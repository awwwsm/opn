import { z } from 'zod/mini';

const ListSectionSchema = z.object({
  items: z.array(
    z.object({
      date: z.optional(z.string({ error: 'Date must be a string.' })),
      description: z.optional(
        z.string({ error: 'Description must be a string.' }),
      ),
      title: z.string({ error: 'Item title is required.' }),
      url: z.optional(z.string({ error: 'URL must be a string.' })),
    }),
    { error: 'Items must be an array.' },
  ),
  title: z.string({ error: 'Section title is required.' }),
  type: z.literal('list', { error: "Type must be 'list'." }),
});

const TextSectionSchema = z.object({
  content: z.string({ error: 'Content is required.' }),
  title: z.string({ error: 'Section title is required.' }),
  type: z.literal('text', { error: "Type must be 'text'." }),
});

const LinksSectionSchema = z.object({
  links: z.array(
    z.object({
      title: z.string({ error: 'Link title is required.' }),
      url: z.string({ error: 'Link URL is required.' }),
    }),
    { error: 'Links must be an array.' },
  ),
  title: z.string({ error: 'Section title is required.' }),
  type: z.literal('links', { error: "Type must be 'links'." }),
});

const SectionSchema = z.union(
  [ListSectionSchema, TextSectionSchema, LinksSectionSchema],
  { error: 'Section must be a valid list, text, or links section.' },
);

const ProfileSchema = z.object({
  description: z.string({ error: 'Profile description is required.' }),
  name: z.string({ error: 'Profile name is required.' }),
  sections: z.optional(
    z.array(SectionSchema, {
      error: 'Sections must be an array of valid sections.',
    }),
  ),
  style: z.optional(
    z.object({
      theme: z.optional(z.union([z.literal('dark'), z.literal('light')])),
    }),
  ),
  version: z.literal(1, { error: 'Version must be 1.' }),
});

export { ProfileSchema };
