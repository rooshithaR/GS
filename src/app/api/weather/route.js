export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") || "New York"

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
    )

    if (!response.ok) {
      throw new Error("Weather data not found")
    }

    const data = await response.json()

    const weatherData = {
      location: data.name,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      rainfall: data.rain ? data.rain["1h"] || 0 : 0,
      conditions: data.weather[0].main,
    }

    return Response.json(weatherData)
  } catch (error) {
    return Response.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
