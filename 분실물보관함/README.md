# 분실물 보관함 (설치 없이 배포하기)

내 컴퓨터에 아무것도 설치하지 않고, 웹사이트만으로 배포하는 방법이에요.

## 1. Supabase (데이터 저장소)
1. https://supabase.com 가입 → New project 만들기
2. 왼쪽 메뉴 SQL Editor → `supabase.sql` 내용을 붙여넣고 Run
3. Project Settings → API 에서 두 값을 메모장에 복사
   - Project URL  → SUPABASE_URL
   - service_role 키 → SUPABASE_SERVICE_ROLE_KEY (비밀! 남에게 보여주지 마세요)

## 2. GitHub (파일 올리기)
1. 압축(zip)을 풀어요 (윈도우 기본 기능으로 가능)
2. github.com 에서 New repository → 이름 `lost-found` → Create
3. "uploading an existing file" 링크 클릭
4. 풀어놓은 폴더 **안의 내용물 전체**(app, lib, package.json, tsconfig.json 등)를 끌어다 놓기
   - `lost-found` 폴더째가 아니라 그 안의 파일들을 올려야 해요
5. Commit changes

## 3. Vercel (사이트 공개)
1. Add New → Project → `lost-found` Import
2. Application Preset 이 **Next.js** 로 나오는지 확인
3. Environment Variables 에 2개 입력
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
4. Deploy
