import { NextRequest, NextResponse } from "next/server";
import { syncLeadToAirtable } from "@/lib/airtable-sync";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: "leadId is required" },
        { status: 400 }
      );
    }

    const result = await syncLeadToAirtable(leadId);

    if (result.success) {
      return NextResponse.json({
        success: true,
        recordId: result.recordId,
        message: "Lead synced successfully",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in sync-lead API:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
