/** Verified Unsplash IDs for landing + wizard imagery */
export const STOCK = {
  heroBarn:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80",
  farmHouse:
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
  cornField:
    "https://images.unsplash.com/photo-1574323863100-15506133fd3c?w=800&q=80",
  fieldHills:
    "https://images.unsplash.com/photo-1501594907357-962cdeeda703?w=800&q=80",
  tractor:
    "https://images.unsplash.com/photo-1625246333195-78d9c38a308e?w=800&q=80",
  soilHands:
    "https://images.unsplash.com/photo-1464224924808-ff83a7938414?w=800&q=80",
  peers: [
    "https://images.unsplash.com/photo-1574323863100-15506133fd3c?w=400&q=80",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
    "https://images.unsplash.com/photo-1592982537077-d031aca4f69f?w=400&q=80",
    "https://images.unsplash.com/photo-1501594907357-962cdeeda703?w=400&q=80",
    "https://images.unsplash.com/photo-1464224924808-ff83a7938414?w=400&q=80",
  ],
} as const;

export const LANDING_CARDS = [
  {
    image: STOCK.farmHouse,
    alt: "Farmhouse beside open fields",
    title: "Field context",
    body: "Pull USDA soil, county yield, weather, and regional fertilizer prices from your pin or drawn boundary.",
    cta: "Learn more",
    href: "/methodology",
  },
  {
    image: STOCK.cornField,
    alt: "Corn rows at sunrise",
    title: "Your prescription",
    body: "Transparent N, P, and K rates with savings estimates and yield-risk confidence—no black box.",
    cta: "Build plan",
    href: "/wizard",
  },
  {
    image: STOCK.fieldHills,
    alt: "Rolling farmland and sky",
    title: "Nearby proof",
    body: "See how similar fields in your area adjusted rates and what outcomes growers reported.",
    cta: "See peers",
    href: "/wizard",
  },
] as const;
