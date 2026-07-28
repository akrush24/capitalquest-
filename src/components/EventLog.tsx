import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import type { IEventInstance } from '../logic/events';

interface EventLogProps {
  log: IEventInstance[];
}

const EventLog: React.FC<EventLogProps> = ({ log }) => {
  const { t } = useTranslation();

  if (log.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 w-full">
      <h3 className="text-2xl font-medieval text-rich-gold mb-4">{t('eventLogTitle')}</h3>
      <ul className="space-y-3 text-left">
        {log.map(({ year, event }) => (
          <li key={`${year}-${event.id}`} className="bg-bg-main/50 p-3 rounded-lg animate-fade-in border border-rich-gold/20 text-sm">
            <strong className={event.type === 'good' ? 'text-forest-green' : 'text-red-500'}>
              {t('year', { year })}: {t(event.nameKey)}
            </strong>
            <p className="text-text-main italic mt-1">{t(event.descriptionKey)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventLog;
