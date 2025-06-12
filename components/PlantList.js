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
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset to start of day for accurate comparison

    const waterDate = new Date(lastWatered)
    waterDate.setHours(0, 0, 0, 0) // Reset to start of day

    const diffTime = today.getTime() - waterDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays) // Ensure non-negative
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
    // Call the parent function to update the plant data
    onWaterPlant(plantId, waterAmount)

    // Show visual feedback
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#166534",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          🌿 My Plants ({plants.length})
        </h2>
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
            transition: "all 0.2s",
            boxShadow: "0 4px 12px rgba(22, 163, 74, 0.3)",
          }}
          onMouseOver={(e) => (e.target.style.transform = "translateY(-2px)")}
          onMouseOut={(e) => (e.target.style.transform = "translateY(0)")}
        >
          {showAddForm ? "✕ Cancel" : "+ Add Plant"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddPlant}
          style={{
            marginBottom: "1.5rem",
            padding: "1.5rem",
            background: "rgba(167, 243, 208, 0.2)",
            borderRadius: "16px",
            border: "2px dashed rgba(167, 243, 208, 0.8)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <input
              type="text"
              placeholder="Plant name (e.g., Cherry Tomatoes)"
              value={newPlant.name}
              onChange={(e) => setNewPlant({ ...newPlant, name: e.target.value })}
              style={{
                padding: "0.75rem 1rem",
                border: "2px solid rgba(167, 243, 208, 0.5)",
                borderRadius: "12px",
                fontSize: "1rem",
                outline: "none",
                background: "white",
              }}
              required
            />
            <select
              value={newPlant.type}
              onChange={(e) => setNewPlant({ ...newPlant, type: e.target.value })}
              style={{
                padding: "0.75rem 1rem",
                border: "2px solid rgba(167, 243, 208, 0.5)",
                borderRadius: "12px",
                fontSize: "1rem",
                outline: "none",
                background: "white",
              }}
            >
              <option value="vegetable">🥕 Vegetable (Daily)</option>
              <option value="flower">🌸 Flower (Every 2 days)</option>
              <option value="herb">🌿 Herb (Daily)</option>
              <option value="succulent">🌵 Succulent (Weekly)</option>
              <option value="tree">🌳 Tree (Every 3 days)</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #16a34a, #15803d)",
                color: "white",
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              ✓ Add Plant
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              style={{
                background: "#6b7280",
                color: "white",
                padding: "0.75rem 1.5rem",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={{ display: "grid", gap: "1rem" }}>
        {plants.map((plant) => {
          const daysSince = getDaysSinceWatered(plant.lastWatered)
          const schedule = getWateringSchedule(plant.type)
          const needsWater = needsWatering(plant)
          const status = getWateringStatus(plant)
          const dailyWater = plant.dailyWaterAmount || 0

          return (
            <div
              key={plant.id}
              style={{
                padding: "1.5rem",
                border:
                  status.urgency === "critical"
                    ? "3px solid #dc2626"
                    : status.urgency === "warning"
                      ? "2px solid #ea580c"
                      : "2px solid rgba(167, 243, 208, 0.5)",
                borderRadius: "16px",
                background:
                  status.urgency === "critical"
                    ? "rgba(220, 38, 38, 0.05)"
                    : status.urgency === "warning"
                      ? "rgba(234, 88, 12, 0.05)"
                      : "white",
                transition: "all 0.2s",
                boxShadow:
                  status.urgency === "critical"
                    ? "0 6px 20px rgba(220, 38, 38, 0.2)"
                    : status.urgency === "warning"
                      ? "0 4px 16px rgba(234, 88, 12, 0.2)"
                      : "0 2px 8px rgba(0, 0, 0, 0.05)",
                animation: status.urgency === "critical" ? "pulse 2s infinite" : "none",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ flex: "1" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>{getPlantIcon(plant.type)}</span>
                    <h3
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "700",
                        color: "#166534",
                        margin: "0",
                      }}
                    >
                      {plant.name}
                    </h3>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        background: status.bgColor,
                        color: status.color,
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        border: `1px solid ${status.color}`,
                      }}
                    >
                      {status.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.75rem",
                        background: "rgba(167, 243, 208, 0.2)",
                        borderRadius: "8px",
                        border: "1px solid rgba(167, 243, 208, 0.5)",
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "#15803d", marginBottom: "0.25rem" }}>Type</div>
                      <div style={{ fontWeight: "600", color: "#166534", textTransform: "capitalize" }}>
                        {plant.type}
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#15803d" }}>{schedule.description}</div>
                    </div>

                    <div
                      style={{
                        padding: "0.75rem",
                        background: daysSince === 0 ? "rgba(22, 163, 74, 0.1)" : "rgba(167, 243, 208, 0.2)",
                        borderRadius: "8px",
                        border: `1px solid ${daysSince === 0 ? "#16a34a" : "rgba(167, 243, 208, 0.5)"}`,
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "#15803d", marginBottom: "0.25rem" }}>Last Watered</div>
                      <div style={{ fontWeight: "600", color: "#166534" }}>
                        {daysSince === 0 ? "Today ✅" : `${daysSince} day${daysSince !== 1 ? "s" : ""} ago`}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "0.75rem",
                        background: "rgba(59, 130, 246, 0.1)",
                        borderRadius: "8px",
                        border: "1px solid rgba(59, 130, 246, 0.3)",
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "#1d4ed8", marginBottom: "0.25rem" }}>
                        Today's Water
                      </div>
                      <div style={{ fontWeight: "600", color: "#1e40af" }}>{dailyWater} ml</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
                  <button
                    onClick={() => handleWaterPlant(plant.id, 250)}
                    disabled={!needsWater && daysSince === 0}
                    style={{
                      background: needsWater
                        ? "linear-gradient(135deg, #dc2626, #b91c1c)"
                        : daysSince === 0
                          ? "#9ca3af"
                          : "linear-gradient(135deg, #3b82f6, #2563eb)",
                      color: "white",
                      padding: "0.75rem 1rem",
                      border: "none",
                      borderRadius: "12px",
                      fontWeight: "600",
                      cursor: !needsWater && daysSince === 0 ? "not-allowed" : "pointer",
                      fontSize: "0.9rem",
                      transition: "all 0.2s",
                      boxShadow: needsWater
                        ? "0 4px 12px rgba(220, 38, 38, 0.3)"
                        : "0 4px 12px rgba(59, 130, 246, 0.3)",
                      minWidth: "120px",
                      opacity: !needsWater && daysSince === 0 ? 0.6 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!(!needsWater && daysSince === 0)) {
                        e.target.style.transform = "translateY(-2px)"
                      }
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)"
                    }}
                  >
                    {needsWater ? "💧 WATER NOW!" : daysSince === 0 ? "✅ Watered" : "💧 Water (250ml)"}
                  </button>

                  <button
                    onClick={() => handleWaterPlant(plant.id, 500)}
                    disabled={!needsWater && daysSince === 0}
                    style={{
                      background: needsWater
                        ? "linear-gradient(135deg, #ea580c, #c2410c)"
                        : daysSince === 0
                          ? "#9ca3af"
                          : "linear-gradient(135deg, #06b6d4, #0891b2)",
                      color: "white",
                      padding: "0.5rem 0.75rem",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: "500",
                      cursor: !needsWater && daysSince === 0 ? "not-allowed" : "pointer",
                      fontSize: "0.8rem",
                      transition: "all 0.2s",
                      minWidth: "120px",
                      opacity: !needsWater && daysSince === 0 ? 0.6 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!(!needsWater && daysSince === 0)) {
                        e.target.style.transform = "translateY(-1px)"
                      }
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)"
                    }}
                  >
                    {needsWater ? "💧💧 DEEP WATER!" : daysSince === 0 ? "✅ Done" : "💧💧 Deep (500ml)"}
                  </button>
                </div>
              </div>

              {needsWater && (
                <div
                  style={{
                    padding: "1rem",
                    background: status.urgency === "critical" ? "rgba(220, 38, 38, 0.1)" : "rgba(234, 88, 12, 0.1)",
                    borderRadius: "8px",
                    border: `1px solid ${status.color}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: status.color,
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {status.urgency === "critical" ? "🚨" : "⚠️"}
                    This plant is {daysSince - schedule.days + 1} day{daysSince - schedule.days + 1 !== 1 ? "s" : ""}{" "}
                    overdue for watering!
                    <br />
                    <small style={{ fontWeight: "normal", opacity: 0.8 }}>
                      {plant.type}s should be watered {schedule.description.toLowerCase()}
                    </small>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {plants.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#15803d",
              background: "rgba(167, 243, 208, 0.2)",
              borderRadius: "16px",
              border: "2px dashed rgba(167, 243, 208, 0.8)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌱</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.5rem" }}>No plants yet!</div>
            <div>Click "Add Plant" to start your garden management journey.</div>
          </div>
        )}
      </div>

      {plants.length > 0 && (
        <div
          style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "rgba(22, 163, 74, 0.1)",
            borderRadius: "12px",
            border: "1px solid rgba(22, 163, 74, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: "0.9rem",
              color: "#166534",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            💡 <strong>Smart Watering:</strong> Buttons change based on plant needs. Red = urgent, blue = optional, gray
            = already watered today!
          </div>
        </div>
      )}
    </div>
  )
}
