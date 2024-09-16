export const runtime = "nodejs";
// Prevents this route's response from being cached
export const dynamic = "force-dynamic";

import Redis from "ioredis";
import { NextRequest } from "next/server";

const redisUrl = process.env.UPSTASH_REDIS_URL!;
const redisSubscriber = new Redis(redisUrl);

const setKey = "ai-responses";

export async function GET(req: NextRequest) {
  // TODO: implement
}