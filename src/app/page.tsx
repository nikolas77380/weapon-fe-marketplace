import React from "react";
import { getHomePageData } from "@/lib/homepage-server";
import CategoryContentClient from "@/components/CategoryContent/CategoryContentClient";

const HomePage = async () => {
  // Загружаем начальные данные на сервере
  let initialData;
  try {
    initialData = await getHomePageData();
  } catch (error) {
    console.error("Failed to load homepage data on server:", error);
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
