import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Globe, Layout, Maximize2, Share2, Sparkles, X } from 'lucide-react';

interface WordpressEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl?: string;
}

export const getWordpressEmbedCode = (appUrl = 'https://gradepass.vercel.app/'): string => {
  return `<!-- ================================================================= -->
<!-- [생디 www.sangdi.net] 2028 대입개편 5등급제 내신 계산기 & 수시 합격 예측기 워드프레스 삽입 코드 -->
<!-- 구글 SEO 검색 최적화 & 구조화 데이터 (Schema.org) & 반응형 와이드 뷰포트 내장 -->
<!-- ================================================================= -->

<div id="sangdi-gradepass-wrapper" class="sangdi-embed-container" style="width:100%;max-width:1400px;margin:32px auto;font-family:-apple-system,BlinkMacSystemFont,'Noto Sans KR',sans-serif;box-sizing:border-box;">
  
  <!-- 1. 상단 브랜딩 & 반응형 제어 툴바 -->
  <div style="background:#0F172A;color:#FFFFFF;border-radius:12px 12px 0 0;padding:14px 18px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:12px;box-shadow:0 2px 8px rgba(0,0,0,0.12);">
    <div style="display:flex;align-items:center;gap:10px;">
      <a href="https://www.sangdi.net" target="_blank" rel="noopener" style="text-decoration:none;display:flex;align-items:center;gap:8px;" title="생디 공식 웹사이트 (www.sangdi.net)">
        <span style="background:linear-gradient(135deg,#0056D6,#00C0F3);color:#fff;font-weight:900;padding:3px 8px;border-radius:6px;font-size:12px;letter-spacing:0.02em;">생디</span>
        <strong style="color:#FFFFFF;font-size:14px;letter-spacing:-0.02em;">학생부를 디자인하다</strong>
      </a>
      <span style="color:#64748B;font-size:13px;">|</span>
      <span style="color:#94A3B8;font-size:12px;font-weight:500;">2028 대입개편 5·9등급제 수시 합격 예측기</span>
    </div>

    <div style="display:flex;align-items:center;gap:8px;">
      <button type="button" onclick="toggleSangdiFullscreen()" style="background:#1E293B;color:#F8FAFC;border:1px solid #334155;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:4px;transition:all 0.2s;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        전체화면으로 크게 보기
      </button>
      <a href="${appUrl}" target="_blank" rel="noopener" style="background:#2563EB;color:#FFFFFF;padding:6px 12px;border-radius:6px;font-size:12px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:4px;">
        새 창에서 열기 ↗
      </a>
    </div>
  </div>

  <!-- 2. 반응형 아이프레임 (가로 넓은 화면 & 충분한 세로 길이 확보) -->
  <div id="sangdi-iframe-box" style="position:relative;width:100%;height:1200px;min-height:85vh;background:#F8FAFC;border:1px solid #CBD5E1;border-top:none;border-radius:0 0 12px 12px;overflow:hidden;box-shadow:0 12px 28px -6px rgba(15,23,42,0.12);">
    <iframe 
      id="sangdi-gradepass-frame"
      src="${appUrl}" 
      title="입시 내비게이터 - 2028 대입 5등급제 내신 계산기 (생디 www.sangdi.net)"
      style="width:100%;height:100%;border:0;display:block;"
      loading="lazy"
      allow="clipboard-write; fullscreen"
    ></iframe>
  </div>

  <!-- 3. 구글 검색엔진 최적화(SEO) 및 생디(www.sangdi.net) 홍보 텍스트 (구글 크롤러 색인 영역) -->
  <section style="margin-top:20px;padding:20px;background:#F1F5F9;border-radius:10px;border:1px solid #E2E8F0;font-size:13px;line-height:1.65;color:#334155;">
    <h3 style="margin:0 0 8px 0;font-size:15px;font-weight:700;color:#0F172A;">
      💡 2028 대입개편 5등급제 내신 계산기 & 수시 학생부교과 합격 예측 서비스 안내
    </h3>
    <p style="margin:0 0 10px 0;">
      본 진학 분석 프로그램은 <strong>생디(<a href="https://www.sangdi.net" target="_blank" rel="noopener" style="color:#0284C7;font-weight:700;text-decoration:underline;">www.sangdi.net</a>)</strong> 플랫폼에서 공식 개발한 2028 대입개편 통합 입시 내비게이터입니다. 
      고1, 고2, 고3 학년별 5등급제 내신 성적을 입력하면 기존 9등급제로 실시간 정밀 환산되며, 
      대입정보포털 어디가(adiga.kr) 및 대학교 입학처가 공식 공시한 <strong>2024학년도(재작년) 및 2025학년도(작년) 2개년 수시 학생부교과 70% 컷 입결</strong>과 즉시 대조 분석합니다.
    </p>
    <div style="display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:8px;font-size:12px;color:#475569;">
      <span>✓ <strong>고1·고2·고3 1학기·2학기 분리 입력:</strong> 학기별 가중평균 및 전학년 누적 성적 완벽 자동 집계</span>
      <span>✓ <strong>희망 학과 직접 입력:</strong> 간호학과, 컴퓨터공학과, 경영학과 등 원하는 학과명을 자유롭게 직접 입력하여 실시간 분석</span>
      <span>✓ <strong>상향·적정·안정 판정:</strong> 희망 학과 및 유사 학과 2개년 공식 입결(70% 컷) 정밀 대조</span>
      <span>✓ <strong>맞춤 전략 리포트:</strong> 내신 등급 도약 전략 과목 추천 및 PDF/HTML 다운로드 제공</span>
    </div>
    <div style="margin-top:12px;padding-top:10px;border-top:1px dashed #CBD5E1;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
      <span style="font-size:12px;color:#64748B;">제작 플랫폼: <strong>생디 (학생부를 디자인하다)</strong> · 공식 웹사이트: <a href="https://www.sangdi.net" target="_blank" rel="noopener" style="color:#0284C7;font-weight:700;">www.sangdi.net</a></span>
      <span style="font-size:12px;color:#64748B;">단독 웹앱 실행: <a href="${appUrl}" target="_blank" rel="noopener" style="color:#2563EB;font-weight:700;">${appUrl}</a></span>
    </div>
  </section>

  <!-- 4. 구글 Schema.org 구조화 데이터 (JSON-LD) - 구글 검색 리치 스니펫 지원 -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "입시 내비게이터 - 2028 대입개편 5등급제 내신 계산기",
        "alternateName": "생디 수시 합격 예측기",
        "url": "${appUrl}",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All",
        "description": "2028 대입개편 5등급제 내신을 9등급제로 환산하고 2024·2025 수시 교과 70% 컷 입결을 바탕으로 합격 가능성을 분석하는 입시 컨설팅 프로그램",
        "publisher": {
          "@type": "Organization",
          "name": "생디 (Sangdi)",
          "url": "https://www.sangdi.net"
        }
      },
      {
        "@type": "Organization",
        "name": "생디",
        "url": "https://www.sangdi.net",
        "description": "학생부를 디자인하다 · AI 기반 학생부 디자인 플랫폼"
      }
    ]
  }
  </script>

  <!-- 5. 전체화면 토글 및 반응형 보정 자바스크립트 -->
  <script>
  function toggleSangdiFullscreen() {
    var box = document.getElementById('sangdi-iframe-box');
    if (!box) return;
    if (!document.fullscreenElement) {
      if (box.requestFullscreen) {
        box.requestFullscreen();
      } else if (box.webkitRequestFullscreen) {
        box.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  </script>
</div>
`;
};

