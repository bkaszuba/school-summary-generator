import { redis } from "@/lib/redis";
import { Student } from "@/lib/types";

export async function GET() {
  const students = (await redis.get<Student[]>("students")) ?? [];
  return Response.json(students);
}

export async function POST(req: Request) {
  const students: Student[] = await req.json();
  await redis.set("students", students);
  return Response.json({ ok: true });
}
