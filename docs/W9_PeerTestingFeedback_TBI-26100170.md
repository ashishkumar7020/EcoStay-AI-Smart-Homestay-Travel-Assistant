# Week 9 Peer Testing Feedback

These are evidence-based comments prepared for posting in the official Week 9 Forum thread. They must be posted there to complete the peer-feedback deliverable.

## 1. Sneha Sharma - VanaVas: An Uttarakhand Homestay

Live application: https://vanvas-an-uttarakhand-homestay.vercel.app

Good point: The VanaVas application is publicly accessible and has a clear travel-focused flow, including separate homestay exploration and AI Trip Planner pages. The backend root URL also responds successfully, which shows the live frontend and backend are connected.

Issue found: The deployed backend does not expose a health-check route, so it is harder to verify service and database availability after deployment.

Steps to reproduce:
1. Open `https://vanvas-an-uttarakhand-homestay.onrender.com/api/health` in a browser.
2. The route returns `404 Not Found`.

Suggestion: Add a small `/api/health` endpoint that returns the API status and database connection state. This would make deployment monitoring and debugging easier.

## 2. Yash Rawat - ProductDescriptionAI

Live application: https://productdescription-zeta.vercel.app

Good point: The landing page is publicly accessible and presents the product-description idea clearly. The project also includes an interactive product-copy demo with input, loading, toast, and preview states.

Issue found: Direct navigation to client-side pages returns a Vercel 404 page instead of loading the React application.

Steps to reproduce:
1. Open `https://productdescription-zeta.vercel.app/demo` directly in a new browser tab.
2. The deployed site returns `404 Not Found`.
3. Repeat with `https://productdescription-zeta.vercel.app/dashboard`; it also returns `404 Not Found`.

Suggestion: Add a Vercel SPA rewrite configuration so all non-asset routes are served through `index.html` and React Router can render the requested page.
