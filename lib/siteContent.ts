export interface SiteSectionContent {
  key: string;
  heading: string;
  tagline: string;
}

export type SiteSectionKey = "destinations" | "gallery";

export const SECTION_LABELS: Record<SiteSectionKey, string> = {
  destinations: "Destinations slider",
  gallery: "Gallery grid",
};

export const DEFAULT_SECTIONS: Record<SiteSectionKey, { heading: string; tagline: string }> = {
  destinations: {
    heading: "A Visual Journey Through the Heart of Our Tours and Safaris",
    tagline:
      "Explore the wild through our lens, moments from unforgettable tours and safaris.",
  },
  gallery: {
    heading: "Tanzania Through Our Lens",
    tagline:
      "Explore breathtaking moments from our adventures across Tanzania's most iconic landscapes.",
  },
};

export const SECTION_KEYS = Object.keys(DEFAULT_SECTIONS) as SiteSectionKey[];

export function defaultSection(key: string): SiteSectionContent {
  const fallback = DEFAULT_SECTIONS[key as SiteSectionKey];
  return {
    key,
    heading: fallback?.heading ?? "",
    tagline: fallback?.tagline ?? "",
  };
}
