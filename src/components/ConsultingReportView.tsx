import React, { useState } from 'react';
import {
  CompanyBranding,
  DepartmentTrack,
  EvaluatedUniversityRecord,
  HighSchoolGrade,
  Semester,
  SubjectEntry,
  SubjectStudyStrategy,
  SupportCategory,
} from '../types/admissions';
import {
  ReachGoalAnalysis,
  StudentGPASummary,
  getSubjectGrade9,
} from '../utils/admissionsAnalyzer';
import { getSangdiLogoSvgDataUrl } from '../utils/reportExporter';
import { CheckSquare, Square, Target, TrendingUp, Globe, ExternalLink } from 'lucide-react';

interface ConsultingReportViewProps {
  studentName: string;
  grade: HighSchoolGrade;
  semester: Semester;
  track: DepartmentTrack;
  subjects: SubjectEntry[];
  gpaSummary: StudentGPASummary;
  reachList: EvaluatedUniversityRecord[];
  targetList: EvaluatedUniversityRecord[];
  safetyList: EvaluatedUniversityRecord[];
  selectedReachUnivId: string | null;
  onSelectReachUniv: (univId: string) => void;
  reachGoal: ReachGoalAnalysis;
  strategies: SubjectStudyStrategy[];
  branding: CompanyBranding;
  generatedDate: string;
}

