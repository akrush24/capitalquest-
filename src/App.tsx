import React, { useState, useEffect } from 'react';
import AnimatedNumber from './components/AnimatedNumber';
import SliderInput from './components/SliderInput';
import { calculateInterest } from './logic/calculator';
import type { IYearData, ICalculatorParams } from './logic/calculator';
import Visualizer from './components/Visualizer';
import Achievements from './components/Achievements';
import type { IAchievement } from './components/Achievements';
import { useTranslation } from './contexts/LanguageContext';

function App() {
  const { t, language, setLanguage } = useTranslation();
  const [questTitle, setQuestTitle] = useState('');

  const [params, setParams] = useState<Omit<ICalculatorParams, 'isCompound'>>({
    initialDeposit: 50000,
    monthlyContribution: 10000,
    years: 20,
    annualRate: 8,
  });
  const [isCompound, setIsCompound] = useState(true);

  const [results, setResults] = useState<IYearData[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<IAchievement[]>([]);
  const [currency, setCurrency] = useState('RUB');

  const CURRENCY_SYMBOLS: { [key: string]: string } = {
    RUB: '₽',
    USD: '$',
    EUR: '€',
  };

  useEffect(() => {
    setCurrency(language === 'ru' ? 'RUB' : 'USD');
    setQuestTitle(t('questTitle'));
  }, [language, t]);

  useEffect(() => {
    const data = calculateInterest({ ...params, isCompound });
    setResults(data);

    const newAchievements: IAchievement[] = [];
    const annualContribution = params.monthlyContribution * 12;

    const passiveMageYear = data.find(yearData => yearData.interest > annualContribution);
    if (passiveMageYear) {
      newAchievements.push({
        id: 'passiveMage',
        year: passiveMageYear.year,
        text: t('passiveMage'),
      });
    }
    setUnlockedAchievements(newAchievements);
  }, [params, isCompound, t]);

  const handleParamChange = (paramName: keyof typeof params, value: number) => {
    setParams(prevParams => ({
      ...prevParams,
      [paramName]: value
    }));
  };

  const finalValue = results.length > 0 ? results[results.length - 1].value : 0;

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-4 sm:p-8">
      <header className="text-center mb-8 relative">
        <input 
          type="text"
          value={questTitle}
          onChange={(e) => setQuestTitle(e.target.value)}
          className="text-4xl sm:text-5xl font-bold text-green-400 font-cinzel bg-transparent text-center w-full focus:outline-none p-2"
        />
        <p className="text-lg text-gray-400 mt-2">{t('subtitle')}</p>
        <div className="absolute top-0 right-0 flex items-center space-x-4">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="RUB">RUB (₽)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
        </div>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <section className="bg-gray-800 p-6 rounded-lg shadow-glow">
          <h2 className="text-2xl font-semibold mb-6 text-gold-400 font-cinzel">{t('growthParameters')}</h2>
          <div className="space-y-8">
            <SliderInput 
              label={t('initialCapital')}
              metaphor={t('initialCapitalMetaphor')}
              value={params.initialDeposit}
              onChange={(val) => handleParamChange('initialDeposit', val)}
              min={0} max={5000000} step={10000}
              unit={CURRENCY_SYMBOLS[currency]}
            />
            <SliderInput 
              label={t('monthlyContribution')}
              metaphor={t('monthlyContributionMetaphor')}
              value={params.monthlyContribution}
              onChange={(val) => handleParamChange('monthlyContribution', val)}
              min={0} max={500000} step={1000}
              unit={CURRENCY_SYMBOLS[currency]}
            />
            <SliderInput 
              label={t('period')}
              metaphor={t('periodMetaphor')}
              value={params.years}
              onChange={(val) => handleParamChange('years', val)}
              min={1} max={50} step={1}
              unit={t('periodUnit')}
            />
            <SliderInput 
              label={t('interestRate')}
              metaphor={t('interestRateMetaphor')}
              value={params.annualRate}
              onChange={(val) => handleParamChange('annualRate', val)}
              min={1} max={20} step={0.5}
              unit="%"
            />
            <div className="flex items-center justify-between pt-4">
                <label htmlFor="compound-toggle" className="font-semibold text-lg cursor-pointer" title={t('reinvestIncomeTooltip')}>
                  {t('reinvestIncome')}
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="compound-toggle" className="sr-only peer" checked={isCompound} onChange={() => setIsCompound(!isCompound)} />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
            </div>
          </div>
        </section>
        
        <section className="bg-gray-800 p-6 rounded-lg flex flex-col items-center justify-start pt-12 min-h-[500px] shadow-glow">
          <h2 className="text-2xl font-semibold mb-6 text-gold-400 font-cinzel">{t('yourKingdom')}</h2>
          <div className="text-center space-y-4">
             <Visualizer value={finalValue} isCompound={isCompound} />
             <AnimatedNumber value={finalValue} currency={currency} className="text-4xl font-bold text-green-400" />
             <p className="text-gray-400">{t('inYears', { years: params.years })}</p>
          </div>
          <Achievements achievements={unlockedAchievements} />
        </section>
      </main>
    </div>
  )
}

export default App;
