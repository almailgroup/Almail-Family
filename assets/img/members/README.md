# Member photographs

Portraits for the directory (the **Characters** page) go in this folder.

## Adding a photo

1. **Drop the image file in here** — `assets/img/members/`.

   Name it after the member's id, lowercase with dashes:

   ```
   assets/img/members/mansour-abdulreda-almail.jpg
   ```

2. **Point the member at it** in `content/members.js`:

   ```js
   photo: "/assets/img/members/mansour-abdulreda-almail.jpg",
   ```

   **The path must start with a slash.** Pages live one level down (`/directory/`),
   so `assets/img/…` would be looked for at `/directory/assets/img/…` and fail.

3. Run `npm run build` so the file gets its cache-busting stamp.

A member with no `photo` line gets a monogram plate of their initials instead,
which is a perfectly good placeholder — add photographs as they come in rather
than waiting to have them all.

## What to upload

| | |
|---|---|
| **Shape** | Square. The card crops to a square, so anything else loses its edges. |
| **Size** | 600 × 600 px is plenty — it is displayed at 64 px, 128 px on a retina screen. |
| **Format** | `.jpg` for photographs, `.png` if it needs transparency. |
| **Weight** | Keep under ~200 KB. Large files are the usual cause of a slow page. |
| **Framing** | Head and shoulders, face roughly centred. |

## Please note

Publish a living family member's photograph only with their agreement. Anything
committed here is public the moment the site deploys.
