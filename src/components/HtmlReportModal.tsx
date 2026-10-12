import React, { useState } from 'react';
import { Check, Copy, Download, ExternalLink, Eye, FileCode, X } from 'lucide-react';

interface HtmlReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  htmlString: string;
  studentName: string;
  blobUrl: string | null;
}

export const HtmlReportModal: React.FC<HtmlReportModalProps> = ({
  isOpen,
  onClose,
  htmlString,
  studentName,
  blobUrl,
}) => {
  const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = htmlString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadHtmlFile = () => {
    const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `수시_교과전형_진학분석_리포트_${studentName}_생디.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-6xl h-[88vh] flex flex-col overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-slate-900">
              HTML 리포트 뷰어 및 파일 내보내기 ({studentName} 학생 · 생디 www.sangdi.net)
            </h3>
            <div className="inline-flex p-0.5 bg-slate-200/80 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'preview'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                웹 문서 미리보기
              </button>
              <button
                type="button"
                onClick={() => setViewMode('source')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  viewMode === 'source'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                HTML 소스코드
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'HTML 복사 완료' : 'HTML 코드 복사'}
            </button>

            <button
              type="button"
              onClick={handleDownloadHtmlFile}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              HTML 파일 다운로드 (.html)
            </button>

            {blobUrl && (
              <a
                href={blobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                새창으로 열기
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="모달 닫기"
              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-slate-100">
          {viewMode === 'preview' ? (
            <iframe
              title="HTML 리포트 미리보기"
              srcDoc={htmlString}
              className="w-full h-full border-0 bg-white"
            />
          ) : (
            <div className="h-full overflow-auto p-5 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed">
              <pre className="whitespace-pre-wrap break-all">{htmlString}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
