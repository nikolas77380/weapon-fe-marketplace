export interface ShopCategory {
  id: number;
  img: string;
  category: string;
  price: number;
  title: string;
  description: string;
  badge?: string;
  seller: string;
  rating: number;
  status?: string;
  createdAt?: string;
}

export const shopCategories = [
  {
    id: 1,
    img: "/shop/1.jpg",
    badge: "New",
    category: "Armor",
    price: 800,
    title: "Product Name",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lo...",
    seller: "S",
    rating: 4.4,
    status: "Verifyed",
    createdAt: "14/01/2025",
  },
  {
    id: 2,
    img: "/shop/2.png",
    badge: "New",
    category: "Armor",
    price: 600,
    title: "Product Name",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lo...",
    seller: "S",
    rating: 4.4,
    status: "Verifyed",
    createdAt: "14/01/2025",
  },
  {
    id: 3,
    img: "/shop/3.png",
    badge: "In Stock",
    category: "Armor",
    price: 550,
    title: "Product Name",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lo...",
    seller: "S",
    rating: 4.4,
    status: "Verifyed",
    createdAt: "14/01/2025",
  },
  {
    id: 4,
    img: "/shop/4.png",
    category: "Armor",
    price: 1200,
    title: "Product Name",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lo...",
    seller: "S",
    rating: 4.4,
    status: "Verifyed",
    createdAt: "14/01/2025",
  },
  {
    id: 5,
    img: "/shop/1.jpg",
    badge: "Pre-order",
    category: "Armor",
    price: 800,
    title: "Product Name",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lo...",
    seller: "S",
    rating: 4.4,
    status: "Verifyed",
    createdAt: "14/01/2025",
  },
  {
    id: 6,
    img: "/shop/4.png",
    category: "Weapon",
    price: 800,
    title: "Product Name",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lo...",
    seller: "S",
    rating: 4.4,
    status: "Verifyed",
    createdAt: "14/01/2025",
  },
  {
    id: 7,
    img: "/shop/3.png",
    category: "Armor",
    price: 800,
    title: "Product Name",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lo...",
    seller: "S",
    rating: 4.4,
    status: "Verifyed",
    createdAt: "14/01/2025",
  },
  {
    id: 8,
    img: "/shop/2.png",
    category: "Armor",
    price: 800,
    title: "Product Name",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lo...",
    seller: "S",
    rating: 4.4,
    status: "Verifyed",
    createdAt: "14/01/2025",
  },
  {
    id: 9,
    img: "/shop/1.jpg",
    category: "Armor",
    price: 800,
    title: "Product Name",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lo...",
    seller: "S",
    rating: 4.4,
    status: "Verifyed",
    createdAt: "14/01/2025",
  },
];
