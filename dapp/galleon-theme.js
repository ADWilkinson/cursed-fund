module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      morion: ["Morion", "Inter var"],
      wigrum: ["Wigrum", "Inter var"],
    },
    extend: {
      colors: {
        "theme-champagne": " #FDE6C4",
        "theme-navy": " #040728",
        "theme-white": " #FFFFFF",
        "theme-oldlace": " #FEF3E2",
        "theme-sky": " #025BEE",
        "theme-aqua": " #59F4F4",
        "theme-copper": " #DC7F5A",
        "theme-pan-navy": " #27272A",
        "theme-pan-sky": " #0072B5",
        "theme-pan-champagne": " #F4EEE8",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
