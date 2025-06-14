"use client"

import { useState, useEffect } from "react"
import { db } from "../firebase"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore"
import WeatherCard from "../components/WeatherCard"
import WateringRecommendation from "../components/WateringRecommendation"
import PlantChat from "../components/PlantChat"
import PlantList from "../components/PlantList"

export default function GardenDashboard() {
  const [weather, setWeather] = useState(null)
  const [location, setLocation] = useState("New York")
  const [plants, setPlants] = useState([])

  const fetchPlants = async () => {
    const snapshot = await getDocs(collection(db, "plants"))
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setPlants(data)
  }

  const addPlant = async (plant) => {
    const newPlant = {
      ...plant,
      lastWatered: null,
      dailyWaterAmount: 0,
      totalWaterAmount: 0,
      waterCount: 0,
      status: "Not watered"
    }
    const docRef = await addDoc(collection(db, "plants"), newPlant)
    setPlants(prev => [...prev, { id: docRef.id, ...newPlant }])
  }

  const updateLastWatered = async (plantId, waterAmount = 250) => {
    const today = new Date().toISOString().split("T")[0]
    const updatedPlants = plants.map(plant =>
      plant.id === plantId
        ? {
            ...plant,
            lastWatered: today,
            dailyWaterAmount: (plant.dailyWaterAmount || 0) + waterAmount,
            totalWaterAmount: (plant.totalWaterAmount || 0) + waterAmount,
            waterCount: (plant.waterCount || 0) + 1,
            status: "Watered"
          }
        : plant
    )
    setPlants(updatedPlants)

    const updated = updatedPlants.find(p => p.id === plantId)
    await updateDoc(doc(db, "plants", plantId), updated)
  }

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
    fetchPlants()
    fetchWeather()
  }, [location])

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
            status: "Not watered"
          }))
        )
        setInterval(() => {
          setPlants((prevPlants) =>
            prevPlants.map((plant) => ({
              ...plant,
              dailyWaterAmount: 0,
              status: "Not watered"
            }))
          )
        }, 24 * 60 * 60 * 1000)
      }, msUntilMidnight)
    }

    resetDailyWater()
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)", fontFamily: "Inter, sans-serif" }}>
      <header style={{ background: "rgba(255,255,255,0.95)", padding: "2rem 1rem", textAlign: "center", borderBottom: "1px solid #bbf7d0" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "bold", color: "#166534" }}>🌱 GREEN SPACE</h1>
        <p style={{ color: "#15803d", fontWeight: "600" }}>Smart Garden Management & Plant Care System</p>
        <p style={{ fontSize: "0.9rem", color: "#6b7280", fontStyle: "italic" }}>"Nurturing plants with technology, one drop at a time"</p>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Location Input */}
        <div style={{ maxWidth: "400px", margin: "0 auto 2rem" }}>
          <label style={{ fontWeight: "600", color: "#166534" }}>📍 Your Location:</label>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city"
              style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "10px", border: "2px solid #bbf7d0" }}
            />
            <button
              onClick={fetchWeather}
              style={{ background: "#16a34a", color: "white", borderRadius: "10px", padding: "0.75rem 1.5rem", fontWeight: "600" }}
            >
              Update
            </button>
          </div>
        </div>

        {/* Weather and Recommendations */}
        <div style={{ display: "grid", gap: "1.5rem", marginBottom: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          <WeatherCard weather={weather} />
          <WateringRecommendation weather={weather} plants={plants} />
        </div>

        {/* Plant List and Chat */}
        <div style={{ display: "grid", gap: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))" }}>
          <PlantList
            plants={plants}
            onAddPlant={addPlant}
            onWaterPlant={updateLastWatered}
            weather={weather}
          />
          <PlantChat weather={weather} plants={plants} />
        </div>
      </main>

      <footer style={{ background: "#166534", color: "white", padding: "2rem 1rem", textAlign: "center", marginTop: "4rem" }}>
        <p style={{ fontWeight: "600", fontSize: "1.1rem" }}>GREEN SPACE</p>
        <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>© 2024 Rooshitha Jemimah – Keep your plants happy! 🌿</p>
      </footer>
    </div>
  )
}
