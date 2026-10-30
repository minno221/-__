import Link from "next/link";
import { supabase, CATEGORIES, type Item } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string; category?: string }> };

export default async function Home({ searchParams }: Props) {
  const { q, category } = await searchParams;

  let query = supabase
    .from("items")
    .select("*")
    .order("status", { ascending: true }) // keeping 먼저
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);
  if (q) {
    const safe = q.replace(/[,()%]/g, " ").trim();
    if (safe) query = query.or(`name.ilike.%${safe}%,found_place.ilike.%${safe}%`);
  }

  const { data, error } = await query;
  const items = (data ?? []) as Item[];

  const chipHref = (c?: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (c) p.set("category", c);
    const s = p.toString();
    return s ? `/?${s}` : "/";
  };

  return (
    <main className="wrap">
      <header className="top">
        <h1>분실물 보관함</h1>
        <p>잃어버린 물건이 있는지 찾아보세요. 물건을 주웠다면 누구나 등록할 수 있어요.</p>
        <p><Link href="/register" className="btn accent">분실물 등록하기</Link></p>
      </header>

      <form className="search" action="/">
        <input
          name="q"
          defaultValue={q}
          placeholder="물건 이름이나 습득 장소로 검색"
          aria-label="검색"
        />
        {category && <input type="hidden" name="category" value={category} />}
        <button className="btn" type="submit">검색</button>
      </form>

      <nav className="chips" aria-label="카테고리">
        <Link className="chip" href={chipHref()} aria-current={!category}>전체</Link>
        {CATEGORIES.map((c) => (
          <Link key={c} className="chip" href={chipHref(c)} aria-current={category === c}>
            {c}
          </Link>
        ))}
      </nav>

      {error && <p className="error">목록을 불러오지 못했어요. 환경 변수를 확인해 주세요.</p>}

      {items.length === 0 && !error ? (
        <p className="empty">조건에 맞는 분실물이 없어요. 검색어나 카테고리를 바꿔 보세요.</p>
      ) : (
        <section className="grid">
          {items.map((it) => (
            <Link
              key={it.id}
              href={`/items/${it.id}`}
              className={`tag ${it.status === "returned" ? "returned" : ""}`}
            >
              <div className="thumb">
                {it.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.image_url} alt={it.name} loading="lazy" />
                ) : (
                  <span aria-hidden>🎒</span>
                )}
              </div>
              <div className="body">
                <span className={`badge ${it.status === "returned" ? "done" : ""}`}>
                  {it.status === "returned" ? "반환 완료" : "보관 중"}
                </span>
                <h2>{it.name}</h2>
                <p className="meta">{it.found_place}에서 발견</p>
                <p className="meta">{it.found_date}</p>
              </div>
            </Link>
          ))}
        </section>
      )}


      <p style={{ marginTop: 48 }}>
        <Link href="/admin" className="meta">관리자</Link>
      </p>
    </main>
  );
}
