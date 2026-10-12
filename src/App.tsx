import React, { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_SUBJECT_PRESETS,
  INITIAL_HIGH_SCHOOL_SUBJECTS,
  buildDynamicTrack,
} from './data/admissionsData';
import {
  CompanyBranding,
  Grade5Tier,
  HighSchoolGrade,
  Semester,
  SubBand,
  SubjectEntry,
} from './types/admissions';
import {
  calculateReachGoalAnalysis,
  calculateStudentGPA,
  evaluateUniversitiesForStudent,
  filterSubjectsForStudentGrade,
  getActiveGradesForStudent,
  generateStrategicSubjectRecommendations,
} from './utils/admissionsAnalyzer';
import {
  FullReportPayload,
  downloadReportAsPDF,
  generateStandaloneReportHTML,
} from './utils/reportExporter';
import { StudentInputPanel } from './components/StudentInputPanel';
import { ReportToolbar } from './components/ReportToolbar';
import { ConsultingReportView } from './components/ConsultingReportView';
import { HtmlReportModal } from './components/HtmlReportModal';
import { WordpressEmbedModal } from './components/WordpressEmbedModal';
import { BrandLogo } from './components/BrandLogo';

export default function App() {
  const [studentName, setStudentName] = useState<string>('김서연');
  const [grade, setGrade] = useState<HighSchoolGrade>('고2');
  const [semester, setSemester] = useState<Semester>('2학기');
  const [targetMajor, setTargetMajor] = useState<string>('컴퓨터공학과');
  const [targetCategory, setTargetCategory] = useState<string>('공학계열');
  const [subjects, setSubjects] = useState<SubjectEntry[]>(() => INITIAL_HIGH_SCHOOL_SUBJECTS);
  const [selectedReachUnivId, setSelectedReachUnivId] = useState<string | null>(null);

  // 생디 (www.sangdi.net) 공식 플랫폼 기본 브랜딩
  const [branding, setBranding] = useState<CompanyBranding>({
    companyName: '생디 (Sangdi)',
    websiteUrl: 'www.sangdi.net',
    reportSubtitle: '2028 대입개편 5·9등급제 통합 수시 학생부교과 정밀 진학컨설팅 리포트',
    consultantName: '생디 입시전략연구팀',
    contactInfo: '공식 웹사이트: www.sangdi.net · 플랫폼: 생디',
    logoPresetId: 'sangdi',
    customLogoDataUrl: null,
  });

  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState<boolean>(false);
  const [isWordpressModalOpen, setIsWordpressModalOpen] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isFullscreenReport, setIsFullscreenReport] = useState<boolean>(false);
  const [standaloneHtmlBlobUrl, setStandaloneHtmlBlobUrl] = useState<string | null>(null);

  const generatedDate = '2026. 10. 12.';

  // 학생이 입력한 희망 학과명 및 계열 기반 전공 트랙 실시간 생성
  const selectedTrack = useMemo(
    () => buildDynamicTrack(targetMajor, targetCategory),
    [targetMajor, targetCategory]
  );

  // 학생이 실제로 입력한 성적값만을 정확히 필터링 집계 (미도래 미래 학년/학기 완전 배제)
  const activeSubjects = useMemo(
    () => filterSubjectsForStudentGrade(subjects, grade, semester, true),
    [subjects, grade, semester]
  );

  const gpaSummary = useMemo(() => calculateStudentGPA(activeSubjects), [activeSubjects]);

  const { reachList, targetList, safetyList } = useMemo(
    () =>
      evaluateUniversitiesForStudent(
        targetMajor,
        gpaSummary.avg9,
        gpaSummary.avg5,
        targetCategory
      ),
    [targetMajor, targetCategory, gpaSummary.avg9, gpaSummary.avg5]
  );

  const selectedReachUniv = useMemo(() => {
    if (!selectedReachUnivId) return null;
    return reachList.find((u) => u.id === selectedReachUnivId) || null;
  }, [selectedReachUnivId, reachList]);

  const reachGoal = useMemo(
    () =>
      calculateReachGoalAnalysis(
        gpaSummary.avg5,
        gpaSummary.avg9,
        grade,
        semester,
        selectedReachUniv,
        reachList,
        gpaSummary.semesterSummaries.length
      ),
    [
      gpaSummary.avg5,
      gpaSummary.avg9,
      grade,
      semester,
      selectedReachUniv,
      reachList,
      gpaSummary.semesterSummaries.length,
    ]
  );

  const { strategies, simulatedTop3Avg5, simulatedTop3Avg9, simulatedTotalGain9 } = useMemo(
    () => generateStrategicSubjectRecommendations(activeSubjects, selectedTrack, targetCategory),
    [activeSubjects, selectedTrack, targetCategory]
  );

  const handleGradeChange = (newGrade: HighSchoolGrade) => {
    setGrade(newGrade);
    const validGrades = getActiveGradesForStudent(newGrade);
    setSubjects((prev) => prev.filter((s) => validGrades.includes(s.gradeLevel || '고1')));
    setSelectedReachUnivId(null);
  };

  const handleTargetMajorChange = (newMajor: string) => {
    setTargetMajor(newMajor);
    setSelectedReachUnivId(null);
  };

  const handleTargetCategoryChange = (newCategory: string) => {
    setTargetCategory(newCategory);
    setSelectedReachUnivId(null);
  };

  const handleApplyGradePreset = (targetGrade: HighSchoolGrade) => {
    setSubjects((prev) => {
      const others = prev.filter((s) => (s.gradeLevel || '고1') !== targetGrade);
      const defaults = DEFAULT_SUBJECT_PRESETS[targetGrade].map((p) => ({
        ...p,
        id: `preset-${targetGrade}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      }));
      return [...others, ...defaults];
    });
    setSelectedReachUnivId(null);
  };

  const handleApplyScoreTierPreset = (tier: 'top' | 'upper' | 'midUpper' | 'mid') => {
    const tierPattern: Record<
      'top' | 'upper' | 'midUpper' | 'mid',
      Array<{ g5: Grade5Tier; band: SubBand }>
    > = {
      top: [
        { g5: 1, band: '상' },
        { g5: 1, band: '중' },
        { g5: 1, band: '상' },
        { g5: 1, band: '중' },
        { g5: 1, band: '하' },
      ],
      upper: [
        { g5: 1, band: '중' },
        { g5: 2, band: '상' },
        { g5: 1, band: '하' },
        { g5: 2, band: '상' },
        { g5: 2, band: '중' },
      ],
      midUpper: [
        { g5: 2, band: '상' },
        { g5: 2, band: '중' },
        { g5: 2, band: '하' },
        { g5: 3, band: '상' },
        { g5: 1, band: '하' },
      ],
      mid: [
        { g5: 3, band: '상' },
        { g5: 3, band: '중' },
        { g5: 2, band: '하' },
        { g5: 3, band: '하' },
        { g5: 2, band: '중' },
      ],
    };

    const pattern = tierPattern[tier];
    setSubjects((prev) =>
      prev.map((sub, idx) => {
        const pick = pattern[idx % pattern.length];
        return {
          ...sub,
          grade5: pick.g5,
          subBand: pick.band,
        };
      })
    );
    setSelectedReachUnivId(null);
  };

  const reportPayload: FullReportPayload = useMemo(
    () => ({
      studentName: studentName || '학생',
      grade,
      semester,
      targetMajor: targetMajor || '컴퓨터공학과',
      targetCategory: targetCategory || '공학계열',
      track: selectedTrack,
      subjects: activeSubjects,
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
    }),
    [
      studentName,
      grade,
      semester,
      targetMajor,
      targetCategory,
      selectedTrack,
      activeSubjects,
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
    ]
  );

  const standaloneHtmlString = useMemo(
    () => generateStandaloneReportHTML(reportPayload),
    [reportPayload]
  );

  useEffect(() => {
    const blob = new Blob([standaloneHtmlString], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    setStandaloneHtmlBlobUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [standaloneHtmlString]);

  const handleToggleFullscreenReport = () => {
    const nextState = !isFullscreenReport;
    setIsFullscreenReport(nextState);
    try {
      if (nextState && document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (!nextState && document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      // Ignore
    }
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await downloadReportAsPDF(reportPayload);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Bar Contract (1-line Brand title, 4-5 nav links, 1 primary action) */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-30 no-print">
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <a
            href="https://www.sangdi.net"
            target="_blank"
            rel="noopener noreferrer"
            title="생디 (www.sangdi.net) 공식 플랫폼"
            className="flex items-center gap-1.5"
          >
            <BrandLogo branding={branding} className="h-7 w-auto" />
          </a>
          <span className="text-slate-300">|</span>
          <a
            href="#top"
            className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            입시 내비게이터
          </a>
        </div>

        {/* Zone 2: 4–5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#section-gpa"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            성적환산
          </a>
          <a
            href="#section-universities"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            수시입결분석
          </a>
          <a
            href="#section-goal"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            목표등급산출
          </a>
          <a
            href="#section-strategy"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            맞춤학습전략
          </a>
          <a
            href="https://www.sangdi.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-700 font-semibold hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            생디(www.sangdi.net)
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handleToggleFullscreenReport}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            {isFullscreenReport ? '입력·분석 화면 복귀' : '전체화면 리포트 보기'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main id="top" className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        <ReportToolbar
          branding={branding}
          onBrandingChange={setBranding}
          onOpenHtmlModal={() => setIsHtmlModalOpen(true)}
          onOpenWordpressModal={() => setIsWordpressModalOpen(true)}
          onDownloadPdf={handleDownloadPdf}
          isGeneratingPdf={isGeneratingPdf}
          isFullscreenReport={isFullscreenReport}
          onToggleFullscreenReport={handleToggleFullscreenReport}
          standaloneHtmlBlobUrl={standaloneHtmlBlobUrl}
        />

        {isFullscreenReport ? (
          <div className="max-w-5xl mx-auto">
            <ConsultingReportView
              studentName={studentName}
              grade={grade}
              semester={semester}
              targetMajor={targetMajor}
              targetCategory={targetCategory}
              track={selectedTrack}
              subjects={activeSubjects}
              gpaSummary={gpaSummary}
              reachList={reachList}
              targetList={targetList}
              safetyList={safetyList}
              selectedReachUnivId={selectedReachUnivId}
              onSelectReachUniv={setSelectedReachUnivId}
              reachGoal={reachGoal}
              strategies={strategies}
              branding={branding}
              generatedDate={generatedDate}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 no-print">
              <StudentInputPanel
                studentName={studentName}
                onStudentNameChange={setStudentName}
                grade={grade}
                onGradeChange={handleGradeChange}
                semester={semester}
                onSemesterChange={setSemester}
                targetMajor={targetMajor}
                onTargetMajorChange={handleTargetMajorChange}
                targetCategory={targetCategory}
                onTargetCategoryChange={handleTargetCategoryChange}
                subjects={subjects}
                onSubjectsChange={setSubjects}
                onApplyGradePreset={handleApplyGradePreset}
                onApplyScoreTierPreset={handleApplyScoreTierPreset}
              />
            </div>

            <div className="lg:col-span-7">
              <ConsultingReportView
                studentName={studentName}
                grade={grade}
                semester={semester}
                targetMajor={targetMajor}
                targetCategory={targetCategory}
                track={selectedTrack}
                subjects={activeSubjects}
                gpaSummary={gpaSummary}
                reachList={reachList}
                targetList={targetList}
                safetyList={safetyList}
                selectedReachUnivId={selectedReachUnivId}
                onSelectReachUniv={setSelectedReachUnivId}
                reachGoal={reachGoal}
                strategies={strategies}
                branding={branding}
                generatedDate={generatedDate}
              />
            </div>
          </div>
        )}
      </main>

      <HtmlReportModal
        isOpen={isHtmlModalOpen}
        onClose={() => setIsHtmlModalOpen(false)}
        htmlString={standaloneHtmlString}
        studentName={studentName || '학생'}
        blobUrl={standaloneHtmlBlobUrl}
      />

      <WordpressEmbedModal
        isOpen={isWordpressModalOpen}
        onClose={() => setIsWordpressModalOpen(false)}
        appUrl="https://gradepass.vercel.app/"
      />
    </div>
  );
}
