import prismadb from "@/lib/prismadb";

async function getSalesCount(storeId: string): Promise<number> {
  const salesCount = await prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });
  return salesCount;
}

export default getSalesCount;
