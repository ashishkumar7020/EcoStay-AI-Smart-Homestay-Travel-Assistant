# Week 7 Weekly Progress Report - EcoStay AI

## Work Completed

This week I added the AI part of EcoStay AI. The new AI Assistant page is available after login and has three small tools: itinerary planning, homestay listing writing, and review insights.

On the backend, I created routes under `/api/ai`. The React page sends the form data to Express, and Express builds the prompt and calls the Groq API. I kept the Groq API key in `backend/.env`, so it is not visible in React code.

On the frontend, I added `/ai-assistant` with tabs, forms, a loading state, output area, and toast errors. I also kept it behind the existing auth guard, so a user has to login before using it.

## AI Features Added

- AI Itinerary Planner: generates day-wise eco-friendly travel plans.
- AI Listing Writer: creates homestay listing title, description, and highlights.
- AI Review Insights: analyzes guest reviews and suggests improvement actions.

## Prompt Testing

I tested three prompt styles for the itinerary feature: a basic itinerary prompt, an eco-friendly prompt, and a more structured EcoStay-specific prompt. The structured prompt worked best because it produced clearer sections for day-wise plan, budget tips, local transport, stay advice, and sustainability suggestions.

## Challenges Faced

The main challenge was keeping the API key secure while still making the feature usable from the frontend. I solved this by sending requests through Express instead of calling the AI provider directly from React. I first tried Gemini and xAI/Grok, but quota and credit issues blocked final output, so I switched to Groq for the working demo. The AI prompt also needed iteration because the first answer was too generic for an EcoStay travel product.

## Learning Outcome

This week helped me understand how an AI API fits into a full-stack project: frontend form, protected backend route, API key in environment variables, loading UI, error handling, and prompt improvement.
