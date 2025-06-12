"use client"

import { useState, useEffect } from "react"
import WeatherCard from "../components/WeatherCard"
import WateringRecommendation from "../components/WateringRecommendation"
import PlantChat from "../components/PlantChat"
import PlantList from "../components/PlantList"

export default function GardenDashboard() {
  const [weather, setWeather] = useState(null)
  const [location, setLocation] = useState("New York")
  const [plants, setPlants] = useState([
    {
      id: 1,
      name: "Tomatoes",
      type: "vegetable",
      lastWatered: "2024-12-10", // Set to yesterday to show "needs water"
      dailyWaterAmount: 0,
      totalWaterAmount: 0,
    },
    {
      id: 2,
      name: "Roses",
      type: "flower",
      lastWatered: "2024-12-09", // Set to 3 days ago to show "needs water"
      dailyWaterAmount: 0,
      totalWaterAmount: 0,
    },
    {
      id: 3,
      name: "Basil",
      type: "herb",
      lastWatered: "2024-12-10", // Set to yesterday to show "needs water"
      dailyWaterAmount: 0,
      totalWaterAmount: 0,
    },
  ])

  const fetchWeather = async () => {
    try {
      const response = await fetch(`/api/weather?location=${location}`)
      const data = await response.json()
      setWeather(data)
    } catch (error) {
      console.error("Error fetching weather:", error)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [location])

  // Reset daily water amounts at midnight
  useEffect(() => {
    const resetDailyWater = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const msUntilMidnight = tomorrow.getTime() - now.getTime()

      setTimeout(() => {
        setPlants((prevPlants) =>
          prevPlants.map((plant) => ({
            ...plant,
            dailyWaterAmount: 0,
          })),
        )
        // Set up daily reset
        setInterval(
          () => {
            setPlants((prevPlants) =>
              prevPlants.map((plant) => ({
                ...plant,
                dailyWaterAmount: 0,
              })),
            )
          },
          24 * 60 * 60 * 1000,
        ) // 24 hours
      }, msUntilMidnight)
    }

    resetDailyWater()
  }, [])

  const addPlant = (plant) => {
    const newPlant = {
      ...plant,
      id: Date.now(),
      lastWatered: new Date().toISOString().split("T")[0],
      dailyWaterAmount: 0,
      totalWaterAmount: 0,
    }
    setPlants([...plants, newPlant])
  }

  const updateLastWatered = (plantId, waterAmount = 250) => {
    const today = new Date().toISOString().split("T")[0]

    setPlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === plantId
          ? {
              ...plant,
              lastWatered: today, // This updates the "last watered" date to today
              dailyWaterAmount: (plant.dailyWaterAmount || 0) + waterAmount,
              totalWaterAmount: (plant.totalWaterAmount || 0) + waterAmount,
            }
          : plant,
      ),
    )

    // Show success notification
    const plantName = plants.find((p) => p.id === plantId)?.name
    if (plantName) {
      console.log(`✅ ${plantName} watered with ${waterAmount}ml! Status updated.`)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(167, 243, 208, 0.5)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2.5rem 1rem",
            textAlign: "center",
          }}
        >
          {/* Main Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "3.5rem",
                background: "linear-gradient(135deg, #166534, #16a34a, #22c55e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: "900",
                letterSpacing: "-0.02em",
                textShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              🌱 GREEN SPACE
            </div>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1.3rem",
              color: "#15803d",
              fontWeight: "600",
              marginBottom: "0.75rem",
              letterSpacing: "0.5px",
            }}
          >
            Smart Garden Management & Plant Care System
          </p>

          {/* Founder Credit */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                padding: "0.5rem 1.5rem",
                background: "rgba(22, 163, 74, 0.1)",
                borderRadius: "25px",
                border: "1px solid rgba(22, 163, 74, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "1rem",
                  color: "#166534",
                  fontWeight: "500",
                }}
              >
                Founded by
              </span>
              <span
                style={{
                  fontSize: "1.1rem",
                  color: "#166534",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                Rooshitha Jemimah
              </span>
              <span style={{ fontSize: "1.2rem" }}>🌿</span>
            </div>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: "1rem",
              color: "#6b7280",
              fontWeight: "400",
              fontStyle: "italic",
              opacity: "0.8",
            }}
          >
            "Nurturing plants with technology, one drop at a time"
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1rem",
        }}
      >
        {/* Location Input */}
        <div
          style={{
            marginBottom: "2rem",
            maxWidth: "400px",
            margin: "0 auto 2rem auto",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(167, 243, 208, 0.5)",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#166534",
                marginBottom: "0.75rem",
              }}
            >
              📍 Your Location:
            </label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  flex: "1",
                  padding: "0.75rem 1rem",
                  border: "2px solid rgba(167, 243, 208, 0.5)",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.2s",
                  background: "white",
                }}
                placeholder="Enter your city"
                onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(167, 243, 208, 0.5)")}
              />
              <button
                onClick={fetchWeather}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#16a34a",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
                }}
                onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
                onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Weather and Recommendations */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <WeatherCard weather={weather} />
          <div style={{ gridColumn: "span 2" }}>
            <WateringRecommendation weather={weather} plants={plants} />
          </div>
        </div>

        {/* Plants and Chat */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <PlantList plants={plants} onAddPlant={addPlant} onWaterPlant={updateLastWatered} weather={weather} />
          <PlantChat weather={weather} plants={plants} />
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#166534",
          color: "white",
          marginTop: "4rem",
          padding: "2rem 1rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  margin: "0 0 0.5rem 0",
                }}
              >
                GREEN SPACE
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  opacity: "0.8",
                  margin: "0",
                }}
              >
                Smart Garden Management System
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  fontSize: "0.9rem",
                  margin: "0 0 0.5rem 0",
                }}
              >
                Founded by <strong>Rooshitha Jemimah</strong>
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  opacity: "0.7",
                  margin: "0",
                }}
              >
                © 2024 - Keep your plants happy! 🌿
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
