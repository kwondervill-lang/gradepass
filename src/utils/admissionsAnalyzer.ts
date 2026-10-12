import {
  DEPARTMENT_TRACKS,
  GRADE5_TO_GRADE9_MAP,
  SUBJECT_GROUP_STUDY_GUIDES,
  buildDynamicTrack,
  convert9To5Equivalent,
  getAdmissionRecordsForStudentTarget,
  getAdmissionRecordsForTrack,
} from '../data/admissionsData';
import {
  DepartmentTrack,
  EvaluatedUniversityRecord,
  Grade5Tier,
  HighSchoolGrade,
  Semester,
  SubjectEntry,
  SubjectGroup,
  SubjectStudyStrategy,
  SupportCategory,
} from '../types/admissions';

export interface GroupSummary {
  group: SubjectGroup;
  credits: number;
  subjectCount: number;
  avg5: number;
  avg9: number;
}

export interface YearlyGPASummary {
  gradeLevel: HighSchoolGrade;
  credits: number;
  subjectCount: number;
  avg5: number;
  avg9: number;
}

export interface SemesterGPASummary {
  gradeLevel: HighSchoolGrade;
  semester: Semester;
  label: string; // 예: '고1 1학기', '고2 2학기'
  credits: number;
  subjectCount: number;
  avg5: number;
  avg9: number;
}

export interface StudentGPASummary {
  totalCredits: number;
  subjectCount: number;
  avg5: number;
  avg9: number;
  coreAvg5: number;
  coreAvg9: number;
  estimatedTopPercent: number;
  groupSummaries: GroupSummary[];
  yearlySummaries: YearlyGPASummary[];
  semesterSummaries: SemesterGPASummary[];
}

export function getActiveGradesForStudent(studentGrade: HighSchoolGrade): HighSchoolGrade[] {
  if (studentGrade === '고1') return ['고1'];
  if (studentGrade === '고2') return ['고1', '고2'];
  return ['고1', '고2', '고3'];
}

export function filterSubjectsForStudentGrade(
  subjects: SubjectEntry[],
  studentGrade: HighSchoolGrade,
  studentSemester?: Semester,
  calculateAllEntered: boolean = true
): SubjectEntry[] {
  const activeGrades = getActiveGradesForStudent(studentGrade);
  return subjects.filter((s) => {
    // 1. 학생의 현재 학년을 초과하는 미래 학년의 성적은 절대 포함하지 않음
    // (예: 현재 고1이면 고2·고3 성적 완전 제외, 현재 고2이면 고3 성적 완전 제외)
    if (!activeGrades.includes(s.gradeLevel)) {
      return false;
    }

    // 2. 현재 학년에서 아직 시작되지 않은 미래 학기 필터링:
    // 학생이 현재 '1학기'인 경우 (예: 고1 1학기, 고2 1학기), 현재 학년의 '2학기'는 아직 도래하지 않은 미래 학기이므로 제외
    if (s.gradeLevel === studentGrade && studentSemester === '1학기' && s.semester === '2학기') {
      return false;
    }

    // 3. 학생이 실제로 입력한 교과목만 집계 계산에 포함
    return true;
  });
}

export function getSubjectGrade9(entry: SubjectEntry): number {
  return GRADE5_TO_GRADE9_MAP[entry.grade5][entry.subBand];
}

