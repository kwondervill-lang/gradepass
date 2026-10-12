import React, { useState } from 'react';
import {
  AVAILABLE_SUBJECTS_BY_GROUP,
  DEPARTMENT_TRACKS,
  GRADE5_PERCENTILE_DESC,
  GRADE5_TO_GRADE9_MAP,
} from '../data/admissionsData';
import {
  Grade5Tier,
  HighSchoolGrade,
  Semester,
  SubBand,
  SubjectEntry,
  SubjectGroup,
} from '../types/admissions';
import { getSubjectGrade9 } from '../utils/admissionsAnalyzer';
import { Plus, Trash2, HelpCircle, RotateCcw } from 'lucide-react';

interface StudentInputPanelProps {
  studentName: string;
  onStudentNameChange: (name: string) => void;
  grade: HighSchoolGrade;
  onGradeChange: (grade: HighSchoolGrade) => void;
  semester: Semester;
  onSemesterChange: (sem: Semester) => void;
  selectedTrackId: string;
  onTrackChange: (trackId: string) => void;
  subjects: SubjectEntry[];
  onSubjectsChange: (subjects: SubjectEntry[]) => void;
  onApplyGradePreset: (grade: HighSchoolGrade) => void;
  onApplyScoreTierPreset: (tier: 'top' | 'upper' | 'midUpper' | 'mid') => void;
}

const SUBJECT_GROUPS: SubjectGroup[] = ['국어', '수학', '영어', '사회', '과학', '정보·제2외국어'];
const GRADES_5: Grade5Tier[] = [1, 2, 3, 4, 5];
const SUB_BANDS: SubBand[] = ['상', '중', '하'];

