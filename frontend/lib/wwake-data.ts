export type WwakeProduct = {
  title: string;
  price: string;
  image: string;
  hover: string;
  badge?: string;
};

export const ECHO_CATEGORIES = [
  {
    id: 'charms',
    index: '1',
    title: 'Charms & Pendants',
    count: '38',
    image: '/landing/wwake/echo-charms.jpg',
    product: '/landing/wwake/echo-charms-p.jpg',
    copy: 'Small forms, held close. Charms and pendants designed to carry meaning, whether personal, symbolic, or evolving over time. Made to layer, collect, and keep.',
  },
  {
    id: 'earrings',
    index: '2',
    title: 'Earrings',
    count: '92',
    image: '/landing/wwake/echo-earrings.jpg',
    product: '/landing/wwake/echo-earrings-p.jpg',
    copy: 'Handcrafted gold earrings designed with intention. Each sustainable piece is shaped by hand with careful attention to balance, weight, and movement. Jewelry that honors both body and earth, created to feel intimate and enduring.',
  },
  {
    id: 'necklaces',
    index: '3',
    title: 'Necklaces',
    count: '69',
    image: '/landing/wwake/echo-necklaces.jpg',
    product: '/landing/wwake/echo-necklaces-p.jpg',
    copy: 'Worn along the body’s center, necklaces often become anchors for memory. Our gold necklaces balance the quiet weight of solid gold with personal significance.',
  },
  {
    id: 'rings',
    index: '4',
    title: 'Rings',
    count: '163',
    image: '/landing/wwake/echo-rings.jpg',
    product: '/landing/wwake/echo-rings-p.jpg',
    copy: 'Our rings explore form, proportion, and the quiet symbolism worn closest to the body. Crafted in solid gold and set with carefully chosen stones, each ring reflects a considered approach to ring jewelry, meant to be lived in, layered, and kept over time.',
  },
] as const;

export const STACK_PINS = [
  { index: '1', title: 'Gold Charm Bail', image: '/landing/wwake/stack-1.jpg', left: '50%', top: '57%' },
  { index: '2', title: 'Large Diamond Lace Pendant', image: '/landing/wwake/stack-2.jpg', left: '48%', top: '79%' },
  { index: '3', title: 'Aquamarine Pool Pendant', image: '/landing/wwake/stack-3.jpg', left: '61%', top: '55%' },
  { index: '4', title: 'One of a Kind Desert Diamond Tennis Necklace', image: '/landing/wwake/stack-4.jpg', left: '70%', top: '35%' },
] as const;

