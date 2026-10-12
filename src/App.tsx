import React, { useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_SUBJECT_PRESETS,
  DEPARTMENT_TRACKS,
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
  generateStrategicSubjectRecommendations,
} from './utils/admissionsAnalyzer';
import {
  FullReportPayload,
  downloadReportAsPDF,
  generateStandaloneReportHTML,
  getSangdiLogoSvgDataUrl,
} from './utils/reportExporter';
import { StudentInputPanel } from './components/StudentInputPanel';
import { ReportToolbar } from './components/ReportToolbar';
import { ConsultingReportView } from './components/ConsultingReportView';
import { HtmlReportModal } from './components/HtmlReportModal';

export default function App() {
  const [studentName, setStudentName] = useState<string>('김서연');
  const [grade, setGrade] = useState<HighSchoolGrade>('2학년');
  const [semester, setSemester] = useState<Semester>('1학기');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('comp-ai');
  const [subjects, setSubjects] = useState<SubjectEntry[]>(() => DEFAULT_SUBJECT_PRESETS['2학년']);
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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isFullscreenReport, setIsFullscreenReport] = useState<boolean>(false);
  const [standaloneHtmlBlobUrl, setStandaloneHtmlBlobUrl] = useState<string | null>(null);

  const generatedDate = '2026. 10. 12.';

  const selectedTrack = useMemo(
    () => DEPARTMENT_TRACKS.find((t) => t.id === selectedTrackId) || DEPARTMENT_TRACKS[0],
    [selectedTrackId]
  );

  const gpaSummary = useMemo(() => calculateStudentGPA(subjects), [subjects]);

  const { reachList, targetList, safetyList } = useMemo(
    () =>
      evaluateUniversitiesForStudent(
        selectedTrackId,
        gpaSummary.avg9,
        gpaSummary.avg5
      ),
    [selectedTrackId, gpaSummary.avg9, gpaSummary.avg5]
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
        reachList
      ),
    [gpaSummary.avg5, gpaSummary.avg9, grade, semester, selectedReachUniv, reachList]
  );

  const { strategies, simulatedTop3Avg5, simulatedTop3Avg9, simulatedTotalGain9 } = useMemo(
    () => generateStrategicSubjectRecommendations(subjects, selectedTrackId),
    [subjects, selectedTrackId]
  );

  const handleGradeChange = (newGrade: HighSchoolGrade) => {
    setGrade(newGrade);
    setSubjects(DEFAULT_SUBJECT_PRESETS[newGrade]);
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
      track: selectedTrack,
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
    }),
    [
      studentName,
      grade,
      semester,
      selectedTrack,
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
            title="생디 (www.sangdi.net)"
            className="flex items-center gap-1.5"
          >
            <img
              src={getSangdiLogoSvgDataUrl()}
              alt="생디"
              className="h-7 w-auto object-contain"
            />
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
              track={selectedTrack}
              subjects={subjects}
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
                selectedTrackId={selectedTrackId}
                onTrackChange={(id) => {
                  setSelectedTrackId(id);
                  setSelectedReachUnivId(null);
                }}
                subjects={subjects}
                onSubjectsChange={setSubjects}
                onApplyGradePreset={handleGradeChange}
                onApplyScoreTierPreset={handleApplyScoreTierPreset}
              />
            </div>

            <div className="lg:col-span-7">
              <ConsultingReportView
                studentName={studentName}
                grade={grade}
                semester={semester}
                track={selectedTrack}
                subjects={subjects}
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
    </div>
  );
}
