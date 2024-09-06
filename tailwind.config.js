/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        lila: "#AC82FF",
        lilaLight: "#C2A3FF",
        darkGray: "#2f2f2f",
        lightGray: "#454545",
        neutral: "#EDECE8",
        braun: "#868171",
        green: "#00b300",
        red: "#ff0000",
      },
      fontFamily: {
        josefine: ["Josefin Sans", "sans-serif"],
      },
      fontSize: {
        16: "16px",
        24: "24px",
        30: "30px",
      },
      maxHeight: {
        "90vh": "90vh",
      },
      maxWidth: {
        "90vh": "90vh",
      },
  
    },
  },
  plugins: [],
};
