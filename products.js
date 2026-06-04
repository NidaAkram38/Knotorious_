// ===========================
//  KNOTORIOUS — products.js
//  Yahan apni products ki info
//  aur images change karo 👇
// ===========================

const PRODUCTS = [

  // -------------------------------------------------------
  // 🔑 KEYCHAINS
  // img: apni photo ka path likhna — e.g. "images/bee.jpg"
  // -------------------------------------------------------
  { id:1,  name:"Bee Keychain",                 category:"keychain", salePrice:300,  origPrice:400,  img:"images/bee.jpeg",         badge:"Popular" },
  { id:2,  name:"Strawberry Keychain",          category:"keychain", salePrice:300,  origPrice:400,  img:"https://media.istockphoto.com/id/2255969181/photo/motorcycle-key-decorated-with-strawberry-doll-pendant-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=qQ1iuYJW05Rw38e7GJSyuR8pSOnDHKxNc8mupp4bGRI=" },
  { id:3,  name:"Mini Chick Keychain",                category:"keychain", salePrice:450,  origPrice:600,  img:"images/duck.jpeg" },
  { id:4,  name:"Cloud Keychain",               category:"keychain", salePrice:250,  origPrice:350,  img:"https://media.istockphoto.com/id/845566552/photo/crocheted-cloud-held-against-sky-in-fushimi-kyoto.webp?a=1&b=1&s=612x612&w=0&k=20&c=Sayz8jhvsPpaSmh01CH4rr8RN1GSqSIIYKP3E8VX_xw=" },
  { id:5,  name:"Star Keychain",                category:"keychain", salePrice:250,  origPrice:350,  img:"https://media.istockphoto.com/id/2219167091/photo/keychain-crafts-made-from-knitting-yarn-hanging-on-display.jpg?s=612x612&w=0&k=20&c=mFcIz1Jd_zBFckRbxWmPC39J59aziRK2jfBbTAHyfEQ=" },
  { id:6,  name:"Smiley Keychain",              category:"keychain", salePrice:250,  origPrice:350,  img:"https://media.istockphoto.com/id/1492186617/photo/yellow-crocheted-amigurumi-emoticon-symbol-in-various-expression-such-as-laugh-smile-shock.jpg?s=612x612&w=0&k=20&c=sq3Jj6IL-ViXrzYDzGrGa1hLoxU5lYN5QBpzxVcT5hY=" },
  { id:7,  name:"Mini Cupcake Keychain",        category:"keychain", salePrice:400,  origPrice:520,  img:"https://media.istockphoto.com/id/1793764063/photo/crochet-snowman-cupcake-bee-crocheted-flower-handmade-garland-bunting-multicolor-background.jpg?s=612x612&w=0&k=20&c=H27J68AuKrxJXhSmD_CWvDdOJW3XPxHImUiDHVkcJSg=" },
  { id:8,  name:"Whale Keychain",               category:"keychain", salePrice:400,  origPrice:520,  img:"https://media.istockphoto.com/id/2188015966/photo/whale-keyring.webp?a=1&b=1&s=612x612&w=0&k=20&c=kLHXUelbXYl7ZO4qRnMxj7zTs7CCG5jRjEmca614pJ0=" },
  { id:9,  name:"Cat Paw Keychain",             category:"keychain", salePrice:300,  origPrice:400,  img:"https://media.istockphoto.com/id/2169787232/photo/cat-paw-crochet-isolated-on-white-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZFVqM4Zg-9b_h0AxiB8XAX8ilcuYDOEW04ccKpsjy4M=" },
  { id:10, name:"Name Keychain (Custom)",       category:"keychain", salePrice:350,  origPrice:500,  img:"images/name keychain.jpeg",        badge:"Custom" },
  { id:11, name:"Small Heart Keychain",         category:"keychain", salePrice:200,  origPrice:300,  img:"https://media.istockphoto.com/id/686645730/photo/red-hart-on-grass-high-angle.webp?a=1&b=1&s=612x612&w=0&k=20&c=ggDXH-j941mmWN8Ds9tOjwzTsOObKyrnRb0p_tNRqEk=" },
  { id:12, name:"Mini Flower Bouquet Keychain", category:"keychain", salePrice:550,  origPrice:700,  img:"https://media.istockphoto.com/id/2169787334/photo/little-flower-bouquet-crochet-keyring.webp?a=1&b=1&s=612x612&w=0&k=20&c=jB7WnjUq8j2FSxB7p2WwbLWnNRl-vDGhiDD829ESQN8=" },
  { id:13, name:"Small Rose Keychain",          category:"keychain", salePrice:400,  origPrice:520,  img:"images/rose keychain.jpeg" },
  { id:14, name:"Crochet Bow Keychain",         category:"keychain", salePrice:300,  origPrice:400,  img:"https://media.istockphoto.com/id/2228273750/photo/handmade-crochet-keychains-with-bow-designs-and-a-key-on-dark-fabric-background.jpg?s=612x612&w=0&k=20&c=OF5d83rsK00WRv1oE8a-BZldI_tu4HbMHtc7Q2EwUF4=", badge:"Popular" },
  { id:15, name:"Sunflower Keychain",           category:"keychain", salePrice:400,  origPrice:520,  img:"https://media.istockphoto.com/id/2236496527/photo/crochet-sunflower-keychain-crochet-flower-handmade-for-texture-illustration-background.webp?a=1&b=1&s=612x612&w=0&k=20&c=oGE10x8YxLAY6fg5x5lMSKt2nrX6oV2yN6AvVYuWK90=", badge:"Popular" },
  { id:16, name:"Swiss Roll Plushie Keychain",  category:"keychain", salePrice:350,  origPrice:480,  img:"images/swiss roll.jpeg", badge:"Popular" },
  { id:17, name:"Tulip Keychain",               category:"keychain", salePrice:350,  origPrice:450,  img:"images/tulip keychain.jpeg" },
  { id:18, name:"Cherry Keychain",               category:"keychain", salePrice:450,  origPrice:500,  img:"https://media.istockphoto.com/id/2169787299/photo/cherry-and-strawberry-crochet-keychain.jpg?s=612x612&w=0&k=20&c=yZQ7h4Q33X_UfoMdC_NMuONMj1C2H1NmCvgobziK5cw=" },

  // -------------------------------------------------------
  // 💐 FLOWERS & BOUQUETS
  // -------------------------------------------------------
  { id:19, name:"Mini Bouquet (2 flowers)",     category:"flower",   salePrice:1350,  origPrice:1700, img:"images/two.jpeg",         badge:"Bestseller" },
  { id:20, name:"Medium Bouquet (4 flowers)",   category:"flower",   salePrice:2200, origPrice:2800, img:"images/four.jpeg",       badge:"Hot" },
  { id:21, name:"Big Bouquet (6 flowers)",      category:"flower",   salePrice:5000, origPrice:6000, img:"images/six.jpeg" },
  { id:22, name:"Crochet Rose (Single Big)",    category:"flower",   salePrice:800,  origPrice:1000, img:"images/rose.jpeg" },
  { id:23, name:"Crochet Lily",                 category:"flower",   salePrice:750,  origPrice:950,  img:"images/lavender.jpeg" },
  { id:24, name:"Crochet Sunflower",            category:"flower",   salePrice:550,  origPrice:700,  img:"images/sunflower.jpeg" },
  { id:25, name:"Crochet Carnation",            category:"flower",   salePrice:650,  origPrice:800,  img:"images/carnation.jpeg" },
  { id:26, name:"Crochet Tulip",                category:"flower",   salePrice:650,  origPrice:800,  img:"images/tulip.jpeg" },
  { id:27, name:"Cherry Blossom",               category:"flower",   salePrice:600,  origPrice:750,  img:"images/cherry blosom.jpeg" },
  { id:28, name:"Crochet Daisy",                category:"flower",   salePrice:550,  origPrice:700,  img:"images/daisy.jpeg" },
  { id:29, name:"Baby Breath",                  category:"flower",   salePrice:400,  origPrice:550,  img:"images/baby breath.jpeg" },
  { id:30, name:"Lavender Crochet",             category:"flower",   salePrice:650,  origPrice:800,  img:"images/lavender.jpeg" },
  { id:31, name:"Lotus Crochet",                category:"flower",   salePrice:800,  origPrice:1000, img:"images/lotus.jpeg" },

  // -------------------------------------------------------
  // 🎀 OTHER ACCESSORIES
  // -------------------------------------------------------
  { id:32, name:"Crochet Bookmark",             category:"other",    salePrice:250,  origPrice:380,  img:"https://media.istockphoto.com/id/1592789629/photo/crochet-fall-autumn-leaves-flowers-multi-color-handmade-background-texture.jpg?s=612x612&w=0&k=20&c=K20ls7TUVpNstpgT5LlJigsiCrNpTnJHNNXGlvvOax4=" },
  { id:33, name:"Crochet Gajra",                category:"other",    salePrice:500,  origPrice:650,  img:"images/gajra.jpeg" },
  { id:34, name:"Crochet Bandana",              category:"other",    salePrice:750,  origPrice:950,  img:"images/bandana.jeg.jpeg",              badge:"Trending" },
  { id:35, name:"Mini Potli Pouch",             category:"other",    salePrice:600,  origPrice:800,  img:"images/mini potli.jpeg" },
  { id:36, name:"Coaster Set (1 pc)",          category:"other",    salePrice:500,  origPrice:700,  img:"https://images.unsplash.com/photo-1627667539472-75fbc7f4654d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3JvY2hldCUyMGNvYXN0ZXIlMjBzZXR8ZW58MHx8MHx8fDA%3D" },
  { id:37, name:"Crochet Scrunchie",            category:"other",    salePrice:250,  origPrice:380,  img:"https://media.istockphoto.com/id/2197890268/photo/hand-crocheted-scrunchies-in-pastel-blue-lilac-and-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=zwbxmEF2Yne8z9OfnmCKGEs_IRKI6Mr3GJ5rnmva9uo=" },
  { id:38, name:"Bow Hair Clip",                category:"other",    salePrice:350,  origPrice:480,  img:"https://media.istockphoto.com/id/519368484/photo/crochet-bows.webp?a=1&b=1&s=612x612&w=0&k=20&c=vyVtRNU8FaYHHbMzHFZRxC9qoEDrKHLGE_BeoJVVxIQ=" },
  { id:39, name:"Crochet Pouch",                category:"other",    salePrice:600,  origPrice:800,  img:"images/pouch.jpeg" },
  { id:40, name:"Glasses Cover",                category:"other",    salePrice:550,  origPrice:720,  img:"images/glasses cover.jpeg" },
  { id:41, name:"Airpods Cover",                category:"other",    salePrice:550,  origPrice:720,  img:"images/airpods.jpeg" },
  { id:42, name:"Phone Charm",                  category:"other",    salePrice:350,  origPrice:480,  img:"https://media.istockphoto.com/id/1427599188/photo/macrame-key-chain.jpg?s=612x612&w=0&k=20&c=GoqNhygyNbWmd1pI3JzTNCnuFvc5NIF0O_RZSmeLX8g=" },
  { id:43, name:"Wall Hanging",                 category:"other",    salePrice:1500, origPrice:2200, img:"images/wall hagging.jpeg" },
  { id:44, name:"Key Holder",                   category:"other",    salePrice:750,  origPrice:1000, img:"https://media.istockphoto.com/id/1492184369/photo/crocheted-wrist-strap-for-clutch-in-natural-color-grey-brown-and-white-making-with-crochet.jpg?s=612x612&w=0&k=20&c=XkF_3IcGNpAF9ch2rJZWhOJPHuEyElyvp9cpmv6Uzis=" },
  
];

// Fallback image agar koi photo missing ho
const FALLBACK_IMG = "images/placeholder.jpg";
