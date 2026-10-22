import { NextResponse } from 'next/server';

/**
 * High-quality fallback response generator when GEMINI_API_KEY is not set or network fails.
 */
function generateFallbackResponse(messages, tripContext) {
  const lastMsg = messages[messages.length - 1]?.content || '';
  const text = lastMsg.toLowerCase();
  const destinations = tripContext?.destinations || [];
  const primaryDest = destinations[0] || tripContext?.title?.replace(/trip|escape|tour|journey/gi, '').trim() || 'your destination';
  const currency = tripContext?.currency || 'USD';
  const budget = tripContext?.budget || 1500;
  const nodes = tripContext?.stops || tripContext?.nodes || [];

  let content = '';
  let suggestedStop = null;

  // Food & Culinary
  if (text.includes('food') || text.includes('eat') || text.includes('dish') || text.includes('restaurant') || text.includes('culinary') || text.includes('cafe')) {
    content = `Here are top culinary recommendations for **${primaryDest}**:\n\n` +
      `• **Signature local flavors**: Seek out family-run eateries off the main tourist strips for authentic regional specialties.\n` +
      `• **Street food & markets**: Twilight and evening markets offer the freshest bites with high turnover.\n` +
      `• **Dining tip**: Reserve popular dinner spots at least 24 hours in advance to secure sunset or patio seating.`;

    suggestedStop = {
      title: `${primaryDest} Heritage Culinary Experience`,
      type: 'food',
      category: 'Food',
      duration: '1.5 - 2 hours',
      estimatedCost: 35,
      description: `Authentic local culinary tasting with regional specialties and chef-curated tastings in ${primaryDest}.`,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    };
  }
  // Sunset / Scenic / Beach / Photography
  else if (text.includes('sunset') || text.includes('view') || text.includes('photo') || text.includes('beach') || text.includes('scenic')) {
    content = `For the most breathtaking views in **${primaryDest}**:\n\n` +
      `• **Golden Hour (5:30 PM - 6:45 PM)**: Arrive at least 45 minutes before sunset to capture changing light across the horizon.\n` +
      `• **Panorama Points**: Coastal ridges, historic fortress ruins, and rooftop promenades provide 360-degree vistas.\n` +
      `• **Crowd tip**: Weekday evenings are significantly quieter for unobstructed photography.`;

    suggestedStop = {
      title: `${primaryDest} Panoramic Sunset Lookout`,
      type: 'destination',
      category: 'Sightseeing',
      duration: '2 hours',
      estimatedCost: 0,
      description: `Elevated vantage point with sweeping horizon views, ideal for golden hour photography and evening breezes.`,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    };
  }
  // Route / Transit / Pacing / Order
  else if (text.includes('route') || text.includes('transit') || text.includes('pacing') || text.includes('optimize') || text.includes('order') || text.includes('drive')) {
    const stopsCount = nodes.length || 4;
    content = `Here is an optimized route and pacing strategy for your ${stopsCount} stops in **${primaryDest}**:\n\n` +
      `• **Geographic Clustering**: Group Northern/Central stops on initial days and cross regional boundaries only once to eliminate redundant travel.\n` +
      `• **Midday Heat Buffer**: Schedule indoor museums, lunch breaks, or rest between 1:00 PM and 3:30 PM.\n` +
      `• **Daily Flow**: Morning sightseeing (9:00 AM) → relaxed lunch → afternoon cultural excursion → golden hour sunset. This saves approximately 1.5–2 hours of transit time per day!`;
  }
  // Budget / Cost / Savings
  else if (text.includes('budget') || text.includes('cost') || text.includes('save') || text.includes('money') || text.includes('price')) {
    const dailyEst = Math.round(budget / (tripContext?.duration || 5));
    content = `Here is a smart budget optimization blueprint for your **${currency} ${budget}** budget:\n\n` +
      `• **35% Accommodation**: Book boutique stays or heritage guesthouses with breakfast included.\n` +
      `• **25% Food & Dining**: Combine casual street food for lunches with upscale regional dinners.\n` +
      `• **20% Activities & Entry**: Reserve multi-attraction passes or visit free landmarks in mornings.\n` +
      `• **20% Transit & Contingency**: Use rideshare or local day passes. Estimated daily target: **${currency} ${dailyEst}/day**.`;
  }
  // Itinerary planning
  else if (text.includes('itinerary') || text.includes('plan') || text.includes('days') || text.includes('suggest') || text.includes('3-day')) {
    content = `Here is a balanced 3-day itinerary framework for **${primaryDest}**:\n\n` +
      `• **Day 1 — Heritage & Landmarks**: Explore historic quarters, iconic monuments, and orientation walks.\n` +
      `• **Day 2 — Culture, Nature & Local Markets**: Morning artisan markets, scenic nature viewpoints, and local cooking demonstrations.\n` +
      `• **Day 3 — Coastal / Leisure & Fine Dining**: Relaxed coastal waterfront, boat excursion, and a celebratory farewell dinner.\n\n` +
      `Would you like me to recommend specific stops to add to your canvas?`;

    suggestedStop = {
      title: `${primaryDest} Historic Walking Tour`,
      type: 'activity',
      category: 'Culture',
      duration: '2.5 hours',
      estimatedCost: 25,
      description: `Guided exploration through hidden alleys, colonial architecture, and local artisan markets in ${primaryDest}.`,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
    };
  }
  // General travel query
  else {
    content = `I've analyzed your trip to **${primaryDest}**${nodes.length ? ` with ${nodes.length} scheduled stops` : ''}!\n\n` +
      `• **Pacing**: Your current itinerary is well-balanced. Adding 90-minute downtime windows between morning and afternoon activities will keep your trip energizing.\n` +
      `• **Local insight**: Early mornings (before 10:00 AM) are the quietest time for popular landmarks.\n` +
      `• **Next steps**: Feel free to ask me for local food gems, route shortcuts, or budget tips!`;
  }

  return {
    role: 'assistant',
    content,
    suggestedStop,
    provider: 'local-copilot',
  };
}

