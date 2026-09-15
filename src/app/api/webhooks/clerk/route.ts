import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { Webhook } from 'svix'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return new Response('CLERK_WEBHOOK_SECRET manquante', { status: 500 })
  }

  // Vérification signature Svix
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Headers Svix manquants', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
    evt = payload as WebhookEvent
  } catch (err) {
    console.error('Webhook Clerk — échec vérification signature:', err)
    return new Response('Signature invalide', { status: 400 })
  }

  // Traitement des événements
  const eventType = evt.type

  // Organisation créée → créer en base
  if (eventType === 'organization.created') {
    const { id, name } = evt.data

    try {
      await db.organization.create({
        data: {
          clerkOrgId: id,
          name: name ?? 'Sans nom',
          plan: 'STARTER',
        },
      })
      console.log(`Organisation créée en base : ${id} — ${name}`)
    } catch (err) {
      console.error('Erreur création organisation:', err)
      return new Response('Erreur base de données', { status: 500 })
    }
  }

  // Organisation supprimée → supprimer en cascade
  if (eventType === 'organization.deleted') {
    const { id } = evt.data

    if (!id) return new Response('OK', { status: 200 })

    try {
      await db.organization.delete({
        where: { clerkOrgId: id },
      })
      console.log(`Organisation supprimée : ${id}`)
    } catch (err) {
      console.error('Erreur suppression organisation:', err)
    }
  }

  // Organisation mise à jour → sync du nom
  if (eventType === 'organization.updated') {
    const { id, name } = evt.data

    try {
      await db.organization.update({
        where: { clerkOrgId: id },
        data: { name: name ?? 'Sans nom' },
      })
      console.log(`Organisation mise à jour : ${id}`)
    } catch (err) {
      console.error('Erreur mise à jour organisation:', err)
    }
  }

  return new Response('OK', { status: 200 })
}
