# Karachi Student Biryani: Online Order Website

React (Vite) + Firebase (Firestore + Authentication) + Vercel.
Frontend, admin panel aur backend sab ek hi project mein hain. Alag server ki zaroorat nahi.

## Kya kya hai

**Customer side:** Home, Menu (category + search + portions), Cart, Checkout (COD / Easypaisa / JazzCash / Bank),
Order tracking (live status), Contact + map, WhatsApp button.

**Admin panel (`/admin`):** naye orders live aate hain (awaaz ke saath), status update (Received, Preparing,
Out for delivery, Delivered), paid mark karna, cancel karna, aaj ki sale.
**Menu tab:** item add/edit/delete, photo aur video upload, "pehle ki qeemat" (kati hui), tag, "Sold out" switch.
**Offers tab:** roz ki offer ka poster ya video lagana, upar wali announcement patti badalna.

> **Demo mode:** Firebase connect kiye baghair bhi poori site aur admin panel chalta hai.
> Admin login: `http://localhost:5173/login`, email `admin@demo.com`, password `admin123` (sign up bhi demo mein isi browser mein chalta hai).
> Menu, offers, orders aur photo (chhoti kar ke) sab isi browser ki storage mein save hote hain, is liye aap admin ki har cheez
> try kar sakte hain. Website par order karein aur usi browser ke admin panel mein dekhein. Admin ke upar "Demo data reset karein" se shuru wali halat wapas aa jati hai.
> Jaise hi `.env` mein Firebase ki values bhar dein, demo mode band ho jata hai aur asli database + asli admin login chalta hai.

---

## 1. Local par chalana

```bash
npm install
npm run dev
```
Browser mein `http://localhost:5173` kholein.

## 2. Client ki info badalna
`src/config.js` kholein. Phone (0330-9169334), WhatsApp, address (Double Road, Abbasi Business Center) pehle se bhare hain.
Timings, delivery charges, delivery areas aur payment accounts client se pooch kar badal dein. About page ki team bhi isi file mein (`TEAM`) hai.
Menu ke items admin panel se badalte hain (step 4).

## 3. Firebase setup (ek baar)

1. https://console.firebase.google.com par jayen > **Add project** (Google Analytics band kar sakte hain).
2. **Build > Firestore Database > Create database**. Production mode chunein, location kisi bhi nazdeeki region ki.
3. **Build > Authentication > Get started > Sign-in method > Email/Password > Enable**.
4. **Authentication > Users > Add user**: client ki email aur password banayen. Ye admin login hoga.
5. **Project settings (gear icon) > Your apps > Web (`</>`)** par click karein, app ka naam likhein, register karein.
   Jo `firebaseConfig` dikhe uski values copy karein.
6. Project folder mein `.env.example` ki copy banayen, naam rakhein `.env`, aur values bhar dein:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
7. **Firestore Database > Rules** tab kholein. `firestore.rules` file ka poora content paste karein.
   **Sabse zaroori:** rules mein `isAdmin()` ke andar admin ki **UID** likhein (email nahi). UID Firebase > Authentication > Users mein "User UID" column mein milti hai. Phir **Publish**.
8. `npm run dev` dobara chalayen (`.env` badalne ke baad restart zaroori hai).

## 4. Admin panel istemal karna

1. `http://localhost:5173/admin` par login karein (asli Firebase user, ya demo mode mein `admin@demo.com` / `admin123`).
2. **Menu** tab > **Load sample menu**. Sample items database mein chale jayenge, phir har item ki qeemat/naam badal sakte hain.
3. Website se ek test order karein. **Orders** tab mein foran nazar aayega.

Photos: apni photos `public/images/` mein rakhein, aur item edit karte waqt "Photo ka link" mein `/images/naam.jpg` likhein.

## Login aur Sign up

- Website ke header mein **Log in** aur **Sign up** buttons hain (`/login`, `/signup`).
- Customer pehle Sign up karta hai (naam, email, password), phir Log in. Login ke baad checkout mein naam khud bhar jata hai.
- Admin apni email aur password se Log in karta hai aur khud `/admin` (staff panel) mein pohanch jata hai. Baaqi users ko staff panel nahi khulta ("No access").
- Admin wahi hai jis ki UID `firestore.rules` mein likhi hai. Naya admin banana ho: Firebase mein user banayen, uski UID copy karein, rules mein `['UID-1', 'UID-2']` likh kar Publish karein.
- Firebase Authentication mein **Email/Password** enable hona zaroori hai (sign up bhi isi se chalta hai).
- Ordering ke liye login zaroori nahi, guest bhi order kar sakta hai.

## 5. GitHub par upload

```bash
git init
git add .
git commit -m "First version"
git branch -M main
git remote add origin https://github.com/APNA-USERNAME/karachi-biryani.git
git push -u origin main
```
(`.env` file `.gitignore` mein hai, GitHub par nahi jayegi. Ye theek hai.)

## 6. Photo aur video upload (Cloudinary, free)

Admin panel se photo/video upload ke liye ye ek baar setup karein (Firebase Storage naye projects mein card / billing maangta hai, is liye Cloudinary):

1. https://cloudinary.com par free account banayen. Dashboard par **Cloud name** likha hota hai.
2. **Settings (gear) > Upload > Upload presets > Add upload preset**.
   - **Signing mode: Unsigned**
   - Folder: `karachi-biryani`
   - (Behtar) **Allowed formats** mein sirf `jpg, png, webp, mp4, mov` aur file size limit laga dein. Save.
