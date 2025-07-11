import prismadb from "@/lib/prismadb";
import { Order, OrderItem, Product } from "@/lib/generated/prisma"; // adjust path if needed

// Define shape returned by the graph
interface GraphData {
  name: string;
  total: number;
}

// Extend Order to include nested items and product
type OrderWithItemsAndProduct = Order & {
  orderItems: (OrderItem & {
    product: Product;
  })[];
};

// Get month name from index
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Main function to fetch and compute revenue per month
async function getGraphRevenue(storeId: string): Promise<GraphData[]> {
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

  const monthlyRevenue: Record<number, number> = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth(); // 0 = Jan, 11 = Dec
    const revenue = order.orderItems.reduce((sum, item) => {
      return sum + item.product.price.toNumber();
    }, 0);

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenue;
  }

  const graphData: GraphData[] = monthNames.map((name, index) => ({
    name,
    total: monthlyRevenue[index] || 0,
  }));

  return graphData;
}

export default getGraphRevenue;
