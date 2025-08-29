// [your-sanity-project]/schemas/video.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'video',
  type: 'document',
  title: 'Video',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // --- THIS IS THE FINAL, SIMPLE SLUG FIELD ---
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A unique, URL-friendly identifier. Click "Generate" to create one from the title.',
      options: {
        source: 'title', // It will be generated from the title field
        maxLength: 96,
        // We are REMOVING the complex isUnique function for reliability.
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'vimeoId',
      title: 'Vimeo ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'thumbnail',
      title: 'Custom Thumbnail (Optional)',
      type: 'image',
      description: 'If left empty, a thumbnail is generated from Vimeo.',
      options: { hotspot: true },
    }),

    defineField({
      name: 'excludeFromHomepage',
      title: 'Exclude from Homepage',
      type: 'boolean',
      description: 'Check this box to prevent this video from appearing as the random background on the homepage.',
      initialValue: false,
    }),
  ],
})