export function calculateStudentGPA(subjects: SubjectEntry[]): StudentGPASummary {
  if (subjects.length === 0) {
    return {
      totalCredits: 0,
      subjectCount: 0,
      avg5: 0,
      avg9: 0,
      coreAvg5: 0,
      coreAvg9: 0,
      estimatedTopPercent: 0,
      groupSummaries: [],
      yearlySummaries: [],
      semesterSummaries: [],
    };
  }

  let totalCredits = 0;
  let weightedSum5 = 0;
  let weightedSum9 = 0;

  let coreCredits = 0;
  let coreSum5 = 0;
  let coreSum9 = 0;

  const groupsOrder: SubjectGroup[] = ['국어', '수학', '영어', '사회', '과학', '정보·제2외국어'];
  const groupAcc: Record<SubjectGroup, { credits: number; count: number; sum5: number; sum9: number }> = {
    국어: { credits: 0, count: 0, sum5: 0, sum9: 0 },
    수학: { credits: 0, count: 0, sum5: 0, sum9: 0 },
    영어: { credits: 0, count: 0, sum5: 0, sum9: 0 },
    사회: { credits: 0, count: 0, sum5: 0, sum9: 0 },
    과학: { credits: 0, count: 0, sum5: 0, sum9: 0 },
    '정보·제2외국어': { credits: 0, count: 0, sum5: 0, sum9: 0 },
  };

  const gradesOrder: HighSchoolGrade[] = ['고1', '고2', '고3'];
  const yearlyAcc: Record<HighSchoolGrade, { credits: number; count: number; sum5: number; sum9: number }> = {
    고1: { credits: 0, count: 0, sum5: 0, sum9: 0 },
    고2: { credits: 0, count: 0, sum5: 0, sum9: 0 },
    고3: { credits: 0, count: 0, sum5: 0, sum9: 0 },
  };

  const semesterOrder: Array<{ gradeLevel: HighSchoolGrade; semester: Semester; label: string }> = [
    { gradeLevel: '고1', semester: '1학기', label: '고1 1학기' },
    { gradeLevel: '고1', semester: '2학기', label: '고1 2학기' },
    { gradeLevel: '고2', semester: '1학기', label: '고2 1학기' },
    { gradeLevel: '고2', semester: '2학기', label: '고2 2학기' },
    { gradeLevel: '고3', semester: '1학기', label: '고3 1학기' },
    { gradeLevel: '고3', semester: '2학기', label: '고3 2학기' },
  ];

  const semesterAcc: Record<string, { credits: number; count: number; sum5: number; sum9: number }> = {
    '고1 1학기': { credits: 0, count: 0, sum5: 0, sum9: 0 },
    '고1 2학기': { credits: 0, count: 0, sum5: 0, sum9: 0 },
    '고2 1학기': { credits: 0, count: 0, sum5: 0, sum9: 0 },
    '고2 2학기': { credits: 0, count: 0, sum5: 0, sum9: 0 },
    '고3 1학기': { credits: 0, count: 0, sum5: 0, sum9: 0 },
    '고3 2학기': { credits: 0, count: 0, sum5: 0, sum9: 0 },
  };

  for (const sub of subjects) {
    const g9 = getSubjectGrade9(sub);
    totalCredits += sub.credits;
    weightedSum5 += sub.grade5 * sub.credits;
    weightedSum9 += g9 * sub.credits;

    if (sub.group !== '정보·제2외국어') {
      coreCredits += sub.credits;
      coreSum5 += sub.grade5 * sub.credits;
      coreSum9 += g9 * sub.credits;
    }

    groupAcc[sub.group].credits += sub.credits;
    groupAcc[sub.group].count += 1;
    groupAcc[sub.group].sum5 += sub.grade5 * sub.credits;
    groupAcc[sub.group].sum9 += g9 * sub.credits;

    const gl: HighSchoolGrade = sub.gradeLevel || '고1';
    if (yearlyAcc[gl]) {
      yearlyAcc[gl].credits += sub.credits;
      yearlyAcc[gl].count += 1;
      yearlyAcc[gl].sum5 += sub.grade5 * sub.credits;
      yearlyAcc[gl].sum9 += g9 * sub.credits;
    }

    const sem: Semester = sub.semester || '1학기';
    const semKey = `${gl} ${sem}`;
    if (semesterAcc[semKey]) {
      semesterAcc[semKey].credits += sub.credits;
      semesterAcc[semKey].count += 1;
      semesterAcc[semKey].sum5 += sub.grade5 * sub.credits;
      semesterAcc[semKey].sum9 += g9 * sub.credits;
    }
  }

  const avg5 = totalCredits > 0 ? Number((weightedSum5 / totalCredits).toFixed(2)) : 0;
  const avg9 = totalCredits > 0 ? Number((weightedSum9 / totalCredits).toFixed(2)) : 0;
  const coreAvg5 = coreCredits > 0 ? Number((coreSum5 / coreCredits).toFixed(2)) : avg5;
  const coreAvg9 = coreCredits > 0 ? Number((coreSum9 / coreCredits).toFixed(2)) : avg9;

  const ninePercentileAnchors: Array<[number, number]> = [
    [1.0, 1.2],
    [1.5, 5.5],
    [2.0, 11.0],
    [2.5, 17.0],
    [3.0, 23.0],
    [3.5, 31.5],
    [4.0, 40.0],
    [5.0, 60.0],
    [6.0, 77.0],
    [7.0, 89.0],
    [8.0, 96.0],
    [9.0, 99.5],
  ];

  let estimatedTopPercent = 50;
  for (let i = 0; i < ninePercentileAnchors.length - 1; i++) {
    const [gA, pA] = ninePercentileAnchors[i];
    const [gB, pB] = ninePercentileAnchors[i + 1];
    if (avg9 >= gA && avg9 <= gB) {
      const r = (avg9 - gA) / (gB - gA);
      estimatedTopPercent = Number((pA + r * (pB - pA)).toFixed(1));
      break;
    }
  }
  if (avg9 < 1.0) estimatedTopPercent = 1.0;

  const groupSummaries: GroupSummary[] = groupsOrder
    .filter((g) => groupAcc[g].count > 0)
    .map((g) => ({
      group: g,
      credits: groupAcc[g].credits,
      subjectCount: groupAcc[g].count,
      avg5: Number((groupAcc[g].sum5 / groupAcc[g].credits).toFixed(2)),
      avg9: Number((groupAcc[g].sum9 / groupAcc[g].credits).toFixed(2)),
    }));

  const yearlySummaries: YearlyGPASummary[] = gradesOrder
    .filter((gl) => yearlyAcc[gl].count > 0)
    .map((gl) => ({
      gradeLevel: gl,
      credits: yearlyAcc[gl].credits,
      subjectCount: yearlyAcc[gl].count,
      avg5: Number((yearlyAcc[gl].sum5 / yearlyAcc[gl].credits).toFixed(2)),
      avg9: Number((yearlyAcc[gl].sum9 / yearlyAcc[gl].credits).toFixed(2)),
    }));

  const semesterSummaries: SemesterGPASummary[] = semesterOrder
    .filter((so) => semesterAcc[so.label].count > 0)
    .map((so) => ({
      gradeLevel: so.gradeLevel,
      semester: so.semester,
      label: so.label,
      credits: semesterAcc[so.label].credits,
      subjectCount: semesterAcc[so.label].count,
      avg5: Number((semesterAcc[so.label].sum5 / semesterAcc[so.label].credits).toFixed(2)),
      avg9: Number((semesterAcc[so.label].sum9 / semesterAcc[so.label].credits).toFixed(2)),
    }));

  return {
    totalCredits,
    subjectCount: subjects.length,
    avg5,
    avg9,
    coreAvg5,
    coreAvg9,
    estimatedTopPercent,
    groupSummaries,
    yearlySummaries,
    semesterSummaries,
  };
}

