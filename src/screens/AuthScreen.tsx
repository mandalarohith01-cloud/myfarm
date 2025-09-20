import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Phone, Eye, EyeOff, UserPlus, LogIn, MapPin, Droplets, Thermometer, Zap, Wheat, Home, Calendar, CreditCard, Banknote, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const AuthScreen: React.FC = () => {
  const { t } = useLanguage();
  const { login, signup, isLoading, error } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    // Basic Info
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    
    // Farmer Details
    farmName: '',
    farmerType: '',
    experience: '',
    education: '',
    farmSize: '',
    farmLocation: '',
    state: '',
    district: '',
    village: '',
    pincode: '',
    
   
    
    
    // Financial Information
    annualIncome: '',
    landOwnership: '',
    hasInsurance: false,
    hasLoan: false,
    bankAccount: ''
  });

  const farmerTypes = [
    'Small Scale Farmer (< 2 acres)',
    'Medium Scale Farmer (2-10 acres)', 
    'Large Scale Farmer (> 10 acres)',
    'Organic Farmer',
    'Dairy Farmer',
    'Poultry Farmer',
    'Mixed Farming'
  ];

  const soilTypes = [
    'Alluvial Soil',
    'Black Cotton Soil',
    'Red Soil',
    'Laterite Soil',
    'Desert Soil',
    'Mountain Soil',
    'Sandy Soil',
    'Clay Soil',
    'Loamy Soil'
  ];

  const cropOptions = [
    'Rice/Paddy', 'Wheat', 'Corn/Maize', 'Sugarcane', 'Cotton',
    'Tomato', 'Onion', 'Potato', 'Cabbage', 'Cauliflower',
    'Mango', 'Banana', 'Apple', 'Grapes', 'Orange',
    'Groundnut', 'Soybean', 'Sunflower', 'Mustard', 'Sesame'
  ];

  const irrigationTypes = [
    'Drip Irrigation',
    'Sprinkler Irrigation', 
    'Flood Irrigation',
    'Furrow Irrigation',
    'Rain-fed',
    'Mixed Methods'
  ];

  const waterSources = [
    'Borewell',
    'Open Well',
    'Canal',
    'River',
    'Pond/Tank',
    'Rainwater Harvesting',
    'Government Supply'
  ];

  const states = [
    'Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala',
    'Maharashtra', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh',
    'Bihar', 'West Bengal', 'Odisha', 'Jharkhand', 'Chhattisgarh',
    'Punjab', 'Haryana', 'Himachal Pradesh', 'Uttarakhand', 'Assam'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignup) {
      const success = await signup(formData);
      if (success) {
        // User will be automatically logged in after successful signup
      }
    } else {
      const success = await login(formData.username, formData.password);
      if (success) {
        // User will be redirected to main app
      }
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCropSelection = (crop: string, isPrimary: boolean) => {
    const field = isPrimary ? 'primaryCrops' : 'secondaryCrops';
    const currentCrops = formData[field] as string[];
    
    if (currentCrops.includes(crop)) {
      handleInputChange(field, currentCrops.filter(c => c !== crop));
    } else {
      handleInputChange(field, [...currentCrops, crop]);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '', password: '', firstName: '', lastName: '', mobile: '', email: '',
      farmName: '', farmerType: '', experience: '', education: '', farmSize: '',
      farmLocation: '', state: '', district: '', village: '', pincode: '',
      soilType: '', soilPH: '', soilMoisture: '', soilFertility: '', irrigationType: '', waterSource: '',
      primaryCrops: [], secondaryCrops: [], farmingMethod: '', season: '',
      annualIncome: '', landOwnership: '', hasInsurance: false, hasLoan: false, bankAccount: ''
    });
    setCurrentStep(1);
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    resetForm();
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepProgress = () => {
    return (currentStep / 5) * 100;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-center mb-6 text-cream">Basic Information</h3>
            
            {/* Username */}
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                className="w-full pl-12 pr-6 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="w-full pl-12 pr-12 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* First Name */}
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                className="w-full pl-12 pr-6 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                className="w-full pl-12 pr-6 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {/* Mobile */}
            <div className="relative">
              <Phone size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                required
                pattern="[6-9][0-9]{9}"
                className="w-full pl-12 pr-6 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-center mb-6 text-cream">Farm Details</h3>
            
            {/* Farmer Type */}
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10" />
              <select
                value={formData.farmerType}
                onChange={(e) => handleInputChange('farmerType', e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-cream text-black rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="">Select Farmer Type</option>
                {farmerTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>

            {/* Experience */}
            <div className="relative">
              <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="number"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {/* Farm Size */}
            <div className="relative">
              <MapPin size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Farm Size (in acres)"
                value={formData.farmSize}
                onChange={(e) => handleInputChange('farmSize', e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {/* State */}
            <div className="relative">
              <MapPin size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10" />
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-cream text-black rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="">Select State</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>

            {/* Village */}
            <div className="relative">
              <Home size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Village/Town"
                value={formData.village}
                onChange={(e) => handleInputChange('village', e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-center mb-6 text-cream">Soil Information</h3>
            
            {/* Soil Type */}
            <div className="relative">
              <Thermometer size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10" />
              <select
                value={formData.soilType}
                onChange={(e) => handleInputChange('soilType', e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-cream text-black rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="">Select Soil Type</option>
                {soilTypes.map(soil => (
                  <option key={soil} value={soil}>{soil}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>

            {/* Soil pH */}
            <div className="relative">
              <Zap size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="number"
                step="0.1"
                placeholder="Soil pH (6.0-8.0)"
                value={formData.soilPH}
                onChange={(e) => handleInputChange('soilPH', e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {/* Soil Fertility */}
            <div className="relative">
              <Wheat size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10" />
              <select
                value={formData.soilFertility}
                onChange={(e) => handleInputChange('soilFertility', e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-cream text-black rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="">Soil Fertility Level</option>
                <option value="high">High Fertility</option>
                <option value="medium">Medium Fertility</option>
                <option value="low">Low Fertility</option>
                <option value="unknown">Unknown</option>
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>

            {/* Irrigation Type */}
            <div className="relative">
              <Droplets size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10" />
              <select
                value={formData.irrigationType}
                onChange={(e) => handleInputChange('irrigationType', e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-cream text-black rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="">Select Irrigation Type</option>
                {irrigationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>

            {/* Water Source */}
            <div className="relative">
              <Droplets size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10" />
              <select
                value={formData.waterSource}
                onChange={(e) => handleInputChange('waterSource', e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-cream text-black rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="">Select Water Source</option>
                {waterSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>

            {/* Farming Method */}
            <div className="relative">
              <Wheat size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10" />
              <select
                value={formData.farmingMethod}
                onChange={(e) => handleInputChange('farmingMethod', e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-cream text-black rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="">Farming Method</option>
                <option value="organic">Organic Farming</option>
                <option value="conventional">Conventional Farming</option>
                <option value="mixed">Mixed Farming</option>
                <option value="sustainable">Sustainable Farming</option>
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-center mb-6 text-cream">Crop Information</h3>
            
            {/* Season */}
            <div className="relative">
              <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10" />
              <select
                value={formData.season}
                onChange={(e) => handleInputChange('season', e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-cream text-black rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="">Primary Growing Season</option>
                <option value="kharif">Kharif (Monsoon)</option>
                <option value="rabi">Rabi (Winter)</option>
                <option value="zaid">Zaid (Summer)</option>
                <option value="year-round">Year Round</option>
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-center mb-6 text-cream">Financial Information</h3>
            
            {/* Annual Income */}
            <div className="relative">
              <Banknote size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10" />
              <select
                value={formData.annualIncome}
                onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-cream text-black rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="">Annual Farm Income</option>
                <option value="below-1lakh">Below ₹1 Lakh</option>
                <option value="1-3lakh">₹1-3 Lakh</option>
                <option value="3-5lakh">₹3-5 Lakh</option>
                <option value="5-10lakh">₹5-10 Lakh</option>
                <option value="above-10lakh">Above ₹10 Lakh</option>
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>

            {/* Land Ownership */}
            <div className="relative">
              <Home size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 z-10" />
              <select
                value={formData.landOwnership}
                onChange={(e) => handleInputChange('landOwnership', e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-cream text-black rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="">Land Ownership</option>
                <option value="owned">Owned Land</option>
                <option value="leased">Leased Land</option>
                <option value="shared">Share Cropping</option>
                <option value="mixed">Mixed (Owned + Leased)</option>
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" />
            </div>

            {/* Bank Account */}
            <div className="relative">
              <CreditCard size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Bank Account Number (Optional)"
                value={formData.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {/* Insurance & Loan Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-center space-x-3 text-cream">
                <input
                  type="checkbox"
                  checked={formData.hasInsurance}
                  onChange={(e) => handleInputChange('hasInsurance', e.target.checked)}
                  className="w-5 h-5 text-green-600 bg-cream border-gray-300 rounded focus:ring-green-500"
                />
                <span>I have crop insurance</span>
              </label>
              
              <label className="flex items-center space-x-3 text-cream">
                <input
                  type="checkbox"
                  checked={formData.hasLoan}
                  onChange={(e) => handleInputChange('hasLoan', e.target.checked)}
                  className="w-5 h-5 text-green-600 bg-cream border-gray-300 rounded focus:ring-green-500"
                />
                <span>I have existing farm loans</span>
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex flex-col items-center justify-center p-6"
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
            <Wheat size={32} className="text-white" />
          </div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 text-cream">MY FARM</h1>
        <p className="text-xl text-gray-300">
          {isSignup ? 'Complete Farmer Registration' : 'Welcome Back, Farmer!'}
        </p>
      </motion.div>

      {/* Login Form (Simple) */}
      {!isSignup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="relative">
              <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
                className="w-full pl-12 pr-6 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="w-full pl-12 pr-12 py-4 bg-cream text-black rounded-2xl text-lg placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Demo Instructions */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-2xl text-center text-sm"
            >
              <p className="font-semibold mb-1">Demo Mode</p>
              <p>Username: <strong>demo</strong></p>
              <p>Password: <strong>demo</strong></p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-green-600 text-white py-4 rounded-2xl text-lg font-semibold flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      )}

      {/* Signup Form (Multi-step) */}
      {isSignup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-cream mb-2">
              <span>Step {currentStep} of 5</span>
              <span>{Math.round(getStepProgress())}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getStepProgress()}%` }}
                transition={{ duration: 0.3 }}
                className="bg-green-500 h-2 rounded-full"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 bg-gray-600 text-white rounded-2xl font-semibold"
                >
                  Previous
                </motion.button>
              )}
              
              {currentStep < 5 ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 bg-green-600 text-white rounded-2xl font-semibold"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 bg-green-600 text-white rounded-2xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <UserPlus size={20} />
                      <span>Complete Registration</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      )}

      {/* Toggle Mode */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-6"
      >
        <p className="text-gray-400 mb-2">
          {isSignup ? 'Already have an account?' : 'New to MY FARM?'}
        </p>
        <button
          onClick={toggleMode}
          className="text-green-500 font-semibold hover:text-green-400 transition-colors"
        >
          {isSignup ? 'Sign In' : 'Complete Registration'}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default AuthScreen;