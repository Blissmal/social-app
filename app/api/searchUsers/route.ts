import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "@/actions/user.action";

export async function GET(req: Request) {
  try {
    const dbUserId = await getDbUserId();
    if (!dbUserId) return;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ users: [] });
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
        id: {
          not: dbUserId,
        },
      },
      select: { id: true, username: true, image: true },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
