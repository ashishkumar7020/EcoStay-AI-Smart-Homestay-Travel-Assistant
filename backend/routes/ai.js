import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

function requireFields(body, fields) {
  const errors = [];

  fields.forEach((field) => {
    const value = body?.[field];

    if (value === undefined || value === null || String(value).trim() === "") {
      errors.push(`${field} is required`);
    }
  });

  return errors;
}

function cleanText(value, maxLength = 600) {
  return String(value || "")
    .trim()
    .slice(0, maxLength);
}

async function callAiProvider(systemPrompt, userPrompt) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    const error = new Error("Groq API key is not configured");
    error.status = 501;
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 900,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = data.error?.message || "AI provider request failed";
      const error = new Error(message);
      error.status = response.status === 429 ? 429 : 502;
      throw error;
    }

    const result = data.choices?.[0]?.message?.content?.trim();

    if (!result) {
      const error = new Error("AI provider returned an empty response");
      error.status = 502;
      throw error;
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("AI request timed out. Please try again.");
      timeoutError.status = 504;
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

router.post("/itinerary", requireAuth, async (req, res, next) => {
  try {
    const errors = requireFields(req.body, [
      "destination",
      "nights",
      "budget",
      "travelStyle",
    ]);
    const nights = Number(req.body?.nights);

    if (
      req.body?.nights !== undefined &&
      (!Number.isInteger(nights) || nights < 1 || nights > 30)
    ) {
      errors.push("nights must be an integer from 1 to 30");
    }

    if (errors.length) return res.status(400).json({ errors });

    const prompt = [
      `Destination: ${cleanText(req.body.destination, 80)}`,
      `Trip length: ${nights} nights`,
      `Budget: ${cleanText(req.body.budget, 80)}`,
      `Travel style and preferences: ${cleanText(req.body.travelStyle, 300)}`,
      "Return a practical eco-friendly itinerary with day-wise plan, local stay advice, food/transport tips, estimated budget notes, and sustainability tips.",
    ].join("\n");

    const result = await callAiProvider(
      "You are EcoStay AI, a practical sustainable travel assistant for Indian homestay guests. Keep answers structured, specific, budget-aware, and safe.",
      prompt,
    );

    res.status(200).json({ feature: "itinerary", result });
  } catch (error) {
    next(error);
  }
});

router.post("/listing-description", requireAuth, async (req, res, next) => {
  try {
    const errors = requireFields(req.body, [
      "propertyName",
      "location",
      "amenities",
      "targetGuests",
      "ecoFeatures",
    ]);

    if (errors.length) return res.status(400).json({ errors });

    const prompt = [
      `Property name: ${cleanText(req.body.propertyName, 80)}`,
      `Location: ${cleanText(req.body.location, 80)}`,
      `Amenities: ${cleanText(req.body.amenities, 300)}`,
      `Target guests: ${cleanText(req.body.targetGuests, 160)}`,
      `Eco-friendly features: ${cleanText(req.body.ecoFeatures, 300)}`,
      "Generate a listing title, a 100-140 word listing description, and 5 short highlights. Avoid unrealistic claims.",
    ].join("\n");

    const result = await callAiProvider(
      "You help homestay owners write honest, warm, high-converting travel listing copy with a sustainability angle.",
      prompt,
    );

    res.status(200).json({ feature: "listing-description", result });
  } catch (error) {
    next(error);
  }
});

router.post("/review-insights", requireAuth, async (req, res, next) => {
  try {
    const errors = requireFields(req.body, ["reviewText"]);

    if (cleanText(req.body?.reviewText, 1200).length < 20) {
      errors.push("reviewText must contain at least 20 characters");
    }

    if (errors.length) return res.status(400).json({ errors });

    const prompt = [
      `Guest review: ${cleanText(req.body.reviewText, 1200)}`,
      "Analyze this review. Return sentiment, key praise, key issues, 3 improvement actions, and a polite owner reply under 80 words.",
    ].join("\n");

    const result = await callAiProvider(
      "You are a homestay operations assistant. Be concise, fair, and action-oriented. Do not overreact to a single review.",
      prompt,
    );

    res.status(200).json({ feature: "review-insights", result });
  } catch (error) {
    next(error);
  }
});

export default router;
