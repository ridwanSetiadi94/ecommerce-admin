import prismadb from "@/lib/prismadb";
import SizeForm from "./components/size-form";

async function SizePage({
  params,
}: {
  params: { sizeId: string };
}): Promise<React.ReactElement> {
  const { sizeId } = await params; // Await params to get the real value
  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
}

export default SizePage;
