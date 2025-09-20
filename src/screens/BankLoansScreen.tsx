import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Banknote, CheckCircle, XCircle, Info, Calculator, FileText, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BankLoansScreenProps {
  onBack: () => void;
  userProfile: { firstName: string; lastName: string; mobile: string; isRegistered: boolean };
}

interface LoanScheme {
  id: number;
  name: string;
  bankName: string;
  description: string;
  interestRate: string;
  maxAmount: string;
  tenure: string;
  eligibility: string[];
  documents: string[];
  features: string[];
  applicationProcess: string;
  contactInfo: string;
  isEligible: boolean;
  loanType: 'crop' | 'equipment' | 'land' | 'dairy' | 'general';
}

const BankLoansScreen: React.FC<BankLoansScreenProps> = ({ onBack, userProfile }) => {
  const { t } = useLanguage();
  const [selectedLoan, setSelectedLoan] = useState<LoanScheme | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showEMICalculator, setShowEMICalculator] = useState(false);
  const [emiData, setEmiData] = useState({
    loanAmount: '',
    interestRate: '',
    tenure: ''
  });

  // Sample bank loan schemes data
  const loanSchemes: LoanScheme[] = [
    {
      id: 1,
      name: t('cropLoanScheme'),
      bankName: t('sbiBank'),
      description: t('cropLoanDescription'),
      interestRate: '7.0% - 9.0%',
      maxAmount: '₹3,00,000',
      tenure: '12 months',
      eligibility: [t('cropLoanEligibility1'), t('cropLoanEligibility2'), t('cropLoanEligibility3')],
      documents: [t('cropLoanDoc1'), t('cropLoanDoc2'), t('cropLoanDoc3')],
      features: [t('cropLoanFeature1'), t('cropLoanFeature2'), t('cropLoanFeature3')],
      applicationProcess: t('cropLoanProcess'),
      contactInfo: t('cropLoanContact'),
      isEligible: true,
      loanType: 'crop'
    },
    {
      id: 2,
      name: t('farmEquipmentLoan'),
      bankName: t('hdfcBank'),
      description: t('farmEquipmentLoanDescription'),
      interestRate: '8.5% - 11.0%',
      maxAmount: '₹25,00,000',
      tenure: '7 years',
      eligibility: [t('equipmentLoanEligibility1'), t('equipmentLoanEligibility2')],
      documents: [t('equipmentLoanDoc1'), t('equipmentLoanDoc2')],
      features: [t('equipmentLoanFeature1'), t('equipmentLoanFeature2')],
      applicationProcess: t('equipmentLoanProcess'),
      contactInfo: t('equipmentLoanContact'),
      isEligible: true,
      loanType: 'equipment'
    },
    {
      id: 3,
      name: t('landPurchaseLoan'),
      bankName: t('iciciBank'),
      description: t('landPurchaseLoanDescription'),
      interestRate: '9.0% - 12.0%',
      maxAmount: '₹50,00,000',
      tenure: '15 years',
      eligibility: [t('landLoanEligibility1'), t('landLoanEligibility2')],
      documents: [t('landLoanDoc1'), t('landLoanDoc2')],
      features: [t('landLoanFeature1'), t('landLoanFeature2')],
      applicationProcess: t('landLoanProcess'),
      contactInfo: t('landLoanContact'),
      isEligible: false,
      loanType: 'land'
    },
    {
      id: 4,
      name: t('dairyLoanScheme'),
      bankName: t('pnbBank'),
      description: t('dairyLoanDescription'),
      interestRate: '7.5% - 10.0%',
      maxAmount: '₹10,00,000',
      tenure: '5 years',
      eligibility: [t('dairyLoanEligibility1'), t('dairyLoanEligibility2')],
      documents: [t('dairyLoanDoc1'), t('dairyLoanDoc2')],
      features: [t('dairyLoanFeature1'), t('dairyLoanFeature2')],
      applicationProcess: t('dairyLoanProcess'),
      contactInfo: t('dairyLoanContact'),
      isEligible: true,
      loanType: 'dairy'
    }
  ];

  const categories = [
    { value: 'all', label: t('allLoans'), icon: Banknote },
    { value: 'crop', label: t('cropLoans'), icon: FileText },
    { value: 'equipment', label: t('equipmentLoans'), icon: Info },
    { value: 'land', label: t('landLoans'), icon: MapPin },
    { value: 'dairy', label: t('dairyLoans'), icon: CheckCircle },
  ];

  const filteredLoans = selectedCategory === 'all' 
    ? loanSchemes 
    : loanSchemes.filter(loan => loan.loanType === selectedCategory);

  const eligibleLoans = loanSchemes.filter(loan => loan.isEligible).length;

  const calculateEMI = () => {
    const principal = parseFloat(emiData.loanAmount);
    const rate = parseFloat(emiData.interestRate) / 100 / 12;
    const tenure = parseFloat(emiData.tenure) * 12;
    
    if (principal && rate && tenure) {
      const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
      return Math.round(emi);
    }
    return 0;
  };

  if (showEMICalculator) {
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
            onClick={() => setShowEMICalculator(false)}
            className="mr-4 p-2 rounded-full bg-cream text-black"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className="text-2xl font-bold">{t('emiCalculator')}</h1>
        </motion.div>

        {/* EMI Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-cream rounded-3xl p-6 mb-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Calculator size={32} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-black">{t('loanEMICalculator')}</h2>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">{t('loanAmount')} (₹)</label>
              <input
                type="number"
                value={emiData.loanAmount}
                onChange={(e) => setEmiData({ ...emiData, loanAmount: e.target.value })}
                placeholder="100000"
                className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">{t('interestRate')} (%)</label>
              <input
                type="number"
                step="0.1"
                value={emiData.interestRate}
                onChange={(e) => setEmiData({ ...emiData, interestRate: e.target.value })}
                placeholder="8.5"
                className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">{t('loanTenure')} ({t('years')})</label>
              <input
                type="number"
                value={emiData.tenure}
                onChange={(e) => setEmiData({ ...emiData, tenure: e.target.value })}
                placeholder="5"
                className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* EMI Result */}
          {emiData.loanAmount && emiData.interestRate && emiData.tenure && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-100 p-6 rounded-2xl text-center"
            >
              <h3 className="text-lg font-bold text-black mb-2">{t('monthlyEMI')}</h3>
              <p className="text-3xl font-bold text-blue-600">₹{calculateEMI().toLocaleString()}</p>
              <p className="text-sm text-black mt-2">
                {t('totalAmount')}: ₹{(calculateEMI() * parseFloat(emiData.tenure) * 12).toLocaleString()}
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  if (selectedLoan) {
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
            onClick={() => setSelectedLoan(null)}
            className="mr-4 p-2 rounded-full bg-cream text-black"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className="text-2xl font-bold">{t('loanDetails')}</h1>
        </motion.div>

        {/* Loan Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-cream rounded-3xl p-6 mb-6"
        >
          {/* Loan Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              {selectedLoan.isEligible ? (
                <CheckCircle size={32} className="text-green-600" />
              ) : (
                <XCircle size={32} className="text-red-600" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-black">{selectedLoan.name}</h2>
                <p className="text-lg text-gray-600">{selectedLoan.bankName}</p>
              </div>
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              selectedLoan.isEligible 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {selectedLoan.isEligible ? t('eligible') : t('notEligible')}
            </div>
          </div>

          {/* Loan Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-2xl text-center">
              <h4 className="font-bold text-black">{t('interestRate')}</h4>
              <p className="text-xl font-bold text-blue-600">{selectedLoan.interestRate}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-2xl text-center">
              <h4 className="font-bold text-black">{t('maxAmount')}</h4>
              <p className="text-xl font-bold text-green-600">{selectedLoan.maxAmount}</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-2xl text-center col-span-2">
              <h4 className="font-bold text-black">{t('loanTenure')}</h4>
              <p className="text-xl font-bold text-orange-600">{selectedLoan.tenure}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">{t('description')}</h3>
            <p className="text-black">{selectedLoan.description}</p>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">{t('keyFeatures')}</h3>
            <ul className="space-y-2">
              {selectedLoan.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2 text-black">
                  <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">{t('eligibilityCriteria')}</h3>
            <ul className="space-y-2">
              {selectedLoan.eligibility.map((criteria, index) => (
                <li key={index} className="flex items-start space-x-2 text-black">
                  <Info size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                  <span>{criteria}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-black mb-3">{t('requiredDocuments')}</h3>
            <ul className="space-y-2">
              {selectedLoan.documents.map((doc, index) => (
                <li key={index} className="flex items-start space-x-2 text-black">
                  <FileText size={16} className="text-purple-600 mt-1 flex-shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-100 p-4 rounded-2xl mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Phone size={20} className="text-green-600" />
              <h4 className="font-bold text-black">{t('contactInfo')}</h4>
            </div>
            <p className="text-black text-sm">{selectedLoan.contactInfo}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEMICalculator(true)}
              className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-semibold flex items-center justify-center space-x-2"
            >
              <Calculator size={20} />
              <span>{t('calculateEMI')}</span>
            </motion.button>
            {selectedLoan.isEligible && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 bg-green-600 text-white rounded-2xl font-semibold"
              >
                {t('applyNow')}
              </motion.button>
            )}
          </div>
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
        <h1 className="text-2xl font-bold">{t('bankLoans')}</h1>
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
        <p className="text-black mb-4">{t('loanEligibilityCheck')}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-black font-semibold">{eligibleLoans} {t('eligibleLoans')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Banknote size={20} className="text-blue-600" />
              <span className="text-black">{loanSchemes.length} {t('totalLoans')}</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEMICalculator(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2"
          >
            <Calculator size={16} />
            <span>{t('emiCalculator')}</span>
          </motion.button>
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

      {/* Loans List */}
      <div className="space-y-4 mb-20">
        {filteredLoans.map((loan, index) => (
          <motion.div
            key={loan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedLoan(loan)}
            className="bg-cream rounded-3xl p-6 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black mb-1">{loan.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{loan.bankName}</p>
                <p className="text-black text-sm mb-3">{loan.description}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-blue-600 font-semibold">{loan.interestRate}</span>
                  <span className="text-green-600 font-semibold">{loan.maxAmount}</span>
                </div>
              </div>
              <div className={`ml-4 p-2 rounded-full ${
                loan.isEligible ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {loan.isEligible ? (
                  <CheckCircle size={24} className="text-green-600" />
                ) : (
                  <XCircle size={24} className="text-red-600" />
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                loan.isEligible 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {loan.isEligible ? t('eligible') : t('notEligible')}
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

export default BankLoansScreen;