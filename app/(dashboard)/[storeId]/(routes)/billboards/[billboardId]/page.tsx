import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/billboard-form";

async function BillboardPage({
  params,
}: {
  params: Promise<{ billboardId: string }>;
}): Promise<React.ReactElement> {
  const { billboardId } = await params; // Await params to get the real value
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
}

export default BillboardPage;
