import { defineCollection, z } from 'astro:content';

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const howtoStepSchema = z.object({
  name: z.string(),
  text: z.string(),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    updated: z.string().optional(),
    image: z.string().optional(),
    category: z.string().default('Guide'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    faq: z.array(faqItemSchema).optional(),
    howto: z.object({
      name: z.string(),
      description: z.string(),
      totalTime: z.string().optional(),
      steps: z.array(howtoStepSchema),
    }).optional(),
    addSoftwareSchema: z.boolean().default(false),
  }),
});

export const collections = { blog };
