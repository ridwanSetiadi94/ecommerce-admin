import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function SetupLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    // Redirect to sign-in page if user is not authenticated
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    // If a store already exists, redirect to the store's dashboard
    redirect(`/${store.id}`);
  }
  return <>{children}</>;
}

export default SetupLayout;
