export type HighSchoolGrade = '고1' | '고2' | '고3';
export type Semester = '1학기' | '2학기';
export type SubjectGroup = '국어' | '수학' | '영어' | '사회' | '과학' | '정보·제2외국어';
export type Grade5Tier = 1 | 2 | 3 | 4 | 5;
export type SubBand = '상' | '중' | '하';

export interface SubjectEntry {
  id: string;
  gradeLevel: HighSchoolGrade; // '고1' | '고2' | '고3'
  semester: Semester; // '1학기' | '2학기'
  group: SubjectGroup;
  name: string;
  credits: number;
  grade5: Grade5Tier;
  subBand: SubBand;
}

export interface DepartmentTrack {
  id: string;
  name: string;
  category: string;
  relatedDepartments: string[];
  coreSubjectGroups: SubjectGroup[];
  recommendedCourses: string[];
  description: string;
}

export interface StudentAdmissionTarget {
  majorName: string;
  category: string;
  relatedDepartments?: string[];
  trackId?: string;
}

export interface UniversityAdmissionRecord {
  id: string;
  university: string;
  department: string;
  matchType: '희망학과 일치' | '유사·인접학과' | '선택계열 상향추천 (합격유망)';
  trackId: string;
  admissionType: string;
  region: '서울' | '수도권' | '거점국립·지방';
  cutoff2024_9: number; // 재작년 (2024학년도) 학생부교과 70% 컷 (9등급제, 어디가 공시 기준)
  cutoff2025_9: number; // 작년 (2025학년도) 학생부교과 70% 컷 (9등급제, 어디가 공시 기준)
  cutoff2025_50_9: number; // 작년 (2025학년도) 50% 컷
  competitionRate2025: number;
  replenishRate2025: number;
  csatMinimum: string;
  subjectReflectionNote: string;
  officialSourceNote?: string;
}

export type SupportCategory = '상향지원' | '적정지원' | '안정지원';

export interface EvaluatedUniversityRecord extends UniversityAdmissionRecord {
  avgCutoff9: number; // 작년·재작년 2개년 평균 70% 컷
  trend9: number; // 작년 - 재작년 변화폭
  equivalentCutoff5: number; // 5등급제 환산 기준 커트라인
  gap9: number; // 학생 9등급제 성적 - 대학 2개년 평균 컷
  gap5: number; // 학생 5등급제 성적 - 대학 5등급제 환산 컷
  category: SupportCategory;
  probabilityPercent: number;
  analysisComment: string;
}

export interface SubjectStudyStrategy {
  subjectId: string;
  subjectName: string;
  group: SubjectGroup;
  credits: number;
  currentGrade5: Grade5Tier;
  currentSubBand: SubBand;
  currentGrade9: number;
  targetGrade5: Grade5Tier;
  targetGrade9: number;
  expectedOverallGrade9After: number;
  expectedGrade9Improvement: number;
  isMajorCore: boolean;
  priorityRank: number;
  reasonSummary: string;
  examStrategy: string;
  performanceAndSeteukStrategy: string;
  weeklyActionPlan: string;
}

export interface CompanyBranding {
  companyName: string;
  websiteUrl: string;
  reportSubtitle: string;
  consultantName: string;
  contactInfo: string;
  logoPresetId: 'sangdi' | 'custom';
  customLogoDataUrl: string | null;
}
