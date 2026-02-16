# 🍜 Ramen Blog

오사카에서 먹은 라멘들을 기록하는 개인 블로그입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS v4
- **Image Storage**: Vercel Blob
- **Image Compression**: browser-image-compression

## 주요 기능

- ✅ 라멘 가게 기록 (CRUD)
- ✅ 구글맵 링크 연동
- ✅ 동적 카테고리 관리
- ✅ 태그 시스템
- ✅ 이미지 업로드 및 압축
- ✅ 관리자 인증
- ✅ SEO (sitemap.xml)
- ✅ 반응형 디자인

## 시작하기

### 1. 저장소 클론

\`\`\`bash
git clone <your-repo>
cd ramen-blog
\`\`\`

### 2. 패키지 설치

\`\`\`bash
npm install
\`\`\`

### 3. 환경변수 설정

\`.env.example\`을 복사해서 \`.env\` 파일을 만들고 설정합니다:

\`\`\`bash
cp .env.example .env
\`\`\`

\`.env\` 파일 내용:

\`\`\`env
# Neon PostgreSQL 데이터베이스 URL
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require&schema=ramen"

# 관리자 비밀번호 (원하는 값으로 변경)
ADMIN_PASSWORD="your-secure-password"

# Vercel Blob Token (Vercel 대시보드에서 생성)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"

# 배포 URL (로컬에서는 localhost:3000)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Google Analytics (선택사항)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Disqus 댓글 (선택사항)
NEXT_PUBLIC_DISQUS_SHORTNAME="your-disqus-shortname"
\`\`\`

### 4. 데이터베이스 설정

#### Neon PostgreSQL 생성

1. [Neon](https://neon.tech) 가입
2. 새 프로젝트 생성
3. Connection String 복사
4. \`.env\`의 \`DATABASE_URL\`에 붙여넣기
5. URL 끝에 \`?schema=ramen\` 추가

#### Prisma 마이그레이션

\`\`\`bash
# Prisma Client 생성
npx prisma generate

# 데이터베이스 스키마 생성
npx prisma migrate dev --name init

# (선택) Prisma Studio로 데이터베이스 확인
npx prisma studio
\`\`\`

### 5. Vercel Blob 설정 (이미지 업로드용)

1. [Vercel](https://vercel.com) 대시보드 접속
2. Storage → Blob → Create
3. Token 복사
4. \`.env\`의 \`BLOB_READ_WRITE_TOKEN\`에 붙여넣기

### 6. Google Analytics 설정 (선택사항)

1. [Google Analytics](https://analytics.google.com) 접속
2. 새 속성 생성
3. 측정 ID (G-XXXXXXXXXX) 복사
4. \`.env\`의 \`NEXT_PUBLIC_GA_ID\`에 붙여넣기

### 7. Disqus 댓글 설정 (선택사항)

1. [Disqus](https://disqus.com) 가입 및 로그인
2. "Get Started" → "I want to install Disqus on my site"
3. Website Name 입력 (shortname이 됨)
4. \`.env\`의 \`NEXT_PUBLIC_DISQUS_SHORTNAME\`에 입력

### 8. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 http://localhost:3000 열기

## 사용 방법

### 관리자 로그인

1. http://localhost:3000/admin/login 접속
2. \`.env\`에 설정한 \`ADMIN_PASSWORD\` 입력
3. 로그인

### 카테고리 추가

1. 관리자 대시보드에서 "카테고리 관리" 클릭
2. 원하는 카테고리 추가 (예: 돈코츠, 쇼유, 미소, 시오, 탄탄멘 등)

### 라멘 추가

1. 관리자 대시보드에서 "+ 새 라멘 추가" 클릭
2. 폼 작성:
   - **가게 이름**: 라멘 가게 이름
   - **주소**: 가게 주소
   - **구글맵 링크**: 
     - 구글맵 앱/웹 열기
     - 가게 검색
     - "공유" 버튼 → "링크 복사"
     - 폼에 붙여넣기
   - **카테고리**: 미리 추가한 카테고리 선택
   - **평점**: 0-5 (0.5 단위)
   - **가격**: 엔화 가격
   - **방문일**: 날짜 선택
   - **맛 평가**: 자유롭게 작성
   - **추가 메모**: 선택사항
   - **커버 이미지**: 이미지 업로드 (자동 압축됨)
   - **태그**: 자유롭게 추가 (예: 오사카, 진한국물, 재방문의사 등)
3. "저장하기" 클릭

## 구글맵 링크 복사 방법

### 모바일 (구글맵 앱)
1. 구글맵 앱 열기
2. 가게 검색 및 선택
3. "공유" 버튼 탭
4. "링크 복사" 탭
5. 관리자 폼에 붙여넣기

### PC (구글맵 웹)
1. https://maps.google.com 접속
2. 가게 검색 및 선택
3. "공유" 버튼 클릭
4. "링크 복사" 클릭
5. 관리자 폼에 붙여넣기

**예시 링크**: \`https://maps.app.goo.gl/ABC123xyz\`

## 배포 (Vercel)

### 1. GitHub에 푸시

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
\`\`\`

### 2. Vercel에 배포

1. [Vercel](https://vercel.com) 접속
2. "New Project" 클릭
3. GitHub 저장소 선택
4. 환경변수 설정:
   - \`DATABASE_URL\`
   - \`ADMIN_PASSWORD\`
   - \`BLOB_READ_WRITE_TOKEN\`
   - \`NEXT_PUBLIC_BASE_URL\` (배포 후 도메인으로 설정)
5. "Deploy" 클릭

### 3. 배포 후 설정

배포가 완료되면:
1. Vercel에서 도메인 확인 (예: \`your-app.vercel.app\`)
2. 환경변수에서 \`NEXT_PUBLIC_BASE_URL\`을 배포 도메인으로 업데이트
3. \`public/robots.txt\`의 Sitemap URL 업데이트

## 프로젝트 구조

\`\`\`
ramen-blog/
├── app/
│   ├── admin/              # 관리자 페이지
│   │   ├── _components/    # RamenForm 컴포넌트
│   │   ├── categories/     # 카테고리 관리
│   │   ├── login/          # 로그인 페이지
│   │   ├── ramen/          # 라멘 CRUD
│   │   └── page.tsx        # 대시보드
│   ├── api/                # API 라우트
│   │   ├── admin/          # 인증 API
│   │   ├── categories/     # 카테고리 API
│   │   ├── ramens/         # 라멘 API
│   │   ├── tags/           # 태그 API
│   │   └── upload/         # 이미지 업로드 API
│   ├── blog/               # 전체 라멘 목록
│   ├── ramen/[slug]/       # 라멘 상세 페이지
│   ├── about/              # About 페이지
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 홈페이지
│   └── sitemap.ts          # SEO Sitemap
├── components/             # 재사용 컴포넌트
│   ├── Header.tsx
│   └── RamenCard.tsx
├── lib/
│   └── prisma.ts           # Prisma Client
├── prisma/
│   ├── schema.prisma       # 데이터베이스 스키마
│   └── seed-categories.ts
├── public/
│   └── robots.txt
└── middleware.ts           # 관리자 인증
\`\`\`

## 데이터베이스 스키마

### Ramen
- 가게 정보 (이름, 주소, 구글맵 링크)
- 카테고리
- 평점, 가격, 방문일
- 맛 평가, 메모
- 커버 이미지
- 태그 (다대다 관계)

### Category
- 동적으로 관리자가 추가하는 카테고리

### Tag
- 자유롭게 추가할 수 있는 태그

## 라이선스

MIT

## 작성자

Bufgix - [@hellowin6076](https://github.com/hellowin6076)
