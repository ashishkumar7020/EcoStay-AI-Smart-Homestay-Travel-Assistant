# Week 8 Screenshot Guide

Use the local frontend at `http://localhost:5173` and keep the backend running at `http://localhost:5000`.

1. Log in, open `/dashboard`, and create a booking. Capture the dashboard with the new booking visible.
2. Capture the Create booking modal with valid details entered. Submit it and capture the success toast plus the new table row.
3. Use Edit on that booking, change the destination or status, submit, and capture the updated row. Then use Delete and capture the browser confirmation dialog or the empty state after deletion.
4. Open `/ai-assistant`, enter an itinerary request, click Generate, and capture the animated loading indicator. Capture a second image after the Groq result appears.
5. In Chrome DevTools, use Device Toolbar at 375px and capture `/dashboard`. Then switch to 1440px and capture the same page. Put both images side by side in the PDF.
6. Delete the only booking, then capture the `No bookings yet` empty state.
7. Open DevTools > Network, filter by Fetch/XHR, reload `/dashboard`, then search for a destination with at least two letters. Keep `/api/bookings`, `/api/bookings/stats`, and `/api/bookings/search` visible with status 200, URL, and Size columns. This is the final PDF page.

Required PDF filename: `W8_FrontendCompletion_TBI-26100170.pdf`.