export const ConsultingReportView: React.FC<ConsultingReportViewProps> = ({
  studentName,
  grade,
  semester,
  track,
  subjects,
  gpaSummary,
  reachList,
  targetList,
  safetyList,
  selectedReachUnivId,
  onSelectReachUniv,
  reachGoal,
  strategies,
  branding,
  generatedDate,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | SupportCategory>('ALL');
  const [matchTypeFilter, setMatchTypeFilter] = useState<'ALL' | '희망학과 일치' | '유사·인접학과'>('ALL');
  const [simulatedSubjectIds, setSimulatedSubjectIds] = useState<string[]>(() =>
    strategies.slice(0, 3).map((s) => s.subjectId)
  );

  const logoSrc = branding.customLogoDataUrl || getSangdiLogoSvgDataUrl();

  const toggleSimulatedSubject = (subjectId: string) => {
    setSimulatedSubjectIds((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId]
    );
  };

  const totalCredits = gpaSummary.totalCredits || 1;
  let simWeighted5 = 0;
  let simWeighted9 = 0;
  for (const sub of subjects) {
    const strat = strategies.find((st) => st.subjectId === sub.id);
    if (strat && simulatedSubjectIds.includes(sub.id)) {
      simWeighted5 += strat.targetGrade5 * sub.credits;
      simWeighted9 += strat.targetGrade9 * sub.credits;
    } else {
      simWeighted5 += sub.grade5 * sub.credits;
      simWeighted9 += getSubjectGrade9(sub) * sub.credits;
    }
  }
  const simulatedAvg5 = Number((simWeighted5 / totalCredits).toFixed(2));
  const simulatedAvg9 = Number((simWeighted9 / totalCredits).toFixed(2));
  const simulatedGain9 = Number(Math.max(0, gpaSummary.avg9 - simulatedAvg9).toFixed(2));
  const simulatedGain5 = Number(Math.max(0, gpaSummary.avg5 - simulatedAvg5).toFixed(2));

  const filterByMatchType = (list: EvaluatedUniversityRecord[]) => {
    if (matchTypeFilter === 'ALL') return list;
    return list.filter((u) => u.matchType === matchTypeFilter);
  };

  const filteredReach = filterByMatchType(reachList);
  const filteredTarget = filterByMatchType(targetList);
  const filteredSafety = filterByMatchType(safetyList);

  const studentPosPercent = Math.min(98, Math.max(2, ((gpaSummary.avg9 - 1.0) / 8.0) * 100));
  const targetPosPercent = Math.min(98, Math.max(2, ((reachGoal.targetCutoff9 - 1.0) / 8.0) * 100));

  const renderUniversitySectionTable = (
    title: string,
    subtitle: string,
    categoryCode: SupportCategory,
    records: EvaluatedUniversityRecord[]
  ) => {
    const isReach = categoryCode === '상향지원';
    const isTarget = categoryCode === '적정지원';

    const statusGlyph = isReach ? '▲ 상향지원' : isTarget ? '● 적정지원' : '◆ 안정지원';
    const statusTextClass = isReach
      ? 'text-amber-700 font-bold'
      : isTarget
      ? 'text-sky-700 font-bold'
      : 'text-emerald-700 font-bold';

    return (
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white mb-5">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              <span className={statusTextClass}>{statusGlyph}</span>
              <span className="mx-2 text-slate-300">·</span>
              <span>{title}</span>
              <span className="ml-2 text-xs font-normal text-slate-500">({records.length}개 모집단위)</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          </div>
          {isReach && (
            <span className="text-xs text-slate-600">
              우측 <strong>목표 지정</strong> 클릭 시 목표 등급 상승폭이 해당 대학 기준으로 계산됩니다.
            </span>
          )}
        </div>

        {records.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            선택한 학과 구분 필터에 해당하는 모집단위가 없습니다. 필터를 '전체 학과'로 변경해 보세요.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-600">
                  <th className="py-2.5 pl-4 pr-2 font-semibold">판정</th>
                  <th className="py-2.5 px-2 font-semibold">대학명</th>
                  <th className="py-2.5 px-2 font-semibold">모집단위 (학과구분)</th>
                  <th className="py-2.5 px-2 font-semibold">전형명</th>
                  <th className="py-2.5 px-2 font-semibold text-right">2024(재작년) 70%컷</th>
                  <th className="py-2.5 px-2 font-semibold text-right">2025(작년) 70%컷</th>
                  <th className="py-2.5 px-2 font-semibold text-right">2개년 평균 (5등급 환산)</th>
                  <th className="py-2.5 px-2 font-semibold text-right">학생 성적 대비</th>
                  <th className="py-2.5 px-2 font-semibold">수능최저 · 충원율</th>
                  {isReach && <th className="py-2.5 pl-2 pr-4 font-semibold text-right">목표 설정</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {records.map((rec) => {
                  const isSelectedGoal =
                    isReach &&
                    (selectedReachUnivId === rec.id ||
                      (!selectedReachUnivId &&
                        reachGoal.targetUniversityName === rec.university &&
                        reachGoal.targetDepartmentName === rec.department));

                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-slate-50/90 transition-colors ${
                        isSelectedGoal ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <td className={`py-2.5 pl-4 pr-2 whitespace-nowrap ${statusTextClass}`}>
                        {statusGlyph}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-slate-900 whitespace-nowrap">
                        {rec.university}
                        <span className="text-[11px] font-normal text-slate-500 ml-1">
                          · {rec.region}
                        </span>
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="font-semibold text-slate-900">{rec.department}</div>
                        <div className="text-[11px] text-slate-500">
                          {rec.matchType} · 경쟁률 {rec.competitionRate2025}:1
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                        {rec.admissionType}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-700">
                        {rec.cutoff2024_9.toFixed(2)}등급
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums text-slate-900 font-semibold">
                        {rec.cutoff2025_9.toFixed(2)}등급
                        <div className="text-[10px] text-slate-400 font-normal">
                          50%컷 {rec.cutoff2025_50_9.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                        <span className="font-bold text-blue-700">{rec.avgCutoff9.toFixed(2)}등급</span>
                        <div className="text-[11px] text-slate-500">
                          5등급제 {rec.equivalentCutoff5.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums whitespace-nowrap">
                        {rec.gap9 > 0 ? (
                          <span className="text-amber-700 font-bold">
                            +{rec.gap9.toFixed(2)}등급 부족
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold">
                            {rec.gap9.toFixed(2)}등급 여유
                          </span>
                        )}
                        <div className="text-[10px] text-slate-500">
                          5등급 {rec.gap5 > 0 ? `+${rec.gap5.toFixed(2)}` : rec.gap5.toFixed(2)}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-slate-600">
                        <div className="text-slate-800">{rec.csatMinimum}</div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          충원율 {rec.replenishRate2025}%
                        </div>
                      </td>
                      {isReach && (
                        <td className="py-2.5 pl-2 pr-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onSelectReachUniv(rec.id)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                              isSelectedGoal
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelectedGoal ? '목표 선택됨' : '목표 지정'}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-2xs">
      {/* 리포트 공식 헤더: 생디 www.sangdi.net 로고 & 학생 인적사항 */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 mb-6 border-b-2 border-slate-900">
        <div>
          <div className="text-xs font-bold text-sky-700 tracking-tight mb-1 flex items-center gap-1.5">
            <span>{branding.reportSubtitle}</span>
            <span className="text-slate-300">·</span>
            <a
              href="https://www.sangdi.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 hover:underline flex items-center gap-0.5"
            >
              <Globe className="w-3 h-3" />
              www.sangdi.net
            </a>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {studentName || '학생'} ({grade} {semester}) 수시 학생부교과 진학분석 리포트
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 mt-2">
            <span>
              희망 학과: <strong className="text-slate-900">{track.name}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>계열: {track.category}</span>
            <span aria-hidden="true">·</span>
            <span>유사 분석 학과: {track.relatedDepartments.join(', ')}</span>
          </div>
        </div>

        {/* 우측 생디 로고 영역 */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
          <a
            href="https://www.sangdi.net"
            target="_blank"
            rel="noopener noreferrer"
            title="생디 (www.sangdi.net) 웹사이트 열기"
            className="h-12 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center hover:border-sky-500 transition-colors"
          >
            <img
              src={logoSrc}
              alt="생디 로고"
              referrerPolicy="no-referrer"
              className="h-9 max-w-[180px] object-contain"
            />
          </a>
          <div className="text-[11px] text-slate-500 text-right">
            <span>발행일: {generatedDate}</span>
            <span className="mx-1.5" aria-hidden="true">·</span>
            <span>{branding.consultantName}</span>
          </div>
        </div>
      </div>

      {/* SECTION 01: 5등급제 평균 및 9등급제 환산 성적 요약 */}
      <section id="section-gpa" className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900">
            01. 5등급제 내신 평균 계산 및 9등급제 정밀 환산 성적
          </h2>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            총 {gpaSummary.subjectCount}과목 · {gpaSummary.totalCredits}학점 이수 기준
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs font-medium text-slate-500">5등급제 내신 평균</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-blue-700 mt-1">
              {gpaSummary.avg5.toFixed(2)}
              <span className="text-sm font-sans font-semibold ml-0.5">등급</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              국영수사과 평균 {gpaSummary.coreAvg5.toFixed(2)}등급
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs font-medium text-slate-500">9등급제 환산 내신 성적</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-1">
              {gpaSummary.avg9.toFixed(2)}
              <span className="text-sm font-sans font-semibold ml-0.5">등급</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              국영수사과 9등급제 {gpaSummary.coreAvg9.toFixed(2)}등급
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs font-medium text-slate-500">상향지원 대학 목표 등급</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-700 mt-1">
              {reachGoal.targetCutoff9.toFixed(2)}
              <span className="text-sm font-sans font-semibold ml-0.5">등급</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 truncate">
              5등급제 환산 {reachGoal.targetCutoff5.toFixed(2)}등급 ({reachGoal.targetUniversityName})
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-xs font-medium text-slate-500">목표 달성 필요 등급 상승폭</div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-700 mt-1">
              -{reachGoal.requiredImprovement9.toFixed(2)}
              <span className="text-sm font-sans font-semibold ml-0.5">등급</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              5등급제 기준 -{reachGoal.requiredImprovement5.toFixed(2)}등급 향상 필요
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
            <span className="font-bold text-slate-900">
              5등급제 · 9등급제 누적 백분위 스케일 상의 현재 내신 및 목표 대학 위치
            </span>
            <span className="text-slate-600 font-mono tabular-nums">
              전국 추정 누적 상위 {gpaSummary.estimatedTopPercent}%
            </span>
          </div>

          <div className="relative h-9 bg-white border border-slate-200 rounded-lg overflow-hidden my-2">
            <div className="absolute inset-0 grid grid-cols-8 divide-x divide-slate-100 text-[10px] font-mono text-slate-400">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="flex items-end justify-start pl-1 pb-0.5">
                  {n}등급
                </div>
              ))}
            </div>

            <div
              style={{ left: `${targetPosPercent}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-amber-600 z-10"
              title={`상향 목표: ${reachGoal.targetCutoff9}등급`}
            >
              <span className="absolute top-0.5 -translate-x-1/2 px-1.5 py-0.5 bg-amber-600 text-white text-[10px] font-mono font-bold rounded whitespace-nowrap">
                목표 {reachGoal.targetCutoff9.toFixed(2)}
              </span>
            </div>

            <div
              style={{ left: `${studentPosPercent}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-blue-700 z-20"
              title={`현재 내신: ${gpaSummary.avg9}등급`}
            >
              <span className="absolute bottom-0.5 -translate-x-1/2 px-1.5 py-0.5 bg-blue-700 text-white text-[10px] font-mono font-bold rounded whitespace-nowrap">
                현재 {gpaSummary.avg9.toFixed(2)} (5등급 {gpaSummary.avg5.toFixed(2)})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3 pt-3 border-t border-slate-200/80">
            {gpaSummary.groupSummaries.map((gs) => (
              <div
                key={gs.group}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{gs.group}</span>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                    {gs.credits}학점
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between font-mono tabular-nums">
                  <span className="text-xs font-semibold text-blue-700">5등급 {gs.avg5.toFixed(2)}</span>
                  <span className="text-xs font-bold text-slate-900">9등급 {gs.avg9.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 02: 희망 학과 및 유사 학과 수시 학생부교과 2개년 공식 입결 분석 */}
      <section id="section-universities" className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              02. 희망 학과 및 유사 학과 수시 학생부교과 2024(재작년)·2025(작년) 공식 70% 컷 입결 분석
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              대입정보포털 어디가(adiga.kr) 및 대학교 입학처 공식 등록자 70% 컷 데이터 기준 분석 결과입니다. (상향 · 적정 · 안정)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <div className="inline-flex p-1 bg-slate-100 rounded-lg">
              {(['ALL', '상향지원', '적정지원', '안정지원'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    categoryFilter === cat
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'ALL' ? '전체 보기' : cat}
                </button>
              ))}
            </div>

            <div className="inline-flex p-1 bg-slate-100 rounded-lg">
              {(['ALL', '희망학과 일치', '유사·인접학과'] as const).map((mType) => (
                <button
                  key={mType}
                  type="button"
                  onClick={() => setMatchTypeFilter(mType)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    matchTypeFilter === mType
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mType === 'ALL' ? '전체 학과' : mType}
                </button>
              ))}
            </div>
          </div>
        </div>

        {(categoryFilter === 'ALL' || categoryFilter === '상향지원') &&
          renderUniversitySectionTable(
            '상향지원 대학 및 학과 목록 (Reach)',
            '현재 내신보다 2개년 평균 합격선이 높으나, 남은 학기 목표 등급 달성 및 수능최저 충족 시 도전 가능한 대학군입니다.',
            '상향지원',
            filteredReach
          )}

        {(categoryFilter === 'ALL' || categoryFilter === '적정지원') &&
          renderUniversitySectionTable(
            '적정지원 대학 및 학과 목록 (Target)',
            '학생의 9등급제 환산 내신과 2개년 평균 70% 컷이 근접하여 수시 학생부교과 합격 가능성이 높은 대학군입니다.',
            '적정지원',
            filteredTarget
          )}

        {(categoryFilter === 'ALL' || categoryFilter === '안정지원') &&
          renderUniversitySectionTable(
            '안정지원 대학 및 학과 목록 (Safety)',
            '2개년 70% 컷 및 50% 컷 대비 성적 여유가 충분하여 수시 6장 지원 전략 중 안정권을 형성하는 대학군입니다.',
            '안정지원',
            filteredSafety
          )}
      </section>

      {/* SECTION 03: 상향지원 대학 합격을 위한 목표 내신 등급 분석 */}
      <section id="section-goal" className="mb-8">
        <div className="pb-3 mb-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">
            03. 상향지원 대학 합격을 위한 목표 내신 등급 및 필요 상승폭 분석
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            목표 상향 대학을 선택하면 학생의 현재 내신에서 몇 등급을 더 올려야 하는지와 남은 학기 필요 평균 성적을 정밀 계산합니다.
          </p>
        </div>

        <div className="mb-4 no-print">
          <div className="text-xs font-semibold text-slate-700 mb-1.5">
            목표로 분석할 상향지원 대학·학과 선택:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {reachList.map((u) => {
              const isSelected =
                selectedReachUnivId === u.id ||
                (!selectedReachUnivId &&
                  reachGoal.targetUniversityName === u.university &&
                  reachGoal.targetDepartmentName === u.department);
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => onSelectReachUniv(u.id)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 font-bold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-medium'
                  }`}
                >
                  {u.university} {u.department} ({u.avgCutoff9.toFixed(2)}등급)
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-blue-200/80">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="text-sm font-bold text-slate-900">
                목표 대학: {reachGoal.targetUniversityName} {reachGoal.targetDepartmentName} (
                {reachGoal.targetAdmissionType})
              </span>
            </div>
            <span className="text-xs font-semibold text-blue-800">
              진단 결과: {reachGoal.feasibilityLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3.5 bg-white border border-blue-200/80 rounded-lg">
              <div className="text-xs text-slate-500">현재 내신 → 목표 합격선 (9등급제)</div>
              <div className="text-lg font-mono font-bold tabular-nums text-slate-900 mt-1">
                {reachGoal.currentAvg9.toFixed(2)}등급 →{' '}
                <span className="text-blue-700">{reachGoal.targetCutoff9.toFixed(2)}등급</span>
              </div>
              <div className="text-xs font-semibold text-emerald-700 mt-1 font-mono tabular-nums">
                9등급제 기준 -{reachGoal.requiredImprovement9.toFixed(2)}등급 향상 필요
              </div>
            </div>

            <div className="p-3.5 bg-white border border-blue-200/80 rounded-lg">
              <div className="text-xs text-slate-500">현재 내신 → 목표 합격선 (5등급제)</div>
              <div className="text-lg font-mono font-bold tabular-nums text-slate-900 mt-1">
                {reachGoal.currentAvg5.toFixed(2)}등급 →{' '}
                <span className="text-blue-700">{reachGoal.targetCutoff5.toFixed(2)}등급</span>
              </div>
              <div className="text-xs font-semibold text-emerald-700 mt-1 font-mono tabular-nums">
                5등급제 기준 -{reachGoal.requiredImprovement5.toFixed(2)}등급 향상 필요
              </div>
            </div>

            <div className="p-3.5 bg-white border border-blue-200/80 rounded-lg">
              <div className="text-xs text-slate-500">
                남은 {reachGoal.remainingSemesters}개 학기 필요 평균 등급
              </div>
              <div className="text-lg font-mono font-bold tabular-nums text-amber-700 mt-1">
                5등급제 {reachGoal.requiredFutureSemesterAvg5.toFixed(2)}등급{' '}
                <span className="text-xs font-normal text-slate-600">
                  (9등급 {reachGoal.requiredFutureSemesterAvg9.toFixed(2)})
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                현재 {reachGoal.completedSemesters}개 학기 이수 · 수시 반영 잔여 {reachGoal.remainingSemesters}학기 기준
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">{reachGoal.summaryAdvice}</p>
        </div>
      </section>

      {/* SECTION 04: 상향대학 합격을 위해 내신 등급을 올리기 좋은 전략 교과목 & 학습 전략 */}
      <section id="section-strategy">
        <div className="pb-3 mb-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900">
            04. 상향대학 합격을 위해 내신 등급을 올리기 좋은 전략 교과목 & 맞춤 학습 전략
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            이수 학점 비중과 {track.name} 핵심 권장과목 가중치, 5→9등급 환산 레버리지 효과를 분석하여 등급을 올리기 가장 좋은 과목을 추천합니다.
          </p>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-xl mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
              <TrendingUp className="w-4 h-4" />
              <span>전략 과목 목표 달성 시뮬레이터 (과목 체크박스를 켜고 꺼서 결과를 확인하세요)</span>
            </div>
            <div className="text-sm font-bold">
              선택한 {simulatedSubjectIds.length}개 과목 목표 등급 달성 시 예상 내신:{' '}
              <span className="font-mono tabular-nums text-amber-300">
                5등급제 {simulatedAvg5.toFixed(2)}등급 / 9등급제 {simulatedAvg9.toFixed(2)}등급
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono tabular-nums">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-sans">예상 등급 상승폭</div>
              <div className="text-base font-bold text-emerald-400">
                9등급제 -{simulatedGain9.toFixed(2)}등급 (5등급 -{simulatedGain5.toFixed(2)})
              </div>
            </div>
            <div className="text-right pl-4 border-l border-slate-700">
              <div className="text-[11px] text-slate-400 font-sans">
                {reachGoal.targetUniversityName} 목표컷({reachGoal.targetCutoff9.toFixed(2)}) 대비
              </div>
              <div className="text-base font-bold">
                {simulatedAvg9 <= reachGoal.targetCutoff9 ? (
                  <span className="text-emerald-400">합격 목표권 진입 달성!</span>
                ) : (
                  <span className="text-amber-300">
                    목표까지 {(simulatedAvg9 - reachGoal.targetCutoff9).toFixed(2)}등급 남음
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          {strategies.slice(0, 5).map((st) => {
            const isSimulated = simulatedSubjectIds.includes(st.subjectId);
            return (
              <div
                key={st.subjectId}
                className={`border rounded-xl p-4 transition-colors ${
                  isSimulated ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleSimulatedSubject(st.subjectId)}
                      className="inline-flex items-center gap-1.5 text-left focus:outline-none group"
                    >
                      {isSimulated ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0" />
                      )}
                      <span className="text-sm font-bold text-slate-900">
                        우선순위 0{st.priorityRank}. {st.subjectName}
                      </span>
                    </button>
                    <span className="text-xs text-slate-500">
                      · {st.group} · {st.credits}학점
                      {st.isMajorCore ? ' · 희망학과 핵심권장' : ''}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-bold tabular-nums text-blue-700">
                    현재 5등급제 {st.currentGrade5}등급({st.currentGrade9.toFixed(2)}) → 목표{' '}
                    {st.targetGrade5}등급({st.targetGrade9.toFixed(2)}) · 전체평균 -
                    {st.expectedGrade9Improvement.toFixed(2)}등급 단축
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 text-xs leading-relaxed">
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                    <div className="font-bold text-slate-900 mb-1">
                      01. 내신 상승 최적 과목 선정 사유
                    </div>
                    <p className="text-slate-600">{st.reasonSummary}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                    <div className="font-bold text-blue-800 mb-1">
                      02. 지필고사 · 서논술형 등급 도약 전략
                    </div>
                    <p className="text-slate-600">{st.examStrategy}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                    <div className="font-bold text-emerald-800 mb-1">
                      03. 수행평가 · 세특 희망학과 연계 전략
                    </div>
                    <p className="text-slate-600">{st.performanceAndSeteukStrategy}</p>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-200 text-[11px] font-semibold text-slate-800">
                      주간 루틴: {st.weeklyActionPlan}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 리포트 하단 공식 푸터 */}
      <footer className="mt-8 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          제작 플랫폼: <strong className="text-slate-900 font-bold">{branding.companyName}</strong>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <a
            href="https://www.sangdi.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 font-semibold hover:underline"
          >
            {branding.websiteUrl}
          </a>
        </div>
        <div>
          담당: {branding.consultantName} · 대입정보포털 어디가(adiga.kr) 및 대학교 공식 발표 2개년 등록자 70% 컷 기준
        </div>
      </footer>
    </div>
  );
};
