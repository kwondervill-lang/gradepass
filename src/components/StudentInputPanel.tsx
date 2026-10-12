import React, { useMemo, useState } from 'react';
import {
  AVAILABLE_SUBJECTS_BY_GROUP,
  DEFAULT_COURSES_BY_GRADE_SEMESTER_AND_GROUP,
  DEFAULT_SEMESTER_SUBJECT_PRESETS,
  DEFAULT_SUBJECT_PRESETS,
  GRADE5_PERCENTILE_DESC,
  GRADE5_TO_GRADE9_MAP,
  POPULAR_MAJOR_PRESETS,
  TARGET_CATEGORY_LIST,
  buildDynamicTrack,
  inferCategoryFromMajor,
} from '../data/admissionsData';
import {
  Grade5Tier,
  HighSchoolGrade,
  Semester,
  SubBand,
  SubjectEntry,
  SubjectGroup,
} from '../types/admissions';
import {
  calculateStudentGPA,
  filterSubjectsForStudentGrade,
  getActiveGradesForStudent,
  getSubjectGrade9,
} from '../utils/admissionsAnalyzer';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Lock,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';

interface StudentInputPanelProps {
  studentName: string;
  onStudentNameChange: (name: string) => void;
  grade: HighSchoolGrade;
  onGradeChange: (grade: HighSchoolGrade) => void;
  semester: Semester;
  onSemesterChange: (sem: Semester) => void;
  targetMajor: string;
  onTargetMajorChange: (major: string) => void;
  targetCategory: string;
  onTargetCategoryChange: (category: string) => void;
  subjects: SubjectEntry[];
  onSubjectsChange: (subjects: SubjectEntry[]) => void;
  onApplyGradePreset: (grade: HighSchoolGrade) => void;
  onApplyScoreTierPreset: (tier: 'top' | 'upper' | 'midUpper' | 'mid') => void;
}

const SUBJECT_GROUPS: SubjectGroup[] = ['국어', '수학', '영어', '사회', '과학', '정보·제2외국어'];
const GRADES_5: Grade5Tier[] = [1, 2, 3, 4, 5];
const SUB_BANDS: SubBand[] = ['상', '중', '하'];
const ALL_GRADES: HighSchoolGrade[] = ['고1', '고2', '고3'];

const DEFAULT_COURSES_BY_GRADE_AND_GROUP: Record<
  HighSchoolGrade,
  Record<SubjectGroup, { name: string; credits: number }>
> = {
  고1: {
    국어: { name: '공통국어1', credits: 4 },
    수학: { name: '공통수학1', credits: 4 },
    영어: { name: '공통영어1', credits: 4 },
    사회: { name: '통합사회1', credits: 4 },
    과학: { name: '통합과학1', credits: 4 },
    '정보·제2외국어': { name: '정보', credits: 3 },
  },
  고2: {
    국어: { name: '문학', credits: 4 },
    수학: { name: '대수', credits: 4 },
    영어: { name: '영어I', credits: 4 },
    사회: { name: '사회·문화', credits: 3 },
    과학: { name: '물리학', credits: 4 },
    '정보·제2외국어': { name: '데이터 과학', credits: 3 },
  },
  고3: {
    국어: { name: '화법과 언어', credits: 4 },
    수학: { name: '미적분I', credits: 4 },
    영어: { name: '영어 독해와 작문', credits: 4 },
    사회: { name: '경제', credits: 3 },
    과학: { name: '생명과학', credits: 4 },
    '정보·제2외국어': { name: '인공지능 수학', credits: 3 },
  },
};

