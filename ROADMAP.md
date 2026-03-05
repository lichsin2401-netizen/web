# Studio EIM — 인프라 로드맵

## Phase 1: 배포 기본 ✅ (즉시 적용)

| 서비스 | 역할 | 무료 Tier | 상태 |
|--------|------|-----------|------|
| **GitHub** | 코드 저장 & 버전 관리 | 무제한 public repo | ✅ 커밋 완료 |
| **Vercel** | 글로벌 CDN 배포 | 100GB bandwidth/월 | 🔧 설정 완료 |
| **PostHog** | 유저 행동 분석 & A/B 테스트 | 1M events/월 | 🔧 스크립트 삽입 완료 |
| **Sentry** | 버그 실시간 감지 | 5K errors/월 | 🔧 스크립트 삽입 완료 |

### 실행 방법
```bash
# 1. GitHub Push
cd studio-eim-deploy
git push -u origin main

# 2. Vercel 연동
# → https://vercel.com/new → Import Git Repository
# → lichsin2401-netizen/web 선택 → Deploy

# 3. PostHog 가입 → API Key 발급
# → index.html에서 YOUR_POSTHOG_KEY 교체

# 4. Sentry 가입 → DSN 발급
# → index.html에서 YOUR_SENTRY_DSN 교체
```

---

## Phase 2: 고객 문의 시스템 (30분)

| 서비스 | 역할 | 무료 Tier |
|--------|------|-----------|
| **Supabase** | DB + API + Storage | 500MB DB, 1GB storage |
| **Resend** | 자동 회신 이메일 | 3,000 emails/월 |

### 구현 내용
- 사이트 Contact Form → Supabase DB 저장
- Vercel Edge Function → Resend API로 자동 회신
- 고객에게 "문의 접수 확인" 이메일 즉시 발송
- contact@eim.kr 로 관리자 알림

### DB 스키마 (Supabase)
```sql
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  project_type TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Phase 3: 보안 & 성능 (20분)

| 서비스 | 역할 | 무료 Tier |
|--------|------|-----------|
| **Cloudflare** | DNS + DDoS 방어 + SSL | 무제한 |
| **Upstash** | Redis 캐싱 (API 응답) | 10K commands/일 |
| **Namecheap** | 커스텀 도메인 | ~$12/년 |

### 구현 내용
- Namecheap에서 도메인 구매 (예: studioeim.com)
- Cloudflare DNS 설정 → Vercel 연동
- DDoS 방어 + 자동 SSL
- Upstash Redis로 API 응답 캐싱 (문의 폼 rate limiting)

### 도메인 설정
```
studioeim.com → Vercel (A record)
www.studioeim.com → CNAME → cname.vercel-dns.com
```

---

## Phase 4: 확장 (별도 프로젝트 — Next.js 전환 후)

| 서비스 | 역할 | 무료 Tier |
|--------|------|-----------|
| **Clerk** | 로그인/회원가입 | 10K MAU |
| **Pinecone** | AI 벡터 검색 | 100K vectors |

### 구현 계획

**Clerk — 사내 인트라넷 & 성우 포털**
- 사내 인트라넷: 프로젝트 관리, 일정, 내부 문서
- 성우 포털: 성우들이 직접 샘플 업로드
- SSO 연동, 역할 기반 접근 제어

**Pinecone — AI 보이스 검색**
- 성우 샘플 → 벡터 임베딩
- "부드러운 남성 나레이션" 같은 자연어 검색
- 프로젝트 매칭 추천 시스템

### ⚠️ Next.js 전환 필요
Phase 4는 현재 정적 HTML에서는 불가능하다.
Next.js App Router + Server Components로 전환 후 진행.

```
현재: 정적 HTML (eim-bravo-style.html)
  ↓
Phase 2-3: 정적 HTML + Vercel Edge Functions
  ↓
Phase 4: Next.js 15 App Router (전면 리빌드)
```

---

## 비용 요약

| Phase | 월 비용 | 연 비용 |
|-------|---------|---------|
| Phase 1 | $0 | $0 |
| Phase 2 | $0 | $0 |
| Phase 3 | $1/월 (도메인 분할) | ~$12 (도메인) |
| Phase 4 | $0 (무료 tier) | $0 |
| **합계** | **$1** | **~$12** |

> 모든 서비스가 generous한 무료 tier를 제공하므로,
> 트래픽이 폭발적으로 늘어나기 전까지 사실상 무료로 운영 가능.
