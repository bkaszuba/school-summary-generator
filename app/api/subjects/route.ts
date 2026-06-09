import { redis } from "@/lib/redis";
import { SUBJECTS } from "@/lib/types";

export async function GET() {
  const subjects = (await redis.get<string[]>("subjects")) ?? SUBJECTS;
  return Response.json(subjects);
}

export async function POST(req: Request) {
  const subjects: string[] = await req.json();
  await redis.set("subjects", subjects);
  return Response.json({ ok: true });
}
