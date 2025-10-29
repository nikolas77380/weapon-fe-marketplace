import AddProductPageComponent from "@/components/seller/add-product/AddProductPageComponent";
import { requireAuth } from "@/lib/server-auth";
import BreadcrumbComponent from "@/components/ui/BreadcrumbComponent";
import { getTranslations } from "next-intl/server";

const AddProductPage = async () => {
  const currentUser = await requireAuth();

  const t = await getTranslations("AddProduct");
  return (
    <div className="w-full min-h-screen h-full mb-20">
      <div className="">
        {/* Breadcrumb - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block mt-4">
          <BreadcrumbComponent currentUser={currentUser} />
        </div>

        {/* Title section with responsive spacing */}
        <div className="mt-4 md:mt-6">
          <h1 className="text-xl sm:text-2xl font-semibold">
            {t("titleAddProduct")}
          </h1>
          <p className="font-roboto font-medium text-sm text-[#C4C2C2] mt-1">
            {t("descriptionAddProduct")}
          </p>
        </div>

        {/* Main content with responsive spacing */}
        <div className="mt-8 md:mt-12">
          <AddProductPageComponent currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
