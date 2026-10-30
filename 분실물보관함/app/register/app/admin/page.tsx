import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { supabase, type Item } from "@/lib/supabase";
import { login, logout, setStatus, deleteItem } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function Admin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  if (!(await isAdmin())) {
    return (
      <main className="wrap">
        <header className="top"><h1>관리자 로그인</h1></header>
        <form action={login} className="panel" style={{ maxWidth: 420 }}>
          <label>
            비밀번호
            <input type="password" name="password" required autoFocus />
          </label>
          {error && <p className="error">비밀번호가 맞지 않아요. 다시 입력해 주세요.</p>}
          <p><button className="btn" type="submit">로그인</button></p>
        </form>
        <Link href="/" className="back">← 목록으로</Link>
      </main>
    );
  }

  const { data } = await supabase.from("items").select("*").order("created_at", { ascending: false });
  const items = (data ?? []) as Item[];

  return (
    <main className="wrap">
      <header className="top row">
        <h1>분실물 관리</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="btn ghost" href="/">사이트 보기</Link>
          <form action={logout}><button className="btn ghost" type="submit">로그아웃</button></form>
        </div>
      </header>

      <section className="panel">
        <h2 style={{ marginTop: 0 }}>등록된 분실물 ({items.length})</h2>
        {items.length === 0 ? (
          <p className="empty">아직 등록된 분실물이 없어요.</p>
        ) : (
          <ul className="list">
            {items.map((it) => (
              <li key={it.id}>
                <div>
                  <span className={`badge ${it.status === "returned" ? "done" : ""}`}>
                    {it.status === "returned" ? "반환 완료" : "보관 중"}
                  </span>{" "}
                  <Link href={`/items/${it.id}`}><strong>{it.name}</strong></Link>
                  <p className="meta">{it.found_place} · {it.found_date}</p>
                </div>
                <div className="actions">
                  <form action={setStatus}>
                    <input type="hidden" name="id" value={it.id} />
                    <input type="hidden" name="status" value={it.status === "returned" ? "keeping" : "returned"} />
                    <button className="btn small ghost" type="submit">
                      {it.status === "returned" ? "보관 중으로" : "반환 완료"}
                    </button>
                  </form>
                  <form action={deleteItem}>
                    <input type="hidden" name="id" value={it.id} />
                    <button className="btn small danger" type="submit">삭제</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
