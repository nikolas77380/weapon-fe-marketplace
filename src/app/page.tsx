import React from "react";
import { getHomePageData } from "@/lib/homepage-server";
import CategoryContentClient from "@/components/CategoryContent/CategoryContentClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Esviem Defence | Weapon Marketplace",
  description:
    "Esviem Defence — платформа для залучення продавців військових товарів.",
  keywords: [
    "військовий маркетплейс",
    "платформа для військової амуніції",
    "маркетплейс тактичного спорядження",
    "товари для військових",
    "тактичний магазин онлайн",
    "тактичні рюкзаки",
    "військова форма",
    "спорядження для виживання",
    "бронежилети та каски",
    "військові аксесуари",
    "армійське взуття",
    "камуфляж та мілітарі-одяг",
    "платформа для продавців військових товарів",
    "розмістити товари військової тематики",
    "маркетплейс для виробників амуніції",
    "платформа для продавців військових товарів",
    "платформа для продажу тактичних товарів",
    "esviem",
    "esviem defence",
  ],
};

const HomePage = async () => {
  // Загружаем начальные данные на сервере
  let initialData;
  try {
    initialData = await getHomePageData();
  } catch (error) {
    console.error("[HomePage] Failed to load homepage data on server:", error);
    // Продолжаем работу, данные загрузятся на клиенте
    initialData = {
      products: {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 12,
            pageCount: 0,
            total: 0,
          },
        },
      },
      promos: {
        data: [],
      },
      categories: [],
      topProducts: [],
    };
  }

  // Проверяем, что данные валидны
  if (!initialData) {
    console.error("[HomePage] initialData is null or undefined");
    initialData = {
      products: {
        data: [],
        meta: {
          pagination: {
            page: 1,
            pageSize: 12,
            pageCount: 0,
            total: 0,
          },
        },
      },
      promos: {
        data: [],
      },
      categories: [],
      topProducts: [],
    };
  }

  return (
    <div className="mb-20 h-full min-h-screen w-full px-4 sm:px-0 lg:px-0">
      <div className="container mx-auto">
        <CategoryContentClient
          initialProducts={initialData.products}
          initialPromos={initialData.promos}
          initialCategories={initialData.categories}
          initialTopProducts={initialData.topProducts}
        />
      </div>
    </div>
  );
};

export default HomePage;
