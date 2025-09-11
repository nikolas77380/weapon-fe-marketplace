import React from "react";
import FilteringContent from "@/components/shop/FilteringContent";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

const CategoryPage = ({ params }: CategoryPageProps) => {
  return (
    <div className="border-t border-[#D3D3D3] mb-20">
      <div className="container mx-auto">
        <FilteringContent categorySlug={params.slug} />
      </div>
    </div>
  );
};

export default CategoryPage;
