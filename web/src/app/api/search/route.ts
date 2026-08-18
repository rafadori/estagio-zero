import { NextResponse, type NextRequest } from "next/server";
import { searchPosts } from "@/lib/data";

// Busca simples via ILIKE (ver src/lib/data.ts) — protótipo descartável
// recomendado pelo doc de pré-engenharia pra essa escala de projeto.
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = await searchPosts(q);
  return NextResponse.json({ results });
}
