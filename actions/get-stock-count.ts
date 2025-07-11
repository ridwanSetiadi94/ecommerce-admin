import prismadb from "@/lib/prismadb";

async function getStockCount(storeId: string): Promise<number> {
  const stockCount = await prismadb.product.count({
    where: {
      storeId,
      isArchived: true,
    },
  });
  return stockCount;
}

export default getStockCount;