/**
 * Parse any ```json ... { "suggestedStop": {...} } ... ``` block from LLM output.
 */
function extractSuggestedStop(rawText) {
  let suggestedStop = null;
  let cleanText = rawText;

  try {
    const jsonMatch = rawText.match(/```(?:json)?\s*(\{[\s\S]*?"suggestedStop"[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[1]);
      if (parsed.suggestedStop) {
        suggestedStop = parsed.suggestedStop;
        cleanText = rawText.replace(jsonMatch[0], '').trim();
      }
    }
  } catch (e) {
    // Silently continue if regex or JSON parse failed
  }

  return { cleanText, suggestedStop };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages = [], tripContext = {} } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key is provided, return intelligent context-aware fallback
    if (!apiKey) {
      const fallback = generateFallbackResponse(messages, tripContext);
      return NextResponse.json(fallback);
    }

    // Prepare system prompt tailored with trip context
    const destinationsStr = (tripContext.destinations || []).join(', ') || 'travel destinations';
    const stopsStr = (tripContext.stops || tripContext.nodes || []).map(s => typeof s === 'string' ? s : s.title).join(', ') || 'Not specified';
    const budgetStr = tripContext.budget ? `${tripContext.currency || 'USD'} ${tripContext.budget}` : 'Flexible';

    const systemPrompt = `You are GlobeTrotter AI Copilot, a world-class luxury travel advisor, itinerary architect, and route transit optimizer.
You assist travelers with destination tips, day-by-day pacing, authentic dining, and route efficiency.

CURRENT TRIP CONTEXT:
- Destination(s): ${destinationsStr}
- Trip Title: ${tripContext.title || 'Custom Trip'}
- Current Itinerary Stops: ${stopsStr}
- Total Budget: ${budgetStr}

GUIDELINES:
1. Provide actionable, concise, and beautifully structured responses using markdown bullet points and bold highlights.
2. Maintain an inspiring, knowledgeable, and hospitable tone.
3. Keep responses focused (typically 2-4 short bullet points or paragraphs).
4. If recommending a specific place, activity, restaurant, or viewpoint that the user can add to their itinerary, output a JSON block at the very end of your message in this EXACT format:
\`\`\`json
{
  "suggestedStop": {
    "title": "Exact Place Name",
    "type": "destination",
    "category": "Sightseeing",
    "duration": "2 hours",
    "estimatedCost": 20,
    "description": "Short vivid description of why to visit.",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop"
  }
}
\`\`\`
Valid categories: "Sightseeing", "Food", "Culture", "Adventure", "Relax".
Valid types: "destination", "activity", "food", "stay".
Only include one suggestedStop block when recommending a concrete visit.`;

    // Convert conversation to Gemini format (roles: "user" | "model")
    const geminiContents = messages.map(m => ({
      role: m.role === 'assistant' || m.sender === 'ai' ? 'model' : 'user',
      parts: [{ text: m.content || m.text || '' }],
    }));

    // Choose Gemini model (default to gemini-1.5-flash)
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.warn(`Gemini API error (${geminiRes.status}):`, errText);
      // Fallback gracefully on Gemini failure
      const fallback = generateFallbackResponse(messages, tripContext);
      return NextResponse.json({
        ...fallback,
        provider: 'fallback-after-gemini-error',
      });
    }

    const geminiData = await geminiRes.json();
    const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!candidateText) {
      const fallback = generateFallbackResponse(messages, tripContext);
      return NextResponse.json(fallback);
    }

    const { cleanText, suggestedStop } = extractSuggestedStop(candidateText);

    return NextResponse.json({
      role: 'assistant',
      content: cleanText,
      suggestedStop,
      provider: 'gemini',
    });
  } catch (error) {
    console.error('Error in /api/chat route:', error);
    // Graceful fallback on unexpected exceptions
    const fallback = generateFallbackResponse([], {});
    return NextResponse.json({
      ...fallback,
      provider: 'fallback-exception',
    });
  }
}
