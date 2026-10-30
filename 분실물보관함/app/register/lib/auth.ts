import { cookies } from "next/headers";
import { createHash } from "crypto";

export const ADMIN_COOKIE = "lf_admin";

// 비밀번호는 코드에 쓰지 않고 Vercel 환경 변수 ADMIN_PASSWORD 에서 읽어요.
export function adminToken() {
  return createHash("sha256")
    .update(`lf:${process.env.ADMIN_PASSWORD ?? ""}`)
    .digest("hex");
}

export async function isAdmin() {
  if (!process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}
