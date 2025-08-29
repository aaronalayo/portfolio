// [your-sanity-project]/schemas/photo.js
import { defineType, defineField } from 'sanity'

// [your-sanity-project]/schemas/photo.ts OR video.ts
import { SlugValidationContext } from 'sanity' // <-- Import the necessary type

// This is the correctly typed helper function for TypeScript.
export async function isSlugUnique(slug: string | undefined, context: SlugValidationContext): Promise<boolean> {
  const { document, getClient } = context;

  // Slug is required
  if (!slug) {
    return true; // Let the required() validation handle this
  }

  const client = getClient({ apiVersion: '2023-01-01' });

  // Use the document's _type to make the query dynamic
  const docType = document?._type;
  const id = document?._id.replace(/^drafts\./, '');

  const params = {
    draft: `drafts.${id}`,
    published: id,
    slug,
  };

  // The query is now dynamic and works for any document type
  const query = `!defined(*[_type == "${docType}" && !(_id in [$draft, $published]) && slug.current == $slug][0]._id)`;

  const result = await client.fetch(query, params);
  
  return result;
}


export default defineType({
  name: 'photo',
  type: 'document',
  title: 'Photo',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    
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
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    })
  ]
})