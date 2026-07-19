# Week 7 Peer Code Review Comments

## Peer Review 1

Repository reviewed: `https://github.com/Thecharming22/Herbal-Batch-Traceability-Certificate-Management-System`

The project has a clear full-stack structure for a herbal batch traceability system, with separate frontend pages, backend routes, MongoDB models, and AI-related utility code. One architecture observation is that the backend is divided into useful areas such as `backend/routes/batches.js`, `backend/routes/auth.js`, `backend/models/Batch.js`, and `backend/utils/gemini.js`, which makes the main feature easier to understand. A specific suggestion is to review `backend/routes/batches.js` and keep validation, database operations, and response formatting separated as much as possible, because batch records may grow with more fields like certificate status, buyer details, and audit history. The README explains the project idea and tech stack, but it still has some placeholder text in the schema section, so replacing that with the actual schema image/details would make the documentation stronger. My question is: how are you planning to verify that uploaded certificates cannot be changed after a batch is marked completed?

## Peer Review 2

Repository reviewed: `https://github.com/deepanshi-code/CropMind-Chatbot.git`

CropMind has a good full-stack structure because the project separates `frontend` and `backend` clearly, and the README explains how both parts run. One architecture observation is that the backend has useful separation for authentication, AI, database models, and middleware through files like `backend/routes/auth.js`, `backend/routes/ai.js`, `backend/models/Crop.js`, and `backend/middleware/auth.js`. A specific suggestion is to review `backend/server.js`, because several crop CRUD endpoints are written directly in the server file. Moving those crop routes into a separate file like `backend/routes/crops.js` would make the server cleaner and easier to maintain as the project grows. I also liked the in-memory fallback idea because it helps the app run even when MongoDB is not connected. My question is: how will you make sure the mock mode and MongoDB mode always return the same response format to the frontend?
