export default defineAppConfig({
  global: {
    picture: {
      // Must point at a file that exists in public/: a broken `src` defeats the
      // initials fallback and spams the router in dev.
      src: "/allan-avatar.jpg",
      alt: "Allan Clarissou",
    },
    email: "allan.clrs@gmail.com",
    available: true,
  },
  ui: {
    colors: {
      primary: "blue",
      neutral: "slate",
    },
    pageHero: {
      slots: {
        container: "py-18 sm:py-24 lg:py-32",
        title: "mx-auto max-w-2xl text-pretty text-3xl sm:text-4xl lg:text-5xl",
        description: "mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted",
      },
    },
  },
  footer: {
    credits: `Allan Clarissou • © ${new Date().getFullYear()}`,
  },
});
