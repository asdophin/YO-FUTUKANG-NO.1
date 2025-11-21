
import React from 'react';
import { Template } from '../types';

interface StyleSelectorProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  templates: Template[];
  placeholder?: string;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  templates, 
  placeholder 
}) => {
  
  const handleTemplateClick = (templateContent: string) => {
    // Create a synthetic event to mimic standard input change for the parent handler
    const event = {
      target: {
        name,
        value: templateContent
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    onChange(event);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-xs text-gray-400">
          {value.length}/1000字
        </span>
      </div>
      
      {/* Template Chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs text-gray-500 self-center mr-1">推荐模板:</span>
        {templates.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => handleTemplateClick(t.content)}
            className="px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all hover:shadow-sm active:scale-95"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative group">
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={1000}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors min-h-[120px] text-sm resize-y"
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">您可以选择一个模板，然后在文本框中继续编辑。</p>
    </div>
  );
};