export interface CategorizedUniversityLists {
  allEvaluated: EvaluatedUniversityRecord[];
  reachList: EvaluatedUniversityRecord[];
  targetList: EvaluatedUniversityRecord[];
  safetyList: EvaluatedUniversityRecord[];
}

export function evaluateUniversitiesForStudent(
  targetMajorOrTrackId: string,
  studentAvg9: number,
  studentAvg5: number,
  targetCategory?: string
): CategorizedUniversityLists {
  const rawRecords = getAdmissionRecordsForStudentTarget(targetMajorOrTrackId, targetCategory);

  const evaluated: EvaluatedUniversityRecord[] = rawRecords.map((rec) => {
    const avgCutoff9 = Number(((rec.cutoff2024_9 + rec.cutoff2025_9) / 2).toFixed(2));
    const trend9 = Number((rec.cutoff2025_9 - rec.cutoff2024_9).toFixed(2));
    const equivalentCutoff5 = convert9To5Equivalent(avgCutoff9);

    const gap9 = Number((studentAvg9 - avgCutoff9).toFixed(2));
    const gap5 = Number((studentAvg5 - equivalentCutoff5).toFixed(2));

    let category: SupportCategory;
    let probabilityPercent: number;
    let analysisComment: string;

    // gap9 = studentAvg - cutoff
    // positive means student grade is numerically higher (worse grade) -> reach
    // negative means student grade is numerically lower (better grade) -> safety
    if (gap9 > 0.25) {
      category = '상향지원';
      const rawProb = Math.round(48 - (gap9 - 0.25) * 35);
      probabilityPercent = Math.max(10, Math.min(48, rawProb));
      analysisComment = `2개년 70%컷(${avgCutoff9}등급) 대비 9등급제 ${gap9.toFixed(
        2
      )}등급 상향 필요 · 충원율(${rec.replenishRate2025}%) 및 수능최저 충족 시 도전 가능`;
    } else if (gap9 >= -0.28 && gap9 <= 0.25) {
      category = '적정지원';
      const rawProb = Math.round(68 - gap9 * 50);
      probabilityPercent = Math.max(50, Math.min(84, rawProb));
      analysisComment = `2개년 70%컷(${avgCutoff9}등급)과 근접한 적정 지원권 · ${rec.csatMinimum} 충족 시 합격 유력`;
    } else {
      category = '안정지원';
      const rawProb = Math.round(85 + Math.min(13, Math.abs(gap9 + 0.28) * 18));
      probabilityPercent = Math.max(85, Math.min(98, rawProb));
      analysisComment = `2개년 70%컷(${avgCutoff9}등급) 대비 ${Math.abs(gap9).toFixed(
        2
      )}등급 여유 확보 · 안정권`;
    }

    return {
      ...rec,
      avgCutoff9,
      trend9,
      equivalentCutoff5,
      gap9,
      gap5,
      category,
      probabilityPercent,
      analysisComment,
    };
  });

  // 1. 희망학과 일치 레코드와 계열 내 기타 학과 레코드 분리
  const exactMajorEvaluated = evaluated.filter((r) => r.matchType === '희망학과 일치');
  const otherCategoryEvaluated = evaluated.filter((r) => r.matchType !== '희망학과 일치');

  // 적정지원 (Target): 유저 요청 원칙 - 학생이 입력한 희망학과 최우선 + 적정지원 개수도 상향/안정처럼 풍부하게(최대 8개) 제공
  let targetList = exactMajorEvaluated
    .filter((r) => r.category === '적정지원')
    .sort((a, b) => a.avgCutoff9 - b.avgCutoff9);

  // 만약 희망학과 내 적정지원 개수가 부족한 경우, 학생 성적과 가까운 순으로 보충하여 6~8개 확보
  if (targetList.length < 8 && exactMajorEvaluated.length > 0) {
    const existingIds = new Set(targetList.map((t) => t.id));
    const closestExact = [...exactMajorEvaluated]
      .filter((r) => !existingIds.has(r.id) && Math.abs(r.gap9) <= 0.45)
      .sort((a, b) => Math.abs(a.gap9) - Math.abs(b.gap9));

    for (const item of closestExact) {
      if (targetList.length >= 8) break;
      targetList.push({
        ...item,
        category: '적정지원',
        analysisComment: item.analysisComment.includes('적정')
          ? item.analysisComment
          : `2개년 70%컷(${item.avgCutoff9}등급) 근접 적정 지원 가능권 · ${item.csatMinimum} 충족 시 안정적 합격권`,
      });
      existingIds.add(item.id);
    }
  }

  // 만약 희망학과만으로 6개 미만일 경우, 선택계열 내 적정 구간(Math.abs(gap) <= 0.30) 인접학과로 보충
  if (targetList.length < 6 && otherCategoryEvaluated.length > 0) {
    const existingIds = new Set(targetList.map((t) => t.id));
    const closestOther = [...otherCategoryEvaluated]
      .filter((r) => !existingIds.has(r.id) && Math.abs(r.gap9) <= 0.30)
      .sort((a, b) => Math.abs(a.gap9) - Math.abs(b.gap9));

    for (const item of closestOther) {
      if (targetList.length >= 8) break;
      targetList.push({
        ...item,
        category: '적정지원',
        analysisComment: `[${targetCategory || '선택계열'} 적정추천] 2개년 70%컷(${item.avgCutoff9}등급) 근접 적정 합격 유망권`,
      });
      existingIds.add(item.id);
    }
  }

  targetList.sort((a, b) => a.avgCutoff9 - b.avgCutoff9);
  targetList = targetList.slice(0, 8);

  // 안정지원 (Safety): 오직 학생이 입력한 희망학과 중심으로 구성 (최대 8개)
  let safetyList = exactMajorEvaluated
    .filter((r) => r.category === '안정지원')
    .sort((a, b) => a.avgCutoff9 - b.avgCutoff9);

  if (safetyList.length === 0 && exactMajorEvaluated.length > 0) {
    safetyList = [...exactMajorEvaluated]
      .slice(-6)
      .map((item) => ({ ...item, category: '안정지원' as SupportCategory }));
  } else {
    safetyList = safetyList.slice(0, 8);
  }

  // 상향지원 (Reach):
  // 1) 학생이 입력한 희망학과 상향 대학 (우선순위 1)
  const exactReach = exactMajorEvaluated
    .filter((r) => r.category === '상향지원')
    .sort((a, b) => a.avgCutoff9 - b.avgCutoff9);

  let exactReachList = exactReach.slice(0, 6);
  if (exactReachList.length === 0 && exactMajorEvaluated.length > 0) {
    exactReachList = exactMajorEvaluated.slice(0, 5).map((item) => ({
      ...item,
      category: '상향지원' as SupportCategory,
      analysisComment: `최상위 모집단위 소신 지원권 (작년 50%컷 ${item.cutoff2025_50_9}등급 기준 경합)`,
    }));
  }

  // 2) 유저 요청:
  // "계열 추천 상향 목표 학과의 경우는 내신 등급 차이가 너무 큰 곳의 경우는 추천에서 제외해주세요. 학생이 어느 정도 가능한 대학과 학과를 계열 추천으로 넣어주세요."
  // 내신 격차가 너무 큰 곳(gap > 0.48~0.50 이상)은 현실적으로 합격이 불가능하므로 엄격히 제외하고,
  // 잔여 학기 집중 및 수능최저/충원율로 극복 가능한 실현 가능 상향 도전권(gap9: +0.02 ~ +0.48)만 선별 추천
  const MAX_REACHABLE_GAP = 0.48;

  let altCategoryReachCandidates = otherCategoryEvaluated
    .filter((r) => r.gap9 >= 0.02 && r.gap9 <= MAX_REACHABLE_GAP)
    .sort((a, b) => a.gap9 - b.gap9); // 학생 성적과 가까워 실현 가능성이 높은 순서로 정렬

  // 만약 후보군이 적은 경우, 최대 허용 한도를 0.52로 소폭 조정하되, 그 이상의 무리한 격차(0.60 이상 등)는 엄격히 배제
  if (altCategoryReachCandidates.length < 5) {
    altCategoryReachCandidates = otherCategoryEvaluated
      .filter((r) => r.gap9 >= -0.05 && r.gap9 <= 0.52)
      .sort((a, b) => Math.abs(a.gap9 - 0.25) - Math.abs(b.gap9 - 0.25));
  }

  const formattedAltReach = altCategoryReachCandidates
    .slice(0, 8)
    .map((item) => ({
      ...item,
      category: '상향지원' as SupportCategory,
      matchType: '선택계열 상향추천 (합격유망)' as any,
      analysisComment: `[${targetCategory || '선택계열'} 전략추천] 2개년 평균컷 ${item.avgCutoff9}등급(격차 ${
        item.gap9 > 0 ? '+' : ''
      }${item.gap9.toFixed(2)}등급) · 잔여학기 집중 및 충원율(${item.replenishRate2025}%) 고려 시 실현 가능한 상향 목표`,
    }));

  let reachList = [...exactReachList, ...formattedAltReach];
  reachList.sort((a, b) => a.avgCutoff9 - b.avgCutoff9);

  return {
    allEvaluated: evaluated,
    reachList,
    targetList,
    safetyList,
  };
}