export const StudentInputPanel: React.FC<StudentInputPanelProps> = ({
  studentName,
  onStudentNameChange,
  grade,
  onGradeChange,
  semester,
  onSemesterChange,
  selectedTrackId,
  onTrackChange,
  subjects,
  onSubjectsChange,
  onApplyGradePreset,
  onApplyScoreTierPreset,
}) => {
  const [showConversionGuide, setShowConversionGuide] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');

  const selectedTrack =
    DEPARTMENT_TRACKS.find((t) => t.id === selectedTrackId) || DEPARTMENT_TRACKS[0];

  const categories = ['전체', ...Array.from(new Set(DEPARTMENT_TRACKS.map((t) => t.category)))];
  const filteredTracks =
    categoryFilter === '전체'
      ? DEPARTMENT_TRACKS
      : DEPARTMENT_TRACKS.filter((t) => t.category === categoryFilter);

  const handleUpdateSubject = (id: string, patch: Partial<SubjectEntry>) => {
    onSubjectsChange(
      subjects.map((sub) => {
        if (sub.id !== id) return sub;
        const updated = { ...sub, ...patch };
        if (patch.group && patch.group !== sub.group) {
          const defaultNames = AVAILABLE_SUBJECTS_BY_GROUP[patch.group];
          updated.name = defaultNames[0] || '';
        }
        return updated;
      })
    );
  };

  const handleRemoveSubject = (id: string) => {
    if (subjects.length <= 1) return;
    onSubjectsChange(subjects.filter((s) => s.id !== id));
  };

  const handleAddSubject = () => {
    const newId = `sub-${Date.now()}`;
    onSubjectsChange([
      ...subjects,
      {
        id: newId,
        group: '수학',
        name: '확률과 통계',
        credits: 4,
        grade5: 2,
        subBand: '중',
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* 1. 학생 학년 및 희망 학과 설정 카드 */}
      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">01. 학생 학년 및 희망 학과 선택</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              선택한 희망 학과와 유사·인접 학과의 대입정보포털 어디가 2024·2025 공식 70% 컷을 분석합니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">학생 성명</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => onStudentNameChange(e.target.value)}
              placeholder="이름 입력"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">현재 학년</label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
              {(['1학년', '2학년', '3학년'] as HighSchoolGrade[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onGradeChange(g)}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    grade === g
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  고{g.replace('학년', '')} ({g})
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">현재 학기</label>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
              {(['1학기', '2학기'] as Semester[]).map((sem) => (
                <button
                  key={sem}
                  type="button"
                  onClick={() => onSemesterChange(sem)}
                  className={`py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    semester === sem
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sem}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 계열 필터 버튼 */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700">희망 계열 및 학과 선택</label>
            <span className="text-xs text-slate-500">
              선택 계열: <strong className="text-slate-800">{selectedTrack.category}</strong>
            </span>
          </div>
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg mb-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
            {filteredTracks.map((track) => {
              const isSelected = track.id === selectedTrackId;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => onTrackChange(track.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-600 text-slate-900'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900">{track.name}</span>
                    <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                      {track.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                    유사·인접 분석 학과: {track.relatedDepartments.join(' · ')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
          <div className="font-semibold text-slate-900">
            선택 학과 핵심 권장과목 ({selectedTrack.name})
          </div>
          <div>
            중점 반영 교과군: <strong className="text-blue-700">{selectedTrack.coreSubjectGroups.join(' · ')}</strong>
            <span className="mx-1.5 text-slate-300">|</span>
            권장 선택과목: <span className="text-slate-800">{selectedTrack.recommendedCourses.join(', ')}</span>
          </div>
        </div>
      </section>

      {/* 2. 교과목 선택 및 5등급제 내신 등급 입력 카드 */}
      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              02. 이수 교과목 및 5등급제 내신 등급 입력
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              과목별 학점과 5등급제 등급(1~5등급)을 선택하면 9등급제 환산 성적이 실시간으로 계산됩니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowConversionGuide(!showConversionGuide)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showConversionGuide ? '환산 기준표 닫기' : '5→9등급 환산 기준표'}
          </button>
        </div>

        {showConversionGuide && (
          <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div className="font-bold text-slate-900 mb-2">
              2028 대입개편 5등급제 ↔ 기존 9등급제 누적 백분위 환산 기준표
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-1.5 pr-2">5등급제</th>
                    <th className="py-1.5 px-2">비율 (누적)</th>
                    <th className="py-1.5 px-2 text-right">상 (상위권)</th>
                    <th className="py-1.5 px-2 text-right">중 (표준중위)</th>
                    <th className="py-1.5 pl-2 text-right">하 (하위권)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/70 font-mono tabular-nums">
                  {GRADES_5.map((g5) => (
                    <tr key={g5}>
                      <td className="py-1.5 pr-2 font-sans font-bold text-slate-900">{g5}등급</td>
                      <td className="py-1.5 px-2 font-sans text-slate-600">
                        {GRADE5_PERCENTILE_DESC[g5].cumRatio}
                      </td>
                      <td className="py-1.5 px-2 text-right text-blue-700 font-semibold">
                        {GRADE5_TO_GRADE9_MAP[g5]['상'].toFixed(2)}등급
                      </td>
                      <td className="py-1.5 px-2 text-right text-slate-900 font-bold">
                        {GRADE5_TO_GRADE9_MAP[g5]['중'].toFixed(2)}등급
                      </td>
                      <td className="py-1.5 pl-2 text-right text-slate-600">
                        {GRADE5_TO_GRADE9_MAP[g5]['하'].toFixed(2)}등급
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 빠른 성적대 시뮬레이션 프리셋 바 */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-xs font-semibold text-slate-600">성적대별 빠른 샘플 적용:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => onApplyScoreTierPreset('top')}
              className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md hover:border-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              최상위권 (5등급 1.1)
            </button>
            <button
              type="button"
              onClick={() => onApplyScoreTierPreset('upper')}
              className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md hover:border-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              상위권 (5등급 1.6)
            </button>
            <button
              type="button"
              onClick={() => onApplyScoreTierPreset('midUpper')}
              className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md hover:border-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              중상위권 (5등급 2.1)
            </button>
            <button
              type="button"
              onClick={() => onApplyScoreTierPreset('mid')}
              className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 rounded-md hover:border-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0"
            >
              중위권 (5등급 2.8)
            </button>
            <button
              type="button"
              onClick={() => onApplyGradePreset(grade)}
              title="현재 학년 기본 과목으로 초기화"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              초기화
            </button>
          </div>
        </div>

        {/* 과목 리스트 */}
        <div className="space-y-2.5">
          {subjects.map((sub, index) => {
            const converted9 = getSubjectGrade9(sub);
            const subjectOptions = AVAILABLE_SUBJECTS_BY_GROUP[sub.group] || [];
            const isCustomName = !subjectOptions.includes(sub.name);

            return (
              <div
                key={sub.id}
                className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4 sm:col-span-3">
                    <label className="block text-[11px] text-slate-500 mb-0.5">
                      0{index + 1}. 교과군
                    </label>
                    <select
                      value={sub.group}
                      onChange={(e) =>
                        handleUpdateSubject(sub.id, { group: e.target.value as SubjectGroup })
                      }
                      className="w-full px-2 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:border-blue-600"
                    >
                      {SUBJECT_GROUPS.map((grp) => (
                        <option key={grp} value={grp}>
                          {grp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-5 sm:col-span-4">
                    <label className="block text-[11px] text-slate-500 mb-0.5">과목명</label>
                    <select
                      value={isCustomName ? '__custom__' : sub.name}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') return;
                        handleUpdateSubject(sub.id, { name: e.target.value });
                      }}
                      className="w-full px-2 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                    >
                      {subjectOptions.map((nameOpt) => (
                        <option key={nameOpt} value={nameOpt}>
                          {nameOpt}
                        </option>
                      ))}
                      {isCustomName && <option value="__custom__">{sub.name}</option>}
                    </select>
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <label className="block text-[11px] text-slate-500 mb-0.5">학점(단위)</label>
                    <select
                      value={sub.credits}
                      onChange={(e) =>
                        handleUpdateSubject(sub.id, { credits: Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 text-xs font-mono font-semibold bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:border-blue-600"
                    >
                      {[1, 2, 3, 4, 5].map((c) => (
                        <option key={c} value={c}>
                          {c}학점
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-12 sm:col-span-3 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-3">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-500 block">9등급제 환산</span>
                      <span className="text-sm font-mono font-bold tabular-nums text-slate-900">
                        {converted9.toFixed(2)}등급
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub.id)}
                      disabled={subjects.length <= 1}
                      aria-label={`${sub.name} 과목 삭제`}
                      className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-600 mr-1">5등급제 성적:</span>
                    <div className="inline-flex p-0.5 bg-slate-200/70 rounded-lg">
                      {GRADES_5.map((g5) => (
                        <button
                          key={g5}
                          type="button"
                          onClick={() => handleUpdateSubject(sub.id, { grade5: g5 })}
                          className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                            sub.grade5 === g5
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-700 hover:text-slate-900'
                          }`}
                        >
                          {g5}등급
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-500">등급 내 위치:</span>
                    <div className="inline-flex p-0.5 bg-slate-200/70 rounded-md">
                      {SUB_BANDS.map((band) => (
                        <button
                          key={band}
                          type="button"
                          onClick={() => handleUpdateSubject(sub.id, { subBand: band })}
                          className={`px-2 py-0.5 text-[11px] font-semibold rounded transition-colors whitespace-nowrap shrink-0 ${
                            sub.subBand === band
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {band}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleAddSubject}
          className="mt-3 w-full py-2.5 px-4 border border-dashed border-slate-300 hover:border-blue-600 bg-slate-50/50 hover:bg-blue-50/40 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          교과목 추가하기
        </button>
      </section>
    </div>
  );
};
