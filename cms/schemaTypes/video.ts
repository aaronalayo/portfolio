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
    })
  ]
})