export interface ReachGoalAnalysis {
  targetUniversityName: string;
  targetDepartmentName: string;
  targetAdmissionType: string;
  currentAvg5: number;
  currentAvg9: number;
  targetCutoff9: number;
  targetCutoff5: number;
  requiredImprovement9: number;
  requiredImprovement5: number;
  completedSemesters: number;
  remainingSemesters: number;
  requiredFutureSemesterAvg5: number;
  requiredFutureSemesterAvg9: number;
  feasibilityLabel: '매우 유력 (단기 도약 가능)' | '충분히 가능 (핵심과목 집중)' | '도전적 목표 (전과목 1등급대 전략 필요)';
  summaryAdvice: string;
}

export function calculateReachGoalAnalysis(
  studentAvg5: number,
  studentAvg9: number,
  grade: HighSchoolGrade,
  semester: Semester,
  selectedReachUniv: EvaluatedUniversityRecord | null,
  reachList: EvaluatedUniversityRecord[],
  actualCompletedSemesters?: number
): ReachGoalAnalysis {
  // 기본 목표 대학은 희망학과 일치하는 상향 대학을 우선 선택!
  const exactReachList = reachList.filter((u) => u.matchType === '희망학과 일치');
  const fallbackTarget =
    exactReachList.length > 0
      ? exactReachList[Math.min(1, exactReachList.length - 1)]
      : reachList.length > 0
      ? reachList[0]
      : null;
  const target = selectedReachUniv || fallbackTarget;

  const targetCutoff9 = target ? target.avgCutoff9 : Math.max(1.1, Number((studentAvg9 - 0.45).toFixed(2)));
  const targetCutoff5 = target ? target.equivalentCutoff5 : convert9To5Equivalent(targetCutoff9);

  const requiredImprovement9 = Number(Math.max(0.05, studentAvg9 - targetCutoff9).toFixed(2));
  const requiredImprovement5 = Number(Math.max(0.04, studentAvg5 - targetCutoff5).toFixed(2));

  const semesterMap: Record<HighSchoolGrade, Record<Semester, { done: number; left: number }>> = {
    고1: {
      '1학기': { done: 1, left: 4 },
      '2학기': { done: 2, left: 3 },
    },
    고2: {
      '1학기': { done: 3, left: 2 },
      '2학기': { done: 3, left: 2 }, // 고2 2학기 재학 중이면 완료는 고1-1, 고1-2, 고2-1 총 3학기이며 잔여 2학기(고2-2, 고3-1)
    },
    고3: {
      '1학기': { done: 4, left: 1 },
      '2학기': { done: 5, left: 1 },
    },
  };

  // 학생이 실제로 성적을 입력 완료한 학기 수 (전달된 경우 실입력 학기 수 우선 반영)
  const defaultDone = semesterMap[grade]?.[semester]?.done || 3;
  const completedSemesters =
    actualCompletedSemesters !== undefined && actualCompletedSemesters > 0
      ? Math.min(5, actualCompletedSemesters)
      : defaultDone;

  // 수시 학생부교과 전형(3학년 1학기까지 총 5개 학기 반영 기준) 잔여 학기
  const remainingSemesters = Math.max(1, 5 - completedSemesters);
  const totalSemesters = completedSemesters + remainingSemesters;

  const rawFuture9 =
    (targetCutoff9 * totalSemesters - studentAvg9 * completedSemesters) / remainingSemesters;
  const rawFuture5 =
    (targetCutoff5 * totalSemesters - studentAvg5 * completedSemesters) / remainingSemesters;

  const requiredFutureSemesterAvg9 = Number(Math.max(1.0, Math.min(studentAvg9, rawFuture9)).toFixed(2));
  const requiredFutureSemesterAvg5 = Number(Math.max(1.0, Math.min(studentAvg5, rawFuture5)).toFixed(2));

  let feasibilityLabel: ReachGoalAnalysis['feasibilityLabel'];
  if (requiredImprovement9 <= 0.35) {
    feasibilityLabel = '매우 유력 (단기 도약 가능)';
  } else if (requiredImprovement9 <= 0.75) {
    feasibilityLabel = '충분히 가능 (핵심과목 집중)';
  } else {
    feasibilityLabel = '도전적 목표 (전과목 1등급대 전략 필요)';
  }

  const targetUnivName = target ? target.university : '목표 상향대학';
  const targetDeptName = target ? target.department : '희망 모집단위';
  const targetAdmType = target ? target.admissionType : '학생부교과전형';

  const summaryAdvice = `${targetUnivName} ${targetDeptName}(${targetAdmType})의 2개년 평균 합격선은 9등급제 기준 ${targetCutoff9.toFixed(
    2
  )}등급(5등급제 환산 ${targetCutoff5.toFixed(
    2
  )}등급)입니다. 현재 학생의 성적에서 5등급제 기준 -${requiredImprovement5.toFixed(
    2
  )}등급(9등급제 환산 -${requiredImprovement9.toFixed(
    2
  )}등급)을 단축하면 합격 안정권에 진입하며, 남은 ${remainingSemesters}개 학기 동안 평균 5등급제 ${requiredFutureSemesterAvg5.toFixed(
    2
  )}등급(9등급제 ${requiredFutureSemesterAvg9.toFixed(2)}등급) 달성이 필요합니다.`;

  return {
    targetUniversityName: targetUnivName,
    targetDepartmentName: targetDeptName,
    targetAdmissionType: targetAdmType,
    currentAvg5: studentAvg5,
    currentAvg9: studentAvg9,
    targetCutoff9,
    targetCutoff5,
    requiredImprovement9,
    requiredImprovement5,
    completedSemesters,
    remainingSemesters,
    requiredFutureSemesterAvg5,
    requiredFutureSemesterAvg9,
    feasibilityLabel,
    summaryAdvice,
  };
}

