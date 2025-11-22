
import React, { useRef, useEffect } from 'react';
import { GenerationStatus } from '../types';
import { Button } from './Button';

interface SummaryDisplayProps {
  content: string;
  status: GenerationStatus;
  errorMessage?: string;
  onContentChange: (newContent: string) => void;
  onCopy?: () => void; // New prop for notifying parent component
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ 
  content, 
  status, 
  errorMessage,
  onContentChange,
  onCopy
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      alert('内容已复制到剪贴板！系统将自动学习此版本以优化未来的生成结果。');
      // Trigger the parent callback to save to DB
      if (onCopy) {
        onCopy();
      }
    }
  };

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (status === GenerationStatus.SUCCESS && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content, status]);

  if (status === GenerationStatus.IDLE) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-10 min-h-[500px]">
        <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-lg font-medium">等待生成</p>
        <p className="text-sm mt-2">请在左侧填写信息并点击生成按钮</p>
      </div>
    );
  }

  if (status === GenerationStatus.LOADING) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-indigo-500 bg-gray-50 rounded-xl p-10 min-h-[500px]">
        <div className="animate-bounce w-6 h-6 bg-indigo-500 rounded-full mb-4"></div>
        <p className="text-lg font-medium text-gray-700">AI 正在思考中...</p>
        <p className="text-sm text-gray-500 mt-2">正在根据您的要求撰写总结</p>
        <p className="text-xs text-gray-400 mt-1">同时在学习过往的优秀案例...</p>
      </div>
    );
  }

  if (status === GenerationStatus.ERROR) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-xl border border-red-100 p-10 min-h-[500px]">
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">生成失败</p>
        <p className="text-sm mt-2 text-red-400">{errorMessage || "请检查网络或稍后重试"}</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm h-full flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          生成结果 <span className="text-xs font-normal text-gray-400 ml-2">(可直接点击下方文字修改)</span>
        </h3>
        <Button variant="secondary" onClick={handleCopy} className="!py-1.5 !px-3 !text-sm">
          复制全文
        </Button>
      </div>
      <div className="flex-1 p-0 overflow-hidden flex flex-col">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="flex-1 w-full h-full p-6 resize-none focus:outline-none focus:ring-inset focus:ring-2 focus:ring-indigo-500/20 text-gray-700 font-sans leading-relaxed bg-transparent border-0 overflow-y-auto custom-scrollbar"
          spellCheck={false}
          placeholder="生成的内容将显示在这里..."
        />
      </div>
    </div>
  );
};
