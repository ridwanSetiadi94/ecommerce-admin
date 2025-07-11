import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SettingsForm from "./components/settings-form";

interface SettingsPageProps {
  params: Promise<{
    storeId: string;
  }>;
}

async function SettingsPage({
  params,
}: SettingsPageProps): Promise<React.ReactElement> {
  // Await params and get the real values
  const { storeId } = await params; // <-- important!

  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Use the unwrapped value, not params.storeId
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
}

export default SettingsPage;
