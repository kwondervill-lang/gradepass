import {
  DEPARTMENT_TRACKS,
  GRADE5_TO_GRADE9_MAP,
  SUBJECT_GROUP_STUDY_GUIDES,
  convert9To5Equivalent,
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

export interface StudentGPASummary {
  totalCredits: number;
  subjectCount: number;
  avg5: number;
  avg9: number;
  coreAvg5: number;
  coreAvg9: number;
  estimatedTopPercent: number;
  groupSummaries: GroupSummary[];
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

  return {
    totalCredits,
    subjectCount: subjects.length,
    avg5,
    avg9,
    coreAvg5,
    coreAvg9,
    estimatedTopPercent,
    groupSummaries,
  };
}

export interface CategorizedUniversityLists {
  allEvaluated: EvaluatedUniversityRecord[];
  reachList: EvaluatedUniversityRecord[];
  targetList: EvaluatedUniversityRecord[];
  safetyList: EvaluatedUniversityRecord[];
}

export function evaluateUniversitiesForStudent(
  trackId: string,
  studentAvg9: number,
  studentAvg5: number
): CategorizedUniversityLists {
  const rawRecords = getAdmissionRecordsForTrack(trackId);

  const evaluated: EvaluatedUniversityRecord[] = rawRecords.map((rec) => {
    const avgCutoff9 = Number(((rec.cutoff2024_9 + rec.cutoff2025_9) / 2).toFixed(2));
    const trend9 = Number((rec.cutoff2025_9 - rec.cutoff2024_9).toFixed(2));
    const equivalentCutoff5 = convert9To5Equivalent(avgCutoff9);

    const gap9 = Number((studentAvg9 - avgCutoff9).toFixed(2));
    const gap5 = Number((studentAvg5 - equivalentCutoff5).toFixed(2));

    let category: SupportCategory;
    let probabilityPercent: number;
    let analysisComment: string;

    if (gap9 > 0.14) {
      category = '상향지원';
      const rawProb = Math.round(52 - (gap9 - 0.14) * 45);
      probabilityPercent = Math.max(12, Math.min(48, rawProb));
      analysisComment = `2개년 70%컷(${avgCutoff9}등급) 대비 9등급제 ${gap9.toFixed(
        2
      )}등급 상향 필요 · 충원율(${rec.replenishRate2025}%) 및 수능최저 충족 시 도전 가능`;
    } else if (gap9 >= -0.20 && gap9 <= 0.14) {
      category = '적정지원';
      const rawProb = Math.round(68 - gap9 * 60);
      probabilityPercent = Math.max(50, Math.min(82, rawProb));
      analysisComment = `2개년 70%컷(${avgCutoff9}등급)과 근접한 적정 지원권 · ${rec.csatMinimum} 충족 시 합격 유력`;
    } else {
      category = '안정지원';
      const rawProb = Math.round(85 + Math.min(13, Math.abs(gap9 + 0.20) * 20));
      probabilityPercent = Math.max(84, Math.min(98, rawProb));
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

  const allReach = evaluated
    .filter((r) => r.category === '상향지원')
    .sort((a, b) => a.gap9 - b.gap9);

  const allTarget = evaluated
    .filter((r) => r.category === '적정지원')
    .sort((a, b) => a.avgCutoff9 - b.avgCutoff9);

  const allSafety = evaluated
    .filter((r) => r.category === '안정지원')
    .sort((a, b) => a.avgCutoff9 - b.avgCutoff9);

  let reachList = allReach.slice(0, 8);
  let targetList = allTarget.slice(0, 8);
  let safetyList = allSafety.slice(0, 8);

  if (reachList.length === 0 && evaluated.length > 0) {
    reachList = evaluated.slice(0, 4).map((item) => ({
      ...item,
      category: '상향지원',
      analysisComment: `최상위 모집단위 소신 지원권 (작년 50%컷 ${item.cutoff2025_50_9}등급 기준 경합)`,
    }));
  }

  if (targetList.length === 0 && evaluated.length > 0) {
    const closest = [...evaluated].sort((a, b) => Math.abs(a.gap9) - Math.abs(b.gap9)).slice(0, 6);
    targetList = closest.map((item) => ({
      ...item,
      category: '적정지원',
    }));
  }

  if (safetyList.length === 0 && evaluated.length > 0) {
    safetyList = evaluated.slice(-6).map((item) => ({
      ...item,
      category: '안정지원',
    }));
  }

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
  reachList: EvaluatedUniversityRecord[]
): ReachGoalAnalysis {
  const fallbackTarget =
    reachList.length > 0 ? reachList[Math.min(1, reachList.length - 1)] : null;
  const target = selectedReachUniv || fallbackTarget;

  const targetCutoff9 = target ? target.avgCutoff9 : Math.max(1.1, Number((studentAvg9 - 0.45).toFixed(2)));
  const targetCutoff5 = target ? target.equivalentCutoff5 : convert9To5Equivalent(targetCutoff9);

  const requiredImprovement9 = Number(Math.max(0.05, studentAvg9 - targetCutoff9).toFixed(2));
  const requiredImprovement5 = Number(Math.max(0.04, studentAvg5 - targetCutoff5).toFixed(2));

  const semesterMap: Record<HighSchoolGrade, Record<Semester, { done: number; left: number }>> = {
    '1학년': {
      '1학기': { done: 1, left: 4 },
      '2학기': { done: 2, left: 3 },
    },
    '2학년': {
      '1학기': { done: 3, left: 2 },
      '2학기': { done: 4, left: 1 },
    },
    '3학년': {
      '1학기': { done: 4, left: 1 },
      '2학기': { done: 5, left: 1 },
    },
  };

  const { done: completedSemesters, left: remainingSemesters } = semesterMap[grade][semester];
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
  trackId: string
): {
  strategies: SubjectStudyStrategy[];
  simulatedTop3Avg5: number;
  simulatedTop3Avg9: number;
  simulatedTotalGain9: number;
} {
  const track: DepartmentTrack =
    DEPARTMENT_TRACKS.find((t) => t.id === trackId) || DEPARTMENT_TRACKS[0];

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
