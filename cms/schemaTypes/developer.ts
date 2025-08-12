// schemas/developerProject.ts

import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'developer',
  title: 'Developer',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
  name: 'description',
  title: 'Short Description',
  type: 'array',
  of: [
    {
      type: 'block', // enables rich text editing
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
          // add other decorators if you want
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
              },
              {
                name: 'blank',
                type: 'boolean',
                title: 'Open in new tab',
                description: 'Check to open the link in a new tab',
              },
            ],
          },
        ],
      },
    },
  ],
  validation: (Rule) => Rule.required(),
}
),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
    }),
  ],
})
