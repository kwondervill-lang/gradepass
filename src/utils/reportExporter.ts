import {
  CompanyBranding,
  DepartmentTrack,
  EvaluatedUniversityRecord,
  HighSchoolGrade,
  Semester,
  SubjectEntry,
  SubjectStudyStrategy,
} from '../types/admissions';
import {
  ReachGoalAnalysis,
  StudentGPASummary,
  getSubjectGrade9,
} from './admissionsAnalyzer';

export interface FullReportPayload {
  studentName: string;
  grade: HighSchoolGrade;
  semester: Semester;
  track: DepartmentTrack;
  subjects: SubjectEntry[];
  gpaSummary: StudentGPASummary;
  reachList: EvaluatedUniversityRecord[];
  targetList: EvaluatedUniversityRecord[];
  safetyList: EvaluatedUniversityRecord[];
  reachGoal: ReachGoalAnalysis;
  strategies: SubjectStudyStrategy[];
  simulatedTop3Avg5: number;
  simulatedTop3Avg9: number;
  simulatedTotalGain9: number;
  branding: CompanyBranding;
  generatedDate: string;
}

// 생디 (www.sangdi.net) 공식 벡터 SVG 인라인 마크업 생성기 (학생부를 디자인하다 · AI 기반 학생부 디자인 플랫폼)
export function getSangdiInlineSvgString(heightPx = 44): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 140" style="height:${heightPx}px;width:auto;display:inline-block;vertical-align:middle;" fill="none" role="img" aria-label="생디 (www.sangdi.net) - 학생부를 디자인하다">
    <defs>
      <linearGradient id="sangdiExportArrow" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0066FF"/>
        <stop offset="50%" stop-color="#00C0F3"/>
        <stop offset="100%" stop-color="#00F0B5"/>
      </linearGradient>
      <linearGradient id="sangdiExportDot" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00C0F3"/>
        <stop offset="100%" stop-color="#00F0B5"/>
      </linearGradient>
      <linearGradient id="sangdiExportBar" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0A3A94"/>
        <stop offset="100%" stop-color="#0056D6"/>
      </linearGradient>
    </defs>
    <g transform="translate(10, 10)">
      <path d="M 24 78 L 54 48" stroke="url(#sangdiExportBar)" stroke-width="15" stroke-linecap="round"/>
      <path d="M 72 66 L 105 33" stroke="url(#sangdiExportArrow)" stroke-width="13" stroke-linecap="round"/>
      <path d="M 82 28 L 114 28 L 114 60" stroke="url(#sangdiExportArrow)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="92" y="58" width="14" height="26" rx="7" fill="#0C2E75"/>
      <ellipse cx="70" cy="98" rx="28" ry="21" fill="none" stroke="#0C2E75" stroke-width="14"/>
      <path d="M 180 44 L 142 44 A 10 10 0 0 0 132 54 L 132 88 A 10 10 0 0 0 142 98 L 180 98" fill="none" stroke="#0C2E75" stroke-width="14" stroke-linecap="round"/>
      <line x1="208" y1="52" x2="208" y2="104" stroke="#0C2E75" stroke-width="14" stroke-linecap="round"/>
      <path d="M 200 38 L 214 26 A 4 4 0 0 1 220 28 L 220 36 A 4 4 0 0 1 216 40 L 204 42 A 3 3 0 0 1 200 38 Z" fill="url(#sangdiExportDot)"/>
    </g>
    <g transform="translate(248, 22)">
      <text x="0" y="48" font-family="'Noto Sans KR', sans-serif" font-size="31" font-weight="800" fill="#0B2768" letter-spacing="-0.03em">학생부를 디자인하다</text>
      <text x="1" y="76" font-family="'Noto Sans KR', sans-serif" font-size="13.5" font-weight="600" fill="#475569" letter-spacing="0.12em">AI 기반 학생부 디자인 플랫폼</text>
      <text x="1" y="95" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" fill="#0284C7" letter-spacing="0.02em">www.sangdi.net</text>
    </g>
  </svg>`;
}

// 생디 (www.sangdi.net) 공식 벡터 SVG 로고 데이터 URL 생성기
export function getSangdiLogoSvgDataUrl(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="140" viewBox="0 0 540 140" fill="none">
    <defs>
      <linearGradient id="sangdiDataArrow" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0066FF"/>
        <stop offset="50%" stop-color="#00C0F3"/>
        <stop offset="100%" stop-color="#00F0B5"/>
      </linearGradient>
      <linearGradient id="sangdiDataDot" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00C0F3"/>
        <stop offset="100%" stop-color="#00F0B5"/>
      </linearGradient>
      <linearGradient id="sangdiDataBar" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0A3A94"/>
        <stop offset="100%" stop-color="#0056D6"/>
      </linearGradient>
    </defs>
    <g transform="translate(10, 10)">
      <path d="M 24 78 L 54 48" stroke="url(#sangdiDataBar)" stroke-width="15" stroke-linecap="round"/>
      <path d="M 72 66 L 105 33" stroke="url(#sangdiDataArrow)" stroke-width="13" stroke-linecap="round"/>
      <path d="M 82 28 L 114 28 L 114 60" stroke="url(#sangdiDataArrow)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="92" y="58" width="14" height="26" rx="7" fill="#0C2E75"/>
      <ellipse cx="70" cy="98" rx="28" ry="21" fill="none" stroke="#0C2E75" stroke-width="14"/>
      <path d="M 180 44 L 142 44 A 10 10 0 0 0 132 54 L 132 88 A 10 10 0 0 0 142 98 L 180 98" fill="none" stroke="#0C2E75" stroke-width="14" stroke-linecap="round"/>
      <line x1="208" y1="52" x2="208" y2="104" stroke="#0C2E75" stroke-width="14" stroke-linecap="round"/>
      <path d="M 200 38 L 214 26 A 4 4 0 0 1 220 28 L 220 36 A 4 4 0 0 1 216 40 L 204 42 A 3 3 0 0 1 200 38 Z" fill="url(#sangdiDataDot)"/>
    </g>
    <g transform="translate(248, 22)">
      <text x="0" y="48" font-family="'Noto Sans KR', sans-serif" font-size="31" font-weight="800" fill="#0B2768" letter-spacing="-0.03em">학생부를 디자인하다</text>
      <text x="1" y="76" font-family="'Noto Sans KR', sans-serif" font-size="13.5" font-weight="600" fill="#475569" letter-spacing="0.12em">AI 기반 학생부 디자인 플랫폼</text>
      <text x="1" y="95" font-family="'JetBrains Mono', monospace" font-size="11.5" font-weight="700" fill="#0284C7" letter-spacing="0.02em">www.sangdi.net</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateStandaloneReportHTML(payload: FullReportPayload): string {
  const {
    studentName,
    grade,
    semester,
    track,
    subjects,
    gpaSummary,
    reachList,
    targetList,
    safetyList,
    reachGoal,
    strategies,
    simulatedTop3Avg5,
    simulatedTop3Avg9,
    simulatedTotalGain9,
    branding,
    generatedDate,
  } = payload;

  const logoSrc = branding.customLogoDataUrl || getSangdiLogoSvgDataUrl();

  const renderUnivRows = (list: EvaluatedUniversityRecord[], badgeLabel: string, colorHex: string) =>
    list
      .slice(0, 8)
      .map(
        (u) => `
      <tr>
        <td style="font-weight:700;color:${colorHex};">${badgeLabel}</td>
        <td style="font-weight:700;color:#0F172A;">${escapeXml(u.university)} <span style="font-size:10px;color:#64748B;">(${escapeXml(
          u.region
        )})</span></td>
        <td>${escapeXml(u.department)} <span style="color:#64748B;font-size:11px;">· ${escapeXml(
          u.matchType
        )}</span></td>
        <td style="color:#475569;font-size:11px;">${escapeXml(u.admissionType)}</td>
        <td style="text-align:right;font-family:monospace;font-weight:600;">${u.cutoff2024_9.toFixed(2)}</td>
        <td style="text-align:right;font-family:monospace;font-weight:600;">${u.cutoff2025_9.toFixed(2)}</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#1D4ED8;">${u.avgCutoff9.toFixed(
          2
        )} <span style="color:#64748B;font-weight:400;font-size:11px;">(5등급 ${u.equivalentCutoff5.toFixed(2)})</span></td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:${
          u.gap9 > 0 ? '#D97706' : '#059669'
        };">${u.gap9 > 0 ? `+${u.gap9.toFixed(2)} 부족` : `${u.gap9.toFixed(2)} 여유`}</td>
        <td style="font-size:11px;color:#475569;">${escapeXml(u.csatMinimum)} (충원율 ${u.replenishRate2025}%)</td>
      </tr>`
      )
      .join('');

  const subjectRows = subjects
    .map((s) => {
      const g9 = getSubjectGrade9(s);
      const gradeBadge = s.gradeLevel
        ? `<span style="display:inline-block;padding:1px 6px;background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;border-radius:4px;font-size:10px;font-weight:700;margin-right:6px;">${escapeXml(
            s.gradeLevel
          )}</span>`
        : '';
      return `
      <tr>
        <td>${gradeBadge}${escapeXml(s.group)}</td>
        <td style="font-weight:600;color:#0F172A;">${escapeXml(s.name)}</td>
        <td style="text-align:right;font-family:monospace;">${s.credits}학점</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#1D4ED8;">${s.grade5}등급 (${s.subBand})</td>
        <td style="text-align:right;font-family:monospace;font-weight:700;color:#0F172A;">${g9.toFixed(2)}등급</td>
      </tr>`;
    })
    .join('');

  const strategyCards = strategies
    .slice(0, 4)
    .map(
      (st) => `
    <div style="border:1px solid #E2E8F0;border-radius:8px;padding:14px;margin-bottom:10px;background:#FFFFFF;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
        <div style="font-weight:700;font-size:14px;color:#0F172A;">
          0${st.priorityRank}. ${escapeXml(st.subjectName)} <span style="font-weight:500;color:#64748B;font-size:12px;">(${escapeXml(
        st.group
      )} · ${st.credits}학점${st.isMajorCore ? ' · 전공핵심' : ''})</span>
        </div>
        <div style="font-family:monospace;font-size:12px;font-weight:700;color:#1D4ED8;">
          현재 5등급제 ${st.currentGrade5}등급(${st.currentGrade9.toFixed(2)}) → 목표 ${
        st.targetGrade5
      }등급(${st.targetGrade9.toFixed(2)}) · 전체평균 -${st.expectedGrade9Improvement.toFixed(2)}등급 상승효과
        </div>
      </div>
      <p style="margin:4px 0;font-size:12px;color:#334155;line-height:1.5;"><strong>선정 사유:</strong> ${escapeXml(
        st.reasonSummary
      )}</p>
      <p style="margin:4px 0;font-size:12px;color:#334155;line-height:1.5;"><strong>지필·내신 전략:</strong> ${escapeXml(
        st.examStrategy
      )}</p>
      <p style="margin:4px 0;font-size:12px;color:#334155;line-height:1.5;"><strong>세특·수행 전략:</strong> ${escapeXml(
        st.performanceAndSeteukStrategy
      )} · <strong>주간 루틴:</strong> ${escapeXml(st.weeklyActionPlan)}</p>
    </div>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>${escapeXml(studentName)} 학생 — 입시 내비게이터 (생디 www.sangdi.net)</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px;
      font-family: 'Noto Sans KR', -apple-system, sans-serif;
      background: #F8FAFC;
      color: #0F172A;
      line-height: 1.5;
    }
    .report-container {
      max-width: 1060px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0F172A;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 28px;
    }
    .kpi-box {
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 14px 16px;
      background: #F8FAFC;
    }
    .kpi-label { font-size: 12px; color: #64748B; margin-bottom: 4px; }
    .kpi-value { font-size: 22px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #0F172A; }
    h2 {
      font-size: 16px;
      font-weight: 700;
      color: #0F172A;
      margin: 28px 0 12px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid #E2E8F0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      margin-bottom: 20px;
    }
    th {
      background: #F1F5F9;
      color: #334155;
      font-weight: 600;
      text-align: left;
      padding: 9px 10px;
      border-top: 1px solid #CBD5E1;
      border-bottom: 1px solid #CBD5E1;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #E2E8F0;
    }
    .goal-banner {
      border: 1px solid #BFDBFE;
      background: #EFF6FF;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 20px;
    }
    .footer {
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #64748B;
    }
    .sangdi-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      color: #0284C7;
      text-decoration: none;
    }
    @media print {
      body { background: #FFFFFF; padding: 0; }
      .report-container { border: none; padding: 16px; max-width: 100%; }
      .no-print-btn { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="no-print-btn" style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:16px;">
      <a href="https://www.sangdi.net" target="_blank" rel="noopener noreferrer" style="padding:8px 16px;background:#F1F5F9;color:#0F172A;border-radius:6px;font-weight:600;text-decoration:none;font-size:12px;">생디 (www.sangdi.net) 방문</a>
      <button onclick="window.print()" style="padding:8px 16px;background:#1D4ED8;color:#FFFFFF;border:none;border-radius:6px;font-weight:600;cursor:pointer;">리포트 인쇄 / PDF 저장</button>
    </div>
    <div class="header">
      <div>
        <div style="font-size:12px;color:#1D4ED8;font-weight:700;margin-bottom:4px;">${escapeXml(
          branding.reportSubtitle
        )}</div>
        <h1 style="margin:0;font-size:24px;font-weight:700;color:#0F172A;">${escapeXml(
          studentName
        )} 학생 · ${escapeXml(grade)} ${escapeXml(semester)} 수시 학생부교과 진학분석 리포트</h1>
        <div style="font-size:13px;color:#475569;margin-top:6px;">
          희망 학과: <strong>${escapeXml(track.name)}</strong> · 유사 분석 학과: ${escapeXml(
    track.relatedDepartments.join(', ')
  )}
        </div>
      </div>
      <div style="text-align:right;">
        ${branding.customLogoDataUrl
          ? `<img src="${branding.customLogoDataUrl}" alt="${escapeXml(branding.companyName)}" style="height:48px;max-width:240px;object-fit:contain;" />`
          : `<a href="https://www.sangdi.net" target="_blank" rel="noopener noreferrer" style="text-decoration:none;display:inline-block;">${getSangdiInlineSvgString(48)}</a>`}
        <div style="font-size:11px;color:#64748B;margin-top:4px;">
          플랫폼: <strong>생디</strong> (<a href="https://www.sangdi.net" target="_blank" class="sangdi-badge">www.sangdi.net</a>) · 발행일: ${escapeXml(
    generatedDate
  )}
        </div>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-box">
        <div class="kpi-label">5등급제 가중평균 내신</div>
        <div class="kpi-value" style="color:#1D4ED8;">${gpaSummary.avg5.toFixed(2)}등급</div>
        <div style="font-size:11px;color:#64748B;margin-top:2px;">총 ${gpaSummary.subjectCount}과목 · ${
    gpaSummary.totalCredits
  }학점 이수</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-label">9등급제 환산 내신 평균</div>
        <div class="kpi-value">${gpaSummary.avg9.toFixed(2)}등급</div>
        <div style="font-size:11px;color:#64748B;margin-top:2px;">국영수사과 9등급제 ${gpaSummary.coreAvg9.toFixed(
          2
        )}등급 · 상위 ${gpaSummary.estimatedTopPercent}%</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-label">상향대학 합격 목표 등급</div>
        <div class="kpi-value" style="color:#D97706;">${reachGoal.targetCutoff9.toFixed(
          2
        )}등급 <span style="font-size:13px;">(5등급 ${reachGoal.targetCutoff5.toFixed(2)})</span></div>
        <div style="font-size:11px;color:#64748B;margin-top:2px;">${escapeXml(
          reachGoal.targetUniversityName
        )} ${escapeXml(reachGoal.targetDepartmentName)} 기준</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-label">상향 합격을 위한 필요 상승폭</div>
        <div class="kpi-value" style="color:#059669;">-${reachGoal.requiredImprovement9.toFixed(
          2
        )}등급 <span style="font-size:13px;">(5등급 -${reachGoal.requiredImprovement5.toFixed(2)})</span></div>
        <div style="font-size:11px;color:#64748B;margin-top:2px;">남은 ${
          reachGoal.remainingSemesters
        }개 학기 평균 ${reachGoal.requiredFutureSemesterAvg9.toFixed(2)}등급 목표</div>
      </div>
    </div>

    <h2>01. 입력 교과목 5등급제 성적 및 9등급제 정밀 환산 결과</h2>
    <table>
      <thead>
        <tr>
          <th>교과군</th>
          <th>과목명</th>
          <th style="text-align:right;">이수 학점</th>
          <th style="text-align:right;">5등급제 성적 (세부구간)</th>
          <th style="text-align:right;">9등급제 환산 등급</th>
        </tr>
      </thead>
      <tbody>
        ${subjectRows}
      </tbody>
    </table>

    <h2>02. 희망 학과 및 유사 학과 수시 학생부교과 2개년(2024·2025) 공식 입결 분석 및 지원 가능 대학</h2>
    <p style="font-size:11px;color:#64748B;margin:-6px 0 10px 0;">* 대입정보포털 어디가(adiga.kr) 및 각 대학교 공식 발표 70% Cut 최종등록자 성적 기준입니다.</p>
    <table>
      <thead>
        <tr>
          <th>지원판정</th>
          <th>대학명</th>
          <th>모집단위 (학과구분)</th>
          <th>전형유형</th>
          <th style="text-align:right;">2024 70%컷</th>
          <th style="text-align:right;">2025 70%컷</th>
          <th style="text-align:right;">2개년 평균컷 (5등급 환산)</th>
          <th style="text-align:right;">학생성적 대비</th>
          <th>수능최저학력기준 및 충원율</th>
        </tr>
      </thead>
      <tbody>
        ${renderUnivRows(reachList, '▲ 상향지원', '#D97706')}
        ${renderUnivRows(targetList, '● 적정지원', '#0284C7')}
        ${renderUnivRows(safetyList, '◆ 안정지원', '#059669')}
      </tbody>
    </table>

    <h2>03. 상향지원 대학 합격을 위한 목표 내신 등급 분석</h2>
    <div class="goal-banner">
      <div style="font-weight:700;font-size:14px;color:#1E3A8A;margin-bottom:6px;">
        목표 대학: ${escapeXml(reachGoal.targetUniversityName)} ${escapeXml(
    reachGoal.targetDepartmentName
  )} (${escapeXml(reachGoal.targetAdmissionType)}) — ${escapeXml(reachGoal.feasibilityLabel)}
      </div>
      <div style="font-size:13px;color:#1E293B;line-height:1.6;">
        ${escapeXml(reachGoal.summaryAdvice)}
      </div>
      <div style="font-size:12px;color:#1D4ED8;margin-top:8px;font-weight:600;">
        전략 과목 TOP 3 집중 상승 시 예상 내신: 5등급제 ${simulatedTop3Avg5.toFixed(
          2
        )}등급 / 9등급제 ${simulatedTop3Avg9.toFixed(2)}등급 (현재 대비 -${simulatedTotalGain9.toFixed(2)}등급 단축)
      </div>
    </div>

    <h2>04. 상향대학 합격을 위해 내신 등급을 올리기 좋은 전략 교과목 & 맞춤 학습 전략</h2>
    ${strategyCards}

    <div class="footer">
      <div>제작 플랫폼: <strong>생디</strong> (<a href="https://www.sangdi.net" target="_blank" class="sangdi-badge">www.sangdi.net</a>) · 담당: ${escapeXml(
    branding.consultantName
  )}</div>
      <div>대입정보포털 어디가(adiga.kr) 및 대학 입학처 2024·2025학년도 공식 등록자 70% 컷 기반 분석 리포트</div>
    </div>
  </div>
</body>
</html>`;
}

// Canvas 기반 고해상도 A4 멀티페이지 PDF 빌더 (생디 www.sangdi.net 브랜드 적용)
function buildMultiPagePdfFromJpegDataUrls(jpegDataUrls: string[], pageWidthPt = 595.28, pageHeightPt = 841.89): Blob {
  const encoder = new TextEncoder();
  const chunks: BlobPart[] = [];
  let offset = 0;
  const xrefOffsets: number[] = [0];

  const pushStr = (s: string) => {
    const bytes = encoder.encode(s);
    chunks.push(bytes as unknown as BlobPart);
    offset += bytes.length;
  };

  const pushBytes = (b: Uint8Array) => {
    chunks.push(b as unknown as BlobPart);
    offset += b.length;
  };

  const startObj = (id: number) => {
    xrefOffsets[id] = offset;
    pushStr(`${id} 0 obj\n`);
  };

  const endObj = () => {
    pushStr(`\nendobj\n`);
  };

  pushStr(`%PDF-1.4\n%\xFF\xFF\xFF\xFF\n`);

  const numPages = jpegDataUrls.length;
  startObj(1);
  pushStr(`<< /Type /Catalog /Pages 2 0 R >>`);
  endObj();

  const kidsRef = Array.from({ length: numPages }, (_, i) => `${3 + i * 3} 0 R`).join(' ');
  startObj(2);
  pushStr(`<< /Type /Pages /Kids [ ${kidsRef} ] /Count ${numPages} >>`);
  endObj();

  for (let i = 0; i < numPages; i++) {
    const pageObjId = 3 + i * 3;
    const contentObjId = 4 + i * 3;
    const imageObjId = 5 + i * 3;

    const base64 = jpegDataUrls[i].split(',')[1];
    const binaryStr = atob(base64);
    const imgBytes = new Uint8Array(binaryStr.length);
    for (let k = 0; k < binaryStr.length; k++) {
      imgBytes[k] = binaryStr.charCodeAt(k);
    }

    startObj(pageObjId);
    pushStr(
      `<< /Type /Page /Parent 2 0 R /MediaBox [ 0 0 ${pageWidthPt.toFixed(2)} ${pageHeightPt.toFixed(
        2
      )} ] /Resources << /XObject << /Im${i} ${imageObjId} 0 R >> >> /Contents ${contentObjId} 0 R >>`
    );
    endObj();

    const contentStream = `q\n${pageWidthPt.toFixed(2)} 0 0 ${pageHeightPt.toFixed(2)} 0 0 cm\n/Im${i} Do\nQ`;
    startObj(contentObjId);
    pushStr(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);
    endObj();

    startObj(imageObjId);
    pushStr(
      `<< /Type /XObject /Subtype /Image /Width 1600 /Height 2262 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`
    );
    pushBytes(imgBytes);
    pushStr(`\nendstream`);
    endObj();
  }

  const xrefStart = offset;
  const totalObjs = xrefOffsets.length;
  pushStr(`xref\n0 ${totalObjs}\n`);
  pushStr(`0000000000 65535 f \n`);
  for (let id = 1; id < totalObjs; id++) {
    const padded = String(xrefOffsets[id]).padStart(10, '0');
    pushStr(`${padded} 00000 n \n`);
  }

  pushStr(`trailer\n<< /Size ${totalObjs} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

  return new Blob(chunks, { type: 'application/pdf' });
}

async function loadLogoImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapKoreanText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawSangdiLogoVectorOnCanvas(
  ctx: CanvasRenderingContext2D,
  rightX: number,
  topY: number
) {
  ctx.save();
  const originX = rightX - 340;
  const originY = topY;

  // Background subtle pill
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(originX - 10, originY - 10, 360, 90, 10);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(originX - 10, originY - 10, 360, 90);
    ctx.strokeRect(originX - 10, originY - 10, 360, 90);
  }

  // Linear gradient for arrow
  const gradArrow = ctx.createLinearGradient(originX + 20, originY + 50, originX + 70, originY + 10);
  gradArrow.addColorStop(0, '#0066FF');
  gradArrow.addColorStop(0.5, '#00C0F3');
  gradArrow.addColorStop(1, '#00F0B5');

  // Gradient for diagonal bar
  const gradBar = ctx.createLinearGradient(originX, originY + 45, originX + 40, originY + 15);
  gradBar.addColorStop(0, '#0A3A94');
  gradBar.addColorStop(1, '#0056D6');

  // Left symbol '생'
  ctx.strokeStyle = gradBar;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(originX + 12, originY + 42);
  ctx.lineTo(originX + 32, originY + 22);
  ctx.stroke();

  // Upward Arrow
  ctx.strokeStyle = gradArrow;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(originX + 44, originY + 35);
  ctx.lineTo(originX + 66, originY + 14);
  ctx.stroke();

  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(originX + 50, originY + 12);
  ctx.lineTo(originX + 72, originY + 12);
  ctx.lineTo(originX + 72, originY + 34);
  ctx.stroke();

  // Right leg
  ctx.fillStyle = '#0C2E75';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(originX + 58, originY + 32, 9, 16, 4);
  } else {
    ctx.fillRect(originX + 58, originY + 32, 9, 16);
  }
  ctx.fill();

  // Bottom circle 'ㅇ'
  ctx.strokeStyle = '#0C2E75';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.ellipse(originX + 44, originY + 56, 17, 13, 0, 0, Math.PI * 2);
  ctx.stroke();

  // '디' - 'ㄷ'
  ctx.strokeStyle = '#0C2E75';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(originX + 115, originY + 24);
  ctx.lineTo(originX + 90, originY + 24);
  ctx.lineTo(originX + 90, originY + 56);
  ctx.lineTo(originX + 115, originY + 56);
  ctx.stroke();

  // '디' - 'ㅣ'
  ctx.beginPath();
  ctx.moveTo(originX + 132, originY + 28);
  ctx.lineTo(originX + 132, originY + 60);
  ctx.stroke();

  // Mint point
  ctx.fillStyle = '#00F0B5';
  ctx.beginPath();
  ctx.arc(originX + 132, originY + 18, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Typography
  ctx.fillStyle = '#0B2768';
  ctx.font = '800 20px "Noto Sans KR", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('학생부를 디자인하다', originX + 154, originY + 28);

  ctx.fillStyle = '#475569';
  ctx.font = '600 12px "Noto Sans KR", sans-serif';
  ctx.fillText('AI 기반 학생부 디자인 플랫폼', originX + 154, originY + 47);

  ctx.fillStyle = '#0284C7';
  ctx.font = '700 12px "JetBrains Mono", monospace';
  ctx.fillText('www.sangdi.net', originX + 154, originY + 63);

  ctx.restore();
}

export async function downloadReportAsPDF(payload: FullReportPayload): Promise<void> {
  const W = 1600;
  const H = 2262;
  const logoSrc = payload.branding.customLogoDataUrl || getSangdiLogoSvgDataUrl();
  const logoImg = await loadLogoImage(logoSrc);

  const canvas1 = document.createElement('canvas');
  canvas1.width = W;
  canvas1.height = H;
  const ctx1 = canvas1.getContext('2d')!;

  const drawHeaderAndFooter = (ctx: CanvasRenderingContext2D, pageNum: number, totalPages: number) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(80, 70, W - 160, 4);

    ctx.fillStyle = '#0284C7';
    ctx.font = '700 20px "Noto Sans KR", sans-serif';
    ctx.fillText(`${payload.branding.reportSubtitle} · 생디 (www.sangdi.net)`, 80, 118);

    ctx.fillStyle = '#0F172A';
    ctx.font = '700 36px "Noto Sans KR", sans-serif';
    ctx.fillText(
      `${payload.studentName} 학생 · ${payload.grade} ${payload.semester} 수시 교과전형 진학분석 리포트`,
      80,
      168
    );

    ctx.fillStyle = '#475569';
    ctx.font = '500 20px "Noto Sans KR", sans-serif';
    ctx.fillText(
      `희망 학과: ${payload.track.name}  |  유사 분석 학과: ${payload.track.relatedDepartments.slice(0, 4).join(', ')}`,
      80,
      204
    );

    if (payload.branding.customLogoDataUrl && logoImg) {
      const targetH = 68;
      const ratio = logoImg.width / Math.max(1, logoImg.height);
      const targetW = Math.min(280, targetH * ratio);
      ctx.drawImage(logoImg, W - 80 - targetW, 92, targetW, targetH);
    } else {
      drawSangdiLogoVectorOnCanvas(ctx, W - 80, 98);
    }

    ctx.fillStyle = '#64748B';
    ctx.font = '400 17px "Noto Sans KR", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`발행일: ${payload.generatedDate} · 생디 입시전략연구팀`, W - 80, 198);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(80, 228, W - 160, 2);

    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(80, H - 100, W - 160, 2);
    ctx.fillStyle = '#475569';
    ctx.font = '600 18px "Noto Sans KR", sans-serif';
    ctx.fillText(`제작 플랫폼: 생디 (www.sangdi.net) · 대입정보포털 어디가 2개년 공식 70% 컷 기준`, 80, H - 62);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#64748B';
    ctx.font = '500 18px "JetBrains Mono", monospace';
    ctx.fillText(`Page ${pageNum} / ${totalPages}`, W - 80, H - 62);
    ctx.textAlign = 'left';
  };

  // --- DRAW PAGE 1 ---
  drawHeaderAndFooter(ctx1, 1, 2);

  const kpis = [
    {
      label: '5등급제 내신 평균',
      val: `${payload.gpaSummary.avg5.toFixed(2)}등급`,
      sub: `이수 ${payload.gpaSummary.subjectCount}과목 (${payload.gpaSummary.totalCredits}학점)`,
      color: '#1D4ED8',
    },
    {
      label: '9등급제 환산 평균',
      val: `${payload.gpaSummary.avg9.toFixed(2)}등급`,
      sub: `국영수사과 ${payload.gpaSummary.coreAvg9.toFixed(2)}등급 (상위 ${payload.gpaSummary.estimatedTopPercent}%)`,
      color: '#0F172A',
    },
    {
      label: '상향지원 목표 등급',
      val: `${payload.reachGoal.targetCutoff9.toFixed(2)}등급`,
      sub: `5등급 환산 ${payload.reachGoal.targetCutoff5.toFixed(2)}등급 (${payload.reachGoal.targetUniversityName})`,
      color: '#D97706',
    },
    {
      label: '목표 달성 필요 상승폭',
      val: `-${payload.reachGoal.requiredImprovement9.toFixed(2)}등급`,
      sub: `5등급제 기준 -${payload.reachGoal.requiredImprovement5.toFixed(2)}등급 향상 필요`,
      color: '#059669',
    },
  ];

  const cardW = (W - 160 - 36) / 4;
  kpis.forEach((k, idx) => {
    const x = 80 + idx * (cardW + 12);
    const y = 252;
    ctx1.fillStyle = '#F8FAFC';
    ctx1.fillRect(x, y, cardW, 130);
    ctx1.strokeStyle = '#E2E8F0';
    ctx1.lineWidth = 2;
    ctx1.strokeRect(x, y, cardW, 130);

    ctx1.fillStyle = '#64748B';
    ctx1.font = '600 18px "Noto Sans KR", sans-serif';
    ctx1.fillText(k.label, x + 20, y + 36);

    ctx1.fillStyle = k.color;
    ctx1.font = '700 34px "JetBrains Mono", "Noto Sans KR", sans-serif';
    ctx1.fillText(k.val, x + 20, y + 82);

    ctx1.fillStyle = '#475569';
    ctx1.font = '500 16px "Noto Sans KR", sans-serif';
    ctx1.fillText(k.sub, x + 20, y + 112);
  });

  let curY = 425;
  ctx1.fillStyle = '#0F172A';
  ctx1.font = '700 24px "Noto Sans KR", sans-serif';
  ctx1.fillText(`01. 수시 반영 교과목 성적 (5등급제 → 9등급제 환산 내역 · ${payload.grade === '고1' ? '고1 성적' : payload.grade === '고2' ? '고1~2 누적' : '고1~3 전학년'})`, 80, curY);
  curY += 18;

  ctx1.fillStyle = '#F1F5F9';
  ctx1.fillRect(80, curY, W - 160, 42);
  ctx1.fillStyle = '#334155';
  ctx1.font = '700 17px "Noto Sans KR", sans-serif';
  ctx1.fillText('교과군 / 과목명', 100, curY + 27);
  ctx1.fillText('학점', 430, curY + 27);
  ctx1.fillText('5등급제', 530, curY + 27);
  ctx1.fillText('9등급 환산', 660, curY + 27);

  ctx1.fillText('교과군 / 과목명', 820, curY + 27);
  ctx1.fillText('학점', 1150, curY + 27);
  ctx1.fillText('5등급제', 1250, curY + 27);
  ctx1.fillText('9등급 환산', 1380, curY + 27);
  curY += 42;

  const maxSubjectsDisplay = Math.min(12, payload.subjects.length);
  const rowsCount = Math.ceil(maxSubjectsDisplay / 2);
  for (let r = 0; r < rowsCount; r++) {
    const leftSub = payload.subjects[r * 2];
    const rightSub = payload.subjects[r * 2 + 1];
    ctx1.fillStyle = r % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
    ctx1.fillRect(80, curY, W - 160, 38);
    ctx1.strokeStyle = '#E2E8F0';
    ctx1.lineWidth = 1;
    ctx1.strokeRect(80, curY, W - 160, 38);

    if (leftSub) {
      const g9 = getSubjectGrade9(leftSub);
      ctx1.fillStyle = '#0F172A';
      ctx1.font = '600 17px "Noto Sans KR", sans-serif';
      ctx1.fillText(`[${leftSub.gradeLevel || '고1'}] [${leftSub.group}] ${leftSub.name}`, 100, curY + 25);
      ctx1.fillStyle = '#475569';
      ctx1.font = '500 17px "JetBrains Mono", monospace';
      ctx1.fillText(`${leftSub.credits}학점`, 430, curY + 25);
      ctx1.fillStyle = '#1D4ED8';
      ctx1.font = '700 17px "JetBrains Mono", monospace';
      ctx1.fillText(`${leftSub.grade5}등급(${leftSub.subBand})`, 530, curY + 25);
      ctx1.fillStyle = '#0F172A';
      ctx1.fillText(`${g9.toFixed(2)}등급`, 660, curY + 25);
    }

    if (rightSub) {
      const g9 = getSubjectGrade9(rightSub);
      ctx1.fillStyle = '#0F172A';
      ctx1.font = '600 17px "Noto Sans KR", sans-serif';
      ctx1.fillText(`[${rightSub.gradeLevel || '고1'}] [${rightSub.group}] ${rightSub.name}`, 820, curY + 25);
      ctx1.fillStyle = '#475569';
      ctx1.font = '500 17px "JetBrains Mono", monospace';
      ctx1.fillText(`${rightSub.credits}학점`, 1150, curY + 25);
      ctx1.fillStyle = '#1D4ED8';
      ctx1.font = '700 17px "JetBrains Mono", monospace';
      ctx1.fillText(`${rightSub.grade5}등급(${rightSub.subBand})`, 1250, curY + 25);
      ctx1.fillStyle = '#0F172A';
      ctx1.fillText(`${g9.toFixed(2)}등급`, 1380, curY + 25);
    }
    curY += 38;
  }

  curY += 42;
  ctx1.fillStyle = '#0F172A';
  ctx1.font = '700 24px "Noto Sans KR", sans-serif';
  ctx1.fillText(
    '02. 수시 학생부교과 공식 2개년(2024·2025) 70% 컷 입결 분석 (상향·적정·안정)',
    80,
    curY
  );
  curY += 18;

  ctx1.fillStyle = '#0F172A';
  ctx1.fillRect(80, curY, W - 160, 44);
  ctx1.fillStyle = '#FFFFFF';
  ctx1.font = '700 16px "Noto Sans KR", sans-serif';
  ctx1.fillText('지원구분', 96, curY + 28);
  ctx1.fillText('대학명', 225, curY + 28);
  ctx1.fillText('모집단위 (희망/유사학과)', 430, curY + 28);
  ctx1.fillText('2024 입결', 810, curY + 28);
  ctx1.fillText('2025 입결', 935, curY + 28);
  ctx1.fillText('2개년 평균(5등급환산)', 1060, curY + 28);
  ctx1.fillText('내 성적 대비', 1295, curY + 28);
  ctx1.fillText('충원율', 1435, curY + 28);
  curY += 44;

  const combinedUnivs: Array<{ label: string; color: string; rec: EvaluatedUniversityRecord }> = [
    ...payload.reachList.slice(0, 6).map((rec) => ({ label: '▲ 상향지원', color: '#D97706', rec })),
    ...payload.targetList.slice(0, 6).map((rec) => ({ label: '● 적정지원', color: '#0284C7', rec })),
    ...payload.safetyList.slice(0, 6).map((rec) => ({ label: '◆ 안정지원', color: '#059669', rec })),
  ];

  combinedUnivs.forEach((item, idx) => {
    const r = item.rec;
    ctx1.fillStyle = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';
    ctx1.fillRect(80, curY, W - 160, 48);
    ctx1.strokeStyle = '#E2E8F0';
    ctx1.strokeRect(80, curY, W - 160, 48);

    ctx1.fillStyle = item.color;
    ctx1.font = '700 16px "Noto Sans KR", sans-serif';
    ctx1.fillText(item.label, 96, curY + 30);

    ctx1.fillStyle = '#0F172A';
    ctx1.font = '700 17px "Noto Sans KR", sans-serif';
    ctx1.fillText(r.university, 225, curY + 30);

    ctx1.fillStyle = '#334155';
    ctx1.font = '500 16px "Noto Sans KR", sans-serif';
    const deptText = `${r.department} (${r.matchType === '희망학과 일치' ? '희망' : '유사'})`;
    ctx1.fillText(deptText.slice(0, 22), 430, curY + 30);

    ctx1.fillStyle = '#475569';
    ctx1.font = '600 17px "JetBrains Mono", monospace';
    ctx1.fillText(`${r.cutoff2024_9.toFixed(2)}`, 815, curY + 30);
    ctx1.fillText(`${r.cutoff2025_9.toFixed(2)}`, 940, curY + 30);

    ctx1.fillStyle = '#1D4ED8';
    ctx1.font = '700 17px "JetBrains Mono", monospace';
    ctx1.fillText(`${r.avgCutoff9.toFixed(2)} (${r.equivalentCutoff5.toFixed(2)})`, 1065, curY + 30);

    ctx1.fillStyle = r.gap9 > 0 ? '#D97706' : '#059669';
    ctx1.font = '700 16px "JetBrains Mono", "Noto Sans KR", sans-serif';
    ctx1.fillText(
      r.gap9 > 0 ? `+${r.gap9.toFixed(2)} 부족` : `${r.gap9.toFixed(2)} 여유`,
      1295,
      curY + 30
    );

    ctx1.fillStyle = '#475569';
    ctx1.font = '500 16px "JetBrains Mono", monospace';
    ctx1.fillText(`${r.replenishRate2025}%`, 1440, curY + 30);

    curY += 48;
  });

  // --- DRAW PAGE 2 ---
  const canvas2 = document.createElement('canvas');
  canvas2.width = W;
  canvas2.height = H;
  const ctx2 = canvas2.getContext('2d')!;
  drawHeaderAndFooter(ctx2, 2, 2);

  let y2 = 265;
  ctx2.fillStyle = '#0F172A';
  ctx2.font = '700 26px "Noto Sans KR", sans-serif';
  ctx2.fillText('03. 상향지원 대학 합격을 위한 목표 내신 등급 및 필요 상승폭 분석', 80, y2);
  y2 += 24;

  ctx2.fillStyle = '#EFF6FF';
  ctx2.fillRect(80, y2, W - 160, 210);
  ctx2.strokeStyle = '#93C5FD';
  ctx2.lineWidth = 2;
  ctx2.strokeRect(80, y2, W - 160, 210);

  ctx2.fillStyle = '#1E3A8A';
  ctx2.font = '700 22px "Noto Sans KR", sans-serif';
  ctx2.fillText(
    `목표 상향대학: ${payload.reachGoal.targetUniversityName} ${payload.reachGoal.targetDepartmentName} (${payload.reachGoal.targetAdmissionType})`,
    110,
    y2 + 44
  );

  ctx2.fillStyle = '#1D4ED8';
  ctx2.font = '700 20px "JetBrains Mono", "Noto Sans KR", sans-serif';
  ctx2.fillText(
    `현재 9등급제 ${payload.reachGoal.currentAvg9.toFixed(2)}등급 (5등급제 ${payload.reachGoal.currentAvg5.toFixed(
      2
    )}등급)  →  합격 목표 9등급제 ${payload.reachGoal.targetCutoff9.toFixed(
      2
    )}등급 (5등급제 ${payload.reachGoal.targetCutoff5.toFixed(2)}등급)  [필요 상승폭: -${payload.reachGoal.requiredImprovement9.toFixed(
      2
    )}등급]`,
    110,
    y2 + 88
  );

  ctx2.fillStyle = '#1E293B';
  ctx2.font = '500 19px "Noto Sans KR", sans-serif';
  const wrappedAdvice = wrapKoreanText(ctx2, payload.reachGoal.summaryAdvice, W - 220);
  wrappedAdvice.slice(0, 2).forEach((line, idx) => {
    ctx2.fillText(line, 110, y2 + 132 + idx * 30);
  });

  ctx2.fillStyle = '#059669';
  ctx2.font = '700 19px "Noto Sans KR", sans-serif';
  ctx2.fillText(
    `★ 전략 과목 상위 3과목 목표 달성 시 시뮬레이션: 5등급제 ${payload.simulatedTop3Avg5.toFixed(
      2
    )}등급 / 9등급제 ${payload.simulatedTop3Avg9.toFixed(2)}등급 달성 (-${payload.simulatedTotalGain9.toFixed(
      2
    )}등급 단축)`,
    110,
    y2 + 190
  );

  y2 += 260;

  ctx2.fillStyle = '#0F172A';
  ctx2.font = '700 26px "Noto Sans KR", sans-serif';
  ctx2.fillText('04. 상향대학 합격을 위해 내신 등급을 올리기 좋은 전략 교과목 & 맞춤 학습 전략', 80, y2);
  y2 += 24;

  payload.strategies.slice(0, 4).forEach((st) => {
    const boxH = 340;
    ctx2.fillStyle = '#FFFFFF';
    ctx2.fillRect(80, y2, W - 160, boxH);
    ctx2.strokeStyle = '#CBD5E1';
    ctx2.lineWidth = 2;
    ctx2.strokeRect(80, y2, W - 160, boxH);

    ctx2.fillStyle = '#F8FAFC';
    ctx2.fillRect(82, y2 + 2, W - 164, 58);

    ctx2.fillStyle = '#0F172A';
    ctx2.font = '700 22px "Noto Sans KR", sans-serif';
    ctx2.fillText(
      `우선순위 0${st.priorityRank}. ${st.subjectName} (${st.group} · ${st.credits}학점${
        st.isMajorCore ? ' · 희망전공 핵심권장과목' : ''
      })`,
      108,
      y2 + 40
    );

    ctx2.fillStyle = '#1D4ED8';
    ctx2.font = '700 20px "JetBrains Mono", "Noto Sans KR", sans-serif';
    ctx2.textAlign = 'right';
    ctx2.fillText(
      `5등급제 ${st.currentGrade5}등급(${st.currentGrade9.toFixed(2)}) → ${
        st.targetGrade5
      }등급(${st.targetGrade9.toFixed(2)})  [전체 평균 -${st.expectedGrade9Improvement.toFixed(2)}등급 향상]`,
      W - 108,
      y2 + 40
    );
    ctx2.textAlign = 'left';

    let innerY = y2 + 95;
    const drawParagraph = (label: string, content: string, labelColor: string) => {
      ctx2.fillStyle = labelColor;
      ctx2.font = '700 18px "Noto Sans KR", sans-serif';
      ctx2.fillText(`• ${label}:`, 108, innerY);

      ctx2.fillStyle = '#334155';
      ctx2.font = '500 18px "Noto Sans KR", sans-serif';
      const lines = wrapKoreanText(ctx2, content, W - 380);
      lines.slice(0, 2).forEach((ln, lIdx) => {
        ctx2.fillText(ln, 265, innerY + lIdx * 28);
      });
      innerY += Math.max(1, Math.min(2, lines.length)) * 28 + 18;
    };

    drawParagraph('전략 선정 근거', st.reasonSummary, '#0F172A');
    drawParagraph('지필고사 전략', st.examStrategy, '#1D4ED8');
    drawParagraph('수행·세특 전략', `${st.performanceAndSeteukStrategy} (${st.weeklyActionPlan})`, '#059669');

    y2 += boxH + 22;
  });

  const jpeg1 = canvas1.toDataURL('image/jpeg', 0.92);
  const jpeg2 = canvas2.toDataURL('image/jpeg', 0.92);

  const pdfBlob = buildMultiPagePdfFromJpegDataUrls([jpeg1, jpeg2]);
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `수시_교과전형_진학분석_리포트_${payload.studentName}_생디.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
