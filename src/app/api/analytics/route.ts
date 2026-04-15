import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

async function getGeolocation(ip: string) {
  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,city,regionName,lat,lon,timezone,isp,org,as`,
    );
    const data = await response.json();
    if (data.status === "success") {
      return {
        country: data.country,
        city: data.city,
        region: data.regionName,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org,
        as: data.as,
      };
    }
  } catch (error) {
    console.error("Geolocation error:", error);
  }
  return null;
}

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

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0].trim() : realIp || "unknown";

    // Get geolocation data
    const geoData = ip !== "unknown" ? await getGeolocation(ip) : null;

    const enhancedMetadata = {
      ...metadata,
      ip,
      ...geoData,
    };

    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        type,
        page,
        action: action || null,
        metadata: enhancedMetadata,
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
