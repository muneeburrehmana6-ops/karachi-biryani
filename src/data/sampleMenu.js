// Demo data. Admin panel mein "Load sample menu" dabane par ye database mein chala jata hai,
// phir client sab kuch (naam, qeemat, photo, video, offers) apni marzi se badal sakta hai.
//
// Menu shop ke asli banner ke mutabiq hai: har row (jaise "چکن بریانی سنگل 160") alag card hai.
// Iftitahi offer: 1 kilo 4 pcs ki qeemat Rs. 550 (pehle 660). Offer khatam ho to admin mein "Old price" khali kar
// ke qeemat 660 kar dein.
// Abhi shamil nahi (banner mein poora nazar nahi aaya): Deal 3, Deal 4, Sada Pulao 1 kilo, cold drinks.

export const SAMPLE_MENU = [
  {
    id: "s1", name: "چکن بریانی", category: "Biryani",
    description: "",
    options: [{ label: "سنگل", price: 160 }],
    badge: "", available: true, featured: true, sortOrder: 1, image: "", video: "",
  },
  {
    id: "s2", name: "چکن بریانی", category: "Biryani",
    description: "",
    options: [{ label: "ڈبل", price: 320 }],
    badge: "", available: true, featured: false, sortOrder: 2, image: "", video: "",
  },
  {
    id: "s3", name: "سادہ بریانی", category: "Biryani",
    description: "",
    options: [{ label: "سنگل", price: 110 }],
    badge: "", available: true, featured: false, sortOrder: 3, image: "", video: "",
  },
  {
    id: "s4", name: "سادہ بریانی", category: "Biryani",
    description: "",
    options: [{ label: "ڈبل", price: 220 }],
    badge: "", available: true, featured: false, sortOrder: 4, image: "", video: "",
  },
  {
    id: "s5", name: "چکن بریانی", category: "Biryani",
    description: "",
    options: [{ label: "1 کلو 4 پیس", price: 550, oldPrice: 660 }],
    badge: "Opening offer", available: true, featured: true, sortOrder: 5, image: "", video: "",
  },
  {
    id: "s6", name: "چکن بریانی", category: "Biryani",
    description: "",
    options: [{ label: "1 کلو 2 پیس", price: 560 }],
    badge: "", available: true, featured: false, sortOrder: 6, image: "", video: "",
  },
  {
    id: "s7", name: "سادہ بریانی", category: "Biryani",
    description: "",
    options: [{ label: "1 کلو", price: 420 }],
    badge: "", available: true, featured: false, sortOrder: 7, image: "", video: "",
  },
  {
    id: "s8", name: "چکن پلاؤ", category: "Pulao",
    description: "",
    options: [{ label: "سنگل", price: 170 }],
    badge: "", available: true, featured: true, sortOrder: 1, image: "", video: "",
  },
  {
    id: "s9", name: "چکن پلاؤ", category: "Pulao",
    description: "",
    options: [{ label: "ڈبل", price: 340 }],
    badge: "", available: true, featured: false, sortOrder: 2, image: "", video: "",
  },
  {
    id: "s10", name: "سادہ پلاؤ", category: "Pulao",
    description: "",
    options: [{ label: "سنگل", price: 120 }],
    badge: "", available: true, featured: false, sortOrder: 3, image: "", video: "",
  },
  {
    id: "s11", name: "سادہ پلاؤ", category: "Pulao",
    description: "",
    options: [{ label: "ڈبل", price: 240 }],
    badge: "", available: true, featured: false, sortOrder: 4, image: "", video: "",
  },
  {
    id: "s12", name: "چکن پلاؤ", category: "Pulao",
    description: "",
    options: [{ label: "1 کلو 4 پیس", price: 550, oldPrice: 660 }],
    badge: "Opening offer", available: true, featured: true, sortOrder: 5, image: "", video: "",
  },
  {
    id: "s13", name: "چکن پلاؤ", category: "Pulao",
    description: "",
    options: [{ label: "1 کلو 2 پیس", price: 560 }],
    badge: "", available: true, featured: false, sortOrder: 6, image: "", video: "",
  },
  {
    id: "s14", name: "Deal 1", category: "Deals",
    description: "3 چکن بریانی سنگل / چکن پلاؤ سنگل، 3 رائتہ، 2 سلاد، 3 شامی کباب اور 1 لیٹر کولڈ ڈرنک۔",
    options: [{ label: "Deal", price: 820 }],
    badge: "", available: true, featured: false, sortOrder: 1, image: "", video: "",
  },
  {
    id: "s15", name: "Deal 2", category: "Deals",
    description: "2 چکن بریانی سنگل / چکن پلاؤ سنگل، 2 رائتہ، 1 سلاد، 2 شامی کباب اور 2 کولڈ ڈرنک۔",
    options: [{ label: "Deal", price: 570 }],
    badge: "", available: true, featured: false, sortOrder: 2, image: "", video: "",
  },
  {
    id: "s16", name: "رائتہ", category: "Sides",
    description: "",
    options: [{ label: "Regular", price: 30 }],
    badge: "", available: true, featured: false, sortOrder: 1, image: "", video: "",
  },
  {
    id: "s17", name: "سلاد", category: "Sides",
    description: "",
    options: [{ label: "Regular", price: 20 }],
    badge: "", available: true, featured: false, sortOrder: 2, image: "", video: "",
  },
  {
    id: "s18", name: "شامی کباب", category: "Sides",
    description: "",
    options: [{ label: "Regular", price: 40 }],
    badge: "", available: true, featured: false, sortOrder: 3, image: "", video: "",
  },
];

// "Today's offers" section ka demo
export const SAMPLE_OFFERS = [
  {
    id: "o1",
    title: "Opening offer",
    text: "Chicken Biryani and Chicken Pulao (1 kg, 4 pieces) for only Rs. 550, down from Rs. 660. Limited time offer.",
    image: "", video: "", active: true, sortOrder: 1,
  },
];

// Website ke sab se upar wali patti
export const DEFAULT_ANNOUNCEMENT = {
  enabled: true,
  text: "Opening offer: Chicken Biryani and Chicken Pulao for only Rs. 550 (1 kg, 4 pieces). Limited time offer.",
};
