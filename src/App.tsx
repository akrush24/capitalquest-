import { useState, useEffect, useMemo, useRef } from 'react';
import AnimatedNumber from './components/AnimatedNumber';
import SliderInput from './components/SliderInput';
import { calculateInterest } from './logic/calculator';
import type { ICalculatorParams, Difficulty } from './logic/calculator';
import Visualizer from './components/Visualizer';
import Achievements from './components/Achievements';
import type { IAchievement } from './components/Achievements';
import { useTranslation } from './contexts/LanguageContext';
import EventLog from './components/EventLog';
import UpgradesModal from './components/UpgradesModal';
import { UPGRADES } from './logic/upgrades';
import TimelineModal from './components/TimelineModal';
import CrestSelector, { CRESTS } from './components/CrestSelector';
import CrestDisplay from './components/crests/CrestDisplay';
import Advisor from './components/Advisor';
import SkillTreeModal from './components/SkillTreeModal';
import CapitalChart from './components/CapitalChart';
import { SKILL_TREE } from './logic/skillTree';
import type { ISkillNode } from './logic/skillTree';

// Workaround for broken type exporting in this environment
interface IUpgrade {
  id: string;
  nameKey: string;
  descriptionKey: string;
  cost: number;
  effect: (params: Omit<ICalculatorParams, 'isCompound' | 'difficulty'>) => Omit<ICalculatorParams, 'isCompound' | 'difficulty'>;
}

const TIERS = [
    { limit: 25000,    path: '/images/tent.svg',     nameKey: 'tier_tent' },
    { limit: 100000,   path: '🏕️', nameKey: 'tier_camp' },
    { limit: 250000,   path: '🛖', nameKey: 'tier_hut' },
    { limit: 750000,   path: '🏡', nameKey: 'tier_house' },
    { limit: 2000000,  path: '🏘️', nameKey: 'tier_village' },
    { limit: 5000000,  path: '⛪', nameKey: 'tier_town' },
    { limit: 15000000, path: '🏰', nameKey: 'tier_castle' },
    { limit: 50000000, path: '🏛️', nameKey: 'tier_citadel' },
    { limit: 150000000, path: '🏙️', nameKey: 'tier_city' },
    { limit: 500000000, path: '✨🏙️✨', nameKey: 'tier_metropolis' },
    { limit: 2000000000, path: '👑', nameKey: 'tier_kingdom' },
    { limit: Infinity,   path: '🌌', nameKey: 'tier_utopia' },
];

