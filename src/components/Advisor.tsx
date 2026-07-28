import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface AdvisorProps {
  messageKey: string | null;
}

const Advisor: React.FC<AdvisorProps> = ({ messageKey }) => {
  const { t } = useTranslation();

  if (!messageKey) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 max-w-xs z-40">
      <div className="flex items-end space-x-2">
        <div className="text-5xl">🦉</div>
        <div className="bg-panel-bg p-3 rounded-lg border border-rich-gold/30 shadow-lg animate-fade-in">
          <p className="text-text-main italic">"{t(messageKey)}"</p>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
