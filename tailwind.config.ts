import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        zen: {
          light: "var(--zen-light)",
          medium: "var(--zen-medium)",
          main: "var(--zen-main)",
          dark: "var(--zen-dark)",
          darker: "var(--zen-darker)",
        },
        meditation: {
          50: "var(--meditation-50)",
          100: "var(--meditation-100)",
          200: "var(--meditation-200)",
          300: "var(--meditation-300)",
          400: "var(--meditation-400)",
          500: "var(--meditation-500)",
          600: "var(--meditation-600)",
          700: "var(--meditation-700)",
          800: "var(--meditation-800)",
          900: "var(--meditation-900)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "breathe-simple": {
          "0%, 100%": { 
            transform: "scale(1)", 
            opacity: "0.8" 
          },
          "50%": { 
            transform: "scale(1.4)", 
            opacity: "1" 
          }
        },
        "breathe-478": {
          "0%": { 
            transform: "scale(1)", 
            opacity: "0.8" 
          },
          "21%": { 
            transform: "scale(1.5)", 
            opacity: "1" 
          },
          "58%": { 
            transform: "scale(1.5)", 
            opacity: "1" 
          },
          "100%": { 
            transform: "scale(1)", 
            opacity: "0.8" 
          }
        },
        "breathe-box": {
          "0%": { 
            transform: "scale(1)", 
            opacity: "0.8" 
          },
          "25%": { 
            transform: "scale(1.4)", 
            opacity: "1" 
          },
          "50%": { 
            transform: "scale(1.4)", 
            opacity: "1" 
          },
          "75%": { 
            transform: "scale(1)", 
            opacity: "0.8" 
          },
          "100%": { 
            transform: "scale(1)", 
            opacity: "0.8" 
          }
        },
        "pulse-gentle": {
          "0%, 100%": { 
            opacity: "1" 
          },
          "50%": { 
            opacity: "0.7" 
          }
        },
        "fade-in": {
          "0%": { 
            opacity: "0", 
            transform: "translateY(10px)" 
          },
          "100%": { 
            opacity: "1", 
            transform: "translateY(0)" 
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "breathe-simple": "breathe-simple 6s infinite ease-in-out",
        "breathe-478": "breathe-478 19s infinite ease-in-out",
        "breathe-box": "breathe-box 16s infinite ease-in-out",
        "pulse-gentle": "pulse-gentle 2s infinite",
        "fade-in": "fade-in 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
