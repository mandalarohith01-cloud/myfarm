import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Edit3, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Droplets, 
  Wheat, 
  TestTube, 
  Upload, 
  FileText, 
  Download, 
  Eye, 
  Trash2,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Camera,
  Save,
  X,
  LogOut,
  Settings
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface ProfileScreenProps {
  onBack: () => void;
}

interface SoilTest {
  id: string;
  testDate: string;
  testType: string;
  status: 'pending' | 'completed' | 'processing';
  results?: {
    ph: number;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    organicMatter: string;
    recommendations: string[];
  };
  labName: string;
  cost: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  category: 'land' | 'identity' | 'bank' | 'insurance' | 'other';
  status: 'verified' | 'pending' | 'rejected';
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'soil' | 'documents'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showSoilTestForm, setShowSoilTestForm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Sample farmer profile data (this would come from the database)
  const [farmerProfile, setFarmerProfile] = useState({
    // Basic Info
    firstName: user?.firstName || 'Demo',
    lastName: user?.lastName || 'User',
    mobile: user?.mobile || '9876543210',
    email: user?.email || 'demo.user@email.com',
    username: user?.username || 'demo',
    
    // Farm Details
    farmName: 'Green Valley Farm',
    farmerType: 'Medium Scale Farmer (2-10 acres)',
    experience: '15',
    education: 'Graduate',
    farmSize: '5.5',
    state: 'Telangana',
    district: 'Hyderabad',
    village: 'Shamshabad',
    pincode: '501218',
    
    // Soil Information
    soilType: 'Black Cotton Soil',
    soilPH: '7.2',
    soilMoisture: 'Medium',
    soilFertility: 'Medium',
    irrigationType: 'Drip Irrigation',
    waterSource: 'Borewell',
    farmingMethod: 'Mixed Farming',
    
    // Crop Information
    season: 'Kharif (Monsoon)',
    
    // Financial Information
    annualIncome: '₹3-5 Lakh',
    landOwnership: 'Owned Land',
    hasInsurance: true,
    hasLoan: false,
    bankAccount: 'SBI - ****1234',
    
    // Additional Registration Details
    registrationDate: user?.createdAt || new Date().toISOString(),
    profileCompleteness: 95
  });

  // Sample soil tests data
  const [soilTests, setSoilTests] = useState<SoilTest[]>([
    {
      id: '1',
      testDate: '2024-08-15',
      testType: 'Complete Soil Analysis',
      status: 'completed',
      results: {
        ph: 7.2,
        nitrogen: 'Medium',
        phosphorus: 'High',
        potassium: 'Low',
        organicMatter: '2.8%',
        recommendations: [
          'Apply potassium fertilizer before next planting',
          'Maintain current pH level',
          'Consider organic matter addition'
        ]
      },
      labName: 'AgriTest Labs',
      cost: 500
    },
    {
      id: '2',
      testDate: '2024-09-10',
      testType: 'NPK Test',
      status: 'processing',
      labName: 'Soil Care Laboratory',
      cost: 300
    }
  ]);

