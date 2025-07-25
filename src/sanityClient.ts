// src/sanityClient.ts
import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,      // Replace with your actual project ID
  dataset: import.meta.env.VITE_SANITY_DATASET,      // Replace with your dataset name if different
  apiVersion: 'v2025-07-21', 
  token: import.meta.env.VITE_SANITY_TOKEN,  // Use today's date or your preferred API version
  useCdn: true,               // `true` for faster, cached responses (recommended for public data)
})

export default sanityClient
