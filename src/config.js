// ============================================================
//  YAHAN SE CLIENT KI SARI INFO BADALNI HAI
//  (naam, phone, WhatsApp, delivery charges, payment accounts)
// ============================================================

export const RESTAURANT = {
  name: "Karachi Student Biryani",
  tagline: "& Murgh Pulao",
  initials: "KSB",

  // Call / home delivery number (shop ke signboard wala)
  phone: "0330-9169334",
  // WhatsApp number international format mein, bina + aur bina space ke (92 + number bina 0 ke)
  whatsapp: "923309169334",
  whatsappDisplay: "0330-9169334",
  // Contact page par dikhne wala doosra number (call aur WhatsApp dono)
  altPhone: { display: "+92 336 9807180", tel: "+923369807180", whatsapp: "923369807180" },
  address: "Double Road, Abbasi Business Center, near Rawalpindi Cricket Stadium, Rawalpindi",
  // ⚠️ Sahi timings client se pooch kar likhein
  timings: "Open daily, 12:00 PM to 12:00 AM",
  closingNote: "Open until midnight",

  // Map isi address se khud ban jata hai (address wala hi text).
  // Bilkul sahi pin chahiye to Google Maps mein shop kholen, Share > Embed a map se src="..." ka link
  // neeche mapEmbedUrl mein paste kar dein.
  mapQuery: "Double Road, Abbasi Business Center, near Rawalpindi Cricket Stadium, Rawalpindi",
  mapEmbedUrl: "",
  facebook: "",
  instagram: "",

  // Delivery
  deliveryFee: 150,
  freeDeliveryAbove: 2500,
  minOrder: 0, // 0 = no minimum. Client ka minimum order ho to yahan likhein (jaise 300)
  deliveryTime: "40 to 60 minutes",
  deliveryAreas: ["Area 1", "Area 2", "Area 3", "Area 4", "Area 5"],

  // Payment accounts (COD ke ilawa)
  payments: {
    easypaisa: { title: "Easypaisa", number: "0300-0000000", name: "Account title here" },
    jazzcash: { title: "JazzCash", number: "0300-0000000", name: "Account title here" },
    bank: {
      title: "Bank transfer",
      number: "IBAN / account number here",
      name: "Account title here",
      bank: "Bank name",
    },
  },
};

// Menu ki categories (admin panel mein bhi yahi dikhengi)
export const CATEGORIES = ["Biryani", "Pulao", "Deals", "Sides", "Drinks"];

export const CATEGORY_EMOJI = {
  Biryani: "🍛",
  Pulao: "🍚",
  Deals: "🎁",
  Sides: "🥗",
  Drinks: "🥤",
};

export const STATUS_FLOW = [
  { key: "received", label: "Order received", short: "Received" },
  { key: "preparing", label: "Being prepared", short: "Preparing" },
  { key: "out_for_delivery", label: "Out for delivery", short: "On the way" },
  { key: "delivered", label: "Delivered", short: "Delivered" },
];

// Sample reviews (demo ke liye). Asli customers ke reviews aane par badal dein.
export const REVIEWS = [
  { name: "Ahmed R.", text: "The biryani arrived hot and the masala was just right. Delivery was faster than expected." },
  { name: "Sana K.", text: "The pulao was light and fragrant. The raita was good too. I will order again." },
  { name: "Bilal H.", text: "The family pack was plenty for the whole house. Packing was good and nothing spilled." },
];

// ============================================================
//  ABOUT PAGE: team members
//  Jin ka "name" khali hai woh website par nazar nahi aate.
//  Naya member add karne ke liye khali jagah par name, phone, whatsapp bhar dein.
//  phone: "0300-1234567"   whatsapp: "923001234567" (92 + number bina 0 ke)
// ============================================================
export const ABOUT_TEXT =
  "We make Karachi-style biryani and murgh pulao. Every order is packed hot and delivered to your door in Rawalpindi. Order through the website, by phone or on WhatsApp.";

export const TEAM = [
  { name: "Malik Adeel", role: "CEO", phone: "", whatsapp: "", photo: "" },
  { name: "Malik Hammad Khawar Khan", role: "", phone: "", whatsapp: "", photo: "" },
  { name: "Malik Sajjad", role: "", phone: "", whatsapp: "", photo: "" },
  { name: "", role: "", phone: "", whatsapp: "", photo: "" },
];
