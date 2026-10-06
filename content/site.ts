export type MediaRole =
  "full-look" | "detail" | "portrait" | "process" | "editorial" | "study";
export type Media = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  role: MediaRole;
  kind: "photography" | "digital-study";
  title: string;
  collection?: string;
  year?: number;
  caption?: string;
  featured?: boolean;
  position?: string;
  materials?: string[];
};
// Supplied photography. Titles describe compositions; no dates or garment facts are inferred.
export const media: Media[] = [
  {
    id: "veiled-eye",
    src: "/media/veiled-eye.jpg",
    alt: "A model’s eye framed by raised sleeves in black and ivory stripes",
    width: 1938,
    height: 2422,
    role: "editorial",
    kind: "photography",
    title: "Veiled / 01",
    position: "50% 43%",
  },
  {
    id: "black-silhouette",
    src: "/media/black-silhouette.jpg",
    alt: "Full-length front view of a model in a sheer black ensemble with ivory collar and cuffs",
    width: 2250,
    height: 3000,
    role: "full-look",
    kind: "photography",
    title: "Silhouette / 01",
    position: "center",
  },
  {
    id: "black-profile",
    src: "/media/black-profile.jpg",
    alt: "Side view of a long black silhouette with ivory cuffs against a weathered stone wall",
    width: 2250,
    height: 3000,
    role: "full-look",
    kind: "photography",
    title: "Silhouette / 02",
    position: "center",
  },
  {
    id: "black-reverse",
    src: "/media/black-reverse.jpg",
    alt: "Rear view of the black ensemble with long straight hair and ivory cuffs",
    width: 2250,
    height: 3000,
    role: "full-look",
    kind: "photography",
    title: "Silhouette / 03",
    position: "center",
  },
  {
    id: "sculptural-reverse",
    src: "/media/sculptural-reverse.jpg",
    alt: "Rear view of a glossy black sculptural skirt and a tall ivory and black headpiece",
    width: 2250,
    height: 3000,
    role: "full-look",
    kind: "photography",
    title: "Sculpture / 01",
    position: "center",
  },
  {
    id: "sculptural-profile",
    src: "/media/sculptural-profile.jpg",
    alt: "Side view of a sculptural black ensemble with hanging textured strands and an extended headpiece",
    width: 2250,
    height: 3000,
    role: "full-look",
    kind: "photography",
    title: "Sculpture / 02",
    position: "center",
  },
  {
    id: "sculptural-front",
    src: "/media/sculptural-front.jpg",
    alt: "Front view of a model in a sculptural black ensemble with a striped collar and tall curved headpiece",
    width: 2250,
    height: 3000,
    role: "full-look",
    kind: "photography",
    title: "Sculpture / 03",
    position: "center",
  },
  {
    id: "striped-portrait",
    src: "/media/striped-portrait.jpg",
    alt: "Close editorial portrait in black and ivory striped fabric with silver ornaments",
    width: 2143,
    height: 2678,
    role: "editorial",
    kind: "photography",
    title: "Stripes / 01",
    position: "50% 40%",
  },
  {
    id: "gloss-silhouette",
    src: "/media/gloss-silhouette.jpg",
    alt: "A model in profile wearing a glossy black structured jacket and skirt beside a wooden pedestal",
    width: 2250,
    height: 3000,
    role: "editorial",
    kind: "photography",
    title: "Gloss / 01",
    position: "center",
  },
  {
    id: "paired-detail",
    src: "/media/paired-detail.jpg",
    alt: "Two models in black, one in a layered sculptural garment and one with an ivory neck bow",
    width: 2250,
    height: 3000,
    role: "editorial",
    kind: "photography",
    title: "Layers / 01",
    position: "center",
  },
  {
    id: "paired-silhouettes",
    src: "/media/paired-silhouettes.jpg",
    alt: "Two full silhouettes against a weathered wall, in layered dark fabric and black with an ivory bow",
    width: 2143,
    height: 2857,
    role: "editorial",
    kind: "photography",
    title: "Layers / 02",
    position: "center",
  },
  {
    id: "veil-detail",
    src: "/media/veil-detail.jpg",
    alt: "A model with a dark lace veil, black mesh sleeves and gathered ivory cuffs",
    width: 2250,
    height: 3000,
    role: "detail",
    kind: "photography",
    title: "Veil / 01",
    position: "center",
  },
  {
    id: "stripe-detail",
    src: "/media/stripe-detail.jpg",
    alt: "Black and ivory striped sleeves and silver ornaments around an editorial portrait",
    width: 2143,
    height: 2678,
    role: "detail",
    kind: "photography",
    title: "Stripes / 02",
    position: "center",
  },
  {
    id: "textured-portrait",
    src: "/media/textured-portrait.jpg",
    alt: "A close portrait framed by a textured black garment with lacing",
    width: 2250,
    height: 3000,
    role: "detail",
    kind: "photography",
    title: "Texture / 01",
    position: "center",
  },
  {
    id: "textured-profile",
    src: "/media/textured-profile.jpg",
    alt: "A model leaning forward in a textured black sculptural jacket with striped shorts",
    width: 2252,
    height: 3000,
    role: "detail",
    kind: "photography",
    title: "Texture / 02",
    position: "center",
  },
  {
    id: "textured-silhouette",
    src: "/media/textured-silhouette.jpg",
    alt: "A model in a dramatically curved textured black jacket and black and ivory striped shorts",
    width: 2250,
    height: 3000,
    role: "editorial",
    kind: "photography",
    title: "Texture / 03",
    position: "center",
  },
];
export const site = {
  name: "Storm Nijhuis",
  title: "HELLION",
  location: "Amsterdam",
  description:
    "HELLION — the creative world of Storm Nijhuis. Purity, desire, skin and transformation.",
  navigation: [
    { label: "Hellion", href: "/hellion" },
    { label: "Archive", href: "/archive" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/about#contact" },
  ],
  // Only fill these fields with verified information. Missing fields render no invented claims or dead links.
  biography: [] as string[],
  contactEmail: null as string | null,
  socials: [
    {
      label: "Instagram / @hellion.sin",
      href: "https://www.instagram.com/hellion.sin/",
    },
  ] as { label: string; href: string }[],
  press: [] as {
    title: string;
    publication: string;
    href: string;
    year?: number;
  }[],
  // Replace these assignments with supplied media IDs to curate without editing components.
  home: {
    hero: "veiled-eye",
    reveal: "striped-portrait",
    detail: "gloss-silhouette",
    isolated: "sculptural-front",
    material: "textured-portrait",
  },
  lookbook: [
    "black-silhouette",
    "black-profile",
    "black-reverse",
    "sculptural-front",
    "sculptural-profile",
    "sculptural-reverse",
    "textured-silhouette",
  ],
};
export function getMedia(id: string): Media {
  const item = media.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown media assignment: ${id}`);
  return item;
}
