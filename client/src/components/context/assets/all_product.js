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


const calculateDiscount = (oldPrice, newPrice) => {
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

let all_product = [
  {
    id: 1,
    name: "Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse",
    category: "women",
    image: p1_img,
    subCategory: "upperwear",
    color:"black",
    new_price: 5,
    old_price: 800,
   
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.6,
    inStock:true,
    productOptions: null,
    data: {
      height: { value: '170' },
      aboveHeight: {
        colorOptions: [
          { name: 'Crimson Blush', hex: '#DC143C' },
          { name: 'Emerald Dream', hex: '#50C878' },
          { name: 'Sapphire Mist', hex: '#082567' },
          { name: 'Sunset Orange', hex: '#FD5E53' },
          { name: 'Lavender Haze', hex: '#B57EDC' },
          { name: 'Golden Rays', hex: '#FFAA33' },
          { name: 'Turquoise Breeze', hex: '#40E0D0' },
          { name: 'Midnight Plum', hex: '#3C1361' }
        ],
        sizeOptions: {
          'Crimson Blush': ['S', 'M', 'L', 'XL'],
          'Emerald Dream': ['M', 'L', 'XL'],
          'Sapphire Mist': ['S', 'M', 'L'],
          'Sunset Orange': ['XS', 'S', 'M', 'L'],
          'Lavender Haze': ['S', 'M', 'L', 'XL'],
          'Golden Rays': ['M', 'L', 'XL'],
          'Turquoise Breeze': ['XS', 'S', 'M', 'L'],
          'Midnight Plum': ['S', 'M', 'L']
        },
        quantities: {
          'Crimson Blush': { S: 5, M: 8, L: 12, XL: 6 },
          'Emerald Dream': { M: 10, L: 15, XL: 7 },
          'Sapphire Mist': { S: 4, M: 9, L: 11 },
          'Sunset Orange': { XS: 3, S: 6, M: 8, L: 5 },
          'Lavender Haze': { S: 7, M: 13, L: 9, XL: 4 },
          'Golden Rays': { M: 11, L: 14, XL: 8 },
          'Turquoise Breeze': { XS: 2, S: 5, M: 7, L: 6 },
          'Midnight Plum': { S: 6, M: 10, L: 8 }
        }
      },
      belowHeight: {
        colorOptions: [
          { name: 'Cherry Blossom', hex: '#FFB7C5' },
          { name: 'Ocean Depths', hex: '#008080' },
          { name: 'Sunflower Fields', hex: '#FFC300' },
          { name: 'Amethyst Charm', hex: '#9966CC' },
          { name: 'Coral Reef', hex: '#FF7F50' },
          { name: 'Mint Frost', hex: '#98FF98' },
          { name: 'Dusty Rose', hex: '#DCAE96' },
          { name: 'Indigo Twilight', hex: '#4B0082' }
        ],
        sizeOptions: {
          'Cherry Blossom': ['XS', 'S', 'M'],
          'Ocean Depths': ['S', 'M', 'L'],
          'Sunflower Fields': ['XS', 'S', 'M', 'L'],
          'Amethyst Charm': ['S', 'M', 'L'],
          'Coral Reef': ['XS', 'S', 'M'],
          'Mint Frost': ['S', 'M', 'L'],
          'Dusty Rose': ['XS', 'S', 'M', 'L'],
          'Indigo Twilight': ['S', 'M', 'L']
        },
        quantities: {
          'Cherry Blossom': { XS: 3, S: 7, M: 9 },
          'Ocean Depths': { S: 6, M: 11, L: 8 },
          'Sunflower Fields': { XS: 2, S: 5, M: 8, L: 4 },
          'Amethyst Charm': { S: 7, M: 12, L: 9 },
          'Coral Reef': { XS: 4, S: 8, M: 10 },
          'Mint Frost': { S: 5, M: 9, L: 7 },
          'Dusty Rose': { XS: 3, S: 6, M: 9, L: 5 },
          'Indigo Twilight': { S: 8, M: 13, L: 10 }
        }
      }
    }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.7,
    inStock:false,
    productOptions: null,
    data: {
      height: { value: '170' },
      aboveHeight: {
        colorOptions: [
          { name: 'Crimson Blush', hex: '#DC143C' },
          { name: 'Emerald Dream', hex: '#50C878' },
          { name: 'Sapphire Mist', hex: '#082567' },
          { name: 'Sunset Orange', hex: '#FD5E53' },
          { name: 'Lavender Haze', hex: '#B57EDC' },
          { name: 'Golden Rays', hex: '#FFAA33' },
          { name: 'Turquoise Breeze', hex: '#40E0D0' },
          { name: 'Midnight Plum', hex: '#3C1361' }
        ],
        sizeOptions: {
          'Crimson Blush': ['S', 'M', 'L', 'XL'],
          'Emerald Dream': ['M', 'L', 'XL'],
          'Sapphire Mist': ['S', 'M', 'L'],
          'Sunset Orange': ['XS', 'S', 'M', 'L'],
          'Lavender Haze': ['S', 'M', 'L', 'XL'],
          'Golden Rays': ['M', 'L', 'XL'],
          'Turquoise Breeze': ['XS', 'S', 'M', 'L'],
          'Midnight Plum': ['S', 'M', 'L']
        },
        quantities: {
          'Crimson Blush': { S: 5, M: 8, L: 12, XL: 6 },
          'Emerald Dream': { M: 10, L: 15, XL: 7 },
          'Sapphire Mist': { S: 4, M: 9, L: 11 },
          'Sunset Orange': { XS: 3, S: 6, M: 8, L: 5 },
          'Lavender Haze': { S: 7, M: 13, L: 9, XL: 4 },
          'Golden Rays': { M: 11, L: 14, XL: 8 },
          'Turquoise Breeze': { XS: 2, S: 5, M: 7, L: 6 },
          'Midnight Plum': { S: 6, M: 10, L: 8 }
        }
      },
      belowHeight: {
        colorOptions: [
          { name: 'Cherry Blossom', hex: '#FFB7C5' },
          { name: 'Ocean Depths', hex: '#008080' },
          { name: 'Sunflower Fields', hex: '#FFC300' },
          { name: 'Amethyst Charm', hex: '#9966CC' },
          { name: 'Coral Reef', hex: '#FF7F50' },
          { name: 'Mint Frost', hex: '#98FF98' },
          { name: 'Dusty Rose', hex: '#DCAE96' },
          { name: 'Indigo Twilight', hex: '#4B0082' }
        ],
        sizeOptions: {
          'Cherry Blossom': ['XS', 'S', 'M'],
          'Ocean Depths': ['S', 'M', 'L'],
          'Sunflower Fields': ['XS', 'S', 'M', 'L'],
          'Amethyst Charm': ['S', 'M', 'L'],
          'Coral Reef': ['XS', 'S', 'M'],
          'Mint Frost': ['S', 'M', 'L'],
          'Dusty Rose': ['XS', 'S', 'M', 'L'],
          'Indigo Twilight': ['S', 'M', 'L']
        },
        quantities: {
          'Cherry Blossom': { XS: 3, S: 7, M: 9 },
          'Ocean Depths': { S: 6, M: 11, L: 8 },
          'Sunflower Fields': { XS: 2, S: 5, M: 8, L: 4 },
          'Amethyst Charm': { S: 7, M: 12, L: 9 },
          'Coral Reef': { XS: 4, S: 8, M: 10 },
          'Mint Frost': { S: 5, M: 9, L: 7 },
          'Dusty Rose': { XS: 3, S: 6, M: 9, L: 5 },
          'Indigo Twilight': { S: 8, M: 13, L: 10 }
        }
      }
    }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.9,
    inStock:false,
    data: {
      height: { value: '170' },
      aboveHeight: {
        colorOptions: [
          { name: 'Crimson Blush', hex: '#DC143C' },
          { name: 'Emerald Dream', hex: '#50C878' },
          { name: 'Sapphire Mist', hex: '#082567' },
          { name: 'Sunset Orange', hex: '#FD5E53' },
          { name: 'Lavender Haze', hex: '#B57EDC' },
          { name: 'Golden Rays', hex: '#FFAA33' },
          { name: 'Turquoise Breeze', hex: '#40E0D0' },
          { name: 'Midnight Plum', hex: '#3C1361' }
        ],
        sizeOptions: {
          'Crimson Blush': ['S', 'M', 'L', 'XL'],
          'Emerald Dream': ['M', 'L', 'XL'],
          'Sapphire Mist': ['S', 'M', 'L'],
          'Sunset Orange': ['XS', 'S', 'M', 'L'],
          'Lavender Haze': ['S', 'M', 'L', 'XL'],
          'Golden Rays': ['M', 'L', 'XL'],
          'Turquoise Breeze': ['XS', 'S', 'M', 'L'],
          'Midnight Plum': ['S', 'M', 'L']
        },
        quantities: {
          'Crimson Blush': { S: 5, M: 8, L: 12, XL: 6 },
          'Emerald Dream': { M: 10, L: 15, XL: 7 },
          'Sapphire Mist': { S: 4, M: 9, L: 11 },
          'Sunset Orange': { XS: 3, S: 6, M: 8, L: 5 },
          'Lavender Haze': { S: 7, M: 13, L: 9, XL: 4 },
          'Golden Rays': { M: 11, L: 14, XL: 8 },
          'Turquoise Breeze': { XS: 2, S: 5, M: 7, L: 6 },
          'Midnight Plum': { S: 6, M: 10, L: 8 }
        }
      },
      belowHeight: {
        colorOptions: [
          { name: 'Cherry Blossom', hex: '#FFB7C5' },
          { name: 'Ocean Depths', hex: '#008080' },
          { name: 'Sunflower Fields', hex: '#FFC300' },
          { name: 'Amethyst Charm', hex: '#9966CC' },
          { name: 'Coral Reef', hex: '#FF7F50' },
          { name: 'Mint Frost', hex: '#98FF98' },
          { name: 'Dusty Rose', hex: '#DCAE96' },
          { name: 'Indigo Twilight', hex: '#4B0082' }
        ],
        sizeOptions: {
          'Cherry Blossom': ['XS', 'S', 'M'],
          'Ocean Depths': ['S', 'M', 'L'],
          'Sunflower Fields': ['XS', 'S', 'M', 'L'],
          'Amethyst Charm': ['S', 'M', 'L'],
          'Coral Reef': ['XS', 'S', 'M'],
          'Mint Frost': ['S', 'M', 'L'],
          'Dusty Rose': ['XS', 'S', 'M', 'L'],
          'Indigo Twilight': ['S', 'M', 'L']
        },
        quantities: {
          'Cherry Blossom': { XS: 3, S: 7, M: 9 },
          'Ocean Depths': { S: 6, M: 11, L: 8 },
          'Sunflower Fields': { XS: 2, S: 5, M: 8, L: 4 },
          'Amethyst Charm': { S: 7, M: 12, L: 9 },
          'Coral Reef': { XS: 4, S: 8, M: 10 },
          'Mint Frost': { S: 5, M: 9, L: 7 },
          'Dusty Rose': { XS: 3, S: 6, M: 9, L: 5 },
          'Indigo Twilight': { S: 8, M: 13, L: 10 }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.4,
    inStock:true,
    productOptions: null,
    data: {
      colorOptions: [
        { name: 'red', hex: '#e91616' },
        { name: 'forestGreen', hex: '#0adb34' },
        { name: 'royalBlue', hex: '#4169E1' },
        { name: 'sunflowerYellow', hex: '#FFD700' },
        { name: 'orchidPurple', hex: '#DA70D6' },
        { name: 'coralOrange', hex: '#FF7F50' },
        { name: 'tealBlue', hex: '#008080' },
        { name: 'burgundy', hex: '#800020' },
        { name: 'mintGreen', hex: '#98FF98' },
        { name: 'navyBlue', hex: '#000080' }
      ],
      sizeOptions: {
        red: ['S', 'L'],
        forestGreen: ['XL', 'L'],
        royalBlue: ['M', 'L', 'XL'],
        sunflowerYellow: ['S', 'M', 'L'],
        orchidPurple: ['XS', 'S', 'M'],
        coralOrange: ['M', 'L', 'XL'],
        tealBlue: ['S', 'M', 'L'],
        burgundy: ['S', 'M', 'L', 'XL'],
        mintGreen: ['XS', 'S', 'M'],
        navyBlue: ['M', 'L', 'XL']
      },
      quantities: {
        red: { S: 3, L: 5 },
        forestGreen: { XL: 5, L: 10 },
        royalBlue: { M: 7, L: 8, XL: 6 },
        sunflowerYellow: { S: 4, M: 6, L: 5 },
        orchidPurple: { XS: 3, S: 5, M: 4 },
        coralOrange: { M: 6, L: 7, XL: 4 },
        tealBlue: { S: 5, M: 8, L: 6 },
        burgundy: { S: 4, M: 7, L: 6, XL: 3 },
        mintGreen: { XS: 2, S: 6, M: 5 },
        navyBlue: { M: 8, L: 9, XL: 5 }
      }
    }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.3,
    inStock:true,
    data: {
      colorOptions: [
        { name: 'red', hex: '#e91616' },
        { name: 'forestGreen', hex: '#0adb34' },
        { name: 'royalBlue', hex: '#4169E1' },
        { name: 'sunflowerYellow', hex: '#FFD700' },
        { name: 'orchidPurple', hex: '#DA70D6' },
        { name: 'coralOrange', hex: '#FF7F50' },
        { name: 'tealBlue', hex: '#008080' },
        { name: 'burgundy', hex: '#800020' },
        { name: 'mintGreen', hex: '#98FF98' },
        { name: 'navyBlue', hex: '#000080' }
      ],
      sizeOptions: {
        red: ['S', 'L'],
        forestGreen: ['XL', 'L'],
        royalBlue: ['M', 'L', 'XL'],
        sunflowerYellow: ['S', 'M', 'L'],
        orchidPurple: ['XS', 'S', 'M'],
        coralOrange: ['M', 'L', 'XL'],
        tealBlue: ['S', 'M', 'L'],
        burgundy: ['S', 'M', 'L', 'XL'],
        mintGreen: ['XS', 'S', 'M'],
        navyBlue: ['M', 'L', 'XL']
      },
      quantities: {
        red: { S: 3, L: 5 },
        forestGreen: { XL: 5, L: 10 },
        royalBlue: { M: 7, L: 8, XL: 6 },
        sunflowerYellow: { S: 4, M: 6, L: 5 },
        orchidPurple: { XS: 3, S: 5, M: 4 },
        coralOrange: { M: 6, L: 7, XL: 4 },
        tealBlue: { S: 5, M: 8, L: 6 },
        burgundy: { S: 4, M: 7, L: 6, XL: 3 },
        mintGreen: { XS: 2, S: 6, M: 5 },
        navyBlue: { M: 8, L: 9, XL: 5 }
      }
    }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 5.0,
    inStock:false,
    productOptions: null,
       data: {
            colorOptions: [
              { name: 'red', hex: '#e91616' },
              { name: 'forestGreen', hex: '#0adb34' },
              { name: 'royalBlue', hex: '#4169E1' },
              { name: 'sunflowerYellow', hex: '#FFD700' },
              { name: 'orchidPurple', hex: '#DA70D6' },
              { name: 'coralOrange', hex: '#FF7F50' },
              { name: 'tealBlue', hex: '#008080' },
              { name: 'burgundy', hex: '#800020' },
              { name: 'mintGreen', hex: '#98FF98' },
              { name: 'navyBlue', hex: '#000080' }
            ],
            sizeOptions: {
              red: ['S', 'L'],
              forestGreen: ['XL', 'L'],
              royalBlue: ['M', 'L', 'XL'],
              sunflowerYellow: ['S', 'M', 'L'],
              orchidPurple: ['XS', 'S', 'M'],
              coralOrange: ['M', 'L', 'XL'],
              tealBlue: ['S', 'M', 'L'],
              burgundy: ['S', 'M', 'L', 'XL'],
              mintGreen: ['XS', 'S', 'M'],
              navyBlue: ['M', 'L', 'XL']
            },
            quantities: {
              red: { S: 3, L: 5 },
              forestGreen: { XL: 5, L: 10 },
              royalBlue: { M: 7, L: 8, XL: 6 },
              sunflowerYellow: { S: 4, M: 6, L: 5 },
              orchidPurple: { XS: 3, S: 5, M: 4 },
              coralOrange: { M: 6, L: 7, XL: 4 },
              tealBlue: { S: 5, M: 8, L: 6 },
              burgundy: { S: 4, M: 7, L: 6, XL: 3 },
              mintGreen: { XS: 2, S: 6, M: 5 },
              navyBlue: { M: 8, L: 9, XL: 5 }
            }
          }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.8,
    inStock:false,
    data: {
      colorOptions: [
        { name: 'red', hex: '#e91616' },
        { name: 'forestGreen', hex: '#0adb34' },
        { name: 'royalBlue', hex: '#4169E1' },
        { name: 'sunflowerYellow', hex: '#FFD700' },
        { name: 'orchidPurple', hex: '#DA70D6' },
        { name: 'coralOrange', hex: '#FF7F50' },
        { name: 'tealBlue', hex: '#008080' },
        { name: 'burgundy', hex: '#800020' },
        { name: 'mintGreen', hex: '#98FF98' },
        { name: 'navyBlue', hex: '#000080' }
      ],
      sizeOptions: {
        red: ['S', 'L'],
        forestGreen: ['XL', 'L'],
        royalBlue: ['M', 'L', 'XL'],
        sunflowerYellow: ['S', 'M', 'L'],
        orchidPurple: ['XS', 'S', 'M'],
        coralOrange: ['M', 'L', 'XL'],
        tealBlue: ['S', 'M', 'L'],
        burgundy: ['S', 'M', 'L', 'XL'],
        mintGreen: ['XS', 'S', 'M'],
        navyBlue: ['M', 'L', 'XL']
      },
      quantities: {
        red: { S: 3, L: 5 },
        forestGreen: { XL: 5, L: 10 },
        royalBlue: { M: 7, L: 8, XL: 6 },
        sunflowerYellow: { S: 4, M: 6, L: 5 },
        orchidPurple: { XS: 3, S: 5, M: 4 },
        coralOrange: { M: 6, L: 7, XL: 4 },
        tealBlue: { S: 5, M: 8, L: 6 },
        burgundy: { S: 4, M: 7, L: 6, XL: 3 },
        mintGreen: { XS: 2, S: 6, M: 5 },
        navyBlue: { M: 8, L: 9, XL: 5 }
      }
    }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.2,
    inStock:true,
    data: {
      colorOptions: [
        { name: 'red', hex: '#e91616' },
        { name: 'forestGreen', hex: '#0adb34' },
        { name: 'royalBlue', hex: '#4169E1' },
        { name: 'sunflowerYellow', hex: '#FFD700' },
        { name: 'orchidPurple', hex: '#DA70D6' },
        { name: 'coralOrange', hex: '#FF7F50' },
        { name: 'tealBlue', hex: '#008080' },
        { name: 'burgundy', hex: '#800020' },
        { name: 'mintGreen', hex: '#98FF98' },
        { name: 'navyBlue', hex: '#000080' }
      ],
      sizeOptions: {
        red: ['S', 'L'],
        forestGreen: ['XL', 'L'],
        royalBlue: ['M', 'L', 'XL'],
        sunflowerYellow: ['S', 'M', 'L'],
        orchidPurple: ['XS', 'S', 'M'],
        coralOrange: ['M', 'L', 'XL'],
        tealBlue: ['S', 'M', 'L'],
        burgundy: ['S', 'M', 'L', 'XL'],
        mintGreen: ['XS', 'S', 'M'],
        navyBlue: ['M', 'L', 'XL']
      },
      quantities: {
        red: { S: 3, L: 5 },
        forestGreen: { XL: 5, L: 10 },
        royalBlue: { M: 7, L: 8, XL: 6 },
        sunflowerYellow: { S: 4, M: 6, L: 5 },
        orchidPurple: { XS: 3, S: 5, M: 4 },
        coralOrange: { M: 6, L: 7, XL: 4 },
        tealBlue: { S: 5, M: 8, L: 6 },
        burgundy: { S: 4, M: 7, L: 6, XL: 3 },
        mintGreen: { XS: 2, S: 6, M: 5 },
        navyBlue: { M: 8, L: 9, XL: 5 }
      }
    }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.7,
    inStock:true,
    data: {
      colorOptions: [
        { name: 'red', hex: '#e91616' },
        { name: 'forestGreen', hex: '#0adb34' },
        { name: 'royalBlue', hex: '#4169E1' },
        { name: 'sunflowerYellow', hex: '#FFD700' },
        { name: 'orchidPurple', hex: '#DA70D6' },
        { name: 'coralOrange', hex: '#FF7F50' },
        { name: 'tealBlue', hex: '#008080' },
        { name: 'burgundy', hex: '#800020' },
        { name: 'mintGreen', hex: '#98FF98' },
        { name: 'navyBlue', hex: '#000080' }
      ],
      sizeOptions: {
        red: ['S', 'L'],
        forestGreen: ['XL', 'L'],
        royalBlue: ['M', 'L', 'XL'],
        sunflowerYellow: ['S', 'M', 'L'],
        orchidPurple: ['XS', 'S', 'M'],
        coralOrange: ['M', 'L', 'XL'],
        tealBlue: ['S', 'M', 'L'],
        burgundy: ['S', 'M', 'L', 'XL'],
        mintGreen: ['XS', 'S', 'M'],
        navyBlue: ['M', 'L', 'XL']
      },
      quantities: {
        red: { S: 3, L: 5 },
        forestGreen: { XL: 5, L: 10 },
        royalBlue: { M: 7, L: 8, XL: 6 },
        sunflowerYellow: { S: 4, M: 6, L: 5 },
        orchidPurple: { XS: 3, S: 5, M: 4 },
        coralOrange: { M: 6, L: 7, XL: 4 },
        tealBlue: { S: 5, M: 8, L: 6 },
        burgundy: { S: 4, M: 7, L: 6, XL: 3 },
        mintGreen: { XS: 2, S: 6, M: 5 },
        navyBlue: { M: 8, L: 9, XL: 5 }
      }
    }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.5,
    inStock:true,
    data: {
      height: { value: '170' },
      aboveHeight: {
        colorOptions: [
          { name: 'Crimson Blush', hex: '#DC143C' },
          { name: 'Emerald Dream', hex: '#50C878' },
          { name: 'Sapphire Mist', hex: '#082567' },
          { name: 'Sunset Orange', hex: '#FD5E53' },
          { name: 'Lavender Haze', hex: '#B57EDC' },
          { name: 'Golden Rays', hex: '#FFAA33' },
          { name: 'Turquoise Breeze', hex: '#40E0D0' },
          { name: 'Midnight Plum', hex: '#3C1361' }
        ],
        sizeOptions: {
          'Crimson Blush': ['S', 'M', 'L', 'XL'],
          'Emerald Dream': ['M', 'L', 'XL'],
          'Sapphire Mist': ['S', 'M', 'L'],
          'Sunset Orange': ['XS', 'S', 'M', 'L'],
          'Lavender Haze': ['S', 'M', 'L', 'XL'],
          'Golden Rays': ['M', 'L', 'XL'],
          'Turquoise Breeze': ['XS', 'S', 'M', 'L'],
          'Midnight Plum': ['S', 'M', 'L']
        },
        quantities: {
          'Crimson Blush': { S: 5, M: 8, L: 12, XL: 6 },
          'Emerald Dream': { M: 10, L: 15, XL: 7 },
          'Sapphire Mist': { S: 4, M: 9, L: 11 },
          'Sunset Orange': { XS: 3, S: 6, M: 8, L: 5 },
          'Lavender Haze': { S: 7, M: 13, L: 9, XL: 4 },
          'Golden Rays': { M: 11, L: 14, XL: 8 },
          'Turquoise Breeze': { XS: 2, S: 5, M: 7, L: 6 },
          'Midnight Plum': { S: 6, M: 10, L: 8 }
        }
      },
      belowHeight: {
        colorOptions: [
          { name: 'Cherry Blossom', hex: '#FFB7C5' },
          { name: 'Ocean Depths', hex: '#008080' },
          { name: 'Sunflower Fields', hex: '#FFC300' },
          { name: 'Amethyst Charm', hex: '#9966CC' },
          { name: 'Coral Reef', hex: '#FF7F50' },
          { name: 'Mint Frost', hex: '#98FF98' },
          { name: 'Dusty Rose', hex: '#DCAE96' },
          { name: 'Indigo Twilight', hex: '#4B0082' }
        ],
        sizeOptions: {
          'Cherry Blossom': ['XS', 'S', 'M'],
          'Ocean Depths': ['S', 'M', 'L'],
          'Sunflower Fields': ['XS', 'S', 'M', 'L'],
          'Amethyst Charm': ['S', 'M', 'L'],
          'Coral Reef': ['XS', 'S', 'M'],
          'Mint Frost': ['S', 'M', 'L'],
          'Dusty Rose': ['XS', 'S', 'M', 'L'],
          'Indigo Twilight': ['S', 'M', 'L']
        },
        quantities: {
          'Cherry Blossom': { XS: 3, S: 7, M: 9 },
          'Ocean Depths': { S: 6, M: 11, L: 8 },
          'Sunflower Fields': { XS: 2, S: 5, M: 8, L: 4 },
          'Amethyst Charm': { S: 7, M: 12, L: 9 },
          'Coral Reef': { XS: 4, S: 8, M: 10 },
          'Mint Frost': { S: 5, M: 9, L: 7 },
          'Dusty Rose': { XS: 3, S: 6, M: 9, L: 5 },
          'Indigo Twilight': { S: 8, M: 13, L: 10 }
        }
      }
    }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.3,
    inStock:true,
    data: {
      height: { value: '170' },
      aboveHeight: {
        colorOptions: [
          { name: 'Crimson Blush', hex: '#DC143C' },
          { name: 'Emerald Dream', hex: '#50C878' },
          { name: 'Sapphire Mist', hex: '#082567' },
          { name: 'Sunset Orange', hex: '#FD5E53' },
          { name: 'Lavender Haze', hex: '#B57EDC' },
          { name: 'Golden Rays', hex: '#FFAA33' },
          { name: 'Turquoise Breeze', hex: '#40E0D0' },
          { name: 'Midnight Plum', hex: '#3C1361' }
        ],
        sizeOptions: {
          'Crimson Blush': ['S', 'M', 'L', 'XL'],
          'Emerald Dream': ['M', 'L', 'XL'],
          'Sapphire Mist': ['S', 'M', 'L'],
          'Sunset Orange': ['XS', 'S', 'M', 'L'],
          'Lavender Haze': ['S', 'M', 'L', 'XL'],
          'Golden Rays': ['M', 'L', 'XL'],
          'Turquoise Breeze': ['XS', 'S', 'M', 'L'],
          'Midnight Plum': ['S', 'M', 'L']
        },
        quantities: {
          'Crimson Blush': { S: 5, M: 8, L: 12, XL: 6 },
          'Emerald Dream': { M: 10, L: 15, XL: 7 },
          'Sapphire Mist': { S: 4, M: 9, L: 11 },
          'Sunset Orange': { XS: 3, S: 6, M: 8, L: 5 },
          'Lavender Haze': { S: 7, M: 13, L: 9, XL: 4 },
          'Golden Rays': { M: 11, L: 14, XL: 8 },
          'Turquoise Breeze': { XS: 2, S: 5, M: 7, L: 6 },
          'Midnight Plum': { S: 6, M: 10, L: 8 }
        }
      },
      belowHeight: {
        colorOptions: [
          { name: 'Cherry Blossom', hex: '#FFB7C5' },
          { name: 'Ocean Depths', hex: '#008080' },
          { name: 'Sunflower Fields', hex: '#FFC300' },
          { name: 'Amethyst Charm', hex: '#9966CC' },
          { name: 'Coral Reef', hex: '#FF7F50' },
          { name: 'Mint Frost', hex: '#98FF98' },
          { name: 'Dusty Rose', hex: '#DCAE96' },
          { name: 'Indigo Twilight', hex: '#4B0082' }
        ],
        sizeOptions: {
          'Cherry Blossom': ['XS', 'S', 'M'],
          'Ocean Depths': ['S', 'M', 'L'],
          'Sunflower Fields': ['XS', 'S', 'M', 'L'],
          'Amethyst Charm': ['S', 'M', 'L'],
          'Coral Reef': ['XS', 'S', 'M'],
          'Mint Frost': ['S', 'M', 'L'],
          'Dusty Rose': ['XS', 'S', 'M', 'L'],
          'Indigo Twilight': ['S', 'M', 'L']
        },
        quantities: {
          'Cherry Blossom': { XS: 3, S: 7, M: 9 },
          'Ocean Depths': { S: 6, M: 11, L: 8 },
          'Sunflower Fields': { XS: 2, S: 5, M: 8, L: 4 },
          'Amethyst Charm': { S: 7, M: 12, L: 9 },
          'Coral Reef': { XS: 4, S: 8, M: 10 },
          'Mint Frost': { S: 5, M: 9, L: 7 },
          'Dusty Rose': { XS: 3, S: 6, M: 9, L: 5 },
          'Indigo Twilight': { S: 8, M: 13, L: 10 }
        }
      }
    }
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
    get discount() {
      return calculateDiscount(this.old_price, this.new_price)
    },
    rating: 4.9,
    inStock:false,
    data: {
      height: { value: '170' },
      aboveHeight: {
        colorOptions: [
          { name: 'Crimson Blush', hex: '#DC143C' },
          { name: 'Emerald Dream', hex: '#50C878' },
          { name: 'Sapphire Mist', hex: '#082567' },
          { name: 'Sunset Orange', hex: '#FD5E53' },
          { name: 'Lavender Haze', hex: '#B57EDC' },
          { name: 'Golden Rays', hex: '#FFAA33' },
          { name: 'Turquoise Breeze', hex: '#40E0D0' },
          { name: 'Midnight Plum', hex: '#3C1361' }
        ],
        sizeOptions: {
          'Crimson Blush': ['S', 'M', 'L', 'XL'],
          'Emerald Dream': ['M', 'L', 'XL'],
          'Sapphire Mist': ['S', 'M', 'L'],
          'Sunset Orange': ['XS', 'S', 'M', 'L'],
          'Lavender Haze': ['S', 'M', 'L', 'XL'],
          'Golden Rays': ['M', 'L', 'XL'],
          'Turquoise Breeze': ['XS', 'S', 'M', 'L'],
          'Midnight Plum': ['S', 'M', 'L']
        },
        quantities: {
          'Crimson Blush': { S: 0, M: 0, L: 0, XL: 6 },
          'Emerald Dream': { M: 10, L: 15, XL: 7 },
          'Sapphire Mist': { S: 4, M: 9, L: 11 },
          'Sunset Orange': { XS: 3, S: 6, M: 8, L: 5 },
          'Lavender Haze': { S: 7, M: 13, L: 9, XL: 4 },
          'Golden Rays': { M: 11, L: 14, XL: 8 },
          'Turquoise Breeze': { XS: 2, S: 5, M: 7, L: 6 },
          'Midnight Plum': { S: 6, M: 10, L: 8 }
        }
      },
      belowHeight: {
        colorOptions: [
          { name: 'Cherry Blossom', hex: '#FFB7C5' },
          { name: 'Ocean Depths', hex: '#008080' },
          { name: 'Sunflower Fields', hex: '#FFC300' },
          { name: 'Amethyst Charm', hex: '#9966CC' },
          { name: 'Coral Reef', hex: '#FF7F50' },
          { name: 'Mint Frost', hex: '#98FF98' },
          { name: 'Dusty Rose', hex: '#DCAE96' },
          { name: 'Indigo Twilight', hex: '#4B0082' }
        ],
        sizeOptions: {
          'Cherry Blossom': ['XS', 'S', 'M'],
          'Ocean Depths': ['S', 'M', 'L'],
          'Sunflower Fields': ['XS', 'S', 'M', 'L'],
          'Amethyst Charm': ['S', 'M', 'L'],
          'Coral Reef': ['XS', 'S', 'M'],
          'Mint Frost': ['S', 'M', 'L'],
          'Dusty Rose': ['XS', 'S', 'M', 'L'],
          'Indigo Twilight': ['S', 'M', 'L']
        },
        quantities: {
          'Cherry Blossom': { XS: 3, S: 7, M: 9 },
          'Ocean Depths': { S: 6, M: 11, L: 8 },
          'Sunflower Fields': { XS: 2, S: 5, M: 8, L: 4 },
          'Amethyst Charm': { S: 7, M: 12, L: 9 },
          'Coral Reef': { XS: 4, S: 8, M: 10 },
          'Mint Frost': { S: 5, M: 9, L: 7 },
          'Dusty Rose': { XS: 3, S: 6, M: 9, L: 5 },
          'Indigo Twilight': { S: 8, M: 13, L: 10 }
        }
      }
    }
  },
 
 ];
 
export default all_product;
