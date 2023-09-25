import bcrypt from 'bcryptjs';
import { User } from './models/userModel';
import { Product } from './models/productModel';

export const sampleProducts: Product[] = [
  {
    name: 'Omega Seamaster 300M GMT',
    slug: 'omega-seamaster-diver-300m-gmt',
    image: '/images/omega-seamaster-diver-300m-gmt.png',
    brand: 'Omega',
    category: 'Automatic',
    description: 'high quality shirt',
    price: 4000,
    countInStock: 10,
    rating: 4.5,
    numReviews: 10,
    reviews: [
      { name: 'John', comment: 'good', rating: 4, createdAt: new Date() },
    ],
    images: ['../images/p11.jpg'],
    isFeatured: true,
    banner: '../images/b1.jpg',
  },

  {
    name: 'Rolex Oyster Perpetual Tiffany Dial 36mm',
    slug: 'rolex_oyster_perpetual_36_tiffany',
    category: 'Automatic',
    image: '/images/rolex_oyster_perpetual_36_tiffany.jpeg',
    price: 6000,
    countInStock: 20,
    brand: 'Rolex',
    rating: 4.0,
    numReviews: 10,
    description: 'high quality product',
    reviews: [],
    images: [],
    isFeatured: true,
    banner: '../images/b2.jpg',
  },
  {
    name: 'Zenith Defy El Primero Double Tourbillion',
    slug: 'zenith_defy_el_primero_double_tourbillon',
    category: 'Automatic',
    image: '/images/Zenith_Defy-El-Primero-Double-Tourbillon.jpeg',
    price: 25000,
    countInStock: 15,
    brand: 'Zenith',
    rating: 4.5,
    numReviews: 14,
    description: 'high quality product',
    reviews: [],
    images: [],
    isFeatured: true,
    banner: '../images/b2.jpg',
  },
];

export const sampleUsers: User[] = [
  {
    name: 'Joe',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: true,
  },
  {
    name: 'John',
    email: 'user@example.com',
    password: bcrypt.hashSync('123456'),
    isAdmin: false,
  },
];
