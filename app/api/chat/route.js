export async function POST(request) {
  try {
    const { message, weather, plants } = await request.json();
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    // Greeting detection function
    const isGreeting = (text) => {
      const greetings = ["hi", "hello", "hey", "good morning", "good evening"];
      return greetings.includes(text.toLowerCase().trim());
    };

    // If the message is just a greeting, respond directly
    if (isGreeting(message)) {
      return Response.json({
        message: "Hi there! I'm your garden assistant 🌿. How can I help you today?",
      });
    }

    if (!apiKey) {
      return Response.json({
        message: "I'm your garden assistant! (Hugging Face API key required for full AI response).",
      });
    }

    // Clean and direct prompt for the model
    const prompt = `Current weather is ${weather?.temperature || "unknown"}°C and ${weather?.description || "unknown conditions"}.
User's garden has: ${plants.map((p) => p.name).join(", ") || "no plants yet"}.
Based on this, answer the following question clearly and helpfully:\n\n${message}`;

    try {
      const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error (non-200):", errorText);
        throw new Error("API returned non-success status");
      }

      const data = await response.json();

      // Try extracting response from different formats
      let generatedText = "";
      if (typeof data === "string") {
        generatedText = data;
      } else if (Array.isArray(data) && typeof data[0] === "string") {
        generatedText = data[0];
      } else if (data?.generated_text) {
        generatedText = data.generated_text;
      } else if (data?.[0]?.generated_text) {
        generatedText = data[0].generated_text;
      }

      if (generatedText && generatedText.length > 20) {
        return Response.json({ message: generatedText.trim() });
      }

      throw new Error("API response was empty or unclear");
    } catch (apiError) {
      console.error("Hugging Face API error:", apiError);
      const fallbackResponse = getFallbackResponse(message, weather, plants);
      return Response.json({ message: fallbackResponse });
    }
  } catch (error) {
    console.error("Chat API general error:", error);
    return Response.json({
      message: "Sorry, I had trouble processing your request. Please try again.",
    });
  }
}

// Fallback response for when the API fails completely
function getFallbackResponse(message, weather, plants) {
  const lowerMessage = message.toLowerCase();
  const temp = weather?.temperature || 25;

  if (lowerMessage.includes("sweet") && (lowerMessage.includes("grow") || lowerMessage.includes("eat"))) {
    return `You can grow strawberries, cherry tomatoes, or sugar snap peas in this weather (${temp}°C).`;
  }

  if (lowerMessage.includes("summer") && lowerMessage.includes("plant")) {
    return `Try tomatoes, peppers, cucumbers, and basil for summer planting in ${temp}°C weather.`;
  }

  if (lowerMessage.includes("overwater")) {
    return "Yellowing leaves and soggy soil are signs of overwatering. Let the soil dry before watering again.";
  }

  return `Your weather is ${temp}°C. You have ${plants.length} plants. Ask about planting, watering, or care tips!`;
}
