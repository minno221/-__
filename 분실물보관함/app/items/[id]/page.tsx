import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, type Item } from "@/lib/supabase";
import { setStatus } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await supabase.from("items").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const it = data as Item;
  const returned = it.status === "returned";

  return (
    <main className="wrap">
      <Link href="/" className="back">← 목록으로</Link>

      <div className="detail">
        <div className="photo">
          {it.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={it.image_url} alt={it.name} />
          ) : (
            <span aria-hidden>🎒</span>
          )}
        </div>

        <div>
          <span className={`badge ${returned ? "done" : ""}`}>{returned ? "반환 완료" : "보관 중"}</span>
          <h1>{it.name}</h1>

          <dl className="facts">
            <dt>카테고리</dt><dd>{it.category}</dd>
            <dt>습득 장소</dt><dd>{it.found_place}</dd>
            <dt>습득 날짜</dt><dd>{it.found_date}</dd>
            <dt>보관 위치</dt><dd>{it.storage_place}</dd>
            {it.description && (<><dt>특징</dt><dd>{it.description}</dd></>)}
          </dl>

          {returned ? (
            <p className="notice">이 물건은 이미 주인에게 돌아갔어요.</p>
          ) : (
            <p className="notice">
              내 물건이라면 <strong>{it.storage_place}</strong>에 방문해 주세요.
              물건의 특징을 설명하거나 신분증을 보여주면 확인 후 돌려드려요.
            </p>
          )}

          <form action={setStatus} style={{ marginTop: 16 }}>
            <input type="hidden" name="id" value={it.id} />
            <input type="hidden" name="status" value={returned ? "keeping" : "returned"} />
            <button className="btn ghost small" type="submit">
              {returned ? "아직 못 돌려줬어요 (보관 중으로 되돌리기)" : "주인에게 돌려줬어요 (반환 완료)"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