export function generateStrategicSubjectRecommendations(
  subjects: SubjectEntry[],
  trackOrTarget: DepartmentTrack | string,
  targetCategory?: string
): {
  strategies: SubjectStudyStrategy[];
  simulatedTop3Avg5: number;
  simulatedTop3Avg9: number;
  simulatedTotalGain9: number;
} {
  let track: DepartmentTrack;
  if (typeof trackOrTarget === 'object' && trackOrTarget !== null) {
    track = trackOrTarget;
  } else {
    track =
      DEPARTMENT_TRACKS.find((t) => t.id === trackOrTarget) ||
      buildDynamicTrack(trackOrTarget, targetCategory || '');
  }

  const currentSummary = calculateStudentGPA(subjects);
  const totalCredits = currentSummary.totalCredits || 1;
  const currentWeightedSum9 = currentSummary.avg9 * totalCredits;

  const candidates: Array<SubjectStudyStrategy & { score: number }> = subjects.map((sub) => {
    const currentGrade9 = getSubjectGrade9(sub);
    let targetGrade5: Grade5Tier = sub.grade5;
    let targetSubBand: '상' | '중' | '하' = '중';

    if (sub.grade5 >= 3) {
      targetGrade5 = (sub.grade5 - 1) as Grade5Tier;
      targetSubBand = '상';
    } else if (sub.grade5 === 2) {
      targetGrade5 = 1;
      targetSubBand = '중';
    } else {
      targetGrade5 = 1;
      targetSubBand = '상';
    }

    const targetGrade9 = GRADE5_TO_GRADE9_MAP[targetGrade5][targetSubBand];
    const newWeightedSum9 = currentWeightedSum9 - currentGrade9 * sub.credits + targetGrade9 * sub.credits;
    const expectedOverallGrade9After = Number((newWeightedSum9 / totalCredits).toFixed(2));
    const expectedGrade9Improvement = Number(
      Math.max(0.03, currentSummary.avg9 - expectedOverallGrade9After).toFixed(2)
    );

    const isMajorCore =
      track.coreSubjectGroups.includes(sub.group) ||
      track.recommendedCourses.some((c) => sub.name.includes(c) || c.includes(sub.name));

    const score =
      expectedGrade9Improvement * 100 +
      (isMajorCore ? 18 : 0) +
      sub.credits * 3 +
      (sub.grade5 >= 2 ? 12 : 0);

    const guide = SUBJECT_GROUP_STUDY_GUIDES[sub.group];

    const reasonSummary = isMajorCore
      ? `${track.name} 지원 시 핵심 반영 교과(${sub.group} · ${sub.credits}학점)입니다. 현재 5등급제 ${sub.grade5}등급(${currentGrade9.toFixed(
          2
        )}등급)에서 ${targetGrade5}등급(${targetGrade9.toFixed(
          2
        )}등급)으로 상승 시 전체 9등급제 내신 평균이 -${expectedGrade9Improvement.toFixed(
          2
        )}등급 향상되어 합격 기여도가 가장 큽니다.`
      : `이수 단위가 ${sub.credits}학점으로 높고 현재 5등급제 ${sub.grade5}등급 구간에 위치해 있어, ${targetGrade5}등급으로 1단계 도약 시 전체 9등급제 평균을 -${expectedGrade9Improvement.toFixed(
          2
        )}등급 향상시킬 수 있는 전략 과목입니다.`;

    return {
      subjectId: sub.id,
      subjectName: sub.name,
      group: sub.group,
      credits: sub.credits,
      currentGrade5: sub.grade5,
      currentSubBand: sub.subBand,
      currentGrade9,
      targetGrade5,
      targetGrade9,
      expectedOverallGrade9After,
      expectedGrade9Improvement,
      isMajorCore,
      priorityRank: 0,
      reasonSummary,
      examStrategy: `${guide.gradeJumpTip[sub.grade5]} ${guide.examFocus}`,
      performanceAndSeteukStrategy: guide.seteukFocus,
      weeklyActionPlan: guide.weeklyRoutine,
      score,
    };
  });

  candidates.sort((a, b) => b.score - a.score);

  const strategies: SubjectStudyStrategy[] = candidates.map((item, idx) => {
    const { score: _unused, ...rest } = item;
    return {
      ...rest,
      priorityRank: idx + 1,
    };
  });

  const top3Ids = new Set(strategies.slice(0, 3).map((s) => s.subjectId));
  let simSum5 = 0;
  let simSum9 = 0;

  for (const sub of subjects) {
    if (top3Ids.has(sub.id)) {
      const strat = strategies.find((s) => s.subjectId === sub.id)!;
      simSum5 += strat.targetGrade5 * sub.credits;
      simSum9 += strat.targetGrade9 * sub.credits;
    } else {
      simSum5 += sub.grade5 * sub.credits;
      simSum9 += getSubjectGrade9(sub) * sub.credits;
    }
  }

  const simulatedTop3Avg5 = Number((simSum5 / totalCredits).toFixed(2));
  const simulatedTop3Avg9 = Number((simSum9 / totalCredits).toFixed(2));
  const simulatedTotalGain9 = Number(Math.max(0, currentSummary.avg9 - simulatedTop3Avg9).toFixed(2));

  return {
    strategies,
    simulatedTop3Avg5,
    simulatedTop3Avg9,
    simulatedTotalGain9,
  };
}