export const SHOP_TABS = [
  {
    id: 'rings',
    index: '1',
    title: 'Rings',
    count: '163',
    products: [
      { title: 'Baguette Pool Ring', price: '$1,695.00', image: '/landing/wwake/p-baguette-pool.jpg', hover: '/landing/wwake/p-baguette-pool-h.jpg' },
      { title: 'Oval Moonstone Monolith Ring', price: '$2,250.00', image: '/landing/wwake/p-moon-mono.jpg', hover: '/landing/wwake/p-moon-mono-h.jpg' },
      { title: 'Oval Moonstone Dyad Signet Ring', price: '$2,865.00', image: '/landing/wwake/p-dyad.jpg', hover: '/landing/wwake/p-dyad-h.jpg' },
      { title: 'Sapphire and Diamond Nestled Ring No. 24', price: '$6,875.00', image: '/landing/wwake/p-nestled24.jpg', hover: '/landing/wwake/p-nestled24-h.jpg', badge: 'One Of A Kind' },
      { title: 'Oval Cut Diamond Signet Ring No. 7', price: '$17,405.00', image: '/landing/wwake/p-signet7.jpg', hover: '/landing/wwake/p-signet7-h.jpg', badge: 'One Of A Kind' },
      { title: 'Micropave Diamond Coast Ring', price: '$4,115.00', image: '/landing/wwake/p-coast.jpg', hover: '/landing/wwake/p-coast-h.jpg', badge: 'One Of A Kind' },
      { title: 'Baguette Cut Diamond Ridge Solitaire Ring No. 13', price: '$5,730.00', image: '/landing/wwake/p-ridge13.jpg', hover: '/landing/wwake/p-ridge13-h.jpg', badge: 'One Of A Kind' },
      { title: 'Pear Cut Diamond Signet Ring', price: 'From $4,890.00', image: '/landing/wwake/p-pear-signet.jpg', hover: '/landing/wwake/p-pear-signet-h.jpg', badge: 'Choose Your Diamond' },
    ] satisfies WwakeProduct[],
  },
  {
    id: 'earrings',
    index: '2',
    title: 'Earrings',
    count: '92',
    products: [
      { title: 'Oval Moonstone Drop Earring', price: 'From $515.00', image: '/landing/wwake/p-moon-drop.jpg', hover: '/landing/wwake/p-moon-drop-h.jpg' },
      { title: 'Sapphire and Aquamarine Drop Earring', price: 'From $655.00', image: '/landing/wwake/p-sapph-aqua.jpg', hover: '/landing/wwake/p-sapph-aqua-h.jpg' },
      { title: 'Opal Teardrop Earring', price: 'From $425.00', image: '/landing/wwake/p-opal-tear.jpg', hover: '/landing/wwake/p-opal-tear-h.jpg' },
      { title: 'Pearl Petal Earring', price: 'From $450.00', image: '/landing/wwake/p-petal.jpg', hover: '/landing/wwake/p-petal-h.jpg' },
      { title: 'Pearl Hitch Earring', price: 'From $385.00', image: '/landing/wwake/p-hitch.jpg', hover: '/landing/wwake/p-hitch-h.jpg' },
      { title: 'Pearl Trellis Earring', price: 'From $400.00', image: '/landing/wwake/p-trellis.jpg', hover: '/landing/wwake/p-trellis-h.jpg' },
    ] satisfies WwakeProduct[],
  },
  {
    id: 'necklaces',
    index: '3',
    title: 'Necklaces',
    count: '69',
    products: [
      { title: 'Opal Drop Necklace', price: '$2,625.00', image: '/landing/wwake/p-opal-drop-n.jpg', hover: '/landing/wwake/p-opal-drop-n-h.jpg' },
      { title: 'Moonstone Drop Necklace', price: '$2,925.00', image: '/landing/wwake/p-moon-drop-n.jpg', hover: '/landing/wwake/p-moon-drop-n-h.jpg' },
      { title: 'Hinged Charm Orbit Necklace', price: '$5,315.00', image: '/landing/wwake/p-orbit.jpg', hover: '/landing/wwake/p-orbit-h.jpg' },
      { title: 'Marquise Opal Pendant', price: 'From $775.00', image: '/landing/wwake/p-marq-opal.jpg', hover: '/landing/wwake/p-marq-opal-h.jpg' },
      { title: 'Aquamarine Pool Pendant', price: 'From $1,095.00', image: '/landing/wwake/p-aqua-pool.jpg', hover: '/landing/wwake/p-aqua-pool-h.jpg' },
      { title: 'Oval Moonstone Portal Locket', price: 'From $2,250.00', image: '/landing/wwake/p-locket.jpg', hover: '/landing/wwake/p-locket-h.jpg' },
    ] satisfies WwakeProduct[],
  },
  {
    id: 'bracelets',
    index: '4',
    title: 'Bracelets',
    count: '11',
    products: [
      { title: 'Pearl Petal Bracelet', price: 'From $475.00', image: '/landing/wwake/p-petal-b.jpg', hover: '/landing/wwake/p-petal-b-h.jpg' },
      { title: 'Pearl Trellis Bracelet', price: 'From $675.00', image: '/landing/wwake/p-trellis-b.jpg', hover: '/landing/wwake/p-trellis-b-h.jpg' },
      { title: 'Diamond Three-Step Bracelet', price: 'From $975.00', image: '/landing/wwake/p-three-step.jpg', hover: '/landing/wwake/p-three-step-h.jpg', badge: 'Bestseller' },
      { title: 'Opal and Diamond Two-Step Bracelet', price: 'From $565.00', image: '/landing/wwake/p-two-step.jpg', hover: '/landing/wwake/p-two-step-h.jpg' },
      { title: 'Gold Wheat Chain Bracelet', price: 'From $1,105.00', image: '/landing/wwake/p-wheat.jpg', hover: '/landing/wwake/p-wheat-h.jpg' },
      { title: 'Caged Pearl Bracelet', price: 'From $515.00', image: '/landing/wwake/p-caged.jpg', hover: '/landing/wwake/p-caged-h.jpg' },
    ] satisfies WwakeProduct[],
  },
] as const;

