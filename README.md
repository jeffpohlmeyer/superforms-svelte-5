# superforms-svelte-5
A simple repository to demonstrate the failure of trying to implement google's recaptcha using sveltekit-superforms in svelte 5

## To run
Simply run `pnpm i`, then `pnpm run dev`, and navigate to http://localhost:5173 and try to submit the form with the console open to see the results. The token, when fetched, is also displayed in a `p` tag

## Note
You'll need to set up a legacy reCAPTCHA Enterprise API key pair and store them in your `.env` file as "PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY" and "GOOGLE_RECAPTCHA_SECRET_KEY" 