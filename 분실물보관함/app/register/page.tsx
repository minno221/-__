import Link from "next/link";
import { CATEGORIES } from "@/lib/supabase";
import { createItem } from "@/app/actions";

const ERRORS: Record<string, string> = {
  size: "사진이 너무 커요. 4MB 이하로 줄여서 다시 올려 주세요.",
  type: "이미지 파일만 올릴 수 있어요.",
  upload: "사진을 올리지 못했어요. 잠시 후 다시 시도해 주세요.",
  save: "등록하지 못했어요. 입력한 내용을 확인하고 다시 시도해 주세요.",
};

export default async function Register({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="wrap">
      <header className="top">
        <h1>분실물 등록</h1>
        <p>주운 물건을 올려 주세요. 주인이 사진을 보고 찾아갈 수 있어요.</p>
      </header>

      <form action={createItem} className="panel form">
        {error && <p className="error full">{ERRORS[error] ?? ERRORS.save}</p>}
        <label>물건 이름
          <input name="name" required maxLength={100} placeholder="예: 검정 가죽 지갑" />
        </label>
        <label>카테고리
          <select name="category" required>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>습득 장소
          <input name="found_place" required maxLength={100} placeholder="예: 3층 휴게실" />
        </label>
        <label>습득 날짜
          <input type="date" name="found_date" required defaultValue={today} />
        </label>
        <label>보관 위치
          <input name="storage_place" required maxLength={100} placeholder="예: 1층 안내데스크" />
        </label>
        <label>사진 (4MB 이하)
          <input type="file" name="image" accept="image/*" />
        </label>
        <label className="full">특징 (선택)
          <textarea name="description" maxLength={500} placeholder="색상, 브랜드, 눈에 띄는 흠집 등" />
        </label>
        <div className="full row">
          <button className="btn accent" type="submit">등록하기</button>
          <Link href="/" className="btn ghost">취소</Link>
        </div>
      </form>
    </main>
  );
}
