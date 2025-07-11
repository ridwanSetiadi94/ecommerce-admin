import prismadb from "@/lib/prismadb";
import ColorForm from "./components/color-form";

async function ColorPage({
  params,
}: {
  params: Promise<{ colorId: string }>;
}): Promise<React.ReactElement> {
  const { colorId } = await params; // Await params to get the real value
  const color = await prismadb.color.findUnique({
    where: {
      id: colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
}

export default ColorPage;
