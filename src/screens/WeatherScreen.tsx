import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Cloud, CloudRain, Sun, Zap, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface WeatherScreenProps {
  onBack: () => void;
}

const WeatherScreen: React.FC<WeatherScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();

  const weeklyForecast = [
    { day: t('monday').slice(0, 3), icon: Sun, high: 30, low: 22, condition: 'sunny' },
    { day: t('tuesday').slice(0, 3), icon: Zap, high: 30, low: 23, condition: 'storm' },
    { day: t('wednesday').slice(0, 3), icon: Zap, high: 29, low: 23, condition: 'storm' },
    { day: t('thursday').slice(0, 3), icon: CloudRain, high: 28, low: 23, condition: 'rain' },
    { day: t('friday').slice(0, 3), icon: CloudRain, high: 27, low: 23, condition: 'rain' },
    { day: t('saturday').slice(0, 3), icon: Zap, high: 27, low: 23, condition: 'storm' },
    { day: t('sunday').slice(0, 3), icon: Zap, high: 28, low: 23, condition: 'storm' },
    { day: t('monday').slice(0, 3), icon: Zap, high: 27, low: 23, condition: 'storm' },
  ];

  const hourlyData = [24, 23, 23, 26, 29, 29, 27, 25];
  const hourlyLabels = ['1am', '4am', '7am', '10am', '1pm', '4pm', '7pm', '10pm'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="min-h-screen bg-black p-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center mb-8 pt-8"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="mr-4 p-2 rounded-full bg-cream text-black"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <h1 className="text-2xl font-bold">{t('weatherAlerts')}</h1>
      </motion.div>

      {/* Weather Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 mb-6 border-2 border-purple-500"
      >
        {/* Current Weather */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <Cloud size={48} className="text-gray-300" />
            <div>
              <div className="text-5xl font-light">24</div>
              <div className="text-sm text-gray-400">°C | °F</div>
            </div>
            <div className="text-sm text-gray-400">
              <div>{t('precipitation')}: 0%</div>
              <div>{t('humidity')}: 85%</div>
              <div>{t('wind')}: 8 km/h</div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-400">
            <div className="font-semibold text-white">{t('weather')}</div>
            <div>{t('monday')}, 12:00 am</div>
            <div>{t('cloudy')}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 mb-4">
          <button className="text-white border-b-2 border-white pb-1">{t('temperature')}</button>
          <button className="text-gray-400">{t('precipitation')}</button>
          <button className="text-gray-400">{t('wind')}</button>
        </div>

        {/* Temperature Chart */}
        <div className="relative h-24 mb-6">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              d="M 0 60 Q 80 50 160 48 Q 240 45 320 42 Q 400 45 480 55 Q 560 58 640 65"
              stroke="#fbbf24"
              strokeWidth="2"
              fill="url(#tempGradient)"
            />
          </svg>
          <div className="absolute bottom-0 flex justify-between w-full text-xs text-gray-400">
            {hourlyLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
          <div className="absolute top-0 flex justify-between w-full text-xs text-white">
            {hourlyData.map((temp, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                {temp}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Weekly Forecast */}
        <div className="flex justify-between">
          {weeklyForecast.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className="flex flex-col items-center space-y-2"
            >
              <span className="text-xs text-gray-400">{day.day}</span>
              <day.icon size={24} className={
                day.condition === 'sunny' ? 'text-yellow-400' :
                day.condition === 'storm' ? 'text-blue-400' :
                'text-gray-400'
              } />
              <div className="text-xs text-center">
                <div className="text-white">{day.high}°</div>
                <div className="text-gray-400">{day.low}°</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-cream rounded-3xl p-6 mb-20"
      >
        <div className="text-black">
          <span className="font-semibold">{t('alerts')}: </span>
          {t('heavyRainAlert')}
        </div>
      </motion.div>

      {/* Profile Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-8 right-8"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg"
        >
          <User size={28} className="text-cream" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WeatherScreen;