function App() {
  const { t, language, setLanguage } = useTranslation();
  const [questTitle, setQuestTitle] = useState('');
  const [selectedCrest, setSelectedCrest] = useState(CRESTS[0]);
  const [isCrestModalOpen, setIsCrestModalOpen] = useState(false);

  const [baseParams, setBaseParams] = useState({
    initialDeposit: 50000,
    monthlyContribution: 10000,
    years: 4,
    annualRate: 11,
    inflationRate: 9,
  });
  const [isCompound, setIsCompound] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [isUpgradesModalOpen, setIsUpgradesModalOpen] = useState(false);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<string[]>([]);
  const [spentOnUpgrades, setSpentOnUpgrades] = useState(0);
  const [unlockedSkills, setUnlockedSkills] = useState<string[]>([]);
  const [spentGlory, setSpentGlory] = useState(0);
  const [isSkillTreeModalOpen, setIsSkillTreeModalOpen] = useState(false);
  const [eventSeed, setEventSeed] = useState(() => Math.floor(Math.random() * 2 ** 32));

  const [currency, setCurrency] = useState('RUB');
  const [linkCopiedMessage, setLinkCopiedMessage] = useState(false);
  const [advisorMessageKey, setAdvisorMessageKey] = useState<string | null>('advisor_welcome');
  const advisorTimeoutRef = useRef<number | null>(null);
  const previousTierRef = useRef<string | null>(null);

  const CURRENCY_SYMBOLS: { [key: string]: string } = { RUB: '₽', USD: '$', EUR: '€' };

  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedState = params.get('data');
    const defaultParams = { initialDeposit: 50000, monthlyContribution: 10000, years: 4, annualRate: 11, inflationRate: 9 };

    if (encodedState) {
      try {
        const decodedString = decodeURIComponent(atob(encodedState));
        const savedState = JSON.parse(decodedString);

        setQuestTitle(savedState.questTitle || t('questTitle'));
        setSelectedCrest(savedState.selectedCrest || CRESTS[0]);
        setBaseParams(savedState.baseParams || defaultParams);
        setIsCompound(savedState.isCompound ?? true);
        setDifficulty(savedState.difficulty || 'normal');
        setPurchasedUpgrades(savedState.purchasedUpgrades || []);
        setSpentOnUpgrades(savedState.spentOnUpgrades ?? 0);
        setUnlockedSkills(savedState.unlockedSkills || []);
        setSpentGlory(savedState.spentGlory ?? 0);
        setEventSeed(savedState.eventSeed ?? Math.floor(Math.random() * 2 ** 32));
        setCurrency(savedState.currency || 'RUB');
        setLanguage(savedState.language || 'ru');
      } catch (error) {
        console.error("Failed to load state from URL:", error);
      }
    }
  }, []);

  const showAdvisorMessage = (key: string, duration: number = 8000) => {
    if (advisorTimeoutRef.current) {
        clearTimeout(advisorTimeoutRef.current);
    }
    setAdvisorMessageKey(key);
    advisorTimeoutRef.current = window.setTimeout(() => {
        setAdvisorMessageKey(null);
    }, duration);
  };

  useEffect(() => {
    setQuestTitle(t('questTitle'));
    showAdvisorMessage('advisor_welcome');
  }, [t]);


  // Update currency when language changes, but only if not loading from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get('data')) {
        const newCurrency = language === 'ru' || language === 'zh' ? 'RUB' : 'USD';
        setCurrency(newCurrency);
    }
  }, [language]);


  const { results, eventLog, simpleResults } = useMemo(() => {
    let modifiedParams = { ...baseParams };
    purchasedUpgrades.forEach(upgradeId => {
      const upgrade = UPGRADES.find(u => u.id === upgradeId);
      if (upgrade) {
        modifiedParams = upgrade.effect(modifiedParams);
      }
    });

    unlockedSkills.forEach(skillId => {
      const skill = SKILL_TREE.find(node => node.id === skillId);
      if (skill) {
        modifiedParams = skill.effect(modifiedParams);
      }
    });

    const campaign = calculateInterest({ ...modifiedParams, isCompound, difficulty, eventSeed });
    const simpleResults = calculateInterest({ ...modifiedParams, isCompound: false, difficulty: 'normal', eventSeed }).results;
    return { ...campaign, simpleResults };
  }, [baseParams, isCompound, difficulty, eventSeed, purchasedUpgrades, unlockedSkills]);

  const totalGlory = useMemo(
    () => results.reduce((sum, year) => sum + year.gloryEarned, 0),
    [results],
  );

  const unlockedAchievements = useMemo(() => {
    const achievements: IAchievement[] = [];
    const annualContribution = baseParams.monthlyContribution * 12;

    const passiveMageYear = results.find(yearData => yearData.interest > annualContribution);
    if (passiveMageYear) {
      achievements.push({ id: 'passiveMage', year: passiveMageYear.year, text: t('passiveMage') });
    }
    return achievements;
  }, [baseParams.monthlyContribution, results, t]);

  const availableGlory = Math.max(0, totalGlory - spentGlory);

  useEffect(() => {
    if (eventLog.length > 0) {
      const lastEvent = eventLog[eventLog.length - 1];
      showAdvisorMessage(`advisor_event_${lastEvent.event.id}`);
    }

    const currentTierValue = results.at(-1)?.value ?? 0;
    const currentTier = TIERS.find(tier => currentTierValue < tier.limit);
    if (currentTier && previousTierRef.current && previousTierRef.current !== currentTier.nameKey) {
      showAdvisorMessage('advisor_milestone_kingdom_reach');
    }
    previousTierRef.current = currentTier?.nameKey ?? null;
  }, [eventLog, results]);


  const handleParamChange = (paramName: keyof typeof baseParams, value: number) => {
    setBaseParams(prevParams => ({ ...prevParams, [paramName]: value }));
  };

  const handlePurchaseUpgrade = (upgrade: IUpgrade) => {
    setSpentOnUpgrades(prev => prev + upgrade.cost);
    setPurchasedUpgrades(prev => [...prev, upgrade.id]);
  };

  const handleUnlockSkill = (skill: ISkillNode) => {
    const prerequisitesMet = skill.prerequisites.every(id => unlockedSkills.includes(id));
    if (unlockedSkills.includes(skill.id) || !prerequisitesMet || availableGlory < skill.costGlory) {
      return;
    }
    setSpentGlory(previous => previous + skill.costGlory);
    setUnlockedSkills(previous => [...previous, skill.id]);
  };

  const handleShare = () => {
    const stateToSave = {
      questTitle, selectedCrest, baseParams, isCompound, difficulty,
      purchasedUpgrades, spentOnUpgrades, unlockedSkills, spentGlory, eventSeed, currency, language,
    };
    const encodedState = btoa(encodeURIComponent(JSON.stringify(stateToSave)));
    const shareableUrl = `${window.location.origin}${window.location.pathname}?data=${encodedState}`;
    
    navigator.clipboard.writeText(shareableUrl).then(() => {
      setLinkCopiedMessage(true);
      setTimeout(() => setLinkCopiedMessage(false), 2000);
    }).catch(err => console.error("Failed to copy link:", err));
  };

  const handleCrestSelect = (crest: string) => {
    setSelectedCrest(crest);
    setIsCrestModalOpen(false);
  }

  const rawFinalValue = results.length > 0 ? results[results.length - 1].value : 0;
  const finalValue = rawFinalValue - spentOnUpgrades;
  const realFinalValue = finalValue / Math.pow(1 + baseParams.inflationRate / 100, baseParams.years);
  const treasury = finalValue;

  return (
    <div className="bg-bg-main min-h-screen text-text-main font-lora p-4 sm:p-8">
      <Advisor messageKey={advisorMessageKey} />
      <header className="mb-8">
        <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4 mb-4">
            <div className="flex justify-center items-center">
                <button onClick={() => setIsCrestModalOpen(true)} className="p-2 rounded-full hover:bg-rich-gold/20 transition-colors">
                    <CrestDisplay crestId={selectedCrest} className="w-12 h-12" />
                </button>
                <input
                  type="text" value={questTitle} onChange={(e) => setQuestTitle(e.target.value)}
                  className="text-4xl sm:text-5xl font-bold text-rich-gold font-medieval bg-transparent text-center focus:outline-none p-2 max-w-full"
                />
            </div>
            <div className="flex items-center flex-wrap justify-center gap-2">
                <div className="flex items-center space-x-1 bg-panel-bg border border-rich-gold/50 rounded-md px-3 py-2">
                    <span className="text-xl">⭐</span>
                    <span className="font-bold text-text-heading">{availableGlory}</span>
                    <span className="text-sm hidden sm:inline">{t('glory')}</span>
                </div>
                {linkCopiedMessage && <span className="text-sm text-forest-green animate-fade-in">{t('linkCopied')}</span>}
                <button onClick={handleShare} className="bg-rich-gold text-bg-main font-bold py-2 px-3 rounded-md hover:bg-yellow-400 transition-colors text-sm">{t('share')}</button>
                <button onClick={() => setIsSkillTreeModalOpen(true)} className="bg-panel-bg border border-rich-gold/50 text-rich-gold font-bold py-2 px-3 rounded-md hover:bg-rich-gold/20 transition-colors text-sm">{t('skillTree')}</button>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-panel-bg border border-rich-gold/50 text-text-heading font-semibold py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-rich-gold text-sm">
                  <option value="RUB">RUB</option> <option value="USD">USD</option> <option value="EUR">EUR</option>
                </select>
                 <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="bg-panel-bg border border-rich-gold/50 text-text-heading font-semibold py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-rich-gold text-sm">
                  <option value="normal">{t('difficulty_normal')}</option> <option value="hard">{t('difficulty_hard')}</option>
                </select>
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-panel-bg border border-rich-gold/50 text-text-heading font-semibold py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-rich-gold text-sm">
                  <option value="ru">RU</option> <option value="en">EN</option> <option value="de">DE</option> <option value="es">ES</option> <option value="fr">FR</option> <option value="zh">ZH</option>
                </select>
            </div>
        </div>
        <p className="text-lg text-text-heading text-center mt-2">{t('subtitle')}</p>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <section className="bg-panel-bg p-6 rounded-lg shadow-glow border border-rich-gold/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-rich-gold font-medieval">{t('growthParameters')}</h2>
            <button onClick={() => setIsUpgradesModalOpen(true)} className="bg-rich-gold text-bg-main font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors">{t('upgrades')}</button>
          </div>
          <div className="space-y-8">
            <SliderInput label={t('initialCapital')} metaphor={t('initialCapitalMetaphor')} value={baseParams.initialDeposit} onChange={(val) => handleParamChange('initialDeposit', val)} min={0} max={5000000} step={10000} unit={CURRENCY_SYMBOLS[currency]} />
            <SliderInput label={t('monthlyContribution')} metaphor={t('monthlyContributionMetaphor')} value={baseParams.monthlyContribution} onChange={(val) => handleParamChange('monthlyContribution', val)} min={0} max={500000} step={1000} unit={CURRENCY_SYMBOLS[currency]} />
            <SliderInput label={t('period')} metaphor={t('periodMetaphor')} value={baseParams.years} onChange={(val) => handleParamChange('years', val)} min={1} max={30} step={1} unit={t('periodUnit')} />
            <SliderInput label={t('interestRate')} metaphor={t('interestRateMetaphor')} value={baseParams.annualRate} onChange={(val) => handleParamChange('annualRate', val)} min={1} max={20} step={0.5} unit="%" />
            <SliderInput label={t('inflationRate')} metaphor={t('inflationRateMetaphor')} value={baseParams.inflationRate} onChange={(val) => handleParamChange('inflationRate', val)} min={0} max={25} step={0.5} unit="%" />
            <div className="flex items-center justify-between pt-4">
                <label htmlFor="compound-toggle" className="font-semibold text-lg text-text-heading cursor-pointer" title={t('reinvestIncomeTooltip')}>{t('reinvestIncome')}</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="compound-toggle" className="sr-only peer" checked={isCompound} onChange={() => setIsCompound(!isCompound)} />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-rich-gold peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-green"></div>
                </label>
            </div>
          </div>
        </section>
        
        <section className="bg-panel-bg p-6 rounded-lg flex flex-col items-center justify-start pt-12 min-h-[500px] shadow-glow border border-rich-gold/20">
          <div className="flex justify-between items-center w-full mb-6">
            <h2 className="text-3xl font-bold text-rich-gold font-medieval">{t('yourKingdom')}</h2>
            <button onClick={() => setIsTimelineModalOpen(true)} className="bg-rich-gold text-bg-main font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors">{t('timeline')}</button>
          </div>
          <div className="text-center space-y-4">
             <Visualizer value={finalValue} isCompound={isCompound} tiers={TIERS} />
             <AnimatedNumber value={finalValue} currency={currency} className="text-4xl font-bold text-forest-green" />
             <div className="text-sm text-text-heading">({t('realValue')}: <AnimatedNumber value={realFinalValue} currency={currency} className="inline"/>)</div>
             <p className="text-text-heading">{t('inYears', { years: baseParams.years })}</p>
          </div>
          <Achievements achievements={unlockedAchievements} />
          <EventLog log={eventLog} />
        </section>
      </main>
      <CapitalChart results={results} simpleResults={simpleResults} inflationRate={baseParams.inflationRate} currency={currency} />
      <UpgradesModal isOpen={isUpgradesModalOpen} onClose={() => setIsUpgradesModalOpen(false)} onPurchase={handlePurchaseUpgrade} purchasedIds={purchasedUpgrades} treasury={treasury} currencySymbol={CURRENCY_SYMBOLS[currency]} />
      <TimelineModal isOpen={isTimelineModalOpen} onClose={() => setIsTimelineModalOpen(false)} results={results} eventLog={eventLog} currency={currency} />
      <CrestSelector isOpen={isCrestModalOpen} onClose={() => setIsCrestModalOpen(false)} onSelect={handleCrestSelect} selectedCrest={selectedCrest} />
      <SkillTreeModal isOpen={isSkillTreeModalOpen} onClose={() => setIsSkillTreeModalOpen(false)} onUnlock={handleUnlockSkill} unlockedSkills={unlockedSkills} currentGlory={availableGlory} />
    </div>
  )
}

export default App;
