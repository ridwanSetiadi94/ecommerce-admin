import prismadb from "@/lib/prismadb";
import CategoryForm from "./components/category-form";

async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string; storeId: string }>;
}): Promise<React.ReactElement> {
  const { categoryId, storeId } = await params; // Await params to get the real value
  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
}

export default CategoryPage;
