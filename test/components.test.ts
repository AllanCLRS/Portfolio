import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";

import type { IndexPage } from "~/types/content";

import LandingEducation from "~/components/landing/Education.vue";
import LandingEngagements from "~/components/landing/Engagements.vue";
import LandingExpertise from "~/components/landing/Expertise.vue";
import LandingLanguages from "~/components/landing/Languages.vue";
import LandingWorkExperience from "~/components/landing/WorkExperience.vue";

// A fixture rather than the real content: these assert rendering behaviour,
// so they must not break every time Allan edits his CV. content.test.ts
// guards the real data separately.
const fixture = {
  experience: {
    title: "Expériences",
    description: "",
    items: [
      {
        date: "2025",
        position: "Développeur fullstack",
        company: { name: "Maline Immobilier", logo: "i-lucide-building-2", color: "7381F3" },
      },
      {
        date: "2023 - 2025",
        position: "Développeur fullstack",
        company: {
          name: "Steamulo",
          url: "https://www.steamulo.com",
          logo: "i-lucide-code-2",
          color: "#ff7e33",
        },
      },
    ],
  },
  education: {
    title: "Formation",
    description: "Mon parcours",
    items: [
      {
        date: "2020 - 2023",
        degree: "Master d'ingénieur",
        school: "ECAM Lyon A&M",
        icon: "i-lucide-graduation-cap",
      },
    ],
  },
  expertise: {
    title: "Expertise",
    description: "Mes technologies",
    categories: [
      { title: "Frontend", icon: "i-lucide-layout-dashboard", skills: ["Nuxt", "React"] },
    ],
  },
  languages: {
    title: "Langues",
    description: "Mes niveaux",
    items: [{ name: "Anglais", level: "C1", value: 80 }],
  },
  engagements: {
    title: "Engagements",
    description: "Hors clavier",
    items: [
      { title: "Club de robotique", description: "Trésorier à l'ECAM.", icon: "i-lucide-bot" },
    ],
  },
} satisfies Pick<IndexPage, "experience" | "education" | "expertise" | "languages" | "engagements">;

// The components take a whole IndexPage, but each only reads its own section.
// The `satisfies` above type-checks every field the fixture does provide, so a
// typo or a renamed content field fails here; the cast only covers the Content
// base fields (id, path, body…) that no component under test touches.
const page = fixture as unknown as IndexPage;

describe("LandingWorkExperience", () => {
  it("renders each position with its company", async () => {
    const wrapper = await mountSuspended(LandingWorkExperience, { props: { page } });
    const text = wrapper.text();

    // Read the expected values off the fixture rather than retyping them:
    // a hardcoded copy drifts the moment the dash style or wording changes.
    for (const item of page.experience.items) {
      expect(text).toContain(item.company.name);
      expect(text).toContain(item.date);
      expect(text).toContain(item.position);
    }
  });

  it("links only the companies that have a url", async () => {
    const wrapper = await mountSuspended(LandingWorkExperience, { props: { page } });
    const hrefs = wrapper.findAll("a").map((a) => a.attributes("href"));

    expect(hrefs).toContain("https://www.steamulo.com");
    // Maline has no url in the fixture, so it must not become a dead link.
    expect(hrefs).toHaveLength(1);
  });
});

describe("LandingEducation", () => {
  it("renders the degree and the school", async () => {
    const wrapper = await mountSuspended(LandingEducation, { props: { page } });

    expect(wrapper.text()).toContain("Master d'ingénieur");
    expect(wrapper.text()).toContain("ECAM Lyon A&M");
  });
});

describe("LandingExpertise", () => {
  it("renders every skill as a badge", async () => {
    const wrapper = await mountSuspended(LandingExpertise, { props: { page } });

    expect(wrapper.text()).toContain("Frontend");
    expect(wrapper.text()).toContain("Nuxt");
    expect(wrapper.text()).toContain("React");
  });
});

describe("LandingLanguages", () => {
  it("renders the language and its level", async () => {
    const wrapper = await mountSuspended(LandingLanguages, { props: { page } });

    expect(wrapper.text()).toContain("Anglais");
    expect(wrapper.text()).toContain("C1");
  });
});

describe("LandingEngagements", () => {
  it("renders each engagement", async () => {
    const wrapper = await mountSuspended(LandingEngagements, { props: { page } });

    expect(wrapper.text()).toContain("Club de robotique");
    expect(wrapper.text()).toContain("Trésorier à l'ECAM.");
  });
});
