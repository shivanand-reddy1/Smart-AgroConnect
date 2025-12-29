import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaRobot, FaPaperPlane } from "react-icons/fa";
import { useLanguage } from "../contexts/LanguageContext";

const Chatbot = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t(
        "Hello! I am your farming advisor. Ask me anything about crop cultivation, pest management, or farming techniques."
      ),
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ Chat window reference (for internal scrolling)
  const chatContainerRef = useRef(null);

  // ⭐ Auto-scroll INSIDE chat window only
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // FIXED: Prevent bold ** from showing
  const formatMessage = (text) => {
    if (!text) return "";
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const cleaned = escaped.replace(/\*\*(.+?)\*\*/g, "$1");

    return cleaned.replace(/\n/g, "<br />");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "/api/chatbot/advisory",
        {
          query: input,
          cropName: "general",
          location: "India",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMessage = {
        id: messages.length + 2,
        text: response.data.advice || "No response from server.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-card shadow-glow-gradient p-6 h-[calc(100vh-120px)] overflow-hidden flex flex-col animate-fadeIn">
      <div className="sticky top-0 z-20 pb-4">
        <h2 className="text-2xl font-bold text-gradient flex items-center gap-2">
          <FaRobot />
          {t("Farming Advisor Chatbot")}
        </h2>
      </div>

      {/* ⭐ Chat scroll area (auto-scroll inside this only) */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 glass-card rounded-card p-4 space-y-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-card ${
                msg.sender === "user"
                  ? "bg-gradient-primary text-white rounded-br-none shadow-glow-purple"
                  : "glass-card text-white rounded-bl-none border border-glass-border"
              }`}
            >
              <p
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
              />
              <p className="text-xs mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="glass-card text-white px-4 py-2 rounded-card rounded-bl-none border border-glass-border">
              <p className="text-sm">Typing...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={t("Ask about farming, crops, pests, fertilizers...")}
          className="flex-1 px-4 py-2 glass-input rounded-button focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-250"
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-gradient-primary text-white px-6 py-2 rounded-button hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-glow-purple transition-all duration-250 font-medium"
        >
          <FaPaperPlane />
          {t("Send")}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
