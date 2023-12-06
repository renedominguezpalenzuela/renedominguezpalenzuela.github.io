/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: ["./src/**/*.{html,js}", "*.{html,js}", "./js/**/*.{html,js}"],
  prefix: 'tw-',

    //...
    daisyui: {
      themes: [
      /*  {
          mytheme: {
            "primary": "#a991f7",
            "secondary": "#f6d860",
            "accent": "#37cdbe",
            "neutral": "#3d4451",
            "base-100": "#ffffff",
          },
        },*/
        "light",
        /*"cupcake",*/
      ],
    },
  
  /*theme: {
    extend: {
      gridRowStart: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
        '14': '15',
        '15': '15',
       }
    },
  },*/
  plugins: [
    require("daisyui")

  ],
}


