
import React from 'react';
import { LANGUAGES } from '../constants';
import { LanguageCode } from '../types';

interface Props {
  label: string;
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
  colorClass: string;
}

const LanguageSelector: React.FC<Props> = ({ label, value, onChange, colorClass }) => {
  return (
    <div className={`flex flex-col gap-2 p-4 rounded-2xl ${colorClass} shadow-lg transition-transform active:scale-95`}>
      <label className="text-sm font-bold opacity-70 uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as LanguageCode)}
        className="bg-transparent text-xl font-bold focus:outline-none cursor-pointer"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
