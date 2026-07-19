# Week 7 AI Feature Screenshot Checklist

Create the final file as:

```text
W7_AIFeatureDemo_TBI-26100170.pdf
```

## Before Screenshots

1. Add Groq key in `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
```

2. Run backend:

```powershell
cd backend
npm run dev
```

3. Run frontend:

```powershell
npm run dev
```

4. Open:

```text
http://localhost:5173/ai-assistant
```

5. Login first if redirected to `/login`.

## Required Screenshots

### Screenshot 1: User Input Screen

Show the AI Assistant page with the Itinerary Planner tab selected and filled fields:

- Destination
- Nights
- Budget
- Travel style

### Screenshot 2: Loading State

Click generate and capture the screen while the loader says:

```text
Generating AI response
```

### Screenshot 3: Final AI Output

Capture the generated itinerary output card after the AI response appears.

### Screenshot 4: Browser Network Tab

Open DevTools > Network and generate again. Capture:

- Request URL containing `/api/ai/itinerary`
- Method `POST`
- Status `200`

## Optional Strong Screenshots

- Listing Writer output.
- Review Insights sentiment output.
- `PROMPTS.md` open in VS Code.
- Backend terminal showing server running.
