import handlebars from "vite-plugin-handlebars";

const basicContext = {
  title: "Hi from Vite Plugin study",
  name: 'Eugene',
  show: false,
  fruits: ["apples", "bananas", "oranges"],
  isClient: true,
  fruitSales: [
    { day: "Monday", apples: 10, bananas: 20, oranges: 30 },
    { day: "Tuesday", apples: 8, bananas: 16, oranges: 26 },
    { day: "Wednesday", apples: 6, bananas: 14, oranges: 22 },
  ],
  numbers: [1, 2, 3, 4, 5],
};

export default {
  plugins: [handlebars({ context: basicContext })],
};
