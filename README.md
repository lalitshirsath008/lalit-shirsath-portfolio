# Lalit Shirsath - Portfolio

A React + TypeScript + Tailwind portfolio (Bauhaus-styled), with its Skills/Projects/Experience/Education
content stored in Firebase so it can be edited from a built-in `/admin` panel instead of editing code.

## Stack

- Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion
- Firebase (Firestore for content, Authentication for the admin login)

## Local development

```
npm install
npm run dev
```

The public site works out of the box even without Firebase configured - it falls back to the bundled
starter content in `src/lib/seedData.ts`.

## Connecting Firebase (so content edits go live)

1. Go to the [Firebase console](https://console.firebase.google.com/), create a project (free Spark plan is enough).
2. **Build > Firestore Database** - create a database (production mode is fine; the rules below override the default).
3. **Build > Authentication > Sign-in method** - enable **Email/Password**.
4. **Authentication > Users > Add user** - create yourself an admin user (the only account that should ever sign in to `/admin`).
5. **Project settings > General > Your apps** - add a Web app, copy the config values.
6. Copy `.env.example` to `.env` and paste those values in (`.env` is gitignored, so it never gets committed).
7. In **Firestore > Rules**, paste:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{collection}/{docId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

   This keeps content publicly readable (so the site works for visitors) but only writable by a signed-in user (you).
8. Restart `npm run dev`, open `/admin`, sign in, and click **Seed starter content** once to load the existing
   Skills/Projects/Experience/Education into Firestore. From then on, edit/add/delete from the admin panel.

## Admin panel

- URL: `/admin` (e.g. `http://localhost:5173/admin` locally, or `https://yoursite.com/admin` once deployed).
- Only the user(s) you create in Firebase Authentication can sign in - there's no public sign-up.
- Each tab (Skills, Projects, Experience, Education) lets you add, edit, reorder (↑/↓) and delete entries.
- Icons are picked from a built-in icon library (`src/lib/icons.ts`) rather than typed free-form, since a
  database can only store an icon's *name*, not the icon itself.
- The public site reads this content once per page load - a new visit (or refresh) picks up your edits.

## Deployment

Works on any static host. `vercel.json` and `public/_redirects` are already set up so refreshing `/admin`
directly doesn't 404 (needed because it's client-side routing, not a real server route).

- **Vercel**: import the repo, no config needed.
- **Netlify**: import the repo, build command `npm run build`, publish directory `dist`.

Whichever host you use, set the same `VITE_FIREBASE_*` environment variables there (from your `.env`) in its
dashboard, since `.env` itself is never committed.

## License

This project is open source and available under the [MIT License](LICENSE).
