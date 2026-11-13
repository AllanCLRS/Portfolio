import { defineCollection, defineContentConfig, z } from "@nuxt/content";

// Keep in sync with the i18n locales in nuxt.config.ts.
const LOCALES = ["fr", "en"] as const;

const createBaseSchema = () =>
  z.object({
    title: z.string(),
    description: z.string(),
  });

const createButtonSchema = () =>
  z.object({
    label: z.string(),
    icon: z.string().optional(),
    to: z.string().optional(),
    color: z.enum(["primary", "neutral", "success", "warning", "error", "info"]).optional(),
    size: z.enum(["xs", "sm", "md", "lg", "xl"]).optional(),
    variant: z.enum(["solid", "outline", "subtle", "soft", "ghost", "link"]).optional(),
    target: z.enum(["_blank", "_self"]).optional(),
  });

const createImageSchema = () =>
  z.object({
    src: z.string().editor({ input: "media" }),
    alt: z.string(),
  });

const indexSchema = z.object({
  hero: z.object({
    links: z.array(createButtonSchema()),
    // The template marquees photos here. Allan has no project shots, so it
    // scrolls his actual stack instead - real data, same motion.
    // One marquee per group, alternating direction.
    stacks: z.array(
      z.object({
        title: z.string(),
        items: z.array(
          z.object({
            name: z.string(),
            icon: z.string().editor({ input: "icon" }),
            // Omitted when the brand logo is black/white: the icon then
            // inherits currentColor and stays legible in both themes.
            color: z.string().optional(),
          }),
        ),
      }),
    ),
  }),
  about: createBaseSchema(),
  experience: createBaseSchema().extend({
    items: z.array(
      z.object({
        date: z.string(),
        position: z.string(),
        company: z.object({
          name: z.string(),
          url: z.string().optional(),
          logo: z.string().editor({ input: "icon" }),
          color: z.string(),
        }),
      }),
    ),
  }),
  education: createBaseSchema().extend({
    items: z.array(
      z.object({
        date: z.string(),
        degree: z.string(),
        school: z.string(),
        // Optional: not every school has a relevant page to link to.
        url: z.string().optional(),
        icon: z.string().editor({ input: "icon" }),
        color: z.string(),
      }),
    ),
  }),
  expertise: createBaseSchema().extend({
    categories: z.array(
      z.object({
        title: z.string(),
        icon: z.string().editor({ input: "icon" }),
        color: z.string(),
        skills: z.array(z.string()),
      }),
    ),
  }),
  languages: createBaseSchema().extend({
    items: z.array(
      z.object({
        name: z.string(),
        level: z.string(),
        // 0-100, drives the meter width.
        value: z.number().min(0).max(100),
        color: z.string(),
      }),
    ),
  }),
  engagements: createBaseSchema().extend({
    items: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().editor({ input: "icon" }),
        color: z.string(),
      }),
    ),
  }),
});

const projectSchema = z.object({
  title: z.string().nonempty(),
  client: z.string().nonempty(),
  description: z.string().nonempty(),
  // Optional on purpose: inventing screenshots or links for client work would
  // be fabricating evidence. Cards fall back to an icon tile.
  image: z.string().optional().editor({ input: "media" }),
  url: z.string().optional(),
  icon: z.string().editor({ input: "icon" }),
  color: z.string(),
  tags: z.array(z.string()),
  date: z.date(),
  duration: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

const aboutSchema = z.object({
  content: z.object({}),
  images: z.array(createImageSchema()),
});

const pagesSchema = z.object({
  links: z.array(createButtonSchema()),
});

// Nuxt Content has no built-in locale filter, so each locale gets its own
// collection sourced from its own folder. `prefix: ''` strips the locale
// segment so paths stay '/' and '/projects' in every language.
// Pages resolve the collection name at query time: `index_${locale}`.
const localeCollections = Object.fromEntries(
  LOCALES.flatMap((locale) => [
    [
      `index_${locale}`,
      defineCollection({
        type: "page",
        source: { include: `${locale}/index.yml`, prefix: "" },
        schema: indexSchema,
      }),
    ],
    [
      `about_${locale}`,
      defineCollection({
        type: "page",
        source: { include: `${locale}/about.yml`, prefix: "" },
        schema: aboutSchema,
      }),
    ],
    [
      `pages_${locale}`,
      defineCollection({
        type: "page",
        source: { include: `${locale}/projects.yml`, prefix: "" },
        schema: pagesSchema,
      }),
    ],
    [
      `projects_${locale}`,
      defineCollection({
        type: "data",
        source: { include: `${locale}/projects/*.yml`, prefix: "" },
        schema: projectSchema,
      }),
    ],
  ]),
);

export default defineContentConfig({
  collections: localeCollections,
});
