import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, User, Search, ArrowUp, ArrowDown, ChevronDown, Wheat } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MarketScreenProps {
  onBack: () => void;
}

const MarketScreen: React.FC<MarketScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    cropType: '',
    variety: '',
    state: '',
    district: ''
  });
  const [showPriceResult, setShowPriceResult] = useState(false);
  const [priceData, setPriceData] = useState<any>(null);
  const [showMyCropSection, setShowMyCropSection] = useState(false);

  // Sample crops from "My Crop" section - this would come from the crop management
  const myCrops = [
    {
      id: 1,
      name: 'Paddy',
      variety: 'BPT 5204 (Sona Masuri)',
      season: 'Kharif',
      sowingDate: '15-July-2025',
      area: '2 Acres',
      marketPrice: {
        minPrice: 2650,
        maxPrice: 2850,
        demandTrend: 'high',
        date: '08-Sep-2025',
        district: 'Hyderabad APMC'
      }
    },
    {
      id: 2,
      name: 'Tomato',
      variety: 'Arka Rakshak',
      season: 'Rabi',
      sowingDate: '10-Aug-2025',
      area: '1 Acre',
      marketPrice: {
        minPrice: 40,
        maxPrice: 45,
        demandTrend: 'high',
        date: '08-Sep-2025',
        district: 'Bangalore APMC'
      }
    }
  ];

  // Crop options with varieties
  const cropOptions = [
    { value: 'rice', label: t('rice') },
    { value: 'wheat', label: t('wheat') },
    { value: 'corn', label: t('corn') },
    { value: 'tomato', label: t('tomato') },
    { value: 'onion', label: t('onion') },
    { value: 'potato', label: t('potato') },
    { value: 'mango', label: t('mango') },
    { value: 'banana', label: t('banana') },
    { value: 'apple', label: t('apple') },
  ];

  const varietyOptions: { [key: string]: string[] } = {
    rice: ['BPT 5204 (Sona Masuri)', 'IR 64', 'Swarna', 'MTU 1010', 'Pusa Basmati 1121'],
    wheat: ['HD 2967', 'PBW 343', 'DBW 17', 'HD 3086', 'Lok 1'],
    corn: ['Pioneer 30V92', 'NK 6240', 'DKC 9108', 'P 3396', 'Monsanto DKC 9144'],
    tomato: ['Arka Rakshak', 'Pusa Ruby', 'Himsona', 'Arka Vikas', 'Pusa Rohini'],
    onion: ['Pusa Red', 'Agrifound Light Red', 'Bhima Super', 'Pusa Madhavi', 'Nasik Red'],
    potato: ['Kufri Jyoti', 'Kufri Pukhraj', 'Kufri Badshah', 'Kufri Chipsona', 'Kufri Lauvkar'],
    mango: ['Alphonso', 'Banganapalli', 'Kesar', 'Dasheri', 'Langra'],
    banana: ['Robusta', 'Dwarf Cavendish', 'Grand Naine', 'Poovan', 'Rasthali'],
    apple: ['Red Delicious', 'Royal Delicious', 'Golden Delicious', 'Granny Smith', 'Fuji'],
  };

  const stateOptions = [
    'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala',
    'Maharashtra', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh',
    'Bihar', 'West Bengal', 'Odisha', 'Jharkhand', 'Chhattisgarh',
    'Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Assam'
  ];

  const districtOptions: { [key: string]: string[] } = {
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Medak', 'Rangareddy'],
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kakinada', 'Anantapur', 'Chittoor'],
    'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli', 'Jalgaon'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur', 'Hoshiarpur', 'Gurdaspur', 'Moga'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Bharuch'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Moradabad']
  };

  // Sample market data based on selections (this will be replaced with Excel data)
  const getMarketPrice = (cropType: string, variety: string, state: string, district: string) => {
    // This is sample data - replace with actual Excel data lookup
    const samplePrices: { [key: string]: any } = {
      'rice-BPT 5204 (Sona Masuri)-Telangana-Hyderabad': {
        crop: t('rice'),
        variety: 'BPT 5204 (Sona Masuri)',
        state: 'Telangana',
        district: 'Hyderabad APMC',
        date: '08-Sep-2025',
        minPrice: 2650,
        maxPrice: 2850,
        demandTrend: 'high',
        remarks: t('pricesStableDueToFestiveDemand')
      },
      'wheat-HD 2967-Punjab-Ludhiana': {
        crop: t('wheat'),
        variety: 'HD 2967',
        state: 'Punjab',
        district: 'Ludhiana APMC',
        date: '08-Sep-2025',
        minPrice: 2100,
        maxPrice: 2200,
        demandTrend: 'medium',
        remarks: t('seasonalPriceFluctuation')
      },
      'tomato-Arka Rakshak-Karnataka-Bangalore': {
        crop: t('tomato'),
        variety: 'Arka Rakshak',
        state: 'Karnataka',
        district: 'Bangalore APMC',
        date: '08-Sep-2025',
        minPrice: 40,
        maxPrice: 45,
        demandTrend: 'high',
        remarks: t('pricesRisingDueToLowSupply')
      }
    };

    const key = `${cropType}-${variety}-${state}-${district}`;
    return samplePrices[key] || {
      crop: t(cropType),
      variety: variety,
      state: state,
      district: `${district} APMC`,
      date: '08-Sep-2025',
      minPrice: Math.floor(Math.random() * 1000) + 1500,
      maxPrice: Math.floor(Math.random() * 1000) + 2000,
      demandTrend: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)],
      remarks: t('pricesStableDueToFestiveDemand')
    };
  };

  const handleGetPrice = () => {
    if (formData.cropType && formData.variety && formData.state && formData.district) {
      const price = getMarketPrice(formData.cropType, formData.variety, formData.state, formData.district);
      setPriceData(price);
      setShowPriceResult(true);
    }
  };

  const handleReset = () => {
    setFormData({ cropType: '', variety: '', state: '', district: '' });
    setShowPriceResult(false);
    setPriceData(null);
  };

  const isFormComplete = formData.cropType && formData.variety && formData.state && formData.district;

  // If showing price result, display the detailed price information
  if (showPriceResult && priceData) {
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
            onClick={handleReset}
            className="mr-4 p-2 rounded-full bg-cream text-black"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className="text-3xl font-bold">{t('market')}</h1>
        </motion.div>

        {/* Search Bar showing selected crop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative mb-8"
        >
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={priceData.crop}
              value={priceData.crop}
              readOnly
              className="w-full pl-12 pr-4 py-4 bg-gray-800 text-white rounded-2xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cream focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Detailed Crop Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cream rounded-3xl p-6 mb-8"
        >
          {/* Crop Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2 break-words">{t('crop')}: {priceData.crop}</h2>
            <div className="space-y-1 text-black text-sm sm:text-base">
              <p className="break-words"><span className="font-semibold">{t('variety')}:</span> {priceData.variety}</p>
              <p className="break-words"><span className="font-semibold">{t('state')}:</span> {priceData.state}</p>
              <p className="break-words"><span className="font-semibold">{t('districtMarketYard')}:</span> {priceData.district}</p>
              <p className="break-words"><span className="font-semibold">{t('date')}:</span> {priceData.date}</p>
            </div>
          </div>

          {/* Price Table */}
          <div className="border-4 border-purple-600 rounded-2xl overflow-hidden text-sm sm:text-base">
            {/* Table Header */}
            <div className="grid grid-cols-2 bg-purple-600 text-sm sm:text-base">
              <div className="p-3 sm:p-4 text-center">
                <h3 className="text-lg sm:text-xl font-bold text-white">{t('parameter')}</h3>
              </div>
              <div className="p-3 sm:p-4 text-center border-l-4 border-purple-800">
                <h3 className="text-lg sm:text-xl font-bold text-white">{t('details')}</h3>
              </div>
            </div>

            {/* Minimum Price Row */}
            <div className="grid grid-cols-2 bg-white border-b-4 border-purple-600">
              <div className="p-3 sm:p-4 text-center border-r-4 border-purple-600">
                <p className="text-black font-medium">{t('minimumPrice')}</p>
                <p className="text-black text-xs sm:text-sm">({t('perQuintal')})</p>
              </div>
              <div className="p-3 sm:p-4 text-center">
                <p className="text-black text-lg sm:text-xl font-bold break-words">₹{priceData.minPrice.toLocaleString()}</p>
              </div>
            </div>

            {/* Maximum Price Row */}
            <div className="grid grid-cols-2 bg-white border-b-4 border-purple-600">
              <div className="p-3 sm:p-4 text-center border-r-4 border-purple-600">
                <p className="text-black font-medium">{t('maximumPrice')}</p>
                <p className="text-black text-xs sm:text-sm">({t('perQuintal')})</p>
              </div>
              <div className="p-3 sm:p-4 text-center">
                <p className="text-black text-lg sm:text-xl font-bold break-words">₹{priceData.maxPrice.toLocaleString()}</p>
              </div>
            </div>

            {/* Demand Trend Row */}
            <div className="grid grid-cols-2 bg-white border-b-4 border-purple-600">
              <div className="p-3 sm:p-4 text-center border-r-4 border-purple-600">
                <p className="text-black font-medium">{t('demandTrend')}</p>
              </div>
              <div className="p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  {priceData.demandTrend === 'high' ? (
                    <>
                      <ArrowUp size={16} className="text-green-600 sm:w-5 sm:h-5" />
                      <span className="text-green-600 font-bold">{t('high')}</span>
                    </>
                  ) : priceData.demandTrend === 'medium' ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-600 font-bold">{t('medium')}</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown size={16} className="text-red-600 sm:w-5 sm:h-5" />
                      <span className="text-red-600 font-bold">{t('low')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Remarks Row */}
            <div className="grid grid-cols-2 bg-white">
              <div className="p-3 sm:p-4 text-center border-r-4 border-purple-600">
                <p className="text-black font-medium">{t('remarks')}</p>
              </div>
              <div className="p-3 sm:p-4 text-center">
                <p className="text-black text-xs sm:text-sm break-words">{priceData.remarks}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
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
  }

  // Main form view for crop selection

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
        <h1 className="text-3xl font-bold">{t('market')}</h1>
      </motion.div>

      {/* Toggle Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex space-x-4 mb-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowMyCropSection(false)}
          className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-colors ${
            !showMyCropSection 
              ? 'bg-cream text-black' 
              : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}
        >
          <Search size={20} className="inline mr-2" />
          {t('searchMarket')}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowMyCropSection(true)}
          className={`flex-1 py-3 px-6 rounded-2xl font-semibold transition-colors ${
            showMyCropSection 
              ? 'bg-cream text-black' 
              : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}
        >
          <Wheat size={20} className="inline mr-2" />
          {t('myCropMarket')}
        </motion.button>
      </motion.div>

      {/* My Crop Market Section */}
      {showMyCropSection ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6 mb-20"
        >
          <div className="bg-cream rounded-3xl p-6">
            <h2 className="text-xl font-bold text-black mb-4">{t('myCropMarketPrices')}</h2>
            <p className="text-black text-sm mb-4">{t('viewMarketPricesForYourCrops')}</p>
          </div>

          {myCrops.map((crop, index) => (
            <motion.div
              key={crop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-cream rounded-3xl p-6"
            >
              {/* Crop Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-black mb-2">{t('crop')}: {t(crop.name.toLowerCase())}</h3>
                <div className="space-y-1 text-black text-sm">
                  <p><span className="font-semibold">{t('variety')}:</span> {crop.variety}</p>
                  <p><span className="font-semibold">{t('season')}:</span> {crop.season}</p>
                  <p><span className="font-semibold">{t('area')}:</span> {crop.area}</p>
                  <p><span className="font-semibold">{t('districtMarketYard')}:</span> {crop.marketPrice.district}</p>
                  <p><span className="font-semibold">{t('date')}:</span> {crop.marketPrice.date}</p>
                </div>
              </div>

              {/* Price Table */}
              <div className="border-4 border-purple-600 rounded-2xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-2 bg-purple-600">
                  <div className="p-4 text-center">
                    <h4 className="text-xl font-bold text-white">{t('parameter')}</h4>
                  </div>
                  <div className="p-4 text-center border-l-4 border-purple-800">
                    <h4 className="text-xl font-bold text-white">{t('details')}</h4>
                  </div>
                </div>

                {/* Minimum Price Row */}
                <div className="grid grid-cols-2 bg-white border-b-4 border-purple-600">
                  <div className="p-4 text-center border-r-4 border-purple-600">
                    <p className="text-black font-medium">{t('minimumPrice')}</p>
                    <p className="text-black text-sm">({t('perQuintal')})</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-black text-xl font-bold">₹{crop.marketPrice.minPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Maximum Price Row */}
                <div className="grid grid-cols-2 bg-white border-b-4 border-purple-600">
                  <div className="p-4 text-center border-r-4 border-purple-600">
                    <p className="text-black font-medium">{t('maximumPrice')}</p>
                    <p className="text-black text-sm">({t('perQuintal')})</p>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-black text-xl font-bold">₹{crop.marketPrice.maxPrice.toLocaleString()}</p>
                  </div>
                </div>

                {/* Demand Trend Row */}
                <div className="grid grid-cols-2 bg-white">
                  <div className="p-4 text-center border-r-4 border-purple-600">
                    <p className="text-black font-medium">{t('demandTrend')}</p>
                  </div>
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {crop.marketPrice.demandTrend === 'high' ? (
                        <>
                          <ArrowUp size={20} className="text-green-600" />
                          <span className="text-green-600 font-bold">{t('high')}</span>
                        </>
                      ) : crop.marketPrice.demandTrend === 'medium' ? (
                        <>
                          <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                          <span className="text-orange-600 font-bold">{t('medium')}</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown size={20} className="text-red-600" />
                          <span className="text-red-600 font-bold">{t('low')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <>
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-cream rounded-3xl p-6 mb-6"
      >
        <h2 className="text-xl font-bold text-black mb-4">{t('howToUse')}</h2>
        <div className="space-y-2 text-black text-sm">
          <p>1. {t('selectCropType')}</p>
          <p>2. {t('chooseVariety')}</p>
          <p>3. {t('selectState')}</p>
          <p>4. {t('selectDistrict')}</p>
          <p>5. {t('clickGetPrice')}</p>
        </div>
      </motion.div>

      {/* Crop Selection Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-cream rounded-3xl p-6 mb-8"
      >
        <h3 className="text-xl font-bold text-black mb-6">{t('selectCropDetails')}</h3>
        
        <div className="space-y-4">
          {/* Crop Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">{t('cropType')}</label>
            <div className="relative">
              <select
                value={formData.cropType}
                onChange={(e) => setFormData({ ...formData, cropType: e.target.value, variety: '' })}
                className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="">{t('selectCropType')}</option>
                {cropOptions.map(crop => (
                  <option key={crop.value} value={crop.value}>{crop.label}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Variety Selection */}
          {formData.cropType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-semibold text-black mb-2">{t('variety')}</label>
              <div className="relative">
                <select
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                >
                  <option value="">{t('chooseVariety')}</option>
                  {varietyOptions[formData.cropType]?.map(variety => (
                    <option key={variety} value={variety}>{variety}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* State Selection */}
          {formData.variety && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-semibold text-black mb-2">{t('state')}</label>
              <div className="relative">
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value, district: '' })}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                >
                  <option value="">{t('selectState')}</option>
                  {stateOptions.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* District Selection */}
          {formData.state && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-semibold text-black mb-2">{t('district')}</label>
              <div className="relative">
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                >
                  <option value="">{t('selectDistrict')}</option>
                  {(districtOptions[formData.state] || []).map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </motion.div>
          )}

          {/* Get Price Button */}
          {isFormComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetPrice}
                className="w-full py-4 bg-green-600 text-white rounded-xl font-semibold text-lg flex items-center justify-center space-x-2"
              >
                <Search size={20} />
                <span>{t('getPrice')}</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
        </>
      )}

      {/* Price List */}
      {/* Profile Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 260, damping: 20 }}
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

export default MarketScreen;