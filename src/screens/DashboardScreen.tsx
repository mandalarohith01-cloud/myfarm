import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Languages, Wheat, Cloud, Bug, TrendingUp, User, FileText, Banknote, Bot, UserCircle, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import LanguageSelector from '../components/LanguageSelector';
import NotificationPanel from '../components/NotificationPanel';
import AIAssistant from '../components/AIAssistant';
import { useRealTimeNotifications } from '../hooks/useRealTimeNotifications';
import type { Screen } from '../App';

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  userProfile: { firstName: string; lastName: string; mobile: string; isRegistered: boolean };
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, userProfile }) => {
  const { t } = useLanguage();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showAIAssistant, setShowAIAssistant] = React.useState(false);
  
  // Enable real-time notifications
  useRealTimeNotifications([
    { name: 'Paddy' },
    { name: 'Tomato' },
    { name: 'Wheat' }
  ], 'Hyderabad');

  const features = [
    {
      title: t('myCrop'),
      icon: Wheat,
      color: 'from-green-400 to-green-600',
      screen: 'crop' as Screen,
    },
    {
      title: t('weeklyMonitoring'),
      icon: Calendar,
      color: 'from-indigo-400 to-indigo-600',
      screen: 'monitoring' as Screen,
    },
    {
      title: t('weather'),
      icon: Cloud,
      color: 'from-blue-400 to-blue-600',
      screen: 'weather' as Screen,
    },
    {
      title: t('pestDetection'),
      icon: Bug,
      color: 'from-red-400 to-red-600',
      screen: 'pest' as Screen,
    },
    {
      title: t('market'),
      icon: TrendingUp,
      color: 'from-purple-400 to-purple-600',
      screen: 'market' as Screen,
    },
    {
      title: t('govtSchemes'),
      icon: FileText,
      color: 'from-orange-400 to-orange-600',
      screen: 'schemes' as Screen,
    },
    {
      title: t('bankLoans'),
      icon: Banknote,
      color: 'from-indigo-400 to-indigo-600',
      screen: 'loans' as Screen,
    },
  ];

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
        className="flex justify-between items-center mb-12 pt-8"
      >
        <LanguageSelector />
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowNotifications(true)}
          className="relative cursor-pointer"
        >
          <Bell size={28} className="text-cream" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-xs font-bold px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-light text-gray-300 mb-2">
          {t('welcomeBack')}, {userProfile.firstName || 'Farmer'}!
        </h2>
        <p className="text-gray-400">{t('manageYourFarm')}</p>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ 
              delay: 0.4 + index * 0.1,
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
            whileHover={{ 
              scale: 1.05, 
              rotate: 1,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate(feature.screen)}
            className="bg-cream rounded-3xl p-4 sm:p-6 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4`}>
              <feature.icon size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-black leading-tight">{feature.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      
      {/* AI Assistant */}
      <AIAssistant 
        isOpen={showAIAssistant} 
        onClose={() => setShowAIAssistant(false)} 
      />
      
      {/* AI Bot Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-8 right-8"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowAIAssistant(true)}
          className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Bot size={28} className="text-white" />
        </motion.button>
      </motion.div>
      
      {/* Profile Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-8 left-8"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('profile')}
          className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-lg"
        >
          <UserCircle size={28} className="text-cream" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default DashboardScreen;