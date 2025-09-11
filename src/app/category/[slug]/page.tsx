import React from "react";
import FilteringContent from "@/components/shop/FilteringContent";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;

  return (
    <div className="mb-20">
      <div className="container mx-auto">
        <FilteringContent categorySlug={slug} />
      </div>
    </div>
  );
};

export default CategoryPage;
