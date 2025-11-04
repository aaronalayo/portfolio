import { createClient } from '@sanity/client'

export interface Env {
  SANITY_PROJECT_ID: string
  SANITY_DATASET: string
  SANITY_WRITE_TOKEN: string
  RECAPTCHA_SECRET: string
  // Fallbacks if your Cloudflare envs are prefixed for the frontend
  VITE_SANITY_PROJECT_ID?: string
  VITE_SANITY_DATASET?: string
  VITE_SANITY_TOKEN?: string
  VITE_RECAPTCHA_SECRET?: string
}

export const onRequestPost = async (
  { request, env }: { request: Request; env: Env }
) => {
  try {
    const body = (await request.json()) as any
    const { name, email, message, recaptchaToken } = body

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    if (!recaptchaToken) {
      return new Response(JSON.stringify({ error: 'Missing reCAPTCHA token' }), { status: 400 })
    }

    // Verify reCAPTCHA v3
    const recaptchaSecret = env.RECAPTCHA_SECRET || env.VITE_RECAPTCHA_SECRET
    if (!recaptchaSecret) {
      return new Response(JSON.stringify({ error: 'Missing RECAPTCHA secret' }), { status: 500 })
    }

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: recaptchaSecret,
        response: recaptchaToken,
      }),
    })
    const verifyJson = (await verifyRes.json()) as { success?: boolean; score?: number; action?: string }
    if (!verifyJson.success || (typeof verifyJson.score === 'number' && verifyJson.score < 0.5)) {
      return new Response(JSON.stringify({ error: 'reCAPTCHA verification failed' }), { status: 403 })
    }

    // Write to Sanity with server-side token
    const projectId = env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID
    const dataset = env.SANITY_DATASET || env.VITE_SANITY_DATASET
    const token = env.SANITY_WRITE_TOKEN || env.VITE_SANITY_TOKEN

    if (!projectId || !dataset || !token) {
      return new Response(
        JSON.stringify({ error: 'Missing Sanity configuration (projectId/dataset/token)' }),
        { status: 500 }
      )
    }

    const client = createClient({
      projectId,
      dataset,
      apiVersion: '2024-10-01',
      token,
      useCdn: false,
    })

    const doc = {
      _type: 'contact',
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    }

    const created = await client.create(doc)

    return new Response(JSON.stringify({ ok: true, id: created._id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}