export const VALUE_CATEGORIES = [
  {
    id: 'diamond',
    index: '1',
    title: 'Diamond Collection',
    count: '64',
    image: '/landing/wwake/val-diamond.jpg',
    product: '/landing/wwake/val-diamond-p.jpg',
    copy: 'Diamonds were formed from pure carbon under immense pressure deep within the earth. Explore our collection of unique diamonds, each recycled and picked for their natural beauty.',
  },
  {
    id: 'ooak',
    index: '2',
    title: 'One Of A Kinds',
    count: '46',
    image: '/landing/wwake/val-ooak.jpg',
    product: '/landing/wwake/val-ooak-p.jpg',
    copy: 'No two are the same. Each piece begins with a singular stone, chosen for its character and shaped into a design that exists only once.',
  },
  {
    id: 'sapphire',
    index: '3',
    title: 'Sapphire Collection',
    count: '38',
    image: '/landing/wwake/val-sapphire.jpg',
    product: '/landing/wwake/val-sapphire-p.jpg',
    copy: 'Sapphires come in a variety of colors and gradients, evoking the ease and poetry of watercolor hues. Explore and discover your perfect color.',
  },
  {
    id: 'ceremonial',
    index: '4',
    title: 'Ceremonial',
    count: '123',
    image: '/landing/wwake/val-ceremonial.jpg',
    product: '/landing/wwake/val-ceremonial-p.jpg',
    copy: 'Ceremony, it all its forms. WWAKE Ceremonial brings together pieces for the milestones that shape a life, engagements, commitments, and the quiet thresholds in between.',
  },
] as const;

export const JOURNAL = [
  { title: 'The Flatback Earring As A Foundation Piece', date: 'August 17 2026', image: '/landing/wwake/j1.jpg' },
  { title: 'Redesigning An Heirloom: A Ring That Changes Hands', date: 'May 28 2026', image: '/landing/wwake/j2.jpg' },
  { title: 'Rock & Mineral Collection: A Guide to Collecting Gemstones', date: 'May 28 2026', image: '/landing/wwake/j3.jpg' },
  { title: 'From Reference to Ring: How a Custom Piece Begins', date: 'May 27 2026', image: '/landing/wwake/j4.jpg' },
  { title: 'Natural and Antique Diamonds: What Each Stone Carries', date: 'May 27 2026', image: '/landing/wwake/j5.jpg' },
  { title: 'Stacking Rings: A Way of Thinking', date: 'May 27 2026', image: '/landing/wwake/j6.jpg' },
] as const;

export const TILES = [
  { title: 'View All', count: '334', image: '/landing/wwake/tile-all.jpg', href: '#shop' },
  { title: 'Ceremonial', count: '123', image: '/landing/wwake/tile-ceremonial.jpg', href: '#values' },
  { title: 'One Of A Kinds', count: '46', image: '/landing/wwake/tile-ooak.jpg', href: '#values' },
  { title: 'Visit Us', image: '/landing/wwake/tile-visit.jpg', href: '#visit' },
  { title: 'Ethos', image: '/landing/wwake/tile-ethos.jpg', href: '#journal' },
] as const;
