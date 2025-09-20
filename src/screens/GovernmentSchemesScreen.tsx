import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, FileText, CheckCircle, XCircle, Info, Calendar, MapPin, Phone, Banknote } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface GovernmentSchemesScreenProps {
  onBack: () => void;
  userProfile: { firstName: string; lastName: string; mobile: string; isRegistered: boolean };
}

interface Scheme {
  id: number;
  name: string;
  description: string;
  benefits: string;
  eligibility: string[];
  documents: string[];
  applicationProcess: string;
  deadline: string;
  contactInfo: string;
  isEligible: boolean;
  category: 'subsidy' | 'insurance' | 'loan' | 'training' | 'equipment';
}

const GovernmentSchemesScreen: React.FC<GovernmentSchemesScreenProps> = ({ onBack, userProfile }) => {
  const { t } = useLanguage();
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample government schemes data
  const schemes: Scheme[] = [
    {
      id: 1,
      name: t('pmKisanScheme'),
      description: t('pmKisanDescription'),
      benefits: t('pmKisanBenefits'),
      eligibility: [t('pmKisanEligibility1'), t('pmKisanEligibility2'), t('pmKisanEligibility3')],
      documents: [t('pmKisanDoc1'), t('pmKisanDoc2'), t('pmKisanDoc3')],
      applicationProcess: t('pmKisanProcess'),
      deadline: t('pmKisanDeadline'),
      contactInfo: t('pmKisanContact'),
      isEligible: true,
      category: 'subsidy'
    },
    {
      id: 2,
      name: t('cropInsuranceScheme'),
      description: t('cropInsuranceDescription'),
      benefits: t('cropInsuranceBenefits'),
      eligibility: [t('cropInsuranceEligibility1'), t('cropInsuranceEligibility2')],
      documents: [t('cropInsuranceDoc1'), t('cropInsuranceDoc2')],
      applicationProcess: t('cropInsuranceProcess'),
      deadline: t('cropInsuranceDeadline'),
      contactInfo: t('cropInsuranceContact'),
      isEligible: true,
      category: 'insurance'
    },
    {
      id: 3,
      name: t('soilHealthScheme'),
      description: t('soilHealthDescription'),
      benefits: t('soilHealthBenefits'),
      eligibility: [t('soilHealthEligibility1'), t('soilHealthEligibility2')],
      documents: [t('soilHealthDoc1'), t('soilHealthDoc2')],
      applicationProcess: t('soilHealthProcess'),
      deadline: t('soilHealthDeadline'),
      contactInfo: t('soilHealthContact'),
      isEligible: false,
      category: 'training'
    },
    {
      id: 4,
      name: t('organicFarmingScheme'),
      description: t('organicFarmingDescription'),
      benefits: t('organicFarmingBenefits'),
      eligibility: [t('organicFarmingEligibility1'), t('organicFarmingEligibility2')],
      documents: [t('organicFarmingDoc1'), t('organicFarmingDoc2')],
      applicationProcess: t('organicFarmingProcess'),
      deadline: t('organicFarmingDeadline'),
      contactInfo: t('organicFarmingContact'),
      isEligible: true,
      category: 'subsidy'
    },
    {
      id: 5,
      name: t('farmEquipmentScheme'),
      description: t('farmEquipmentDescription'),
      benefits: t('farmEquipmentBenefits'),
      eligibility: [t('farmEquipmentEligibility1'), t('farmEquipmentEligibility2')],
      documents: [t('farmEquipmentDoc1'), t('farmEquipmentDoc2')],
      applicationProcess: t('farmEquipmentProcess'),
      deadline: t('farmEquipmentDeadline'),
      contactInfo: t('farmEquipmentContact'),
      isEligible: true,
      category: 'equipment'
    }
  ];

  const categories = [
    { value: 'all', label: t('allSchemes'), icon: FileText },
    { value: 'subsidy', label: t('subsidySchemes'), icon: Banknote },
    { value: 'insurance', label: t('insuranceSchemes'), icon: CheckCircle },
    { value: 'loan', label: t('loanSchemes'), icon: Banknote },
    { value: 'training', label: t('trainingSchemes'), icon: Info },
    { value: 'equipment', label: t('equipmentSchemes'), icon: FileText },
  ];

  const filteredSchemes = selectedCategory === 'all' 
    ? schemes 
    : schemes.filter(scheme => scheme.category === selectedCategory);

  const eligibleSchemes = schemes.filter(scheme => scheme.isEligible).length;

  if (selectedScheme) {
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
            onClick={() => setSelectedScheme(null)}
            className="mr-4 p-2 rounded-full bg-cream text-black"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className="text-2xl font-bold">{t('schemeDetails')}</h1>
        </motion.div>

        {/* Scheme Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-cream rounded-3xl p-6 mb-6"
        >
          {/* Scheme Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {selectedScheme.isEligible ? (
                <CheckCircle size={32} className="text-green-600" />
              ) : (
                <XCircle size={32} className="text-red-600" />
              )}
              <h2 className="text-2xl font-bold text-black">{selectedScheme.name}</h2>
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              selectedScheme.isEligible 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {selectedScheme.isEligible ? t('eligible') : t('notEligible')}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">{t('description')}</h3>
            <p className="text-black">{selectedScheme.description}</p>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">{t('benefits')}</h3>
            <p className="text-black">{selectedScheme.benefits}</p>
          </div>

          {/* Eligibility Criteria */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">{t('eligibilityCriteria')}</h3>
            <ul className="space-y-2">
              {selectedScheme.eligibility.map((criteria, index) => (
                <li key={index} className="flex items-start space-x-2 text-black">
                  <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>{criteria}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Documents */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">{t('requiredDocuments')}</h3>
            <ul className="space-y-2">
              {selectedScheme.documents.map((doc, index) => (
                <li key={index} className="flex items-start space-x-2 text-black">
                  <FileText size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Application Process */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">{t('applicationProcess')}</h3>
            <p className="text-black">{selectedScheme.applicationProcess}</p>
          </div>

          {/* Important Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar size={20} className="text-blue-600" />
                <h4 className="font-bold text-black">{t('deadline')}</h4>
              </div>
              <p className="text-black text-sm">{selectedScheme.deadline}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <Phone size={20} className="text-green-600" />
                <h4 className="font-bold text-black">{t('contactInfo')}</h4>
              </div>
              <p className="text-black text-sm">{selectedScheme.contactInfo}</p>
            </div>
          </div>

          {/* Apply Button */}
          {selectedScheme.isEligible && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-semibold text-lg"
            >
              {t('applyNow')}
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    );
  }

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
        <h1 className="text-2xl font-bold">{t('govtSchemes')}</h1>
      </motion.div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-cream rounded-3xl p-6 mb-6"
      >
        <h2 className="text-xl font-bold text-black mb-2">
          {t('welcome')}, {userProfile.firstName}!
        </h2>
        <p className="text-black mb-4">{t('schemeEligibilityCheck')}</p>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle size={20} className="text-green-600" />
            <span className="text-black font-semibold">{eligibleSchemes} {t('eligibleSchemes')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText size={20} className="text-blue-600" />
            <span className="text-black">{schemes.length} {t('totalSchemes')}</span>
          </div>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <motion.button
              key={category.value}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.value
                  ? 'bg-cream text-black'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}
            >
              <category.icon size={16} />
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Schemes List */}
      <div className="space-y-4 mb-20">
        {filteredSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedScheme(scheme)}
            className="bg-cream rounded-3xl p-6 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black mb-2">{scheme.name}</h3>
                <p className="text-black text-sm mb-3">{scheme.description}</p>
              </div>
              <div className={`ml-4 p-2 rounded-full ${
                scheme.isEligible ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {scheme.isEligible ? (
                  <CheckCircle size={24} className="text-green-600" />
                ) : (
                  <XCircle size={24} className="text-red-600" />
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                scheme.isEligible 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {scheme.isEligible ? t('eligible') : t('notEligible')}
              </div>
              <span className="text-black text-sm">{t('tapForDetails')}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Profile Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
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

export default GovernmentSchemesScreen;