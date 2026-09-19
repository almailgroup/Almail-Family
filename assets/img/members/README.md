# Member photographs

Portraits for the directory (the **Characters** page) go in this folder.

## Adding a photo

1. **Drop the image file in here** — `assets/img/members/`.

   Any filename is fine as long as it matches what you write in step 2 —
   exactly, capitals and underscores included:

   ```
   assets/img/members/Mansour_Abdulreda_Almail.png
   ```

2. **Point the member at it** in `content/members.js`:

   ```js
   photo: "/assets/img/members/Mansour_Abdulreda_Almail.png",
   ```

   **The path must start with a slash.** Pages live one level down (`/directory/`),
   so `assets/img/…` would be looked for at `/directory/assets/img/…` and fail.

That is the whole job — no build step. The card is drawn by JavaScript at page
load, so unlike the CSS and the page assets this path is **not** fingerprinted
by `npm run build`. If you ever replace a photo while keeping the same
filename, people holding an old copy in their browser cache may keep seeing it;
give the new file a slightly different name to be certain.

A member with no `photo` line gets a monogram plate of their initials instead,
which is a perfectly good placeholder — add photographs as they come in rather
than waiting to have them all.

## What to upload

| | |
|---|---|
| **Shape** | **3:4 portrait** (taller than wide). The card frame is 3:4, so a 3:4 photograph is shown whole and anything else gets cropped to fit. |
| **Size** | 900 × 1200 px is plenty — it is displayed at 80 px wide, 160 px on a retina screen. |
| **Format** | `.jpg` for photographs, `.png` if it needs transparency. |
| **Weight** | Keep under ~200 KB. Large files are the usual cause of a slow page. |
| **Framing** | Head and shoulders, face roughly centred. |

## Please note

Publish a living family member's photograph only with their agreement. Anything
committed here is public the moment the site deploys.
