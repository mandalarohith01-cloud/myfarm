import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { languages, Language } from '../utils/translations';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-cream px-4 py-2 rounded-full flex items-center space-x-2 cursor-pointer"
      >
        <Languages size={20} className="text-black" />
        <span className="text-black font-medium">{currentLanguage?.nativeName}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-black" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 bg-cream rounded-2xl shadow-xl z-50 min-w-[200px] max-h-80 overflow-y-auto"
            >
              <div className="p-2">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.code}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, backgroundColor: '#f0f0f0' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLanguageChange(lang.code as Language)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                      language === lang.code 
                        ? 'bg-green-100 text-green-800 font-semibold' 
                        : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-sm text-gray-600">{lang.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;