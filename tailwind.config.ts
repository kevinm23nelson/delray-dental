import { type Config } from "tailwindcss"

const calendarStyles = `
.fc .fc-button-primary {
  background-color: rgb(14 165 233) !important;
  border-color: rgb(14 165 233) !important;
  font-weight: 500;
}

.fc .fc-button-primary:hover {
  background-color: rgb(2 132 199) !important;
  border-color: rgb(2 132 199) !important;
}

.fc .fc-button-primary:disabled {
  background-color: rgb(186 230 253) !important;
  border-color: rgb(186 230 253) !important;
}

.fc .fc-daygrid-day:hover {
  background-color: rgb(240 249 255) !important;
}

.fc .fc-col-header-cell {
  background-color: rgb(240 249 255);
  padding: 8px 0;
}

.fc .fc-toolbar-title {
  font-size: 1.25rem !important;
  font-weight: 600;
}

.fc .fc-daygrid-day-frame {
  padding: 8px 4px !important;
}

.fc-theme-standard td, .fc-theme-standard th {
  border-color: rgb(226 232 240) !important;
}
`;
const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config