"use client"

import { useState } from "react"

export default function PlantList({ plants, onAddPlant, onWaterPlant, weather }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newPlant, setNewPlant] = useState({ name: "", type: "vegetable" })

  const handleAddPlant = (e) => {
    e.preventDefault()
    if (newPlant.name.trim()) {
      onAddPlant(newPlant)
      setNewPlant({ name: "", type: "vegetable" })
      setShowAddForm(false)
    }
  }

  const getDaysSinceWatered = (lastWatered) => {
    if (!lastWatered) return Infinity
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const waterDate = new Date(lastWatered)
    waterDate.setHours(0, 0, 0, 0)

    const diffTime = today.getTime() - waterDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const getWateringSchedule = (type) => {
    const schedules = {
      vegetable: { days: 1, description: "Daily watering" },
      flower: { days: 2, description: "Every 2 days" },
      herb: { days: 1, description: "Daily watering" },
      succulent: { days: 7, description: "Weekly watering" },
      tree: { days: 3, description: "Every 3 days" },
    }
    return schedules[type] || { days: 2, description: "Every 2 days" }
  }

  const needsWatering = (plant) => {
    const daysSince = getDaysSinceWatered(plant.lastWatered)
    const schedule = getWateringSchedule(plant.type)
    return daysSince >= schedule.days
  }

  const getPlantIcon = (type) => {
    const icons = {
      vegetable: "🥕",
      flower: "🌸",
      herb: "🌿",
      succulent: "🌵",
      tree: "🌳",
    }
    return icons[type] || "🌱"
  }

  const getWateringStatus = (plant) => {
    const daysSince = getDaysSinceWatered(plant.lastWatered)
    const schedule = getWateringSchedule(plant.type)
    const needsWater = needsWatering(plant)

    if (daysSince === 0) {
      return {
        status: "Watered today",
        color: "#16a34a",
        bgColor: "rgba(22, 163, 74, 0.1)",
        urgency: "good",
      }
    }

    if (needsWater) {
      const overdueDays = daysSince - schedule.days + 1
      if (overdueDays > 2) {
        return {
          status: "Urgent - Very thirsty!",
          color: "#dc2626",
          bgColor: "rgba(220, 38, 38, 0.1)",
          urgency: "critical",
        }
      } else {
        return {
          status: "Needs water!",
          color: "#ea580c",
          bgColor: "rgba(234, 88, 12, 0.1)",
          urgency: "warning",
        }
      }
    }

    return {
      status: "Healthy",
      color: "#15803d",
      bgColor: "rgba(21, 128, 61, 0.1)",
      urgency: "good",
    }
  }

  const handleWaterPlant = (plantId, waterAmount) => {
    onWaterPlant(plantId, waterAmount)
    const plantName = plants.find((p) => p.id === plantId)?.name
    console.log(`💧 ${plantName} watered with ${waterAmount}ml!`)
  }

  return (
    <div
      style={{
        background: "rgba(240, 253, 244, 0.95)",
        borderRadius: "20px",
        padding: "1.5rem",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(167, 243, 208, 0.5)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#166534" }}>🌿 My Plants ({plants.length})</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: showAddForm
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "linear-gradient(135deg, #16a34a, #15803d)",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "12px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {showAddForm ? "✕ Cancel" : "+ Add Plant"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddPlant} style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            value={newPlant.name}
            onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
            placeholder="Plant name"
            required
            style={{ padding: "0.75rem 1rem", borderRadius: "8px", marginRight: "0.5rem" }}
          />
          <select
            value={newPlant.type}
            onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value })}
            style={{ padding: "0.75rem", borderRadius: "8px", marginRight: "0.5rem" }}
          >
            <option value="vegetable">🥕 Vegetable</option>
            <option value="flower">🌸 Flower</option>
            <option value="herb">🌿 Herb</option>
            <option value="succulent">🌵 Succulent</option>
            <option value="tree">🌳 Tree</option>
          </select>
          <button type="submit" style={{ background: "#16a34a", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: "600" }}>
            ✓ Add
          </button>
        </form>
      )}

      {plants.map((plant) => {
        const daysSince = getDaysSinceWatered(plant.lastWatered)
        const schedule = getWateringSchedule(plant.type)
        const needsWater = needsWatering(plant)
        const status = getWateringStatus(plant)

        return (
          <div key={plant.id}
            style={{
              padding: "1rem",
              marginBottom: "1rem",
              background: status.bgColor,
              border: `2px solid ${status.color}`,
              borderRadius: "12px",
              transition: "0.2s",
            }}
          >
            <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#166534", marginBottom: "0.5rem" }}>
              {getPlantIcon(plant.type)} {plant.name}
              <span style={{ fontSize: "0.9rem", color: status.color, marginLeft: "1rem" }}>
                ({status.status})
              </span>
            </div>
            <div style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              <strong>Last Watered:</strong> {plant.lastWatered || "Never"}<br />
              <strong>Daily Water:</strong> {plant.dailyWaterAmount || 0}ml<br />
              <strong>Total Water:</strong> {plant.totalWaterAmount || 0}ml
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => handleWaterPlant(plant.id, 250)}
                disabled={!needsWater && daysSince === 0}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer"
                }}
              >
                💧 Water (250ml)
              </button>
              <button
                onClick={() => handleWaterPlant(plant.id, 500)}
                disabled={!needsWater && daysSince === 0}
                style={{
                  background: "#0891b2",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer"
                }}
              >
                💧💧 Deep Water (500ml)
              </button>
            </div>
          </div>
        )
      })}

      {plants.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#15803d" }}>
          🌱 No plants yet. Click "Add Plant" to start!
        </div>
      )}
    </div>
  )
}
