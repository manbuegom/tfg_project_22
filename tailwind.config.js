module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  plugins: [],
  theme: {
    extend: {},
  },
  purge: ["./index.html",'./src/**/*.{svelte,js,ts}'], // for unused CSS
  variants: {
    extend: {},
  }
}
