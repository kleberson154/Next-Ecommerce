import prisma from '@/lib/prisma'
import { IncomingHttpHeaders } from 'http'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Webhook, WebhookRequiredHeaders } from 'svix'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ''

type EventType = 'user.created' | 'user.updated' | '*'

type Event = {
  data: EventDataType
  object: 'event'
  type: EventType
}

type EventDataType = {
  id: string
  fisrt_name: string
  last_name: string
  email_address: EmailAddressType[]
  primary_email_address_id: string
  attributes: Record<string, string | number>
}

type EmailAddressType = {
  id: string
  email_address: string
}

async function handler(request: Request) {
  const payload = await request.json()
  const headersList = headers()
  const heads = {
    'svix-id': headersList.get('svix-id'),
    'svix-signature': headersList.get('svix-signature'),
    'svix-timestamp': headersList.get('svix-timestamp')
  }
  const wh = new Webhook(webhookSecret)
  let evt: Event | null = null

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event
  } catch (err) {
    console.error((err as Error).message)
    return NextResponse.json({}, { status: 400 })
  }

  const eventType: EventType = evt.type
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const {
      id,
      fisrt_name,
      last_name,
      email_address,
      primary_email_address_id,
      ...attributes
    } = evt.data

    //inserir usuario no stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2022-11-15'
    })

    const customer = await stripe.customers.create({
      name: `${fisrt_name} ${last_name}`,
      email: email_address ? email_address[0].email_address : ''
    })

    await prisma.user.upsert({
      where: { externalId: id as string },
      create: {
        externalId: id as string,
        stripeCustomerId: customer.id,
        attributes
      },
      update: {
        attributes
      }
    })
  }

  return NextResponse.json({}, { status: 200 })
}

export const GET = handler
export const POST = handler
export const PUT = handler
