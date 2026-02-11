import { NextRequest, NextResponse } from "next/server";
import { getAnimeRecommendations } from "@/lib/bourbon-anime-matcher";
import type { Whiskey } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const whiskey = body.whiskey as Whiskey;

    if (!whiskey || !whiskey.name) {
      return NextResponse.json(
        { error: "Missing whiskey data" },
        { status: 400 }
      );
    }

    const recommendations = getAnimeRecommendations(whiskey);

    return NextResponse.json({
      recommendations,
      message: `Found ${recommendations.length} anime that match ${whiskey.name}'s vibe!`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