export const WordpressEmbedModal: React.FC<WordpressEmbedModalProps> = ({
  isOpen,
  onClose,
  appUrl = 'https://gradepass.vercel.app/',
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'guide'>('code');

  if (!isOpen) return null;

  const embedCode = getWordpressEmbedCode(appUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* 모달 헤더 */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                워드프레스(WordPress) 삽입 전용 HTML 코드 생성기
                <span className="text-[11px] font-semibold bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/30">
                  구글 SEO &amp; 와이드 뷰포트 최적화
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                워드프레스 본문에 삽입 시 잘림 없이 넓고 길게 시원하게 출력되며, 구글 검색 노출을 돕는 코드입니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'code'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              삽입용 HTML 코드 복사
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'guide'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              워드프레스 삽입 방법 안내 (3단계)
            </button>
          </div>

          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1 mb-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {appUrl}
          </a>
        </div>

        {/* 본문 컨텐츠 */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'code' ? (
            <div className="space-y-4">
              {/* 핵심 특징 4가지 배너 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
                  <div className="font-bold text-blue-900 mb-1">① 와이드 &amp; 넉넉한 높이</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    가로 1400px 풀 와이드 지원 및 높이 1200px(최소 85vh) 설정으로 두 겹 스크롤 현상을 최소화했습니다.
                  </p>
                </div>
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                  <div className="font-bold text-emerald-900 mb-1">② 전체화면 확장 버튼</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    상단 툴바에 '전체화면으로 크게 보기' 버튼이 탑재되어 모바일과 PC 모두 한 화면 가득 볼 수 있습니다.
                  </p>
                </div>
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <div className="font-bold text-amber-900 mb-1">③ 구글 검색엔진 최적화</div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    구글 크롤러가 색인할 수 있는 본문 텍스트 + Schema.org 구조화 데이터 + 생디(sangdi.net) 백링크를 완비했습니다.
                  </p>
                </div>
              </div>

              {/* 코드 블록 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    워드프레스 '사용자 정의 HTML' 블록에 붙여넣을 완성 코드:
                  </label>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? '복사 완료!' : 'HTML 전체 복사'}
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    readOnly
                    value={embedCode}
                    rows={12}
                    className="w-full font-mono text-[11.5px] p-3.5 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
                  >
                    {copied ? '복사됨 ✓' : '코드 복사'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  📌 워드프레스(WordPress) 글 / 페이지에 삽입하는 3단계 순서
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-700">
                  <li>
                    <strong>워드프레스 관리자</strong>에 로그인 후, 글(Posts) 또는 페이지(Pages) 편집 화면으로 이동합니다.
                  </li>
                  <li>
                    블록 추가 버튼(<strong>+</strong>)을 누르고 <strong>'사용자 정의 HTML'</strong> (Custom HTML) 블록을 추가합니다.
                  </li>
                  <li>
                    위의 <strong>'HTML 전체 복사'</strong> 버튼을 클릭하여 복사한 코드를 해당 블록에 그대로 붙여넣고 [발행/업데이트]합니다.
                  </li>
                </ol>
              </div>

              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900">
                  💡 워드프레스 테마가 페이지 가로폭을 좁게 제한하는 경우 팁
                </h4>
                <p>
                  워드프레스 테마(Astra, GeneratePress, OceanWP 등)에서 페이지 템플릿을 설정할 수 있습니다.
                  글/페이지 우측 설정 패널의 <strong>[템플릿]</strong> 옵션에서 <strong>'전체 너비' (Full Width / No Sidebar)</strong>를 선택하시면 화면 전체에 꽉 차게 출력됩니다.
                </p>
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-900">
                  🔍 구글 검색 홍보(SEO) 효과
                </h4>
                <p>
                  아이프레임 내부뿐 아니라, 삽입 코드 하단에 <strong>구글 크롤러가 직접 읽을 수 있는 키워드 텍스트</strong>와 <strong>Schema.org 구조화 데이터(JSON-LD)</strong>가 함께 삽입됩니다. 
                  이를 통해 구글 검색창에서 <em>'2028 대입 5등급제 내신 계산기'</em>, <em>'생디'</em>, <em>'수시 학생부교과 합격선'</em> 검색 시 해당 워드프레스 포스팅과 생디 사이트가 상위에 노출되도록 돕습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 모달 푸터 */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            앱 URL: <strong className="text-slate-800 font-mono">{appUrl}</strong> · 제작: 생디 (www.sangdi.net)
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '복사 완료' : '워드프레스 코드 복사'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
