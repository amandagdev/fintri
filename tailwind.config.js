// tailwind.config.ts

// Passo 1: Importar o plugin correto
import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    // Seus caminhos de arquivos normais
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

    // Passo 2: A LINHA MAIS IMPORTANTE!
    // Diga ao Tailwind para ler os componentes do HeroUI
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    // Passo 3: Adicionar o plugin do HeroUI
    heroui()
  ],
};

export default config;