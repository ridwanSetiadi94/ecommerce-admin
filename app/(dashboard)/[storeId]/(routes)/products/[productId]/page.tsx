import prismadb from "@/lib/prismadb";
import ProductForm from "./components/product-form";

async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string; storeId: string }>;
}): Promise<React.ReactElement> {
  const { productId, storeId } = await params; // Await params to get the real value
  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          colors={colors}
          sizes={sizes}
          initialData={
            product
              ? {
                  ...product,
                  price: product.price.toNumber(), // Convert Decimal to number
                  createdAt: product.createdAt.toISOString(),
                  updatedAt: product.updatedAt.toISOString(),
                }
              : null
          }
        />
      </div>
    </div>
  );
}

export default ProductPage;
