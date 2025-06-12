export default function WateringRecommendation({ weather, plants }) {
  const getWateringRecommendation = () => {
    if (!weather) return { recommendation: "Loading weather data...", color: "gray", icon: "⏳" }

    const { temperature, humidity, rainfall, conditions } = weather

    // Skip watering if it rained recently
    if (rainfall > 5) {
      return {
        recommendation: "Skip watering today - Recent rainfall detected",
        color: "#0d9488",
        reason: `${rainfall}mm of rain means your plants have enough water`,
        icon: "🌧️",
      }
    }

    // High temperature and low humidity = definitely water
    if (temperature > 25 && humidity < 40) {
      return {
        recommendation: "Water immediately - Hot and dry conditions",
        color: "#b91c1c",
        reason: "High temperature and low humidity will stress your plants",
        icon: "💧",
      }
    }

    // Moderate conditions
    if (temperature > 20 && humidity < 60) {
      return {
        recommendation: "Water lightly - Moderate conditions",
        color: "#ca8a04",
        reason: "Plants may need water, check soil moisture first",
        icon: "🌱",
      }
    }

    // Cool and humid conditions
    if (temperature < 20 && humidity > 70) {
      return {
        recommendation: "No watering needed - Cool and humid",
        color: "#15803d",
        reason: "Plants can conserve water in these conditions",
        icon: "✅",
      }
    }

    // Default moderate watering
    return {
      recommendation: "Light watering recommended",
      color: "#15803d",
      reason: "General maintenance watering for healthy growth",
      icon: "🌿",
    }
  }

  const { recommendation, color, reason, icon } = getWateringRecommendation()

  return (
    <div
      style={{
        background: "rgba(240, 253, 244, 0.95)", // Light green background
        borderRadius: "20px",
        padding: "1.5rem",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(167, 243, 208, 0.5)",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#166534",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        💧 Watering Recommendation
      </h2>

      <div
        style={{
          padding: "1.5rem",
          borderRadius: "16px",
          marginBottom: "1.5rem",
          background: "rgba(167, 243, 208, 0.3)",
          border: `2px solid ${color}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "white",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            {icon}
          </div>
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: "700",
              color,
            }}
          >
            {recommendation}
          </div>
        </div>
        <div
          style={{
            fontSize: "1rem",
            color: "#374151",
            paddingLeft: "calc(48px + 1rem)",
          }}
        >
          {reason}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            padding: "1rem",
            background: "rgba(167, 243, 208, 0.2)",
            borderRadius: "12px",
            textAlign: "center",
            border: "1px solid rgba(167, 243, 208, 0.5)",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              color: "#166534",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            Temperature
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#166534",
            }}
          >
            {weather?.temperature || "--"}°C
          </div>
        </div>

        <div
          style={{
            padding: "1rem",
            background: "rgba(167, 243, 208, 0.2)",
            borderRadius: "12px",
            textAlign: "center",
            border: "1px solid rgba(167, 243, 208, 0.5)",
          }}
        >
          <div
            style={{
              fontSize: "0.875rem",
              color: "#166534",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            Humidity
          </div>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#166534",
            }}
          >
            {weather?.humidity || "--"}%
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "1rem",
          background: "rgba(236, 252, 203, 0.5)",
          borderRadius: "12px",
          border: "1px solid rgba(236, 252, 203, 0.8)",
        }}
      >
        <div
          style={{
            fontSize: "0.9rem",
            color: "#3f6212",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>💡</span>
          <span>
            <strong>Tip:</strong> Always check soil moisture before watering. Stick your finger 2 inches into the soil -
            if it's dry, water thoroughly.
          </span>
        </div>
      </div>
    </div>
  )
}