  // Sample documents data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Land Ownership Certificate',
      type: 'PDF',
      uploadDate: '2024-08-20',
      size: '2.4 MB',
      category: 'land',
      status: 'verified'
    },
    {
      id: '2',
      name: 'Aadhaar Card',
      type: 'PDF',
      uploadDate: '2024-08-20',
      size: '1.2 MB',
      category: 'identity',
      status: 'verified'
    },
    {
      id: '3',
      name: 'Bank Passbook',
      type: 'PDF',
      uploadDate: '2024-08-21',
      size: '3.1 MB',
      category: 'bank',
      status: 'pending'
    },
    {
      id: '4',
      name: 'Crop Insurance Policy',
      type: 'PDF',
      uploadDate: '2024-09-01',
      size: '1.8 MB',
      category: 'insurance',
      status: 'verified'
    }
  ]);

  const tabs = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'soil', label: t('soilTests'), icon: TestTube },
    { id: 'documents', label: t('documents'), icon: FileText }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'processing':
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'verified':
        return CheckCircle;
      case 'processing':
      case 'pending':
        return Clock;
      case 'rejected':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const handleSoilTestSubmit = (testData: any) => {
    const newTest: SoilTest = {
      id: Date.now().toString(),
      testDate: new Date().toISOString().split('T')[0],
      testType: testData.testType,
      status: 'pending',
      labName: testData.labName,
      cost: testData.cost
    };
    setSoilTests([newTest, ...soilTests]);
    setShowSoilTestForm(false);
  };

  const handleDocumentUpload = (file: File, category: string) => {
    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.split('/')[1].toUpperCase(),
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      category: category as any,
      status: 'pending'
    };
    setDocuments([newDocument, ...documents]);
    setShowDocumentUpload(false);
  };

  const handleLogout = () => {
    logout();
    onBack(); // This will redirect to auth screen
  };

  const renderProfileTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className="bg-cream rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">
                {farmerProfile.firstName} {farmerProfile.lastName}
              </h2>
              <p className="text-gray-600">{farmerProfile.farmName}</p>
              <p className="text-sm text-gray-500">{farmerProfile.farmerType}</p>
              <p className="text-xs text-gray-400">@{farmerProfile.username}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="p-3 bg-blue-600 text-white rounded-full"
            >
              {isEditing ? <Save size={20} /> : <Edit3 size={20} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogoutConfirm(true)}
              className="p-3 bg-red-600 text-white rounded-full"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Profile Completeness</span>
            <span>{farmerProfile.profileCompleteness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${farmerProfile.profileCompleteness}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-green-500 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-100 rounded-xl">
            <Calendar size={24} className="text-blue-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Experience</p>
            <p className="font-bold text-black">{farmerProfile.experience} years</p>
          </div>
          <div className="text-center p-3 bg-green-100 rounded-xl">
            <MapPin size={24} className="text-green-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Farm Size</p>
            <p className="font-bold text-black">{farmerProfile.farmSize} acres</p>
          </div>
          <div className="text-center p-3 bg-purple-100 rounded-xl">
            <Wheat size={24} className="text-purple-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Farm Type</p>
            <p className="font-bold text-black text-xs">{farmerProfile.farmerType.split(' ')[0]}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-cream rounded-3xl p-6">
        <h3 className="text-xl font-bold text-black mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <User size={20} className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-semibold text-black">{farmerProfile.username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone size={20} className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Mobile</p>
              <p className="font-semibold text-black">{farmerProfile.mobile}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail size={20} className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-black">{farmerProfile.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin size={20} className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold text-black">{farmerProfile.village}, {farmerProfile.district}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar size={20} className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-semibold text-black">{new Date(farmerProfile.registrationDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <User size={20} className="text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Land Ownership</p>
              <p className="font-semibold text-black">{farmerProfile.landOwnership}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Farm Details */}
      <div className="bg-cream rounded-3xl p-6">
        <h3 className="text-xl font-bold text-black mb-4">Farm Details</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Farm Name</p>
              <p className="font-semibold text-black">{farmerProfile.farmName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Farmer Type</p>
              <p className="font-semibold text-black">{farmerProfile.farmerType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Education</p>
              <p className="font-semibold text-black">{farmerProfile.education}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">State</p>
              <p className="font-semibold text-black">{farmerProfile.state}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">District</p>
              <p className="font-semibold text-black">{farmerProfile.district}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Village</p>
              <p className="font-semibold text-black">{farmerProfile.village}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Pincode</p>
              <p className="font-semibold text-black">{farmerProfile.pincode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Soil Type</p>
              <p className="font-semibold text-black">{farmerProfile.soilType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Soil pH</p>
              <p className="font-semibold text-black">{farmerProfile.soilPH}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Soil Moisture</p>
              <p className="font-semibold text-black">{farmerProfile.soilMoisture}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Soil Fertility</p>
              <p className="font-semibold text-black">{farmerProfile.soilFertility}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Irrigation</p>
              <p className="font-semibold text-black">{farmerProfile.irrigationType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Water Source</p>
              <p className="font-semibold text-black">{farmerProfile.waterSource}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Farming Method</p>
              <p className="font-semibold text-black">{farmerProfile.farmingMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Growing Season</p>
              <p className="font-semibold text-black">{farmerProfile.season}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-cream rounded-3xl p-6">
        <h3 className="text-xl font-bold text-black mb-4">Financial Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Annual Income</p>
            <p className="font-semibold text-black">{farmerProfile.annualIncome}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Bank Account</p>
            <p className="font-semibold text-black">{farmerProfile.bankAccount}</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={16} className={farmerProfile.hasInsurance ? 'text-green-600' : 'text-gray-400'} />
            <span className="text-black">Crop Insurance</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={16} className={farmerProfile.hasLoan ? 'text-green-600' : 'text-gray-400'} />
            <span className="text-black">Active Loans</span>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut size={32} className="text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Confirm Logout</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-3 px-6 bg-gray-200 text-black rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-3 px-6 bg-red-600 text-white rounded-xl font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderSoilTestTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Soil Test Header */}
      <div className="bg-cream rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <TestTube size={32} className="text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-black">Soil Test Reports</h2>
              <p className="text-gray-600">Monitor your soil health and get recommendations</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSoilTestForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>New Test</span>
          </motion.button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-100 rounded-xl">
            <CheckCircle size={24} className="text-green-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Completed</p>
            <p className="font-bold text-black">{soilTests.filter(t => t.status === 'completed').length}</p>
          </div>
          <div className="text-center p-3 bg-orange-100 rounded-xl">
            <Clock size={24} className="text-orange-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Processing</p>
            <p className="font-bold text-black">{soilTests.filter(t => t.status === 'processing').length}</p>
          </div>
          <div className="text-center p-3 bg-blue-100 rounded-xl">
            <TestTube size={24} className="text-blue-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Total Tests</p>
            <p className="font-bold text-black">{soilTests.length}</p>
          </div>
        </div>
      </div>

      {/* Soil Tests List */}
      <div className="space-y-4">
        {soilTests.map((test, index) => {
          const StatusIcon = getStatusIcon(test.status);
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-cream rounded-3xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <TestTube size={24} className="text-blue-600" />
                    <h3 className="text-lg font-bold text-black">{test.testType}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(test.status)}`}>
                      <StatusIcon size={12} />
                      <span className="capitalize">{test.status}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold">Test Date:</span> {test.testDate}
                    </div>
                    <div>
                      <span className="font-semibold">Lab:</span> {test.labName}
                    </div>
                    <div>
                      <span className="font-semibold">Cost:</span> ₹{test.cost}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {test.status === 'completed' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-green-100 text-green-600 rounded-full"
                    >
                      <Download size={16} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-blue-100 text-blue-600 rounded-full"
                  >
                    <Eye size={16} />
                  </motion.button>
                </div>
              </div>

              {/* Test Results */}
              {test.results && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-black mb-3">Test Results</h4>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-xl">
                      <p className="text-sm text-gray-600">pH Level</p>
                      <p className="font-bold text-blue-600">{test.results.ph}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl">
                      <p className="text-sm text-gray-600">Nitrogen</p>
                      <p className="font-bold text-green-600">{test.results.nitrogen}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl">
                      <p className="text-sm text-gray-600">Phosphorus</p>
                      <p className="font-bold text-purple-600">{test.results.phosphorus}</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-xl">
                      <p className="text-sm text-gray-600">Potassium</p>
                      <p className="font-bold text-orange-600">{test.results.potassium}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Organic Matter</p>
                      <p className="font-bold text-gray-600">{test.results.organicMatter}</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-xl">
                    <h5 className="font-semibold text-black mb-2">Recommendations</h5>
                    <ul className="space-y-1">
                      {test.results.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                          <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* New Soil Test Form Modal */}
      <AnimatePresence>
        {showSoilTestForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black">Book Soil Test</h3>
                <button
                  onClick={() => setShowSoilTestForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Test Type</label>
                  <select className="w-full px-4 py-3 bg-gray-100 text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Complete Soil Analysis</option>
                    <option>NPK Test</option>
                    <option>pH Test</option>
                    <option>Micronutrient Test</option>
                    <option>Organic Matter Test</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Laboratory</label>
                  <select className="w-full px-4 py-3 bg-gray-100 text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>AgriTest Labs - ₹500</option>
                    <option>Soil Care Laboratory - ₹300</option>
                    <option>Farm Health Center - ₹450</option>
                    <option>Green Soil Testing - ₹350</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Sample Collection</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="collection" className="text-blue-600" />
                      <span className="text-black">Home Collection (₹50 extra)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="collection" className="text-blue-600" defaultChecked />
                      <span className="text-black">Drop at Lab</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowSoilTestForm(false)}
                    className="flex-1 py-3 px-6 bg-gray-200 text-black rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSoilTestSubmit({ testType: 'Complete Soil Analysis', labName: 'AgriTest Labs', cost: 500 })}
                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold"
                  >
                    Book Test
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderDocumentsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Documents Header */}
      <div className="bg-cream rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText size={32} className="text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-black">Document Manager</h2>
              <p className="text-gray-600">Upload and manage your farming documents</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDocumentUpload(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center space-x-2"
          >
            <Upload size={20} />
            <span>Upload</span>
          </motion.button>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-100 rounded-xl">
            <CheckCircle size={24} className="text-green-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Verified</p>
            <p className="font-bold text-black">{documents.filter(d => d.status === 'verified').length}</p>
          </div>
          <div className="text-center p-3 bg-orange-100 rounded-xl">
            <Clock size={24} className="text-orange-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Pending</p>
            <p className="font-bold text-black">{documents.filter(d => d.status === 'pending').length}</p>
          </div>
          <div className="text-center p-3 bg-red-100 rounded-xl">
            <AlertCircle size={24} className="text-red-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="font-bold text-black">{documents.filter(d => d.status === 'rejected').length}</p>
          </div>
          <div className="text-center p-3 bg-blue-100 rounded-xl">
            <FileText size={24} className="text-blue-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Total</p>
            <p className="font-bold text-black">{documents.length}</p>
          </div>
        </div>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['land', 'identity', 'bank', 'insurance'].map((category) => {
          const categoryDocs = documents.filter(doc => doc.category === category);
          const categoryNames = {
            land: 'Land Documents',
            identity: 'Identity Proof',
            bank: 'Bank Documents',
            insurance: 'Insurance Papers'
          };
          
          return (
            <div key={category} className="bg-cream rounded-3xl p-6">
              <h3 className="text-lg font-bold text-black mb-4">{categoryNames[category as keyof typeof categoryNames]}</h3>
              <div className="space-y-3">
                {categoryDocs.length > 0 ? (
                  categoryDocs.map((doc, index) => {
                    const StatusIcon = getStatusIcon(doc.status);
                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-white rounded-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <FileText size={20} className="text-gray-600" />
                          <div>
                            <p className="font-semibold text-black text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.size} • {doc.uploadDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(doc.status)}`}>
                            <StatusIcon size={10} />
                            <span className="capitalize">{doc.status}</span>
                          </span>
                          <div className="flex space-x-1">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Eye size={14} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Download size={14} className="text-gray-600" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents uploaded</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Document Upload Modal */}
      <AnimatePresence>
        {showDocumentUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black">Upload Document</h3>
                <button
                  onClick={() => setShowDocumentUpload(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Document Category</label>
                  <select className="w-full px-4 py-3 bg-gray-100 text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="land">Land Documents</option>
                    <option value="identity">Identity Proof</option>
                    <option value="bank">Bank Documents</option>
                    <option value="insurance">Insurance Papers</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Upload File</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-2">Drag and drop or click to upload</p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(file, 'land');
                        }
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700"
                    >
                      Choose File
                    </label>
                    <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowDocumentUpload(false)}
                    className="flex-1 py-3 px-6 bg-gray-200 text-black rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-xl font-semibold">
                    Upload
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

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
        <h1 className="text-2xl font-bold">Farmer Profile</h1>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex space-x-2 mb-6"
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-cream text-black'
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <div className="mb-20">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'soil' && renderSoilTestTab()}
        {activeTab === 'documents' && renderDocumentsTab()}
      </div>
    </motion.div>
  );
};

export default ProfileScreen;