3. Preset ka naam copy karein. `.env` mein likhein:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=aapka-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=preset-ka-naam
   ```
4. `npm run dev` dobara chalayen. Ab Menu / Offers mein "Photo upload karein" ka button kaam karega.

Limits: photo max 8 MB, video max 60 MB (website par khud chhoti aur tez ho jati hai).
Cloudinary ke baghair bhi kaam chalta hai: photo ka link paste kar dein.

## 7. Roz ka kaam (client ke liye)

- **Aaj ki deal lagana (order ho sakti hai):** Admin > **Menu** > Naya item add karein > Category **Deals** > naam, qeemat, photo. Deal khatam ho to "Available" band kar dein ya Delete.
- **Sirf poster / video dikhana:** Admin > **Offers** > Nayi offer add karein > poster ya video upload karein. Khatam hone par "Chal rahi" band kar dein.
- **Upar wali patti:** Admin > Offers > "Upar wali patti" mein text likhein aur Save.
- **Qeemat badalna:** Menu > item ke saamne Edit. Discount dikhana ho to "Pehle ki qeemat" bharein.
- **Item khatam ho gaya:** Menu mein "Available" ka switch band karein (Sold out likha aayega).

Sab tabdeeliyan website par foran nazar aati hain, dobara deploy nahi karna parta.

## 8. Vercel par deploy

1. https://vercel.com > **Add New > Project** > apni GitHub repo import karein. Framework "Vite" khud detect ho jata hai.
2. **Environment Variables** mein `.env` wali sab values (6 Firebase + 2 Cloudinary) same naam se add karein.
3. **Deploy**.
4. Firebase Console > **Authentication > Settings > Authorized domains** mein apna Vercel domain add karein
   (jaise `karachi-biryani.vercel.app`). Warna admin login live site par nahi chalega.

Har baar `git push` par Vercel khud naya version deploy kar deta hai.

## 9. Client ke baad: apna domain

Vercel > Project > **Settings > Domains** mein domain add karein aur registrar par jo DNS records Vercel dikhaye woh laga dein.
Domain add karne ke baad Firebase ke **Authorized domains** mein bhi wo domain add karein.

---

## 10. Firebase Hosting par deploy (domain Vercel se liya ho)

Project mein `firebase.json` pehle se hai. Firebase Hosting Vercel ki tarah hi site chalata hai, aur database/login pehle se Firebase mein hain.

1. Ek baar: `npm install -g firebase-tools` phir `firebase login`.
2. Project folder mein: `firebase use --add` aur apna Firebase project chunein (alias `default`).
3. Site deploy: `npm run deploy:site` (pehle build banata hai, phir upload). `.env` ki values build ke waqt site mein shamil ho jati hain, is liye Vercel jaisa Environment Variables ka koi kaam nahi.
4. Rules deploy (rules file badalne ke baad): `npm run deploy:rules`. Ya dono ek saath: `npm run deploy`.
5. Site `https://PROJECT-ID.web.app` par khul jayegi. Admin: `/admin`.

### Apna domain lagana
1. Vercel > **Domains** se domain khareedein.
2. Firebase Console > **Hosting > Add custom domain** > domain likhein. Firebase ek **TXT** record (verification) aur **A** records dikhayega.
3. Vercel > **Domains > apna domain > DNS Records** mein wahi records add karein (Type, Name, Value bilkul waisa jaisa Firebase ne dikhaya). Domain ko Vercel ke kisi project se jorna nahi, warna wahi use ho jata hai.
4. Firebase mein "Verify" dabayen. SSL (https) khud ban jata hai, kabhi kabhi kuch ghante lagte hain.
5. Firebase Console > **Authentication > Settings > Authorized domains** mein apna domain (aur `www.` wala agar use karein) add karein, warna admin login nahi hoga.

Agar site Vercel par hi rakhni ho: domain Vercel ke Project > Settings > Domains mein add ho jata hai, is mein Firebase Hosting ki zaroorat nahi. Database aur login phir bhi Firebase se chalte rahenge.

---

## Project ka structure

```
src/
  config.js            client ki info, categories, payment accounts
  firebase.js          Firebase connection
  utils.js             helper functions
  data/sampleMenu.js   demo menu
  context/             cart aur admin login ka state
  hooks/useMenu.js     live menu
  components/          Header, Footer, ItemCard, Layout
  pages/               Home, Menu, Cart, Checkout, Order, Track, Contact, About
  pages/admin/         Login, Orders, MenuManager, OffersManager
  cloudinary.js        photo/video upload
  styles.css           poori website ka design
firestore.rules        database ki security rules
firebase.json          Firebase Hosting ki setting
vercel.json            page refresh par 404 na aaye
```

## Baad mein aane wale masail

- **Admin login "Email ya password ghalat":** Firebase Authentication mein user bana hai? Email bilkul sahi hai?
- **Admin mein orders nahi dikhte / "load nahi ho sake":** `firestore.rules` mein admin email sahi likhi hai aur Publish ki hai?
- **Live site par admin login nahi hota:** Firebase Authorized domains mein Vercel domain add karein.
- **Photo upload ka button nahi aa raha:** `.env` mein Cloudinary ki 2 values bharein aur dev server restart karein.
- **Vercel par site khali/demo mode:** Vercel Environment Variables add karke **Redeploy** karein.

## Limits (production se pehle yaad rakhein)

- Total price customer ke browser mein hisab hota hai. Chhote restaurant ke liye theek hai, lekin bade paimane par
  price server (Cloud Functions) se verify karwana chahiye.
- Firebase free plan (Spark) chhote restaurant ke liye kaafi hai. Usage barhe to Firebase Console mein check karte rahein.
- Reviews `src/config.js` mein sample hain. Asli reviews aane par badal dein.
