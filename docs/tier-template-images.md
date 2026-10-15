# Admin tier template covers

The template creation form supports an optional image file, local preview,
removal, and saving progress. JPEG, PNG, WebP, GIF and AVIF are accepted, with a
browser limit of 10 MB. The legacy URL field remains available without a file.

The presign server action forwards the admin cookie through the existing API
client to `POST /admin/tier-templates/presign-url`. The browser uploads directly
to R2 using PUT without cookies or Authorization, then creation sends
`image_key` to `POST /admin/tier-templates`. Files never pass through a Server
Action. Creation waits for upload success and retries reuse a successfully
uploaded key when template creation fails. Errors leave the form intact;
successful creation refreshes the template list and navigates back to it.

The backend identifies the creator through the admin session, so the form no
longer asks for Created By. Category Universe is required only when creating
from an anime category; otherwise its UUID is omitted.

Requires the backend upload endpoints from commit `05c4f48` and R2 CORS allowing
PUT and Content-Type from the admin app origin.

Checks: `node --test tests/*.test.cjs`, `npx tsc --noEmit`, and `npm run lint`.
Tests mock storage; a live R2 upload requires configured credentials.
