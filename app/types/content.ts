import type { IndexFrCollectionItem, ProjectsFrCollectionItem } from "@nuxt/content";

/**
 * Every locale is generated from the same schema, so the `fr` types describe
 * `en` documents just as accurately. Aliasing them here keeps components free
 * of per-locale imports - and means adding a third locale touches no component.
 */
export type IndexPage = IndexFrCollectionItem;
export type Project = ProjectsFrCollectionItem;

export type Experience = IndexPage["experience"]["items"][number];
export type Stack = IndexPage["hero"]["stacks"][number];
