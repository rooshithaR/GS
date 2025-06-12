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
    { id: 1, name: "Tomatoes", type: "vegetable", lastWatered: "2024-12-11" },
    { id: 2, name: "Roses", type: "flower", lastWatered: "2024-12-10" },
    { id: 3, name: "Basil", type: "herb", lastWatered: "2024-12-11" },
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

  const addPlant = (plant) => {
    setPlants([...plants, { ...plant, id: Date.now(), lastWatered: new Date().toISOString().split("T")[0] }])
  }

  const updateLastWatered = (plantId) => {
    setPlants(
      plants.map((plant) =>
        plant.id === plantId ? { ...plant, lastWatered: new Date().toISOString().split("T")[0] } : plant,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 Garden Management System</h1>
          <p className="text-gray-600">Smart watering recommendations based on weather conditions</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location:</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your city"
              />
              <button
                onClick={fetchWeather}
                className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Update Weather
              </button>
            </div>
            <WeatherCard weather={weather} />
          </div>

          <div className="lg:col-span-2">
            <WateringRecommendation weather={weather} plants={plants} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlantList plants={plants} onAddPlant={addPlant} onWaterPlant={updateLastWatered} weather={weather} />
          <PlantChat weather={weather} plants={plants} />
        </div>
      </div>
    </div>
  )
}