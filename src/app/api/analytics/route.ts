import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, page, action, metadata } = body;

    if (!type || !page) {
      return NextResponse.json(
        { error: "Missing required fields: type, page" },
        { status: 400 },
      );
    }

    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        type,
        page,
        action: action || null,
        metadata: metadata || null,
      },
    });

    return NextResponse.json(analyticsEvent, { status: 201 });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 },
    );
  }
}
