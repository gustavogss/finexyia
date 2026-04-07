/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F3D3E",
          light: "#1A6466",
          dark: "#082526",
        },
        secondary: {
          DEFAULT: "#FF7A00",
          light: "#FF9533",
          dark: "#D46600",
        },
        accent: {
          DEFAULT: "#00C2FF",
        },
        success: {
          DEFAULT: "#4ADE80",
          dark: "#22C55E",
        },
        error: {
          DEFAULT: "#F87171",
          dark: "#EF4444",
        },
        warning: {
          DEFAULT: "#FBBF24",
          dark: "#F59E0B",
        },
        background: {
          light: "#FFFFFF",
          dark: "#121212",
        },
        surface: {
          light: "#F8F9FA",
          dark: "#1E1E1E",
        },
      },
      fontFamily: {
        regular: ["Inter_400Regular"],
        medium: ["Inter_500Medium"],
        bold: ["Inter_700Bold"],
      },
    },
  },
  plugins: [],
};
