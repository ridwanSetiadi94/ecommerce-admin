import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ billboardId: string }> }
) {
  try {
    const { billboardId } = await params; // <-- important!

    if (!billboardId) {
      return new NextResponse("Billboard ID is Required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARD_GET] Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { label, imageUrl } = await body;
    const { storeId, billboardId } = await params; // <-- important!

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!label || typeof label !== "string") {
      return new NextResponse("Label is Required", { status: 400 });
    }

    if (!imageUrl || typeof imageUrl !== "string") {
      return new NextResponse("Image URL is Required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is Required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARD_PATCH] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; billboardId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, billboardId } = await params; // <-- important!

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard ID is Required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARD_DELETE] Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
