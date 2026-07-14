Preparing this static site for Vercel

Quick checklist to avoid 404s after deployment:

- Ensure the project root selected in Vercel contains `index.html` at the top level.
- If you use the Vercel dashboard, choose the repository and set the **Framework Preset** to **Other** (or **None**). Leave **Build Command** empty and **Output Directory** empty.
- This project includes `vercel.json` which instructs Vercel to serve static files and rewrites all routes to `/index.html` (useful for SPA routes).

Deploy from the command line (optional):

```bash
npm i -g vercel
vercel --prod
```

If you still see a 404:
- Confirm `index.html` exists at repository root.
- Confirm Vercel's selected root matches the folder where `index.html` lives.
- Check Deployment > Files in the Vercel dashboard to verify `index.html` was uploaded.
- If your site uses client-side routes (e.g. `/projects/xyz`), the `vercel.json` here will rewrite them to the root `index.html` so they load properly.

If you'd like, I can also add a `package.json` with a `vercel-build` script or configure a different route strategy.
