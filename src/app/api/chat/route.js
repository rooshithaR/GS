import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  try {
    const { message, weather, plants } = await request.json()

    const systemPrompt = `You are a professional gardening expert and plant care specialist. You help people with garden management, plant care, and growing advice.

Current weather conditions: ${weather ? `Temperature: ${weather.temperature}°C, Humidity: ${weather.humidity}%, Conditions: ${weather.description}, Location: ${weather.location}` : "Weather data not available"}

User's plants: ${plants.map((plant) => `${plant.name} (${plant.type}), last watered: ${plant.lastWatered}`).join(", ")}

Provide helpful, practical advice about:
- Plant care and watering schedules
- Climate suitability for different plants
- Garden management tips
- Plant health and growth optimization
- Seasonal planting recommendations

Keep responses concise but informative. Always consider the current weather conditions when giving advice.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return Response.json({
      message: completion.choices[0].message.content,
    })
  } catch (error) {
    console.error("OpenAI API error:", error)
    return Response.json({ error: "Failed to get plant advice" }, { status: 500 })
  }
}
