import { createClient } from "@supabase/supabase-js";

// Vercel의 Supabase 연동이 붙이는 이름(STORAGE_ 접두사)도 함께 지원합니다.
const url = process.env.SUPABASE_URL ?? process.env.STORAGE_SUPABASE_URL ?? process.env.STORAGE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.STORAGE_SUPABASE_SERVICE_ROLE_KEY;

// 서버에서만 import 하세요. service role key 는 브라우저로 나가면 안 됩니다.
export const supabase = createClient(url!, key!, { auth: { persistSession: false } });

export const CATEGORIES = ["지갑", "전자기기", "가방", "의류", "열쇠", "카드·신분증", "기타"];

export type Item = {
  id: string;
  name: string;
  category: string;
  found_place: string;
  found_date: string;
  storage_place: string;
  description: string | null;
  image_url: string | null;
  status: "keeping" | "returned";
  created_at: string;
};
