import React, { useState } from 'react';
import { CompanyBranding } from '../types/admissions';

interface BrandLogoProps {
  branding: CompanyBranding;
  className?: string;
  imgClassName?: string;
  showSubtitle?: boolean;
}

export const SangdiVectorLogo: React.FC<{ className?: string; width?: number | string; height?: number | string }> = ({
  className = 'h-8 w-auto',
  width,
  height,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 540 140"
      className={className}
      width={width}
      height={height}
      fill="none"
      role="img"
      aria-label="생디 (www.sangdi.net) - 학생부를 디자인하다"
    >
      <defs>
        <linearGradient id="sangdiGradArrow" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="50%" stopColor="#00C0F3" />
          <stop offset="100%" stopColor="#00F0B5" />
        </linearGradient>
        <linearGradient id="sangdiGradDot" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00C0F3" />
          <stop offset="100%" stopColor="#00F0B5" />
        </linearGradient>
        <linearGradient id="sangdiGradBar" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0A3A94" />
          <stop offset="100%" stopColor="#0056D6" />
        </linearGradient>
      </defs>

      {/* Symbol Container (Left side) */}
      <g transform="translate(10, 10)">
        {/* 생 - 왼쪽 사선 바 */}
        <path
          d="M 24 78 L 54 48"
          stroke="url(#sangdiGradBar)"
          strokeWidth="15"
          strokeLinecap="round"
        />

        {/* 생 - 우상향 화살표 (성적 도약) */}
        <path
          d="M 72 66 L 105 33"
          stroke="url(#sangdiGradArrow)"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <path
          d="M 82 28 L 114 28 L 114 60"
          stroke="url(#sangdiGradArrow)"
          strokeWidth="13"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 생 - 'ㅅ' 우측 지지 기둥 */}
        <rect x="92" y="58" width="14" height="26" rx="7" fill="#0C2E75" />

        {/* 생 - 하단 'ㅇ' 받침 타원 */}
        <ellipse
          cx="70"
          cy="98"
          rx="28"
          ry="21"
          fill="none"
          stroke="#0C2E75"
          strokeWidth="14"
        />

        {/* 디 - 'ㄷ' */}
        <path
          d="M 180 44 L 142 44 A 10 10 0 0 0 132 54 L 132 88 A 10 10 0 0 0 142 98 L 180 98"
          fill="none"
          stroke="#0C2E75"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* 디 - 'ㅣ' 세로 기둥 */}
        <line
          x1="208"
          y1="52"
          x2="208"
          y2="104"
          stroke="#0C2E75"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* 디 - 상단 민트 포인트 */}
        <path
          d="M 200 38 L 214 26 A 4 4 0 0 1 220 28 L 220 36 A 4 4 0 0 1 216 40 L 204 42 A 3 3 0 0 1 200 38 Z"
          fill="url(#sangdiGradDot)"
        />
      </g>

      {/* Brand Typography & Slogan */}
      <g transform="translate(248, 22)">
        {/* 학생부를 디자인하다 */}
        <text
          x="0"
          y="48"
          fontFamily="'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif"
          fontSize="31"
          fontWeight="800"
          fill="#0B2768"
          letterSpacing="-0.03em"
        >
          학생부를 디자인하다
        </text>

        {/* Subtitle: AI 기반 학생부 디자인 플랫폼 */}
        <text
          x="1"
          y="76"
          fontFamily="'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif"
          fontSize="13.5"
          fontWeight="600"
          fill="#475569"
          letterSpacing="0.12em"
        >
          AI 기반 학생부 디자인 플랫폼
        </text>

        {/* Web domain: www.sangdi.net */}
        <text
          x="1"
          y="95"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="11.5"
          fontWeight="700"
          fill="#0284C7"
          letterSpacing="0.02em"
        >
          www.sangdi.net
        </text>
      </g>
    </svg>
  );
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  branding,
  className = 'h-9',
  imgClassName = 'max-h-full max-w-[180px] object-contain',
}) => {
  const [imgError, setImgError] = useState(false);

  // If custom logo is set and has not errored, show it
  if (branding.customLogoDataUrl && !imgError) {
    return (
      <img
        src={branding.customLogoDataUrl}
        alt={branding.companyName || '회사 로고'}
        className={imgClassName}
        onError={() => setImgError(true)}
      />
    );
  }

  // Official Sangdi vector logo (never breaks, pure vector SVG)
  return <SangdiVectorLogo className={className} />;
};