export const StudentInputPanel: React.FC<StudentInputPanelProps> = ({
  studentName,
  onStudentNameChange,
  grade,
  onGradeChange,
  semester,
  onSemesterChange,
  targetMajor,
  onTargetMajorChange,
  targetCategory,
  onTargetCategoryChange,
  subjects,
  onSubjectsChange,
  onApplyGradePreset,
  onApplyScoreTierPreset,
}) => {
  const [showConversionGuide, setShowConversionGuide] = useState(false);
  // 학년별 성적 입력 탭: 기본값은 현재 학생 학년
  const [selectedGradeTab, setSelectedGradeTab] = useState<HighSchoolGrade>(grade);
  // 학기별 성적 입력 탭: '1학기' | '2학기' | '전체'
  const [selectedSemesterTab, setSelectedSemesterTab] = useState<'1학기' | '2학기' | '전체'>('1학기');

  // 학생 학년에 따라 집계 대상 학년 결정
  const activeGrades = useMemo(() => getActiveGradesForStudent(grade), [grade]);

  // 학생 학년이 바뀔 때 만약 현재 탭이 허용되지 않은 학년이면 유효한 학년으로 자동 전환
  React.useEffect(() => {
    if (!activeGrades.includes(selectedGradeTab)) {
      setSelectedGradeTab(grade);
    }
  }, [grade, activeGrades, selectedGradeTab]);

  const dynamicTrack = useMemo(
    () => buildDynamicTrack(targetMajor, targetCategory),
    [targetMajor, targetCategory]
  );

  // 현재 활성 학년별 과목 목록
  const tabSubjects = useMemo(
    () => subjects.filter((s) => (s.gradeLevel || '고1') === selectedGradeTab),
    [subjects, selectedGradeTab]
  );

  // 1학기 과목
  const sem1Subjects = useMemo(
    () => tabSubjects.filter((s) => (s.semester || '1학기') === '1학기'),
    [tabSubjects]
  );

  // 2학기 과목
  const sem2Subjects = useMemo(
    () => tabSubjects.filter((s) => (s.semester || '1학기') === '2학기'),
    [tabSubjects]
  );

  const sem1Stat = useMemo(() => calculateStudentGPA(sem1Subjects), [sem1Subjects]);
  const sem2Stat = useMemo(() => calculateStudentGPA(sem2Subjects), [sem2Subjects]);

  // 집계 대상 전체 활성 과목 (모든 입력된 학기 과목 가중합산)
  const activeCumulativeSubjects = useMemo(
    () => filterSubjectsForStudentGrade(subjects, grade, semester, true),
    [subjects, grade, semester]
  );

  const cumulativeSummary = useMemo(
    () => calculateStudentGPA(activeCumulativeSubjects),
    [activeCumulativeSubjects]
  );

  // 각 학년별 요약 계산 (1학기, 2학기, 종합)
  const gradeSummaries = useMemo(() => {
    const map: Record<
      HighSchoolGrade,
      {
        count: number;
        credits: number;
        avg5: number;
        avg9: number;
        sem1Count: number;
        sem1Avg5: number;
        sem1Avg9: number;
        sem2Count: number;
        sem2Avg5: number;
        sem2Avg9: number;
      }
    > = {
      고1: { count: 0, credits: 0, avg5: 0, avg9: 0, sem1Count: 0, sem1Avg5: 0, sem1Avg9: 0, sem2Count: 0, sem2Avg5: 0, sem2Avg9: 0 },
      고2: { count: 0, credits: 0, avg5: 0, avg9: 0, sem1Count: 0, sem1Avg5: 0, sem1Avg9: 0, sem2Count: 0, sem2Avg5: 0, sem2Avg9: 0 },
      고3: { count: 0, credits: 0, avg5: 0, avg9: 0, sem1Count: 0, sem1Avg5: 0, sem1Avg9: 0, sem2Count: 0, sem2Avg5: 0, sem2Avg9: 0 },
    };
    ALL_GRADES.forEach((g) => {
      const gSubs = subjects.filter((s) => (s.gradeLevel || '고1') === g);
      const summ = calculateStudentGPA(gSubs);
      const s1 = gSubs.filter((s) => (s.semester || '1학기') === '1학기');
      const s2 = gSubs.filter((s) => (s.semester || '1학기') === '2학기');
      const sum1 = calculateStudentGPA(s1);
      const sum2 = calculateStudentGPA(s2);
      map[g] = {
        count: gSubs.length,
        credits: summ.totalCredits,
        avg5: summ.avg5,
        avg9: summ.avg9,
        sem1Count: s1.length,
        sem1Avg5: sum1.avg5,
        sem1Avg9: sum1.avg9,
        sem2Count: s2.length,
        sem2Avg5: sum2.avg5,
        sem2Avg9: sum2.avg9,
      };
    });
    return map;
  }, [subjects]);

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
    onSubjectsChange(subjects.filter((s) => s.id !== id));
  };

  // 특정 교과군 빠른 추가 (학기 지원)
  const handleAddSubjectByGroup = (group: SubjectGroup, targetSem?: Semester) => {
    const semToUse: Semester = targetSem || (selectedSemesterTab === '2학기' ? '2학기' : '1학기');
    const def =
      DEFAULT_COURSES_BY_GRADE_SEMESTER_AND_GROUP[selectedGradeTab]?.[semToUse]?.[group] || {
        name: `${group}1`,
        credits: 4,
      };
    const newEntry: SubjectEntry = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      gradeLevel: selectedGradeTab,
      semester: semToUse,
      group,
      name: def.name,
      credits: def.credits,
      grade5: 2,
      subBand: '중',
    };
    onSubjectsChange([...subjects, newEntry]);
  };

  // 일반 과목 추가 (학기 지원)
  const handleAddGeneralSubject = (targetSem?: Semester) => {
    const semToUse: Semester = targetSem || (selectedSemesterTab === '2학기' ? '2학기' : '1학기');
    const defaultName =
      selectedGradeTab === '고1'
        ? semToUse === '1학기'
          ? '공통수학1'
          : '공통수학2'
        : selectedGradeTab === '고2'
        ? semToUse === '1학기'
          ? '대수'
          : '미적분I'
        : semToUse === '1학기'
        ? '미적분I'
        : '확률과 통계';

    const newEntry: SubjectEntry = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      gradeLevel: selectedGradeTab,
      semester: semToUse,
      group: '수학',
      name: defaultName,
      credits: 4,
      grade5: 2,
      subBand: '중',
    };
    onSubjectsChange([...subjects, newEntry]);
  };

  // 해당 학년/학기 기본 과목 불러오기
  const handleLoadDefaultPresetForTab = (targetSem?: Semester) => {
    const semToUse = targetSem || (selectedSemesterTab === '전체' ? undefined : selectedSemesterTab);
    if (semToUse) {
      const otherSubjects = subjects.filter(
        (s) => !((s.gradeLevel || '고1') === selectedGradeTab && (s.semester || '1학기') === semToUse)
      );
      const presets = DEFAULT_SEMESTER_SUBJECT_PRESETS[selectedGradeTab][semToUse].map((p) => ({
        ...p,
        id: `preset-${selectedGradeTab}-${semToUse}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      }));
      onSubjectsChange([...otherSubjects, ...presets]);
    } else {
      const existingOtherGrades = subjects.filter((s) => (s.gradeLevel || '고1') !== selectedGradeTab);
      const presets = DEFAULT_SUBJECT_PRESETS[selectedGradeTab].map((p) => ({
        ...p,
        id: `preset-${selectedGradeTab}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      }));
      onSubjectsChange([...existingOtherGrades, ...presets]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. 학생 기본 인적사항 및 희망 학과 직접 입력 카드 */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900">01. 학생 인적사항 및 희망 학과 직접 입력</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              입력한 학생 이름과 희망 학과·계열에 맞춰 대학별 2개년 공식 입결(70% 컷)을 실시간으로 분석합니다.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>리포트 실시간 연동 중</span>
          </div>
        </div>

        {/* 학생 성명, 학년, 학기 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              학생 성명 <span className="text-blue-600 font-normal">(리포트 실시간 반영)</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => onStudentNameChange(e.target.value)}
              placeholder="학생 이름 입력 (예: 김서연)"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">현재 학년</label>
              <span className="text-[11px] text-blue-700 font-semibold">
                {grade === '고1' ? '고1 반영' : grade === '고2' ? '고1~2 누적 반영' : '고1~3 전학년 반영'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
              {ALL_GRADES.map((g) => (
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
                  {g}
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

        {/* 희망 학과 직접 입력란 (유저 요청 1 반영!) */}
        <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-xl mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
              희망 학과 직접 입력
              <span className="text-[11px] font-normal text-sky-800">
                (원하는 학과명을 자유롭게 직접 입력하세요)
              </span>
            </label>
            <span className="text-xs text-slate-600 font-medium">
              현재 분석 계열: <strong className="text-blue-800 font-semibold">{targetCategory}</strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={targetMajor}
                onChange={(e) => {
                  const val = e.target.value;
                  onTargetMajorChange(val);
                  const inferred = inferCategoryFromMajor(val);
                  if (inferred) onTargetCategoryChange(inferred);
                }}
                placeholder="예: 간호학과, 컴퓨터공학과, 경영학과, 심리학과, 생명과학과 등 직접 입력"
                className="w-full px-3.5 py-2.5 text-sm font-semibold bg-white border border-sky-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs transition-all"
              />
            </div>

            {/* 희망 계열 선택 드롭다운 */}
            <div className="sm:w-44 shrink-0">
              <select
                value={targetCategory}
                onChange={(e) => onTargetCategoryChange(e.target.value)}
                className="w-full px-3 py-2.5 text-xs font-semibold bg-white border border-sky-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-600"
              >
                {TARGET_CATEGORY_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 주요·인기 학과 빠른 선택 태그 */}
          <div className="mt-3">
            <div className="text-[11px] font-semibold text-slate-600 mb-1.5">
              자주 찾는 주요 학과 빠른 선택:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_MAJOR_PRESETS.map((item) => {
                const isSelected = targetMajor === item.major;
                return (
                  <button
                    key={item.major}
                    type="button"
                    onClick={() => {
                      onTargetMajorChange(item.major);
                      onTargetCategoryChange(item.category);
                    }}
                    className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400 hover:text-blue-700'
                    }`}
                  >
                    {item.major}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 실시간 리포트 반영 안내 배너 */}
          <div className="mt-3 pt-2.5 border-t border-sky-200/60 flex flex-wrap items-center justify-between gap-1 text-xs">
            <span className="text-slate-600">
              우측 리포트 반영 대상:{' '}
              <strong className="text-blue-700 font-bold">{studentName || '학생'}</strong> 학생 ·{' '}
              <strong className="text-slate-900 font-bold">{targetMajor || '컴퓨터공학과'}</strong> (
              {targetCategory})
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">✓ 실시간 자동 업데이트</span>
          </div>
        </div>

        {/* 선택 학과 핵심 안내 */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
          <div className="font-semibold text-slate-900 flex items-center justify-between">
            <span>{dynamicTrack.name} 핵심 추천 교과군 및 유사 분석 학과</span>
            <span className="text-[11px] text-blue-700 font-medium">{dynamicTrack.category}</span>
          </div>
          <div>
            중점 반영 교과군:{' '}
            <strong className="text-blue-700">{dynamicTrack.coreSubjectGroups.join(' · ')}</strong>
            <span className="mx-1.5 text-slate-300">|</span>
            권장 선택과목: <span className="text-slate-800">{dynamicTrack.recommendedCourses.join(', ')}</span>
          </div>
          {dynamicTrack.relatedDepartments.length > 0 && (
            <div className="text-[11px] text-slate-500">
              유사·인접 비교 모집단위: {dynamicTrack.relatedDepartments.join(' · ')}
            </div>
          )}
        </div>
      </section>

      {/* 2. 교과목 선택 및 5등급제 내신 등급 입력 카드 */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">
                02. 학년별 이수 교과목 및 5등급제 내신 등급 입력
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
                {grade === '고1' ? '고1 성적 집계' : grade === '고2' ? '고1~2 성적 합산 집계' : '고1~3 전학년 합산 집계'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              학년별(고1, 고2, 고3)로 실제 이수한 과목을 추가하여 입력하면 학년별 가중평균과 전체 종합 내신이 자동 집계됩니다.
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

        {/* 환산 기준표 */}
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

        {/* 누적 종합 성적 요약 배너 */}
        <div className="mb-4 p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-950">
                수시 리포트 종합 반영 성적 ({grade === '고1' ? '고1' : grade === '고2' ? '고1~2 누적' : '고1~3 전학년'})
              </div>
              <div className="text-[11px] text-blue-700 mt-0.5">
                총 {cumulativeSummary.subjectCount}개 과목 · {cumulativeSummary.totalCredits}학점 집계 완료
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono tabular-nums">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-sans">5등급제 종합 평균</div>
              <div className="text-lg font-bold text-blue-700">
                {cumulativeSummary.avg5.toFixed(2)}
                <span className="text-xs font-sans font-semibold ml-0.5">등급</span>
              </div>
            </div>
            <div className="h-8 w-px bg-blue-200" />
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-sans">9등급제 환산 평균</div>
              <div className="text-lg font-bold text-slate-900">
                {cumulativeSummary.avg9.toFixed(2)}
                <span className="text-xs font-sans font-semibold ml-0.5">등급</span>
              </div>
            </div>
          </div>
        </div>

        {/* 학년별 성적 입력 탭 바 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">성적 입력 대상 학년 선택:</span>
            <span className="text-[11px] text-blue-700 font-semibold">
              고1, 고2, 고3 학년별로 1학기와 2학기 성적을 각각 입력하여 전학년 누적 집계합니다.
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {ALL_GRADES.map((g) => {
              const isIncludedInCurrent = activeGrades.includes(g);
              const isSelectedTab = selectedGradeTab === g;
              const gStat = gradeSummaries[g];

              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    if (isIncludedInCurrent) {
                      setSelectedGradeTab(g);
                    }
                  }}
                  disabled={!isIncludedInCurrent}
                  className={`relative p-3 rounded-xl border text-left transition-all ${
                    !isIncludedInCurrent
                      ? 'bg-slate-50 border-slate-200/70 text-slate-400 opacity-60 cursor-not-allowed'
                      : isSelectedTab
                      ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600 text-slate-900'
                      : 'bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold">{g} 성적</span>
                      {isSelectedTab && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    {!isIncludedInCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                        <Lock className="w-3 h-3" /> 미반영 (미도래)
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500">
                        총 {gStat.count}과목 · {gStat.credits}학점
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>1학기: {gStat.sem1Count}과목</span>
                    <span>2학기: {gStat.sem2Count}과목</span>
                  </div>

                  <div className="mt-1.5 flex items-baseline justify-between font-mono tabular-nums text-xs">
                    <span className="text-slate-500 font-sans text-[11px]">
                      {isIncludedInCurrent ? '평균:' : '미도래 학년 (집계 제외)'}
                    </span>
                    {isIncludedInCurrent && gStat.count > 0 ? (
                      <span className="font-bold text-blue-700">
                        5등급 {gStat.avg5.toFixed(2)} (9등급 {gStat.avg9.toFixed(2)})
                      </span>
                    ) : isIncludedInCurrent ? (
                      <span className="text-slate-400 text-[11px] font-sans">과목 등록 대기</span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1학기 / 2학기 분리 탭 선택 바 (유저 요청 4 핵심 구현) */}
        <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              {selectedGradeTab} 학기별 성적 분리 입력:
            </span>
            <span className="text-[11px] text-slate-500">
              {selectedGradeTab} 1학기와 2학기 성적을 각각 분리하여 입력·집계합니다.
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedSemesterTab('1학기')}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedSemesterTab === '1학기'
                  ? 'bg-blue-50/90 border-blue-600 ring-1 ring-blue-600 text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-950 flex items-center gap-1">
                  📘 {selectedGradeTab} 1학기
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {sem1Subjects.length}과목 · {sem1Stat.totalCredits}학점
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between text-xs font-mono tabular-nums">
                <span className="text-[10px] text-slate-500 font-sans">1학기 평균:</span>
                <span className="font-bold text-blue-700">
                  {sem1Subjects.length > 0 ? `5등급 ${sem1Stat.avg5.toFixed(2)} (9등급 ${sem1Stat.avg9.toFixed(2)})` : '과목 없음'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSemesterTab('2학기')}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedSemesterTab === '2학기'
                  ? 'bg-amber-50/90 border-amber-600 ring-1 ring-amber-600 text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                  📙 {selectedGradeTab} 2학기
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {sem2Subjects.length}과목 · {sem2Stat.totalCredits}학점
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between text-xs font-mono tabular-nums">
                <span className="text-[10px] text-slate-500 font-sans">2학기 평균:</span>
                <span className="font-bold text-amber-700">
                  {sem2Subjects.length > 0 ? `5등급 ${sem2Stat.avg5.toFixed(2)} (9등급 ${sem2Stat.avg9.toFixed(2)})` : '과목 없음'}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedSemesterTab('전체')}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                selectedSemesterTab === '전체'
                  ? 'bg-slate-100 border-slate-700 ring-1 ring-slate-700 text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  📋 1·2학기 전체 보기
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  총 {tabSubjects.length}과목
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between text-xs font-mono tabular-nums">
                <span className="text-[10px] text-slate-500 font-sans">{selectedGradeTab} 합산:</span>
                <span className="font-bold text-slate-900">
                  {tabSubjects.length > 0 ? `5등급 ${gradeSummaries[selectedGradeTab].avg5.toFixed(2)}` : '과목 없음'}
                </span>
              </div>
            </button>
          </div>
        </div>

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
              onClick={() => handleLoadDefaultPresetForTab()}
              title={`${selectedGradeTab} 기본 추천 과목 불러오기`}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              {selectedGradeTab} {selectedSemesterTab !== '전체' ? selectedSemesterTab : ''} 기본과목 초기화
            </button>
          </div>
        </div>

        {/* 교과군 빠른 과목 추가 버튼 바 (학기 대응) */}
        <div className="mb-3.5 p-3 bg-slate-50/90 border border-slate-200 rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              {selectedGradeTab} {selectedSemesterTab === '2학기' ? '2학기' : '1학기'} 교과군 빠른 과목 추가:
            </span>
            <span className="text-[11px] text-slate-500">
              클릭 시 {selectedGradeTab} {selectedSemesterTab === '2학기' ? '2학기' : '1학기'} 대표 과목이 즉시 추가됩니다.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {SUBJECT_GROUPS.map((grp) => {
              const activeSem = selectedSemesterTab === '2학기' ? '2학기' : '1학기';
              const def =
                DEFAULT_COURSES_BY_GRADE_SEMESTER_AND_GROUP[selectedGradeTab]?.[activeSem]?.[grp] || {
                  name: `${grp}1`,
                  credits: 4,
                };
              return (
                <button
                  key={grp}
                  type="button"
                  onClick={() => handleAddSubjectByGroup(grp, activeSem)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-800 hover:border-blue-600 hover:text-blue-700 hover:bg-blue-50/50 shadow-2xs transition-colors whitespace-nowrap shrink-0"
                >
                  <span className="text-blue-600 font-bold">+</span>
                  <span>{grp}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({def.name})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 과목 리스트 헤더 & 카운트 */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="text-xs font-bold text-slate-800">
            {selectedGradeTab} {selectedSemesterTab === '전체' ? '1·2학기 전체' : selectedSemesterTab} 이수 교과목 목록 (
            {selectedSemesterTab === '1학기'
              ? `${sem1Subjects.length}과목`
              : selectedSemesterTab === '2학기'
              ? `${sem2Subjects.length}과목`
              : `${tabSubjects.length}과목`}
            )
          </div>
          <div className="text-xs text-slate-500">
            학기(1학기/2학기)와 과목별 학점, 5등급제 등급을 지정하세요
          </div>
        </div>

        {/* 과목 리스트 렌더링 */}
        {tabSubjects.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 my-2">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              {selectedGradeTab}에 등록된 이수 과목이 없습니다.
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              위 교과군 빠른 추가 버튼을 누르거나 아래 '교과목 추가하기' 버튼을 눌러 실제 성적을 입력하세요.
            </p>
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleLoadDefaultPresetForTab()}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                {selectedGradeTab} 추천 기본과목 불러오기
              </button>
              <button
                type="button"
                onClick={() => handleAddGeneralSubject(selectedSemesterTab === '2학기' ? '2학기' : '1학기')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                + {selectedSemesterTab === '2학기' ? '2학기' : '1학기'} 과목 직접 추가
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {(selectedSemesterTab === '1학기'
              ? sem1Subjects
              : selectedSemesterTab === '2학기'
              ? sem2Subjects
              : tabSubjects
            ).map((sub, index) => {
              const converted9 = getSubjectGrade9(sub);
              const subjectOptions = AVAILABLE_SUBJECTS_BY_GROUP[sub.group] || [];
              const isCustomName = !subjectOptions.includes(sub.name);

              return (
                <div
                  key={sub.id}
                  className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-2 items-center">
                    {/* 학기 선택 버튼 및 교과군 */}
                    <div className="col-span-12 sm:col-span-4 flex items-center gap-2">
                      <div className="inline-flex p-0.5 bg-slate-200/90 rounded-md shrink-0">
                        {(['1학기', '2학기'] as Semester[]).map((sem) => (
                          <button
                            key={sem}
                            type="button"
                            onClick={() => handleUpdateSubject(sub.id, { semester: sem })}
                            title={`${sem}로 변경`}
                            className={`px-2 py-0.5 text-[11px] font-bold rounded transition-colors whitespace-nowrap shrink-0 ${
                              (sub.semester || '1학기') === sem
                                ? sem === '1학기'
                                  ? 'bg-blue-600 text-white shadow-2xs'
                                  : 'bg-amber-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {sem}
                          </button>
                        ))}
                      </div>

                      <div className="flex-1 min-w-0">
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
                    </div>

                    <div className="col-span-6 sm:col-span-4">
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

                    <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1.5 pt-2 sm:pt-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block leading-tight">9등급 환산</span>
                        <span className="text-xs font-mono font-bold tabular-nums text-slate-900">
                          {converted9.toFixed(2)}등급
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(sub.id)}
                        aria-label={`${sub.name} 과목 삭제`}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors"
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
        )}

        {/* 과목 추가 버튼들 */}
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => handleAddGeneralSubject(selectedSemesterTab === '2학기' ? '2학기' : '1학기')}
            className="flex-1 py-2.5 px-4 border border-dashed border-slate-300 hover:border-blue-600 bg-slate-50/50 hover:bg-blue-50/40 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            + {selectedGradeTab} {selectedSemesterTab === '2학기' ? '2학기' : '1학기'} 교과목 추가하기
          </button>
          {selectedSemesterTab === '전체' && (
            <button
              type="button"
              onClick={() => handleAddGeneralSubject('2학기')}
              className="flex-1 py-2.5 px-4 border border-dashed border-amber-300 hover:border-amber-600 bg-amber-50/30 hover:bg-amber-50/60 text-amber-800 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              + {selectedGradeTab} 2학기 교과목 추가하기
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
