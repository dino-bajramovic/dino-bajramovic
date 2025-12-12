# Dino Bajramovic · Portfolio

Modern React + Vite portfolio sa sekcijama Hero, About, Skills, Work, Certifications, Contact i Admin panelom (za pregled upita). Dizajn je građen Tailwind klasama, GSAP animacijama i Lenis smooth scrollom.

## Pokretanje lokalno
1. `npm install`
2. Kreiraj `.env` sa:
   ```
   VITE_API_URL=http://localhost:5000
   VITE_SITE_URL=http://localhost:5173
   VITE_GSC_VERIFICATION=   # opciono, Search Console meta
   ```
3. Pokreni front: `npm run dev`
4. Pokreni backend (Express) ako koristiš lokalni API: `npm run server`

## Build i preview
- Build: `npm run build`
- Preview builda: `npm run preview`

## Deploy (sažeto)
- Postavi produkcijske URL-ove u `.env` (`VITE_SITE_URL`, `VITE_API_URL`, `VITE_GSC_VERIFICATION` po potrebi).
- Ažuriraj `public/robots.txt` i `public/sitemap.xml` na tačan domen.
- Na Render/Netlify/Vercel:
  - Build command: `npm run build`
  - Publish dir: `dist`
  - Backend (ako odvojeno): deploy Express server (`npm run server`) i postavi admin key/DB varijable.

## Admin panel
- Pristup: otvori Admin iz headera. Unesi admin key i klikni Login/Refresh. Bez ključa se upiti ne prikazuju.

## SEO
- React Helmet meta (title, description, keywords, canonical, OG/Twitter), JSON-LD `Person`, `robots.txt`, `sitemap.xml`, opisni alt na slikama, canonical iz `VITE_SITE_URL`. Nakon deploya pokreni Lighthouse SEO i sačuvaj report.

## Download CV
- `public/files/dino-bajramovic-cv.pdf` služi se direktno; Hero “Download CV” gumb preuzima taj fajl.

