import AddProductPageComponent from "@/components/seller/add-product/AddProductPageComponent";
import { requireAuth } from "@/lib/server-auth";
import BreadcrumbComponent from "@/components/ui/BreadcrumbComponent";

const AddProductPage = async () => {
  const currentUser = await requireAuth();
  return (
    <div className="w-full min-h-screen h-full">
      <div className="p-6">
        <BreadcrumbComponent currentUser={currentUser} />
        <div className="mt-6">
          <h1 className="text-2xl font-semibold">Add new Product</h1>
          <p className="font-roboto font-medium text-sm text-[#C4C2C2]">
            List your tactical equipment on the marketplace
          </p>
        </div>
        <div className="container mx-auto mt-12">
          <AddProductPageComponent currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
