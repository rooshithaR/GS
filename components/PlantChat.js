"use client"

import { useState } from "react"

export default function PlantChat({ weather, plants }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your garden assistant. Ask me anything about plant care, growing conditions, or garden management!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          weather,
          plants,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedQuestions = [
    "Will my tomatoes grow well in this climate?",
    "What plants should I grow this season?",
    "How often should I water my herbs?",
    "Is this weather good for planting?",
    "What are signs of overwatering?",
  ]

  return (
    <div
      style={{
        background: "rgba(240, 253, 244, 0.95)", // Light green background
        borderRadius: "20px",
        padding: "1.5rem",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(167, 243, 208, 0.5)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#166534",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <span
          style={{
            fontSize: "1.5rem",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#dcfce7",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
          }}
        >
          🤖
        </span>
        Garden Assistant
      </h2>

      <div
        style={{
          flex: "1",
          overflowY: "auto",
          background: "rgba(255, 255, 255, 0.5)",
          borderRadius: "16px",
          padding: "1rem",
          marginBottom: "1rem",
          border: "1px solid rgba(167, 243, 208, 0.5)",
          minHeight: "300px",
          maxHeight: "400px",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "1rem",
              display: "flex",
              justifyContent: message.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "0.75rem 1rem",
                borderRadius: "16px",
                background: message.role === "user" ? "#16a34a" : "white",
                color: message.role === "user" ? "white" : "#374151",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                border: message.role === "user" ? "none" : "1px solid rgba(167, 243, 208, 0.5)",
              }}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ marginBottom: "1rem", display: "flex" }}>
            <div
              style={{
                maxWidth: "80%",
                padding: "0.75rem 1rem",
                borderRadius: "16px",
                background: "white",
                color: "#374151",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                border: "1px solid rgba(167, 243, 208, 0.5)",
              }}
            >
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#16a34a",
                    animation: "bounce 1s infinite",
                  }}
                ></div>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#16a34a",
                    animation: "bounce 1s infinite",
                    animationDelay: "0.2s",
                  }}
                ></div>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#16a34a",
                    animation: "bounce 1s infinite",
                    animationDelay: "0.4s",
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your plants..."
            style={{
              flex: "1",
              padding: "0.75rem 1rem",
              borderRadius: "12px",
              border: "2px solid rgba(167, 243, 208, 0.5)",
              outline: "none",
              fontSize: "0.9rem",
              background: "white",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(167, 243, 208, 0.5)")}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#16a34a",
              color: "white",
              borderRadius: "12px",
              fontWeight: "600",
              border: "none",
              cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
              opacity: isLoading || !input.trim() ? 0.7 : 1,
              transition: "all 0.2s",
            }}
          >
            Send
          </button>
        </div>
      </form>

      <div>
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "#166534",
            marginBottom: "0.75rem",
          }}
        >
          Quick questions:
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInput(question)}
              style={{
                padding: "0.5rem 0.75rem",
                background: "rgba(167, 243, 208, 0.3)",
                border: "1px solid rgba(167, 243, 208, 0.8)",
                borderRadius: "8px",
                fontSize: "0.8rem",
                color: "#166534",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.target.style.background = "rgba(167, 243, 208, 0.5)"
              }}
              onMouseOut={(e) => {
                e.target.style.background = "rgba(167, 243, 208, 0.3)"
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
