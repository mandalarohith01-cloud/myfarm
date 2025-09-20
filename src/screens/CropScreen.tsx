import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Check, User, ChevronDown, Calendar, MapPin, Sparkles, Trash2, Edit3, BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCrops, Crop, TodoItem } from '../contexts/CropContext';
import AIService from '../services/AIService';

interface CropScreenProps {
  onBack: () => void;
}

const CropScreen: React.FC<CropScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const { crops, addCrop, toggleTodo, deleteCrop, updateCrop, isLoading } = useCrops();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isGeneratingTodos, setIsGeneratingTodos] = useState(false);
  const [editingCrop, setEditingCrop] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    season: '',
    sowingDate: '',
    area: '',
    location: '',
    soilType: '',
    irrigationType: '',
    expectedHarvest: '',
    notes: ''
  });

  const cropOptions = [
    { value: 'paddy', label: t('paddy') },
    { value: 'wheat', label: t('wheat') },
    { value: 'corn', label: t('corn') },
    { value: 'tomato', label: t('tomato') },
    { value: 'onion', label: t('onion') },
    { value: 'potato', label: t('potato') },
  ];

  const varietyOptions = {
    paddy: ['BPT 5204 (Sona Masuri)', 'IR 64', 'Swarna', 'MTU 1010'],
    wheat: ['HD 2967', 'PBW 343', 'DBW 17', 'HD 3086'],
    corn: ['Pioneer 30V92', 'NK 6240', 'DKC 9108', 'P 3396'],
    tomato: ['Arka Rakshak', 'Pusa Ruby', 'Himsona', 'Arka Vikas'],
    onion: ['Pusa Red', 'Agrifound Light Red', 'Bhima Super', 'Pusa Madhavi'],
    potato: ['Kufri Jyoti', 'Kufri Pukhraj', 'Kufri Badshah', 'Kufri Chipsona'],
  };

  const seasonOptions = [
    { value: 'kharif', label: 'Kharif (Monsoon)' },
    { value: 'rabi', label: 'Rabi (Winter)' },
    { value: 'zaid', label: 'Zaid (Summer)' },
    { value: 'perennial', label: 'Perennial' },
  ];

  const soilTypeOptions = [
    'Alluvial Soil',
    'Black Cotton Soil', 
    'Red Soil',
    'Laterite Soil',
    'Sandy Soil',
    'Clay Soil',
    'Loamy Soil'
  ];

  const irrigationOptions = [
    'Drip Irrigation',
    'Sprinkler Irrigation',
    'Flood Irrigation', 
    'Furrow Irrigation',
    'Rain-fed'
  ];

  const generateAITodos = (cropName: string, variety: string, season: string) => {
    // Enhanced AI-based todo generation
    const aiTodoTemplates = {
      paddy: [
        { text: 'AI Recommendation: Prepare seedbed with proper leveling', priority: 'high' as const, dueDate: 'Day 1-3' },
        { text: 'AI Recommendation: Soak seeds in salt water (remove floating seeds)', priority: 'high' as const, dueDate: 'Day 1' },
        { text: 'AI Recommendation: Apply basal fertilizer (NPK 120:60:40 kg/ha)', priority: 'high' as const, dueDate: 'Before transplanting' },
        { text: 'AI Recommendation: Transplant 21-day old seedlings', priority: 'high' as const, dueDate: 'Day 20-25' },
        { text: 'AI Recommendation: Maintain 2-3 cm water level', priority: 'high' as const, dueDate: 'Daily monitoring' },
        { text: 'AI Recommendation: First nitrogen top dressing (25% of total N)', priority: 'medium' as const, dueDate: 'Day 30' },
        { text: 'AI Recommendation: Weed management (manual/herbicide)', priority: 'medium' as const, dueDate: 'Day 15-20' },
        { text: 'AI Recommendation: Monitor for stem borer and leaf folder', priority: 'medium' as const, dueDate: 'Weekly inspection' },
        { text: 'AI Recommendation: Second nitrogen application at panicle initiation', priority: 'medium' as const, dueDate: 'Day 45-50' },
        { text: 'AI Recommendation: Drain field 10 days before harvest', priority: 'low' as const, dueDate: 'Day 110-120' },
      ],
      wheat: [
        { text: 'AI Recommendation: Deep plowing and field preparation', priority: 'high' as const, dueDate: 'Day 1-5' },
        { text: 'AI Recommendation: Seed treatment with fungicide', priority: 'high' as const, dueDate: 'Before sowing' },
        { text: 'AI Recommendation: Sow at 2-3 cm depth with proper spacing', priority: 'high' as const, dueDate: 'Day 1' },
        { text: 'AI Recommendation: Apply basal fertilizer (NPK 120:60:40)', priority: 'high' as const, dueDate: 'At sowing' },
        { text: 'AI Recommendation: First irrigation at crown root initiation', priority: 'high' as const, dueDate: 'Day 20-25' },
        { text: 'AI Recommendation: First nitrogen top dressing', priority: 'medium' as const, dueDate: 'Day 30' },
        { text: 'AI Recommendation: Monitor for aphids and rust diseases', priority: 'medium' as const, dueDate: 'Weekly' },
        { text: 'AI Recommendation: Irrigation at tillering stage', priority: 'medium' as const, dueDate: 'Day 40-45' },
        { text: 'AI Recommendation: Critical irrigation at flowering', priority: 'high' as const, dueDate: 'Day 60-65' },
      ],
      tomato: [
        { text: 'AI Recommendation: Prepare raised nursery beds', priority: 'high' as const, dueDate: 'Day 1-5' },
        { text: 'AI Recommendation: Seed treatment and sowing in nursery', priority: 'high' as const, dueDate: 'Day 1' },
        { text: 'AI Recommendation: Transplant healthy seedlings', priority: 'high' as const, dueDate: 'Day 25-30' },
        { text: 'AI Recommendation: Install bamboo/wooden stakes for support', priority: 'high' as const, dueDate: 'At transplanting' },
        { text: 'AI Recommendation: Apply organic manure (10 tons/ha)', priority: 'medium' as const, dueDate: 'Before transplanting' },
        { text: 'AI Recommendation: Install drip irrigation system', priority: 'high' as const, dueDate: 'Week 1' },
        { text: 'AI Recommendation: Pruning and training of plants', priority: 'medium' as const, dueDate: 'Weekly' },
        { text: 'AI Recommendation: Monitor for early blight and whitefly', priority: 'medium' as const, dueDate: 'Bi-weekly' },
        { text: 'AI Recommendation: Harvest at proper maturity stage', priority: 'low' as const, dueDate: 'Day 70-90' },
      ],
    };

    const baseTodos = aiTodoTemplates[cropName as keyof typeof aiTodoTemplates] || [
      { text: 'AI Recommendation: Prepare field with proper tillage', priority: 'high' as const, dueDate: 'Day 1' },
      { text: 'AI Recommendation: Select quality seeds/seedlings', priority: 'high' as const, dueDate: 'Day 1' },
      { text: 'AI Recommendation: Apply balanced fertilizer', priority: 'medium' as const, dueDate: 'As per soil test' },
      { text: 'AI Recommendation: Implement efficient irrigation', priority: 'high' as const, dueDate: 'Regular monitoring' },
      { text: 'AI Recommendation: Integrated pest management', priority: 'medium' as const, dueDate: 'Weekly inspection' },
      { text: 'AI Recommendation: Timely weed management', priority: 'medium' as const, dueDate: 'As needed' },
    ];

    return baseTodos.map((todo, index) => ({
      id: Date.now() + index,
      text: todo.text,
      completed: false,
      priority: todo.priority,
      dueDate: todo.dueDate,
    }));
  };

  const handleAddCrop = async () => {
    if (!formData.cropName || !formData.variety || !formData.season || !formData.sowingDate || !formData.area) {
      alert('Please fill in all required fields: Crop Name, Variety, Season, Sowing Date, and Area');
      return;
    }

    setIsGeneratingTodos(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiTodos = generateAITodos(formData.cropName, formData.variety, formData.season);
    
    const newCropData = {
      name: formData.cropName,
      variety: formData.variety,
      season: formData.season,
      sowingDate: formData.sowingDate,
      area: formData.area,
      location: formData.location,
      soilType: formData.soilType,
      irrigationType: formData.irrigationType,
      expectedHarvest: formData.expectedHarvest,
      notes: formData.notes,
      todos: aiTodos,
    };

    addCrop(newCropData);
    
    // Show success message
    alert(`${formData.cropName} crop added successfully with AI recommendations!`);
    
    setFormData({ 
      cropName: '', variety: '', season: '', sowingDate: '', area: '',
      location: '', soilType: '', irrigationType: '', expectedHarvest: '', notes: ''
    });
    setShowAddForm(false);
    setIsGeneratingTodos(false);
  };

  const handleDeleteCrop = (cropId: number) => {
    const cropToDelete = crops.find(crop => crop.id === cropId);
    if (window.confirm(`Are you sure you want to delete "${cropToDelete?.name}" crop? This action cannot be undone.`)) {
      deleteCrop(cropId);
      alert('Crop deleted successfully!');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading your crops...</div>
      </div>
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
        <h1 className="text-3xl font-bold">{t('myCrop')}</h1>
      </motion.div>

      {/* Crop Cards */}
      <div className="space-y-6 mb-6">
        {crops.map((crop, cropIndex) => (
          <motion.div
            key={crop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + cropIndex * 0.1 }}
            className="bg-cream rounded-3xl p-6"
          >
            {/* Crop Info */}
            <div className="mb-6 relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black">{crop.name} - {t('crop')} {cropIndex + 1}</h2>
                <div className="flex items-center space-x-2">
                  {/* Progress Bar */}
                  <div className="flex items-center space-x-2">
                    <BarChart3 size={16} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-600">{crop.progress}%</span>
                  </div>
                  <div className="w-16 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${crop.progress}%` }}
                    />
                  </div>
                  {/* Action Buttons */}
                  <button
                    onClick={() => setEditingCrop(crop.id)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCrop(crop.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-black text-sm">
                <div><span className="font-semibold">{t('cropName')}:</span> {crop.name}</div>
                <div><span className="font-semibold">{t('variety')}:</span> {crop.variety}</div>
                <div><span className="font-semibold">{t('season')}:</span> {crop.season}</div>
                <div><span className="font-semibold">{t('sowingDate')}:</span> {crop.sowingDate}</div>
                <div><span className="font-semibold">{t('area')}:</span> {crop.area}</div>
                {crop.location && <div><span className="font-semibold">Location:</span> {crop.location}</div>}
                {crop.soilType && <div><span className="font-semibold">Soil Type:</span> {crop.soilType}</div>}
                {crop.irrigationType && <div><span className="font-semibold">Irrigation:</span> {crop.irrigationType}</div>}
                {crop.expectedHarvest && <div><span className="font-semibold">Expected Harvest:</span> {crop.expectedHarvest}</div>}
                {crop.notes && <div className="col-span-2"><span className="font-semibold">Notes:</span> {crop.notes}</div>}
              </div>
              
              {/* Status Badge */}
              <div className="mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  crop.status === 'active' ? 'bg-green-100 text-green-800' :
                  crop.status === 'harvested' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                </span>
              </div>
            </div>

            {/* AI-Generated To-do List */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles size={20} className="text-purple-600" />
                <h3 className="text-lg font-bold text-black">{t('todoList')} (AI Recommended)</h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {crop.todos.map((todo, index) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-start space-x-3 p-3 bg-white rounded-xl"
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleTodo(crop.id, todo.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                        todo.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-400 text-transparent hover:border-green-400'
                      }`}
                    >
                      {todo.completed && <Check size={16} />}
                    </motion.button>
                    <div className="flex-1">
                      <span className={`text-black ${todo.completed ? 'line-through opacity-60' : ''}`}>
                        {todo.text}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                          {todo.priority}
                        </span>
                        {todo.dueDate && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {todo.dueDate}
                          </span>
                        )}
                        {todo.completed && todo.completedAt && (
                          <span className="text-xs text-green-600">
                            ✓ Completed {new Date(todo.completedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Crop Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-cream rounded-3xl p-6 mb-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles size={24} className="text-purple-600" />
              <h3 className="text-xl font-bold text-black">Add New Crop (AI Powered)</h3>
            </div>
            
            <div className="space-y-4">
              {/* Crop Name */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">{t('cropName')}</label>
                <select
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value, variety: '' })}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select crop</option>
                  {cropOptions.map(crop => (
                    <option key={crop.value} value={crop.value}>{crop.label}</option>
                  ))}
                </select>
              </div>

              {/* Variety */}
              {formData.cropName && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm font-semibold text-black mb-2">{t('variety')}</label>
                  <select
                    value={formData.variety}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select variety</option>
                    {varietyOptions[formData.cropName as keyof typeof varietyOptions]?.map(variety => (
                      <option key={variety} value={variety}>{variety}</option>
                    ))}
                  </select>
                </motion.div>
              )}

              {/* Season */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">{t('season')}</label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select season</option>
                  {seasonOptions.map(season => (
                    <option key={season.value} value={season.value}>{season.label}</option>
                  ))}
                </select>
              </div>

              {/* Sowing Date */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">{t('sowingDate')}</label>
                <input
                  type="date"
                  value={formData.sowingDate}
                  onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Location</label>
                <input
                  type="text"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Soil Type</label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select soil type</option>
                  {soilTypeOptions.map(soil => (
                    <option key={soil} value={soil}>{soil}</option>
                  ))}
                </select>
              </div>

              {/* Irrigation Type */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Irrigation Type</label>
                <select
                  value={formData.irrigationType}
                  onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select irrigation type</option>
                  {irrigationOptions.map(irrigation => (
                    <option key={irrigation} value={irrigation}>{irrigation}</option>
                  ))}
                </select>
              </div>

              {/* Expected Harvest Date */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Expected Harvest Date</label>
                <input
                  type="date"
                  value={formData.expectedHarvest}
                  onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Notes</label>
                <textarea
                  placeholder="Add any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">{t('area')}</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Enter area"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="flex-1 px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <select className="px-4 py-3 bg-white text-black rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="acres">Acres</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 px-6 bg-gray-200 text-black rounded-xl font-semibold"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddCrop}
                  disabled={isGeneratingTodos}
                  className="flex-1 py-3 px-6 bg-green-600 text-white rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isGeneratingTodos ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Generating AI Recommendations...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      <span>Add Crop with AI</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Crop Button */}
      {!showAddForm && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="bg-cream text-black py-4 px-8 rounded-3xl font-semibold text-lg flex items-center space-x-2 mb-20"
        >
          <Plus size={24} />
          <span>{t('addCrop')}</span>
        </motion.button>
      )}

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

export default CropScreen;