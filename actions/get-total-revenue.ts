import prismadb from "@/lib/prismadb";
import { Order, OrderItem, Product } from "@/lib/generated/prisma"; // adjust path if needed

type OrderWithItemsAndProduct = Order & {
  orderItems: (OrderItem & {
    product: Product;
  })[];
};

// Helper: Get item price
function getItemPrice(item: OrderItem & { product: Product }): number {
  return item.product.price.toNumber();
}

// Helper: Calculate total for one order
function calculateOrderSum(
  orderItems: (OrderItem & { product: Product })[]
): number {
  return orderItems.reduce((sum, item) => sum + getItemPrice(item), 0);
}

// Helper: Calculate total revenue
function calculateTotalRevenue(orders: OrderWithItemsAndProduct[]): number {
  return orders.reduce((total, order) => {
    const orderTotal = calculateOrderSum(order.orderItems);
    return total + orderTotal;
  }, 0);
}

// Main: Get total revenue for store
async function getTotalRevenue(storeId: string): Promise<number> {
  const paidOrders: OrderWithItemsAndProduct[] = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return calculateTotalRevenue(paidOrders);
}

export default getTotalRevenue;
