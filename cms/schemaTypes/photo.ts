import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'photo',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'image', title: 'Image', type: 'image' }),
    defineField({name: 'category', title: 'Category', type: 'string'})
  ]})
