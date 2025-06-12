export default function WeatherCard({ weather }) {
  if (!weather) {
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
        <div style={{ animation: "pulse 2s infinite" }}>
          <div
            style={{
              height: "1rem",
              background: "#dcfce7",
              borderRadius: "0.5rem",
              width: "75%",
              marginBottom: "0.5rem",
            }}
          ></div>
          <div
            style={{
              height: "2rem",
              background: "#dcfce7",
              borderRadius: "0.5rem",
              width: "50%",
              marginBottom: "1rem",
            }}
          ></div>
          <div
            style={{
              height: "1rem",
              background: "#dcfce7",
              borderRadius: "0.5rem",
              width: "100%",
            }}
          ></div>
        </div>
      </div>
    )
  }

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
          color: "#166534", // Dark green
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        🌤️ Current Weather
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          style={{
            width: "80px",
            height: "80px",
            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
          }}
        />
        <div style={{ marginLeft: "1rem" }}>
          <div
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#166534", // Dark green
              lineHeight: "1",
            }}
          >
            {weather.temperature}°C
          </div>
          <div
            style={{
              color: "#15803d", // Medium green
              textTransform: "capitalize",
              fontSize: "1.1rem",
              fontWeight: "500",
            }}
          >
            {weather.description}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {[
          { label: "Location", value: weather.location, icon: "📍" },
          { label: "Humidity", value: `${weather.humidity}%`, icon: "💧" },
          { label: "Wind Speed", value: `${weather.windSpeed} m/s`, icon: "💨" },
          { label: "Rainfall", value: `${weather.rainfall} mm`, icon: "🌧️" },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.75rem",
              background: "rgba(167, 243, 208, 0.2)",
              borderRadius: "12px",
              border: "1px solid rgba(167, 243, 208, 0.5)",
            }}
          >
            <span
              style={{
                color: "#15803d", // Medium green
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {item.icon} {item.label}:
            </span>
            <span
              style={{
                fontWeight: "600",
                color: "#166534", // Dark green
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
