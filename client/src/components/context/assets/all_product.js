import p1_img from "./product_201.webp";
import p2_img from "./product_202.webp";
import p3_img from "./product_203.webp";
import p4_img from "./product_204.webp";
import p5_img from "./product_205.webp";
import p6_img from "./product_206.webp";
import p13_img from "./product_101.webp";
import p14_img from "./product_102.webp";
import p15_img from "./product_103.webp";
import p16_img from "./product_104.webp";
import p17_img from "./product-00.webp";
import p18_img from "./product_106.webp";
import p25_img from "./product_301.webp";
import p26_img from "./product_302.webp";
import p27_img from "./product_303.webp";
import p28_img from "./product_304.webp";
import p29_img from "./product_305.webp";
import p30_img from "./product_306.webp";



let all_product = [
  {
    id: 1,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    category: "women",
    image: p1_img,
    subCategory: "upperwear",
    color:"black",
    new_price: 500,
    old_price: 800,
    rating: 4.6,
    inStock:true,
    productOptions: null,
  },
  {
    id: 2,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    category: "women",
    image: p2_img,
    subCategory: "upperwear",
    color:"black",
    new_price: 850,
    old_price: 1200,
    rating: 4.7,
    inStock:false,
    productOptions: null,
  
  },
  {
    id: 3,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    category: "women",
    image: p3_img,
    subCategory: "lowerwear",
    color:"red",
    new_price: 600,
    old_price: 1000,
    rating: 4.9,
    inStock:false,
    productOptions: {
      "above5.6": {
        colors: {
          "#FF5733": { 
            name: "ManojOrange", 
            sizes: [
              { size: "XS", quantity: 10 }, 
              { size: "S", quantity: 10 }, 
              { size: "M", quantity: 10 },
              { size: "L", quantity: 10 }, 
              { size: "XL", quantity: 10}, 
              { size: "XXL", quantity: 5 }
            ]
          },
          "#6A0DAD": { 
            name: "royalPurple", 
            sizes: [
              { size: "M", quantity: 0 }, 
              { size: "L", quantity: 3 }
            ] 
          },
          "#FFD700": { 
            name: "goldenYellow", 
            sizes: [
              { size: "L", quantity: 12 }, 
              { size: "XL", quantity: 9 }
            ]
          },
          // New colors added below
          "#1E90FF": { 
            name: "dodgerBlue", 
            sizes: [
              { size: "M", quantity: 14 }, 
              { size: "L", quantity: 7 }
            ]
          },
          "#32CD32": { 
            name: "limeGreen", 
            sizes: [
              { size: "M", quantity: 8 }, 
              { size: "XL", quantity: 6 }
            ] 
          },
          "#FF4500": { 
            name: "orangeRed", 
            sizes: [
              { size: "M", quantity: 5 }, 
              { size: "L", quantity: 4 }, 
              { size: "XL", quantity: 2 }
            ]
          },
          "#C71585": { 
            name: "mediumVioletRed", 
            sizes: [
              { size: "M", quantity: 3 }, 
              { size: "L", quantity: 10 }
            ]
          },
          "#8A2BE2": { 
            name: "blueViolet", 
            sizes: [
              { size: "M", quantity: 12 }, 
              { size: "XL", quantity: 4 }
            ]
          }
        }
      },
      "below5.6": {
        colors: {
          "#00CED1": { 
            name: "darkTurquoise", 
            sizes: [
              { size: "S", quantity: 15 }, 
              { size: "M", quantity: 7 }
            ] 
          },
          "#FF69B4": { 
            name: "hotPink", 
            sizes: [
              { size: "S", quantity: 12 }, 
              { size: "M", quantity: 10 }
            ] 
          },
          "#8B4513": { 
            name: "saddleBrown", 
            sizes: [
              { size: "S", quantity: 6 }, 
              { size: "M", quantity: 9 }
            ] 
          },
          // New colors added below
          "#4682B4": { 
            name: "steelBlue", 
            sizes: [
              { size: "S", quantity: 10 }, 
              { size: "M", quantity: 5 }
            ] 
          },
          "#FA8072": { 
            name: "salmon", 
            sizes: [
              { size: "S", quantity: 8 }, 
              { size: "M", quantity: 3 }
            ]
          },
          "#20B2AA": { 
            name: "lightSeaGreen", 
            sizes: [
              { size: "S", quantity: 13 }, 
              { size: "M", quantity: 6 }
            ]
          },
          "#DC143C": { 
            name: "crimsonRed", 
            sizes: [
              { size: "S", quantity: 9 }, 
              { size: "M", quantity: 7 }
            ]
          },
          "#B8860B": { 
            name: "darkGoldenrod", 
            sizes: [
              { size: "S", quantity: 11 }, 
              { size: "M", quantity: 4 }
            ]
          }
        }
      }
    }
    
  },
  {
    id: 4,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    category: "women",
    image: p4_img,
    subCategory: "lowerwear",
    color:"red",
    new_price: 1000,
    old_price: 1500,
    rating: 4.4,
    inStock:true,
    productOptions: null,
  },
  {
    id: 5,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    category: "women",
    image: p5_img,
    subCategory: "lowerwear",
    color:"red",
    new_price: 830,
    old_price: 1205,
    rating: 4.3,
    inStock:true,
  },
  {
    id: 6,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    category: "women",
    image: p6_img,
    subCategory: "lowerwear",
    color:"red",
    new_price: 880,
    old_price: 1200,
    rating: 5.0,
    inStock:false,
    productOptions: null,
  },
  {
    id: 7,
    name: "Boys Orange Colourblocked Hooded Sweatshirt",
    category: "accessories",
    image: p25_img,
    subCategory: "lowerwear",
    color:"red",
    new_price: 450,
    old_price: 1200,
    rating: 4.6,
    inStock:true,
    productOptions: null,
  },
  {
    id: 8,
    name: "Boys Orange Colourblocked Hooded Sweatshirt",
    category: "accessories",
    image: p26_img,
    subCategory: "lowerwear",
    color:"red",
    new_price: 470,
    old_price: 1200,
    rating: 4.8,
    inStock:false,
    productOptions: null,
  },
  {
    id: 9,
    name: "Boys Orange Colourblocked Hooded Sweatshirt",
    category: "accessories",
    image: p27_img,
    subCategory: "lowerwear",
    color:"red",
    new_price: 490,
    old_price: 1200,
    rating: 4.3,
    inStock:true,
    productOptions: null,
  },
  {
    id: 10,
    name: "Boys Orange Colourblocked Hooded Sweatshirt",
    category: "accessories",
    subCategory: "upperwear",
    color:"black",
    image: p28_img,
    new_price: 510,
    old_price: 1200,
    rating: 5.0,
    inStock:false,
    productOptions: null,
  },
  {
    id: 11,
    name: "Boys Orange Colourblocked Hooded Sweatshirt",
    category: "accessories",
    subCategory: "upperwear",
    color:"black",
    image: p29_img,
    new_price: 630,
    old_price: 1200,
    rating: 4.1,
    inStock:true,
    productOptions: null,
  },
  {
    id: 12,
    name: "Boys Orange Colourblocked Hooded Sweatshirt",
    category: "accessories",
    subCategory: "upperwear",
    color:"black",
    image: p30_img,
    new_price: 650,
    old_price: 1200,
    rating: 4.7,
    inStock:true,
    productOptions: null,
  },
  {
    id: 13,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    category: "men",
    image: p13_img,
    subCategory: "lowerwear",
    
    color:"red",
    new_price: 590,
    old_price: 1200,
    rating: 4.8,
    inStock:false,
  },
  {
    id: 14,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    category: "men",
    image: p14_img,
    subCategory: "lowerwear",
    color:"red",
    new_price: 550,
    old_price: 1200,
    rating: 4.2,
    inStock:true,
  },
  {
    id: 15,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    category: "men",
    image: p15_img,
    subCategory: "upperwear",
    color:"black",
    new_price: 950,
    old_price: 1200,
    rating: 4.7,
    inStock:true,
  },
  {
    id: 16,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    category: "men",
    image: p16_img,
    subCategory: "upperwear",
    color:"black",
    new_price: 810,
    old_price: 1200,
    rating: 4.5,
    inStock:true,
  },
  {
    id: 17,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    category: "men",
    image: p17_img,
    subCategory: "upperwear",
    color:"black",
    new_price: 670,
    old_price: 1200,
    rating: 4.3,
    inStock:true,
  },
  {
    id: 18,
    name: "Men Green Solid Zippered Full-Zip Slim Fit Bomber Jacket",
    category: "men",
    image: p18_img,
    subCategory: "upperwear",
    color:"black",
    new_price: 910,
    old_price: 1200,
    rating: 4.9,
    inStock:false,
  },
 
 ];
 
export default all_product;
