// src/sanityClient.ts
import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'or9vpa2z',      // Replace with your actual project ID
  dataset: 'production',      // Replace with your dataset name if different
  apiVersion: 'v2025-07-21',   // Use today's date or your preferred API version
  useCdn: true,               // `true` for faster, cached responses (recommended for public data)
})

export default sanityClient
