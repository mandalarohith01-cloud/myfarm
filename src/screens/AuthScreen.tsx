import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Phone, Eye, EyeOff, UserPlus, LogIn, MapPin, Droplets, Thermometer, Zap, Wheat, Home, Calendar, CreditCard, Banknote, ChevronDown, Upload, FileText, Camera, Sparkles, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import AIService from '../services/AIService';

const AuthScreen: React.FC = () => {
  const { t } = useLanguage();
  const { login, signup, isLoading, error } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzingSoil, setIsAnalyzingSoil] = useState(false);
  const [soilAnalysisResult, setSoilAnalysisResult] = useState(null);
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  
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
    
    // Soil and Crop Information
    soilType: '',
    soilPH: '',
    soilMoisture: '',
    soilFertility: '',
    irrigationType: '',
    waterSource: '',
    primaryCrops: [],
    secondaryCrops: [],
    farmingMethod: '',
    season: '',
   
    // Financial Information
    annualIncome: '',
    landOwnership: '',
    hasInsurance: false,
    hasLoan: false,
    bankAccount: '',
    
    // Soil Test Data
    soilTestDocument: null,
    soilTestResults: null,
    recommendedCrops: []
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
      // Include recommended crops in signup data
      const signupData = {
        ...formData,
        recommendedCrops: selectedCrops,
        soilAnalysis: soilAnalysisResult
      };
      const success = await signup(signupData);
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

  const handleSoilDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsAnalyzingSoil(true);
      
      try {
        // Convert file to base64 for AI analysis
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Data = e.target?.result as string;
          
          // Simulate AI analysis of soil test document
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          // Mock soil analysis results
          const mockSoilAnalysis = {
            ph: 6.8,
            nitrogen: 'Medium',
            phosphorus: 'High',
            potassium: 'Low',
            organicMatter: '2.5%',
            soilType: 'Loamy',
            recommendations: [
              'Apply potassium fertilizer before planting',
              'Maintain current pH level',
              'Consider organic matter addition'
            ]
          };
          
          // Generate crop recommendations based on soil analysis
          const cropRecommendations = await generateCropRecommendations(mockSoilAnalysis);
          
          setSoilAnalysisResult(mockSoilAnalysis);
          setRecommendedCrops(cropRecommendations);
          setFormData(prev => ({
            ...prev,
            soilTestDocument: file,
            soilTestResults: mockSoilAnalysis
          }));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Soil analysis failed:', error);
      } finally {
        setIsAnalyzingSoil(false);
      }
    }
  };
  
  const generateCropRecommendations = async (soilData: any) => {
    // AI-based crop recommendations based on soil analysis
    const recommendations = [
      {
        name: 'Paddy',
        variety: 'BPT 5204 (Sona Masuri)',
        suitability: 95,
        reason: 'Excellent match for your soil pH and nutrient levels',
        expectedYield: '45-50 quintals/acre',
        sowingDate: 'June 15 - July 15',
        benefits: ['High market demand', 'Suitable for your soil type', 'Good water retention']
      },
      {
        name: 'Tomato',
        variety: 'Arka Rakshak',
        suitability: 88,
        reason: 'Good phosphorus levels support fruit development',
        expectedYield: '400-500 quintals/acre',
        sowingDate: 'Year round (protected cultivation)',
        benefits: ['High profitability', 'Year-round cultivation', 'Value addition potential']
      },
      {
        name: 'Onion',
        variety: 'Pusa Red',
        suitability: 82,
        reason: 'Suitable for loamy soil with good drainage',
        expectedYield: '200-250 quintals/acre',
        sowingDate: 'October - November',
        benefits: ['Good storage life', 'Stable market', 'Low water requirement']
      }
    ];
    
    return recommendations.sort((a, b) => b.suitability - a.suitability);
  };
  
  const toggleCropSelection = (cropName: string) => {
    if (selectedCrops.includes(cropName)) {
      setSelectedCrops(prev => prev.filter(crop => crop !== cropName));
    } else {
      setSelectedCrops(prev => [...prev, cropName]);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '', password: '', firstName: '', lastName: '', mobile: '', email: '',
      farmName: '', farmerType: '', experience: '', education: '', farmSize: '',
      farmLocation: '', state: '', district: '', village: '', pincode: '',
      soilType: '', soilPH: '', soilMoisture: '', soilFertility: '', irrigationType: '', waterSource: '',
      primaryCrops: [], secondaryCrops: [], farmingMethod: '', season: '',
      annualIncome: '', landOwnership: '', hasInsurance: false, hasLoan: false, bankAccount: '',
      soilTestDocument: null, soilTestResults: null, recommendedCrops: []
    });
    setSoilAnalysisResult(null);
    setRecommendedCrops([]);
    setSelectedCrops([]);
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
    return (currentStep / 6) * 100;
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

      case 4:
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

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles size={24} className="text-purple-600" />
              <h3 className="text-xl font-bold text-cream">Soil Test Analysis (AI Powered)</h3>
            </div>
            
            {!soilAnalysisResult ? (
              <div className="space-y-4">
                <p className="text-cream text-sm mb-4">
                  Upload your soil test report and our AI will analyze it to recommend the best crops for your land.
                </p>
                
                {/* File Upload */}
                <div className="border-2 border-dashed border-cream rounded-2xl p-6 text-center">
                  {isAnalyzingSoil ? (
                    <div className="space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-cream border-t-transparent rounded-full mx-auto"
                      />
                      <p className="text-cream">AI is analyzing your soil test report...</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="text-cream mx-auto mb-2" />
                      <p className="text-cream mb-2">Upload Soil Test Report</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleSoilDocumentUpload}
                        className="hidden"
                        id="soil-upload"
                      />
                      <label
                        htmlFor="soil-upload"
                        className="inline-block px-4 py-2 bg-cream text-black rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        Choose File
                      </label>
                      <p className="text-cream text-xs mt-2">PDF, JPG, PNG up to 10MB</p>
                    </>
                  )}
                </div>
                
                <div className="bg-blue-100 p-4 rounded-2xl">
                  <h4 className="font-bold text-black mb-2">What our AI analyzes:</h4>
                  <ul className="text-black text-sm space-y-1">
                    <li>• Soil pH levels</li>
                    <li>• Nitrogen, Phosphorus, Potassium content</li>
                    <li>• Organic matter percentage</li>
                    <li>• Soil type and texture</li>
                    <li>• Nutrient deficiencies</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <h4 className="font-bold text-black">Soil Analysis Complete!</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-black">
                      <span className="font-semibold">pH Level:</span> {soilAnalysisResult.ph}
                    </div>
                    <div className="text-black">
                      <span className="font-semibold">Soil Type:</span> {soilAnalysisResult.soilType}
                    </div>
                    <div className="text-black">
                      <span className="font-semibold">Nitrogen:</span> {soilAnalysisResult.nitrogen}
                    </div>
                    <div className="text-black">
                      <span className="font-semibold">Phosphorus:</span> {soilAnalysisResult.phosphorus}
                    </div>
                    <div className="text-black">
                      <span className="font-semibold">Potassium:</span> {soilAnalysisResult.potassium}
                    </div>
                    <div className="text-black">
                      <span className="font-semibold">Organic Matter:</span> {soilAnalysisResult.organicMatter}
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-100 p-4 rounded-2xl">
                  <h4 className="font-bold text-black mb-2">AI Recommendations:</h4>
                  <ul className="text-black text-sm space-y-1">
                    {soilAnalysisResult.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        );
        
      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Wheat size={24} className="text-green-600" />
              <h3 className="text-xl font-bold text-cream">AI Crop Recommendations</h3>
            </div>
            
            {recommendedCrops.length > 0 ? (
              <div className="space-y-4">
                <p className="text-cream text-sm mb-4">
                  Based on your soil analysis, here are the best crops for your land. Select the ones you want to grow:
                </p>
                
                {recommendedCrops.map((crop, index) => (
                  <motion.div
                    key={crop.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedCrops.includes(crop.name)
                        ? 'border-green-500 bg-green-100'
                        : 'border-cream bg-cream'
                    }`}
                    onClick={() => toggleCropSelection(crop.name)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-bold text-black">{crop.name}</h4>
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                            {crop.suitability}% match
                          </span>
                        </div>
                        <p className="text-black text-sm mb-2">{crop.variety}</p>
                        <p className="text-black text-xs mb-2">{crop.reason}</p>
                      </div>
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        selectedCrops.includes(crop.name)
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-400'
                      }`}>
                        {selectedCrops.includes(crop.name) && (
                          <CheckCircle size={16} className="text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-black">
                      <div><span className="font-semibold">Expected Yield:</span> {crop.expectedYield}</div>
                      <div><span className="font-semibold">Sowing Date:</span> {crop.sowingDate}</div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-xs text-black font-semibold mb-1">Benefits:</p>
                      <div className="flex flex-wrap gap-1">
                        {crop.benefits.map((benefit, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <div className="bg-green-100 p-4 rounded-2xl">
                  <p className="text-black text-sm">
                    <span className="font-semibold">Selected crops ({selectedCrops.length}):</span> {selectedCrops.join(', ') || 'None selected'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Wheat size={48} className="text-cream mx-auto mb-4 opacity-50" />
                <p className="text-cream">Please complete soil analysis first to get crop recommendations</p>
              </div>
            )}
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
              
              {currentStep < 6 ? (
                <motion.button
                  type="button"
                  onClick={() => {
                    if (currentStep === 4) {
                      // Skip to soil analysis if no document uploaded
                      if (!soilAnalysisResult) {
                        setCurrentStep(5);
                      } else {
                        nextStep();
                      }
                    } else if (currentStep === 5) {
                      // Skip to crop recommendations if soil analysis complete
                      if (soilAnalysisResult) {
                        setCurrentStep(6);
                      }
                    } else {
                      nextStep();
                    }
                  }}
                  disabled={currentStep === 5 && isAnalyzingSoil}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 px-6 bg-green-600 text-white rounded-2xl font-semibold disabled:opacity-50"
                >
                  {currentStep === 5 && isAnalyzingSoil ? 'Analyzing...' : 'Next'}
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