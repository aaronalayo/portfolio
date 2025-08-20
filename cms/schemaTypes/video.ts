// [your-sanity-project]/schemas/video.js
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'video',
  type: 'document',
  title: 'Video',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'vimeoId', type: 'string', title: 'Vimeo ID' }),
    defineField({
      name: 'thumbnail',
      type: 'image',
      title: 'Thumbnail',
      options: { hotspot: true }
    }),

    // --- THIS IS THE NEW FIELD ---
    defineField({
      name: 'excludeFromHomepage',
      title: 'Exclude from Homepage',
      type: 'boolean',
      description: 'Check this box to prevent this video from appearing as the random background on the homepage.',
      // By default, a new video will NOT be excluded.
      initialValue: false 
    })
  ]
})