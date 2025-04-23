import { NextResponse } from "next/server";

import { auth } from "@acme/auth";
import { db as prisma } from "@acme/db";

export const runtime = "nodejs"; // Ensures Node.js runtime

export async function GET() {
  const session = await auth();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const trades = await prisma.order.findMany({
      where: {
        TradingAccountId: session.user.id,
      },
      take: 100,
    });

    // Process trades to calculate daily P/L, trading activity, etc.
    const processedData = processTrades(trades);

    return NextResponse.json(processedData);
  } catch {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function processTrades(trades: unknown[]) {
  // Add your logic to process trades and calculate statistics
  return {
    dailyPnL: [],
    tradingActivity: [],
    recentTrades: trades,
  };
}
