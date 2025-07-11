import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    const { sizeId } = await params; // <-- important!

    if (!sizeId) {
      return new NextResponse("Size ID is Required", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_GET] Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, value } = await body;
    const { storeId, sizeId } = await params; // <-- important!

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || typeof name !== "string") {
      return new NextResponse("Name is Required", { status: 400 });
    }

    if (!value || typeof value !== "string") {
      return new NextResponse("Value is Required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size ID is Required", { status: 400 });
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

    const size = await prismadb.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_PATCH] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = await auth();
    const { storeId, sizeId } = await params; // <-- important!

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!sizeId) {
      return new NextResponse("Size ID is Required", { status: 400 });
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

    const size = await prismadb.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_DELETE] Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
