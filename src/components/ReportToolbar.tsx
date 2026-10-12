import React, { useRef, useState } from 'react';
import { CompanyBranding } from '../types/admissions';
import { BrandLogo } from './BrandLogo';
import {
  Building2,
  Code2,
  ExternalLink,
  FileDown,
  Globe,
  Maximize2,
  Minimize2,
  Printer,
  Upload,
  Check,
  RotateCcw,
} from 'lucide-react';

interface ReportToolbarProps {
  branding: CompanyBranding;
  onBrandingChange: (branding: CompanyBranding) => void;
  onOpenHtmlModal: () => void;
  onDownloadPdf: () => Promise<void>;
  isGeneratingPdf: boolean;
  isFullscreenReport: boolean;
  onToggleFullscreenReport: () => void;
  standaloneHtmlBlobUrl: string | null;
}

export const ReportToolbar: React.FC<ReportToolbarProps> = ({
  branding,
  onBrandingChange,
  onOpenHtmlModal,
  onDownloadPdf,
  isGeneratingPdf,
  isFullscreenReport,
  onToggleFullscreenReport,
  standaloneHtmlBlobUrl,
}) => {
  const [showLogoPanel, setShowLogoPanel] = useState(false);
  const [logoUploadMessage, setLogoUploadMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onBrandingChange({
          ...branding,
          logoPresetId: 'custom',
          customLogoDataUrl: reader.result,
        });
        setLogoUploadMessage(`'${file.name}' 로고가 리포트에 적용되었습니다.`);
        setTimeout(() => setLogoUploadMessage(null), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRestoreSangdiLogo = () => {
    onBrandingChange({
      ...branding,
      logoPresetId: 'sangdi',
      customLogoDataUrl: null,
      companyName: '생디 (Sangdi)',
      websiteUrl: 'www.sangdi.net',
    });
    setLogoUploadMessage('생디 공식 로고와 사이트 정보로 복원되었습니다.');
    setTimeout(() => setLogoUploadMessage(null), 3000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 no-print">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* 좌측: 생디 플랫폼 브랜드 로고 및 사이트 안내 */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.sangdi.net"
            target="_blank"
            rel="noopener noreferrer"
            title="생디 (www.sangdi.net) 웹사이트 열기"
            className="h-10 px-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center shrink-0 hover:border-sky-500 transition-colors"
          >
            <BrandLogo branding={branding} className="h-7 w-auto" />
          </a>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">{branding.companyName}</span>
              <a
                href="https://www.sangdi.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-0.5"
              >
                <Globe className="w-3 h-3" />
                {branding.websiteUrl}
              </a>
            </div>
            <div className="text-[11px] text-slate-500">{branding.consultantName}</div>
          </div>
          <button
            type="button"
            onClick={() => setShowLogoPanel(!showLogoPanel)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              showLogoPanel
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            로고 교체 · 기관 설정
          </button>
        </div>

        {/* 우측: HTML 보기 / PDF 다운로드 / 리포트 인쇄 / 전체화면 / 새창열기 */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenHtmlModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Code2 className="w-3.5 h-3.5" />
            HTML 보기
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <FileDown className="w-3.5 h-3.5" />
            {isGeneratingPdf ? 'PDF 생성 중...' : 'PDF 다운로드'}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            리포트 인쇄
          </button>

          <button
            type="button"
            onClick={onToggleFullscreenReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            {isFullscreenReport ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                전체화면 닫기
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                전체화면 리포트
              </>
            )}
          </button>

          {standaloneHtmlBlobUrl && (
            <a
              href={standaloneHtmlBlobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              새창열기 (전체화면 탭)
            </a>
          )}
        </div>
      </div>

      {/* 로고 교체 및 플랫폼 설정 패널 */}
      {showLogoPanel && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold text-slate-900">
                1. 회사 / 학원 로고 이미지 업로드 및 생디 로고 복원
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  내 컴퓨터에서 로고 파일 업로드
                </button>
                <button
                  type="button"
                  onClick={handleRestoreSangdiLogo}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  생디 로고로 복원
                </button>
              </div>

              {logoUploadMessage && (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <Check className="w-3.5 h-3.5" />
                  {logoUploadMessage}
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-slate-800">
                  공식 제작 플랫폼: <strong className="text-blue-700">생디 (Sangdi)</strong>
                </div>
                <div className="text-slate-600">
                  웹사이트 URL: <a href="https://www.sangdi.net" target="_blank" rel="noopener noreferrer" className="font-mono text-sky-600 hover:underline">www.sangdi.net</a>
                </div>
                <div className="text-[11px] text-slate-500">
                  업로드한 로고는 출력 리포트 헤더, HTML 보기, 그리고 PDF 다운로드 파일에 즉시 적용됩니다.
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  회사 / 학원 / 플랫폼 명칭
                </label>
                <input
                  type="text"
                  value={branding.companyName}
                  onChange={(e) =>
                    onBrandingChange({ ...branding, companyName: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  공식 웹사이트 주소
                </label>
                <input
                  type="text"
                  value={branding.websiteUrl}
                  onChange={(e) =>
                    onBrandingChange({ ...branding, websiteUrl: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  담당 컨설턴트 / 팀명
                </label>
                <input
                  type="text"
                  value={branding.consultantName}
                  onChange={(e) =>
                    onBrandingChange({ ...branding, consultantName: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  리포트 서브 타이틀 문구
                </label>
                <input
                  type="text"
                  value={branding.reportSubtitle}
                  onChange={(e) =>
                    onBrandingChange({ ...branding, reportSubtitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
