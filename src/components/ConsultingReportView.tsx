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
} from '../utils/admissionsAnalyzer';
import { Target, Globe, Compass, Sparkles, TrendingUp } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ConsultingReportViewProps {
  studentName: string;
  grade: HighSchoolGrade;
  semester: Semester;
  targetMajor?: string;
  targetCategory?: string;
  track: DepartmentTrack;
  subjects: SubjectEntry[];
  gpaSummary: StudentGPASummary;
  reachList: EvaluatedUniversityRecord[];
  targetList: EvaluatedUniversityRecord[];
  safetyList: EvaluatedUniversityRecord[];
  selectedReachUnivId: string | null;
  onSelectReachUniv: (univId: string) => void;
  reachGoal: ReachGoalAnalysis;
  strategies?: SubjectStudyStrategy[];
  branding: CompanyBranding;
  generatedDate: string;
}

export const ConsultingReportView: React.FC<ConsultingReportViewProps> = ({
  studentName,
  grade,
  semester,
  targetMajor,
  targetCategory,
  track,
  subjects,
  gpaSummary,
  reachList,
  targetList,
  safetyList,
  selectedReachUnivId,
  onSelectReachUniv,
  reachGoal,
  branding,
  generatedDate,
}) => {
  const majorName = targetMajor || track.name;
  const categoryName = targetCategory || track.category;
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | SupportCategory>('ALL');
  const [matchTypeFilter, setMatchTypeFilter] = useState<'ALL' | '희망학과 일치' | '선택계열 추천학과'>('ALL');
  const [reachGoalFilter, setReachGoalFilter] = useState<'ALL' | '희망학과 상향' | '선택계열 추천'>('ALL');

  const filterByMatchType = (list: EvaluatedUniversityRecord[]) => {
    if (matchTypeFilter === 'ALL') return list;
    if (matchTypeFilter === '희망학과 일치') {
      return list.filter((u) => u.matchType === '희망학과 일치');
    }
    return list.filter((u) => u.matchType !== '희망학과 일치');
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
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">{rec.department}</span>
                          {rec.matchType === '선택계열 상향추천 (합격유망)' || rec.matchType.includes('상향추천') ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              선택계열 상향추천 (합격유망)
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              희망학과 일치
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {rec.admissionType} · 경쟁률 {rec.competitionRate2025}:1 · 충원율 {rec.replenishRate2025}%
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
            {studentName || '학생'} · {grade} {semester} 수시 학생부교과 진학분석 리포트
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 mt-2">
            <span>
              희망 학과: <strong className="text-slate-900">{majorName}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>계열: {categoryName}</span>
            {track.relatedDepartments.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>유사 분석 학과: {track.relatedDepartments.join(', ')}</span>
              </>
            )}
          </div>
        </div>

        {/* 우측 생디 로고 영역 */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
          <a
            href="https://www.sangdi.net"
            target="_blank"
            rel="noopener noreferrer"
            title="생디 (www.sangdi.net) 공식 플랫폼"
            className="h-12 px-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center hover:border-sky-500 transition-colors"
          >
            <BrandLogo branding={branding} className="h-9 w-auto" />
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
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              01. 5등급제 내신 평균 계산 및 9등급제 정밀 환산 성적 (실제 입력 학기 기반 종합 집계)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              학생이 실제로 입력한 이수 학기({gpaSummary.semesterSummaries.map((s) => s.label).join(', ') || '성적'})의 과목별 이수단위 가중평균만을 정밀 계산하여 정확한 수시 지원 기준 종합 내신을 도출합니다. (미입력 및 미도래 학기 완전 배제)
            </p>
          </div>
          <span className="text-xs text-slate-600 font-mono tabular-nums bg-slate-100 px-2.5 py-1 rounded-md">
            총 {gpaSummary.subjectCount}과목 · {gpaSummary.totalCredits}학점 실집계 반영
          </span>
        </div>

        {/* 학기별(1·2학기) 성적 구성 및 누적 집계 현황 카드 그리드 */}
        {gpaSummary.semesterSummaries && gpaSummary.semesterSummaries.length > 0 && (
          <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                학기별(1학기·2학기) 성적 구성 및 실제 입력 누적 집계 결과
              </span>
              <span className="text-[11px] font-semibold text-blue-700">
                총 {gpaSummary.semesterSummaries.length}개 학기 정밀 집계 반영 (실제 입력 학기만 산출)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {gpaSummary.semesterSummaries.map((ss) => (
                <div
                  key={ss.label}
                  className="p-2.5 bg-white border border-slate-200 rounded-lg flex flex-col justify-between shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{ss.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {ss.subjectCount}과목 · {ss.credits}학점
                    </span>
                  </div>
                  <div className="mt-1 space-y-0.5 font-mono tabular-nums">
                    <div className="flex items-baseline justify-between text-[11px]">
                      <span className="text-slate-400 font-sans text-[10px]">5등급:</span>
                      <span className="font-bold text-blue-700">{ss.avg5.toFixed(2)}등급</span>
                    </div>
                    <div className="flex items-baseline justify-between text-[11px]">
                      <span className="text-slate-400 font-sans text-[10px]">9등급:</span>
                      <span className="font-semibold text-slate-800">{ss.avg9.toFixed(2)}등급</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 학년별 합산 요약 */}
            {gpaSummary.yearlySummaries && gpaSummary.yearlySummaries.length > 0 && (
              <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-slate-700">학년별 합산:</span>
                  {gpaSummary.yearlySummaries.map((ys) => (
                    <span key={ys.gradeLevel} className="text-slate-600 font-mono">
                      <strong className="text-slate-800">{ys.gradeLevel}</strong> ({ys.credits}학점):{' '}
                      <span className="text-blue-700 font-semibold">5등급 {ys.avg5.toFixed(2)}</span> /{' '}
                      <span className="text-slate-700 font-semibold">9등급 {ys.avg9.toFixed(2)}</span>
                    </span>
                  ))}
                </div>
                <div className="font-bold text-slate-900 font-mono text-xs">
                  최종 종합: 5등급 <span className="text-blue-700 font-bold">{gpaSummary.avg5.toFixed(2)}</span> (9등급 {gpaSummary.avg9.toFixed(2)})
                </div>
              </div>
            )}
          </div>
        )}

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
              02. [{majorName}] 수시 학생부교과 2024(재작년)·2025(작년) 공식 70% 컷 입결 분석
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              학생이 입력한 <strong>희망학과([{majorName}])</strong>를 최우선으로 분석하며, 상향·적정·안정 전 영역에서 풍부한 대학군을 제공하고, 상향 지원에 한해 과도한 내신 격차를 제외한 <strong>[{categoryName}]</strong> 내 실현 가능한 전략 추천 학과를 함께 제안합니다.
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
              {(['ALL', '희망학과 일치', '선택계열 추천학과'] as const).map((mType) => (
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
            `희망학과([${majorName}]) 도전 지원권 및 [${categoryName}] 내 합격선이 비교적 유리한 전략 추천 모집단위 목록입니다.`,
            '상향지원',
            filteredReach
          )}

        {(categoryFilter === 'ALL' || categoryFilter === '적정지원') &&
          renderUniversitySectionTable(
            '적정지원 대학 및 학과 목록 (Target)',
            `학생의 9등급제 환산 내신과 2개년 평균 70% 컷이 근접한 희망학과([${majorName}]) 중심의 합격 유력 대학군입니다.`,
            '적정지원',
            filteredTarget
          )}

        {(categoryFilter === 'ALL' || categoryFilter === '안정지원') &&
          renderUniversitySectionTable(
            '안정지원 대학 및 학과 목록 (Safety)',
            `2개년 70% 컷 및 50% 컷 대비 성적 여유가 충분한 희망학과([${majorName}]) 중심의 수시 6장 안정권 대학군입니다.`,
            '안정지원',
            filteredSafety
          )}
      </section>

      {/* SECTION 03: 상향지원 대학 합격을 위한 목표 내신 등급 및 필요 상승폭 분석 */}
      <section id="section-goal" className="mb-8">
        <div className="pb-3 mb-4 border-b border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                03. 상향지원 대학 합격을 위한 목표 내신 등급 및 필요 상승폭 분석
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                목표 상향 대학을 선택하면 학생의 현재 내신에서 몇 등급을 더 올려야 하는지와 남은 학기 필요 평균 성적을 정밀 계산합니다. 학생이 입력한 <strong>희망학과([{majorName}])</strong>뿐만 아니라 <strong>[{categoryName}] 계열 추천 학과</strong>를 다수 제공하여 폭넓은 전략 시뮬레이션이 가능합니다.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              상향 목표 후보군: 총 {reachList.length}개 모집단위
            </span>
          </div>
        </div>

        {/* 상향 목표 선택 패널: 1) 희망학과 상향 / 2) 선택계열 추천학과 다수 제공 */}
        <div className="mb-5 no-print space-y-3">
          {/* 1. 희망학과 상향 목록 */}
          {reachList.filter((u) => u.matchType === '희망학과 일치').length > 0 && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                <span>🎯 희망학과([{majorName}]) 상향 목표 대학 ({reachList.filter((u) => u.matchType === '희망학과 일치').length}개)</span>
                <span className="text-[11px] font-normal text-slate-500">클릭하여 해당 대학 기준으로 목표 상승폭을 분석하세요</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {reachList
                  .filter((u) => u.matchType === '희망학과 일치')
                  .map((u) => {
                    const isSelected =
                      selectedReachUnivId === u.id ||
                      (!selectedReachUnivId &&
                        reachGoal.targetUniversityName === u.university &&
                        reachGoal.targetDepartmentName === u.department);
                    const diff9 = Number(Math.max(0.05, gpaSummary.avg9 - u.avgCutoff9).toFixed(2));
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => onSelectReachUniv(u.id)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all whitespace-nowrap shrink-0 text-left ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs ring-2 ring-blue-300'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 font-medium'
                        }`}
                      >
                        <span className="font-bold">{u.university}</span> {u.department}
                        <span className="ml-1.5 font-mono text-[11px] opacity-90">
                          ({u.avgCutoff9.toFixed(2)}컷 · -{diff9.toFixed(2)})
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* 2. 선택계열 추천 학과 (개수 대폭 확대) */}
          {reachList.filter((u) => u.matchType !== '희망학과 일치').length > 0 && (
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>🌟 [{categoryName}] 선택계열 추천 상향 목표 학과 ({reachList.filter((u) => u.matchType !== '희망학과 일치').length}개)</span>
                <span className="text-[11px] font-normal text-amber-700">과도한 내신 격차를 배제하고 학생의 현재 내신에서 현실적으로 도약 가능한 [{categoryName}] 내 실현 가능 상향 도전 모집단위입니다</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {reachList
                  .filter((u) => u.matchType !== '희망학과 일치')
                  .map((u) => {
                    const isSelected =
                      selectedReachUnivId === u.id ||
                      (!selectedReachUnivId &&
                        reachGoal.targetUniversityName === u.university &&
                        reachGoal.targetDepartmentName === u.department);
                    const diff9 = Number(Math.max(0.05, gpaSummary.avg9 - u.avgCutoff9).toFixed(2));
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => onSelectReachUniv(u.id)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all whitespace-nowrap shrink-0 text-left ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs ring-2 ring-amber-300'
                            : 'bg-white text-slate-800 border-amber-200 hover:border-amber-400 hover:bg-amber-100/50 font-medium'
                        }`}
                      >
                        <span className="font-bold">{u.university}</span> {u.department}
                        <span className="ml-1 px-1 py-0.2 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                          계열추천
                        </span>
                        <span className="ml-1.5 font-mono text-[11px] opacity-90">
                          ({u.avgCutoff9.toFixed(2)}컷 · -{diff9.toFixed(2)})
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* 선택된 목표 대학 정밀 진단 카드 */}
        <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-xl mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-blue-200/80">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-700 shrink-0" />
              <div>
                <span className="text-xs text-blue-800 font-semibold">현재 분석 중인 목표 대학:</span>
                <div className="text-sm font-bold text-slate-900">
                  {reachGoal.targetUniversityName} {reachGoal.targetDepartmentName} (
                  {reachGoal.targetAdmissionType})
                </div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white text-blue-800 border border-blue-300">
              진단 결과: {reachGoal.feasibilityLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-3.5 bg-white border border-blue-200/80 rounded-lg shadow-2xs">
              <div className="text-xs text-slate-500">현재 내신 → 목표 합격선 (9등급제)</div>
              <div className="text-lg font-mono font-bold tabular-nums text-slate-900 mt-1">
                {reachGoal.currentAvg9.toFixed(2)}등급 →{' '}
                <span className="text-blue-700">{reachGoal.targetCutoff9.toFixed(2)}등급</span>
              </div>
              <div className="text-xs font-semibold text-emerald-700 mt-1 font-mono tabular-nums">
                9등급제 기준 -{reachGoal.requiredImprovement9.toFixed(2)}등급 향상 필요
              </div>
            </div>

            <div className="p-3.5 bg-white border border-blue-200/80 rounded-lg shadow-2xs">
              <div className="text-xs text-slate-500">현재 내신 → 목표 합격선 (5등급제)</div>
              <div className="text-lg font-mono font-bold tabular-nums text-slate-900 mt-1">
                {reachGoal.currentAvg5.toFixed(2)}등급 →{' '}
                <span className="text-blue-700">{reachGoal.targetCutoff5.toFixed(2)}등급</span>
              </div>
              <div className="text-xs font-semibold text-emerald-700 mt-1 font-mono tabular-nums">
                5등급제 기준 -{reachGoal.requiredImprovement5.toFixed(2)}등급 향상 필요
              </div>
            </div>

            <div className="p-3.5 bg-white border border-blue-200/80 rounded-lg shadow-2xs">
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
                현재 {reachGoal.completedSemesters}개 학기 이수 · 수시 3-1까지 잔여 {reachGoal.remainingSemesters}학기 기준
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-white/80 p-3 rounded-lg border border-blue-100">
            {reachGoal.summaryAdvice}
          </p>
        </div>

        {/* 상향지원 목표 대학 및 계열 추천 학과 전체 비교 분석표 */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-sky-700" />
                <span>상향지원 목표 대학 및 선택계열 추천 학과 시뮬레이션 비교표</span>
                <span className="text-xs font-normal text-slate-500">({reachList.length}개 모집단위)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                각 대학별 70% 컷과 학생 성적 대비 필요 상승폭 및 잔여 학기 요구 평균 등급을 한눈에 비교할 수 있습니다.
              </p>
            </div>

            <div className="inline-flex p-1 bg-slate-100 rounded-lg no-print">
              {(['ALL', '희망학과 상향', '선택계열 추천'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setReachGoalFilter(mode)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    reachGoalFilter === mode
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode === 'ALL'
                    ? `전체 보기 (${reachList.length})`
                    : mode === '희망학과 상향'
                    ? `희망학과 (${reachList.filter((u) => u.matchType === '희망학과 일치').length})`
                    : `계열추천 (${reachList.filter((u) => u.matchType !== '희망학과 일치').length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-600">
                  <th className="py-2.5 pl-4 pr-2 font-semibold">구분</th>
                  <th className="py-2.5 px-2 font-semibold">대학명</th>
                  <th className="py-2.5 px-2 font-semibold">모집단위 (학과)</th>
                  <th className="py-2.5 px-2 font-semibold">전형유형</th>
                  <th className="py-2.5 px-2 font-semibold text-right">2개년 평균컷 (5등급 환산)</th>
                  <th className="py-2.5 px-2 font-semibold text-right">필요 상승폭 (9등급 / 5등급)</th>
                  <th className="py-2.5 px-2 font-semibold text-right">남은 {reachGoal.remainingSemesters}학기 목표 등급</th>
                  <th className="py-2.5 px-2 font-semibold">수능최저 · 충원율</th>
                  <th className="py-2.5 pl-2 pr-4 font-semibold text-right no-print">목표 설정</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {reachList
                  .filter((u) => {
                    if (reachGoalFilter === '희망학과 상향') return u.matchType === '희망학과 일치';
                    if (reachGoalFilter === '선택계열 추천') return u.matchType !== '희망학과 일치';
                    return true;
                  })
                  .map((rec) => {
                    const isSelected =
                      selectedReachUnivId === rec.id ||
                      (!selectedReachUnivId &&
                        reachGoal.targetUniversityName === rec.university &&
                        reachGoal.targetDepartmentName === rec.department);
                    const isAlt =
                      rec.matchType === '선택계열 상향추천 (합격유망)' || rec.matchType.includes('상향추천');
                    const req9 = Number(Math.max(0.05, gpaSummary.avg9 - rec.avgCutoff9).toFixed(2));
                    const req5 = Number(Math.max(0.04, gpaSummary.avg5 - rec.equivalentCutoff5).toFixed(2));

                    // 잔여 학기 필요 평균 계산
                    const rem = reachGoal.remainingSemesters;
                    const comp = reachGoal.completedSemesters;
                    const tot = rem + comp;
                    const fut9 = Math.max(1.0, Math.min(gpaSummary.avg9, (rec.avgCutoff9 * tot - gpaSummary.avg9 * comp) / rem));
                    const fut5 = Math.max(1.0, Math.min(gpaSummary.avg5, (rec.equivalentCutoff5 * tot - gpaSummary.avg5 * comp) / rem));

                    return (
                      <tr
                        key={rec.id}
                        className={`hover:bg-slate-50/90 transition-colors ${
                          isSelected ? 'bg-blue-50/60 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2.5 pl-4 pr-2 whitespace-nowrap">
                          {isAlt ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              계열추천
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              희망학과
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 font-bold text-slate-900 whitespace-nowrap">
                          {rec.university}
                          <span className="text-[11px] font-normal text-slate-500 ml-1">
                            · {rec.region}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 font-semibold text-slate-800">
                          {rec.department}
                        </td>
                        <td className="py-2.5 px-2 text-slate-600 whitespace-nowrap">
                          {rec.admissionType}
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums whitespace-nowrap">
                          <span className="font-bold text-blue-700">{rec.avgCutoff9.toFixed(2)}등급</span>
                          <span className="text-[11px] text-slate-500 ml-1">
                            (5등급 {rec.equivalentCutoff5.toFixed(2)})
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums whitespace-nowrap text-amber-700 font-bold">
                          -{req9.toFixed(2)}등급
                          <span className="text-[11px] font-normal text-slate-500 ml-1">
                            (5등급 -{req5.toFixed(2)})
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono tabular-nums whitespace-nowrap text-emerald-700 font-semibold">
                          5등급 {fut5.toFixed(2)}
                          <span className="text-[11px] font-normal text-slate-500 ml-1">
                            (9등급 {fut9.toFixed(2)})
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-slate-600">
                          <div className="text-slate-800 text-[11px]">{rec.csatMinimum}</div>
                          <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                            충원율 {rec.replenishRate2025}% · 경쟁률 {rec.competitionRate2025}:1
                          </div>
                        </td>
                        <td className="py-2.5 pl-2 pr-4 text-right whitespace-nowrap no-print">
                          <button
                            type="button"
                            onClick={() => onSelectReachUniv(rec.id)}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs font-bold'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? '선택됨 (분석중)' : '목표로 선택'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
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
