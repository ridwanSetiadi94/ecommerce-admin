import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ colorId: string }> }
) {
  try {
    const { colorId } = await params; // <-- important!

    if (!colorId) {
      return new NextResponse("Color ID is Required", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLORS_GET] Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; colorId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const { name, value } = await body;
    const { storeId, colorId } = await params; // <-- important!

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || typeof name !== "string") {
      return new NextResponse("Name is Required", { status: 400 });
    }

    if (!value || typeof value !== "string") {
      return new NextResponse("Value is Required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color ID is Required", { status: 400 });
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

    const color = await prismadb.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLORS_PATCH] Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; colorId: string }> }
) {
  try {
    const { userId } = await auth();
    const { storeId, colorId } = await params; // <-- important!

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!colorId) {
      return new NextResponse("Color ID is Required", { status: 400 });
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

    const color = await prismadb.color.deleteMany({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error("[COLORS_DELETE] Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
