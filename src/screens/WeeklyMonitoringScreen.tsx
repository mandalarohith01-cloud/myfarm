import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Plus,
  X,
  Mic,
  Download,
  Share2,
  BarChart3,
  Leaf,
  Droplets,
  Bug,
  Sun,
  Activity
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AIService from '../services/AIService';

interface WeeklyMonitoringScreenProps {
  onBack: () => void;
}

interface MonitoringEntry {
  id: string;
  date: string;
  week: number;
  cropId: string;
  cropName: string;
  photos: {
    id: string;
    url: string;
    type: 'overview' | 'leaves' | 'stem' | 'roots' | 'fruits';
    analysis?: {
      healthScore: number;
      issues: string[];
      recommendations: string[];
      growthStage: string;
      diseaseDetected: boolean;
      pestActivity: boolean;
    };
  }[];
  manualNotes: string;
  weatherConditions: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
  measurements: {
    height: number;
    leafCount: number;
    flowerCount?: number;
    fruitCount?: number;
  };
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  aiSummary: string;
  recommendations: string[];
  nextActions: string[];
}

const WeeklyMonitoringScreen: React.FC<WeeklyMonitoringScreenProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [monitoringEntries, setMonitoringEntries] = useState<MonitoringEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<MonitoringEntry | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<any[]>([]);
  const [manualNotes, setManualNotes] = useState('');
  const [measurements, setMeasurements] = useState({
    height: '',
    leafCount: '',
    flowerCount: '',
    fruitCount: ''
  });

  // Load monitoring data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('weekly_monitoring');
    if (savedEntries) {
      try {
        setMonitoringEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Error loading monitoring data:', error);
      }
    }
  }, []);

  // Save monitoring data to localStorage
  const saveMonitoringData = (entries: MonitoringEntry[]) => {
    localStorage.setItem('weekly_monitoring', JSON.stringify(entries));
    setMonitoringEntries(entries);
  };

  // Get user's crops from localStorage
  const getUserCrops = () => {
    const savedCrops = localStorage.getItem('user_crops');
    if (savedCrops) {
      try {
        return JSON.parse(savedCrops);
      } catch (error) {
        return [];
      }
    }
    return [];
  };

  const userCrops = getUserCrops();

  // Calculate current week based on crop sowing date
  const calculateCurrentWeek = (cropId: string) => {
    const crop = userCrops.find((c: any) => c.id === parseInt(cropId));
    if (crop && crop.sowingDate) {
      const sowingDate = new Date(crop.sowingDate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - sowingDate.getTime());
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      return diffWeeks;
    }
    return 1;
  };

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now().toString() + Math.random(),
            url: e.target?.result as string,
            type: type,
            file: file
          };
          setUploadedPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Analyze photos with AI
  const analyzePhotos = async (photos: any[]) => {
    const analyzedPhotos = [];
    
    for (const photo of photos) {
      try {
        setIsAnalyzing(true);
        const base64Data = photo.url.split(',')[1];
        const analysis = await AIService.analyzePlantImage(base64Data, language);
        
        analyzedPhotos.push({
          ...photo,
          analysis: {
            healthScore: analysis.confidence,
            issues: analysis.recommendations || [],
            recommendations: analysis.nextSteps || [],
            growthStage: 'vegetative', // This would be determined by AI
            diseaseDetected: analysis.severity !== 'low',
            pestActivity: analysis.treatment?.toLowerCase().includes('pest') || false
          }
        });
      } catch (error) {
        console.error('Photo analysis error:', error);
        analyzedPhotos.push({
          ...photo,
          analysis: {
            healthScore: 75,
            issues: ['Unable to analyze - please retake photo'],
            recommendations: ['Ensure good lighting and clear focus'],
            growthStage: 'unknown',
            diseaseDetected: false,
            pestActivity: false
          }
        });
      }
    }
    
    setIsAnalyzing(false);
    return analyzedPhotos;
  };

  // Generate AI summary
  const generateAISummary = (photos: any[], notes: string, measurements: any) => {
    const avgHealthScore = photos.reduce((sum, photo) => sum + (photo.analysis?.healthScore || 0), 0) / photos.length;
    const hasIssues = photos.some(photo => photo.analysis?.diseaseDetected || photo.analysis?.pestActivity);
    
    let summary = '';
    if (avgHealthScore >= 90) {
      summary = 'Excellent crop health observed. Plants showing optimal growth patterns.';
    } else if (avgHealthScore >= 75) {
      summary = 'Good crop health with minor areas for improvement.';
    } else if (avgHealthScore >= 60) {
      summary = 'Fair crop health. Some issues detected that require attention.';
    } else {
      summary = 'Poor crop health. Immediate intervention required.';
    }

    if (hasIssues) {
      summary += ' Disease or pest activity detected in some areas.';
    }

    return summary;
  };

  // Submit monitoring entry
  const handleSubmitEntry = async () => {
    if (!selectedCrop || uploadedPhotos.length === 0) {
      alert('Please select a crop and upload at least one photo');
      return;
    }

    const analyzedPhotos = await analyzePhotos(uploadedPhotos);
    const week = calculateCurrentWeek(selectedCrop);
    const crop = userCrops.find((c: any) => c.id === parseInt(selectedCrop));
    
    const newEntry: MonitoringEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      week: week,
      cropId: selectedCrop,
      cropName: crop?.name || 'Unknown Crop',
      photos: analyzedPhotos,
      manualNotes: manualNotes,
      weatherConditions: {
        temperature: 28, // This would come from weather API
        humidity: 65,
        rainfall: 0
      },
      measurements: {
        height: parseFloat(measurements.height) || 0,
        leafCount: parseInt(measurements.leafCount) || 0,
        flowerCount: parseInt(measurements.flowerCount) || 0,
        fruitCount: parseInt(measurements.fruitCount) || 0
      },
      overallHealth: analyzedPhotos.reduce((sum, photo) => sum + (photo.analysis?.healthScore || 0), 0) / analyzedPhotos.length >= 80 ? 'good' : 'fair',
      aiSummary: generateAISummary(analyzedPhotos, manualNotes, measurements),
      recommendations: analyzedPhotos.flatMap(photo => photo.analysis?.recommendations || []),
      nextActions: ['Continue monitoring', 'Follow recommended treatments', 'Schedule next week monitoring']
    };

    const updatedEntries = [newEntry, ...monitoringEntries];
    saveMonitoringData(updatedEntries);
    
    // Reset form
    setShowAddEntry(false);
    setUploadedPhotos([]);
    setManualNotes('');
    setMeasurements({ height: '', leafCount: '', flowerCount: '', fruitCount: '' });
    setSelectedCrop('');
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-green-500 bg-green-50';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent':
      case 'good':
        return CheckCircle;
      case 'fair':
        return Activity;
      case 'poor':
      case 'critical':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  if (selectedEntry) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="min-h-screen bg-black p-6"
      >
        {/* Header */}
        <div className="flex items-center mb-8 pt-8">
          <button
            onClick={() => setSelectedEntry(null)}
            className="mr-4 p-2 rounded-full bg-cream text-black"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Week {selectedEntry.week} - {selectedEntry.cropName}</h1>
        </div>

        {/* Entry Details */}
        <div className="space-y-6 mb-20">
          {/* Summary Card */}
          <div className="bg-cream rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">Health Summary</h2>
              <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getHealthColor(selectedEntry.overallHealth)}`}>
                {React.createElement(getHealthIcon(selectedEntry.overallHealth), { size: 20 })}
                <span className="font-semibold capitalize">{selectedEntry.overallHealth}</span>
              </div>
            </div>
            <p className="text-black mb-4">{selectedEntry.aiSummary}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-black">Date:</span>
                <p className="text-gray-700">{selectedEntry.date}</p>
              </div>
              <div>
                <span className="font-semibold text-black">Week:</span>
                <p className="text-gray-700">{selectedEntry.week}</p>
              </div>
            </div>
          </div>

          {/* Photos Grid */}
          <div className="bg-cream rounded-3xl p-6">
            <h3 className="text-lg font-bold text-black mb-4">Photos & Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedEntry.photos.map((photo, index) => (
                <div key={photo.id} className="bg-white rounded-2xl p-4">
                  <img
                    src={photo.url}
                    alt={`Crop photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-black capitalize">{photo.type}</span>
                      <span className="text-sm text-green-600 font-semibold">
                        {photo.analysis?.healthScore}% Health
                      </span>
                    </div>
                    {photo.analysis?.issues && photo.analysis.issues.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-black">Issues:</p>
                        <ul className="text-xs text-gray-700">
                          {photo.analysis.issues.slice(0, 2).map((issue, idx) => (
                            <li key={idx}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Measurements */}
          <div className="bg-cream rounded-3xl p-6">
            <h3 className="text-lg font-bold text-black mb-4">Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-center">
                <Leaf size={24} className="text-blue-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Height</p>
                <p className="font-bold text-black">{selectedEntry.measurements.height} cm</p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl text-center">
                <Activity size={24} className="text-green-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Leaves</p>
                <p className="font-bold text-black">{selectedEntry.measurements.leafCount}</p>
              </div>
              {selectedEntry.measurements.flowerCount > 0 && (
                <div className="bg-yellow-50 p-3 rounded-xl text-center">
                  <Sun size={24} className="text-yellow-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Flowers</p>
                  <p className="font-bold text-black">{selectedEntry.measurements.flowerCount}</p>
                </div>
              )}
              {selectedEntry.measurements.fruitCount > 0 && (
                <div className="bg-orange-50 p-3 rounded-xl text-center">
                  <Droplets size={24} className="text-orange-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Fruits</p>
                  <p className="font-bold text-black">{selectedEntry.measurements.fruitCount}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-cream rounded-3xl p-6">
            <h3 className="text-lg font-bold text-black mb-4">AI Recommendations</h3>
            <div className="space-y-3">
              {selectedEntry.recommendations.slice(0, 5).map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                  <CheckCircle size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-black text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Notes */}
          {selectedEntry.manualNotes && (
            <div className="bg-cream rounded-3xl p-6">
              <h3 className="text-lg font-bold text-black mb-4">Notes</h3>
              <p className="text-black">{selectedEntry.manualNotes}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  if (showAddEntry) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="min-h-screen bg-black p-6"
      >
        {/* Header */}
        <div className="flex items-center mb-8 pt-8">
          <button
            onClick={() => setShowAddEntry(false)}
            className="mr-4 p-2 rounded-full bg-cream text-black"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Add Weekly Monitoring</h1>
        </div>

        <div className="space-y-6 mb-20">
          {/* Crop Selection */}
          <div className="bg-cream rounded-3xl p-6">
            <h3 className="text-lg font-bold text-black mb-4">Select Crop</h3>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Choose a crop to monitor</option>
              {userCrops.map((crop: any) => (
                <option key={crop.id} value={crop.id.toString()}>
                  {crop.name} - Week {calculateCurrentWeek(crop.id.toString())}
                </option>
              ))}
            </select>
          </div>

          {/* Photo Upload */}
          <div className="bg-cream rounded-3xl p-6">
            <h3 className="text-lg font-bold text-black mb-4">Upload Photos</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {['overview', 'leaves', 'stem', 'fruits'].map((type) => (
                <div key={type} className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handlePhotoUpload(e, type)}
                    className="hidden"
                    id={`upload-${type}`}
                  />
                  <label
                    htmlFor={`upload-${type}`}
                    className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-green-500 transition-colors"
                  >
                    <Camera size={24} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-black font-semibold capitalize">{type}</p>
                    <p className="text-xs text-gray-600">Tap to upload</p>
                  </label>
                </div>
              ))}
            </div>

            {/* Uploaded Photos Preview */}
            {uploadedPhotos.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {uploadedPhotos.map((photo, index) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => setUploadedPhotos(prev => prev.filter(p => p.id !== photo.id))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                    >
                      <X size={16} />
                    </button>
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded capitalize">
                      {photo.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Measurements */}
          <div className="bg-cream rounded-3xl p-6">
            <h3 className="text-lg font-bold text-black mb-4">Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={measurements.height}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Leaf Count</label>
                <input
                  type="number"
                  value={measurements.leafCount}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, leafCount: e.target.value }))}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Flowers (optional)</label>
                <input
                  type="number"
                  value={measurements.flowerCount}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, flowerCount: e.target.value }))}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Fruits (optional)</label>
                <input
                  type="number"
                  value={measurements.fruitCount}
                  onChange={(e) => setMeasurements(prev => ({ ...prev, fruitCount: e.target.value }))}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Manual Notes */}
          <div className="bg-cream rounded-3xl p-6">
            <h3 className="text-lg font-bold text-black mb-4">Notes & Observations</h3>
            <textarea
              value={manualNotes}
              onChange={(e) => setManualNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Add any observations, concerns, or notes about your crop..."
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitEntry}
            disabled={isAnalyzing || !selectedCrop || uploadedPhotos.length === 0}
            className="w-full py-4 bg-green-600 text-white rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Analyzing Photos...</span>
              </>
            ) : (
              <>
                <CheckCircle size={24} />
                <span>Submit Monitoring Entry</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-black p-6"
    >
      {/* Header */}
      <div className="flex items-center mb-8 pt-8">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full bg-cream text-black"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Weekly Monitoring</h1>
      </div>

      {/* Stats Overview */}
      <div className="bg-cream rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold text-black mb-4">Monitoring Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-100 rounded-xl">
            <BarChart3 size={24} className="text-green-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Total Entries</p>
            <p className="font-bold text-black">{monitoringEntries.length}</p>
          </div>
          <div className="text-center p-3 bg-blue-100 rounded-xl">
            <Calendar size={24} className="text-blue-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">This Week</p>
            <p className="font-bold text-black">
              {monitoringEntries.filter(entry => {
                const entryDate = new Date(entry.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return entryDate >= weekAgo;
              }).length}
            </p>
          </div>
          <div className="text-center p-3 bg-yellow-100 rounded-xl">
            <Activity size={24} className="text-yellow-600 mx-auto mb-1" />
            <p className="text-sm text-gray-600">Avg Health</p>
            <p className="font-bold text-black">
              {monitoringEntries.length > 0 
                ? Math.round(monitoringEntries.reduce((sum, entry) => {
                    const healthScore = entry.photos.reduce((photoSum, photo) => 
                      photoSum + (photo.analysis?.healthScore || 0), 0) / entry.photos.length;
                    return sum + healthScore;
                  }, 0) / monitoringEntries.length)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Add Entry Button */}
      <button
        onClick={() => setShowAddEntry(true)}
        className="w-full mb-6 py-4 bg-green-600 text-white rounded-2xl font-semibold text-lg flex items-center justify-center space-x-2"
      >
        <Plus size={24} />
        <span>Add Weekly Entry</span>
      </button>

      {/* Monitoring Entries */}
      <div className="space-y-4 mb-20">
        {monitoringEntries.length === 0 ? (
          <div className="bg-cream rounded-3xl p-8 text-center">
            <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-black mb-2">No Monitoring Entries</h3>
            <p className="text-gray-600 mb-4">Start tracking your crop health with weekly photo monitoring</p>
            <button
              onClick={() => setShowAddEntry(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold"
            >
              Add First Entry
            </button>
          </div>
        ) : (
          monitoringEntries.map((entry, index) => {
            const HealthIcon = getHealthIcon(entry.overallHealth);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedEntry(entry)}
                className="bg-cream rounded-3xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-black">{entry.cropName}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                        Week {entry.week}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{entry.date}</p>
                    <p className="text-black text-sm">{entry.aiSummary}</p>
                  </div>
                  <div className={`ml-4 p-3 rounded-full flex items-center space-x-2 ${getHealthColor(entry.overallHealth)}`}>
                    <HealthIcon size={20} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>{entry.photos.length} photos</span>
                    <span>
                      {Math.round(entry.photos.reduce((sum, photo) => sum + (photo.analysis?.healthScore || 0), 0) / entry.photos.length)}% health
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Eye size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">View Details</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default WeeklyMonitoringScreen;