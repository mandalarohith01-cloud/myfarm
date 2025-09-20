import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, TestTube } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface RegistrationScreenProps {
  onRegister: (profile: { firstName: string; lastName: string; mobile: string }) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ onRegister }) => {
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = () => {
    if (firstName && lastName && mobile) {
      onRegister({ firstName, lastName, mobile });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-black flex flex-col items-center justify-center p-6"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-green-600 rounded-sm"></div>
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-2">{t('appName')}</h1>
        <p className="text-xl text-gray-300">{t('profileRegistration')}</p>
      </motion.div>

      {/* Form */}
      <div className="w-full max-w-sm space-y-4 mb-8">
        <motion.input
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          type="text"
          placeholder={t('firstName')}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-6 py-4 bg-cream text-black rounded-full text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
        <motion.input
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          type="text"
          placeholder={t('lastName')}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-6 py-4 bg-cream text-black rounded-full text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
        <motion.input
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          type="tel"
          placeholder={t('mobileNumber')}
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="w-full px-6 py-4 bg-cream text-black rounded-full text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 w-full max-w-sm">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex-1 bg-cream text-black py-4 rounded-3xl text-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
        >
          <TestTube size={20} />
          <span>{t('testSlot')}</span>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="flex-1 bg-cream text-black py-4 rounded-3xl text-lg font-medium flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors"
        >
          <FileText size={20} />
          <span>{t('register')}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RegistrationScreen;