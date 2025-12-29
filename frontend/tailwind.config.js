module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: "#9A3DEB",
          blue: "#3576F6",
          gradient: {
            from: "#AB47FF",
            to: "#3F8CFF",
          },
        },
        bg: {
          dark: "#0D1117",
          secondary: "#111827",
        },
        text: {
          primary: "#C9D1D9",
          secondary: "#8B949E",
          muted: "#6B7280",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.06)",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #AB47FF 0%, #3F8CFF 100%)",
        "gradient-dark": "linear-gradient(135deg, #0D1117 0%, #1a1f35 100%)",
        "gradient-stat":
          "linear-gradient(135deg, #AB47FF 0%, #3F8CFF 35%, #FF6B35 70%, #FF1B8D 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.25)",
        "glow-purple": "0 0 20px rgba(154, 61, 235, 0.5)",
        "glow-blue": "0 0 20px rgba(53, 118, 246, 0.5)",
        "glow-gradient": "0 0 30px rgba(171, 71, 255, 0.6)",
        card: "0 4px 16px rgba(0, 0, 0, 0.25)",
      },
      backdropBlur: {
        glass: "14px",
      },
      borderRadius: {
        card: "18px",
        button: "999px",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.35s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(171, 71, 255, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(171, 71, 255, 0.8)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      transitionDuration: {
        250: "250ms",
        350: "350ms",
      },
    },
  },
  plugins: [],
};
