# EcoStay AI Prompt Testing Log

Week 7 feature: protected Groq-powered EcoStay AI Assistant.

I tested the itinerary prompt first because it is the easiest feature to demonstrate in screenshots. The other two prompts use the same backend AI service but solve owner-side tasks.

## System Role Used

EcoStay AI should answer like a practical travel helper, not like a long travel blog. I wanted the answer to mention budget, local travel, and eco-friendly choices because that matches the project theme.

## Prompt Variation 1: Basic Travel Plan

**Prompt tested**

```text
Create a travel itinerary for the destination, number of nights, and budget.
```

**Example input**

```text
Destination: Manali
Nights: 3
Budget: Rs. 10000
Travel style: family trip
```

**What I noticed**

The response gave a simple day-wise plan with sightseeing suggestions. It was readable, but it sounded like a normal tourist itinerary and did not include enough sustainability details or practical budget notes.

**Result**

This prompt was too broad. It worked, but the answer could fit almost any travel website, so I did not use it as the final version.

## Prompt Variation 2: Eco-Friendly Travel Plan

**Prompt tested**

```text
Create an eco-friendly travel itinerary with day-wise activities, local food ideas, transport tips, and sustainability suggestions.
```

**Example input**

```text
Destination: Manali
Nights: 3
Budget: Rs. 10000
Travel style: eco-friendly family trip with local food and nature walks
```

**What I noticed**

The response included local activities, low-impact transport ideas, reusable bottle reminders, and local food suggestions. This felt closer to EcoStay, but the format was still not consistent enough for a dashboard output card.

**Result**

This prompt worked better because it connected the output to EcoStay's eco-friendly theme. I still wanted clearer sections for budget and stay advice.

## Prompt Variation 3: Structured EcoStay Assistant Prompt

**Prompt tested**

```text
Return a practical eco-friendly itinerary with day-wise plan, local stay advice, food/transport tips, estimated budget notes, and sustainability tips.
```

**Example input**

```text
Destination: Manali
Trip length: 3 nights
Budget: Rs. 10000
Travel style and preferences: eco-friendly family trip with local food and nature walks
```

**What I noticed**

The response was organized into days, budget guidance, food and transport suggestions, and sustainability tips. This was easier to read in the frontend output card.

**Result**

This was the best prompt because it gave the AI clear sections instead of leaving the answer open-ended. I selected this one for the main Week 7 demo.

## Additional Feature Prompts

### Homestay Listing Writer

```text
Generate a listing title, a 100-140 word listing description, and 5 short highlights. Avoid unrealistic claims.
```

I added "avoid unrealistic claims" because listing copy can become too promotional if the prompt is not limited.

### Guest Review Insights

```text
Analyze this review. Return sentiment, key praise, key issues, 3 improvement actions, and a polite owner reply under 80 words.
```

This prompt is useful for owners because it turns a review into action points instead of only saying positive or negative.

## Implementation Notes

- The Groq key is used only in the Express backend through `backend/.env`.
- I first tried Gemini and xAI/Grok, but both had quota or credit issues. The working local setup now uses Groq with `llama-3.1-8b-instant`.
- If the API returns a quota error, the frontend shows an error toast instead of breaking the page.
