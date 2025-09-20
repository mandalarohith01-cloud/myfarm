import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Check, User, ChevronDown, Calendar, MapPin, Sparkles, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AIService from '../services/AIService';

interface CropScreenProps {
  onBack: () => void;
}

interface Crop {
  id: number;
  name: string;
  variety: string;
  season: string;
  sowingDate: string;
  area: string;
  health: number; // 0-100 health percentage
  lastHealthUpdate: string;
  todos: TodoItem[];
}

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  completedAt?: string;
  isOverdue?: boolean;
}

const CropScreen: React.FC<CropScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isGeneratingTodos, setIsGeneratingTodos] = useState(false);
  const [showRecommendedCrops, setShowRecommendedCrops] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    cropName: '',
    variety: '',
    season: '',
    sowingDate: '',
    area: ''
  });

  const [crops, setCrops] = useState<Crop[]>([
    {
      id: 1,
      name: t('paddy'),
      variety: t('sonamasuri'),
      season: t('kharifRabi'),
      sowingDate: '15-July-2025',
      area: '2 ' + t('acres'),
      health: 85,
      lastHealthUpdate: new Date().toISOString(),
      todos: [
        { id: 1, text: t('water'), completed: false, priority: 'high', dueDate: '7am-9am', isOverdue: false },
        { id: 2, text: t('sprayFertilizer'), completed: true, priority: 'medium', completedAt: new Date(Date.now() - 86400000).toISOString(), isOverdue: false },
        { id: 3, text: t('monitorField'), completed: false, priority: 'low', isOverdue: true },
      ]
    }
  ]);
  
  // Load recommended crops from registration
  React.useEffect(() => {
    const recommendedCrops = localStorage.getItem('recommended_crops');
    const aiAdvisorResponse = localStorage.getItem('ai_advisor_response');
    
    if (recommendedCrops && aiAdvisorResponse) {
      const crops = JSON.parse(recommendedCrops);
      const response = JSON.parse(aiAdvisorResponse);
      
      if (crops.length > 0) {
        setShowRecommendedCrops(true);
      }
    }
  }, []);

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

  // Calculate crop health based on task completion
  const calculateCropHealth = (todos: TodoItem[]): number => {
    if (todos.length === 0) return 100;
    
    let healthScore = 100;
    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    const overdueTasks = todos.filter(todo => todo.isOverdue && !todo.completed).length;
    const highPriorityIncomplete = todos.filter(todo => !todo.completed && todo.priority === 'high').length;
    const mediumPriorityIncomplete = todos.filter(todo => !todo.completed && todo.priority === 'medium').length;
    
    // Base health calculation
    const completionRate = completedTasks / totalTasks;
    healthScore = Math.round(completionRate * 100);
    
    // Penalties for incomplete tasks
    healthScore -= (overdueTasks * 15); // -15 for each overdue task
    healthScore -= (highPriorityIncomplete * 10); // -10 for each incomplete high priority
    healthScore -= (mediumPriorityIncomplete * 5); // -5 for each incomplete medium priority
    
    // Bonus for completing high priority tasks
    const completedHighPriority = todos.filter(todo => todo.completed && todo.priority === 'high').length;
    healthScore += (completedHighPriority * 5);
    
    // Ensure health stays within 0-100 range
    return Math.max(0, Math.min(100, healthScore));
  };

  // Get health status color and text
  const getHealthStatus = (health: number) => {
    if (health >= 90) return { color: 'text-green-600 bg-green-100', text: 'Excellent', icon: '🌟' };
    if (health >= 75) return { color: 'text-green-600 bg-green-100', text: 'Good', icon: '✅' };
    if (health >= 60) return { color: 'text-yellow-600 bg-yellow-100', text: 'Fair', icon: '⚠️' };
    if (health >= 40) return { color: 'text-orange-600 bg-orange-100', text: 'Poor', icon: '🔶' };
    return { color: 'text-red-600 bg-red-100', text: 'Critical', icon: '🚨' };
  };

  // Update crop health when todos change
  const updateCropHealth = (cropId: number, updatedTodos: TodoItem[]) => {
    const newHealth = calculateCropHealth(updatedTodos);
    setCrops(prevCrops => 
      prevCrops.map(crop => 
        crop.id === cropId 
          ? { 
              ...crop, 
              health: newHealth, 
              lastHealthUpdate: new Date().toISOString(),
              todos: updatedTodos 
            }
          : crop
      )
    );
  };

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

  const generateAITodosFromCareInstructions = (cropData: any) => {
    // Generate todos from care instructions
    const careInstructions = cropData.careInstructions || [];
    return careInstructions.map((instruction: string, index: number) => ({
      id: Date.now() + index,
      text: `AI Recommendation: ${instruction}`,
      completed: false,
      priority: index < 3 ? 'high' as const : index < 6 ? 'medium' as const : 'low' as const,
      dueDate: `Week ${index + 1}`,
    }));
  };

  const handleAddCrop = async () => {
    if (!formData.cropName || !formData.variety || !formData.season || !formData.sowingDate || !formData.area) {
      return;
    }

    setIsGeneratingTodos(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const aiTodos = generateAITodos(formData.cropName, formData.variety, formData.season);
    
    const newCrop: Crop = {
      id: Date.now(),
      name: formData.cropName,
      variety: formData.variety,
      season: formData.season,
      sowingDate: formData.sowingDate,
      area: formData.area,
      health: 100, // New crops start with perfect health
      lastHealthUpdate: new Date().toISOString(),
      todos: aiTodos,
    };

    setCrops([...crops, newCrop]);
    setFormData({ cropName: '', variety: '', season: '', sowingDate: '', area: '' });
    setShowAddForm(false);
    setIsGeneratingTodos(false);
  };
  
  const addRecommendedCrop = async (cropName: string) => {
    const recommendedCrops = JSON.parse(localStorage.getItem('recommended_crops') || '[]');
    const aiAdvisorResponse = JSON.parse(localStorage.getItem('ai_advisor_response') || '{}');
    
    // Find crop in AI advisor response
    const cropData = aiAdvisorResponse?.cropRecommendations?.find((crop: any) => crop.name === cropName);
    if (!cropData) return;
    
    setIsGeneratingTodos(true);
    
    // Generate AI todos based on recommended crop and care instructions
    await new Promise(resolve => setTimeout(resolve, 2000));
    const aiTodos = generateAITodosFromCareInstructions(cropData);
    
    const newCrop: Crop = {
      id: Date.now(),
      name: cropData.name,
      variety: cropData.variety,
      season: cropData.seasonalTiming || 'Current Season',
      sowingDate: cropData.sowingDate,
      area: '1 acre',
      health: 100,
      lastHealthUpdate: new Date().toISOString(),
      todos: aiTodos,
    };
    
    setCrops(prev => [...prev, newCrop]);
    setIsGeneratingTodos(false);
    
    // Remove from recommended crops
    const updatedRecommendations = aiAdvisorResponse.cropRecommendations.filter((crop: any) => crop.name !== cropName);
    const updatedResponse = { ...aiAdvisorResponse, cropRecommendations: updatedRecommendations };
    localStorage.setItem('ai_advisor_response', JSON.stringify(updatedResponse));
    
    if (updatedRecommendations.length === 0) {
      setShowRecommendedCrops(false);
    }
  };

  const toggleTodo = (cropId: number, todoId: number) => {
    const crop = crops.find(c => c.id === cropId);
    if (!crop) return;
    
    const updatedTodos = crop.todos.map(todo => {
      if (todo.id === todoId) {
        const isCompleting = !todo.completed;
        return { 
          ...todo, 
          completed: isCompleting,
          completedAt: isCompleting ? new Date().toISOString() : undefined,
          isOverdue: isCompleting ? false : todo.isOverdue
        };
      }
      return todo;
    });
    
    updateCropHealth(cropId, updatedTodos);
  };

  // Check for overdue tasks periodically
  React.useEffect(() => {
    const checkOverdueTasks = () => {
      const now = new Date();
      const today = now.toDateString();
      
      setCrops(prevCrops => 
        prevCrops.map(crop => {
          const updatedTodos = crop.todos.map(todo => {
            if (!todo.completed && todo.dueDate) {
              // Simple overdue check - if task has a due date and it's not completed
              const isOverdue = todo.dueDate.includes('am') || todo.dueDate.includes('pm') 
                ? now.getHours() > 12 // Simple time check
                : Math.random() > 0.7; // Random overdue for demo
              
              return { ...todo, isOverdue };
            }
            return todo;
          });
          
          const newHealth = calculateCropHealth(updatedTodos);
          return {
            ...crop,
            todos: updatedTodos,
            health: newHealth,
            lastHealthUpdate: new Date().toISOString()
          };
        })
      );
    };
    
    // Check every 30 seconds
    const interval = setInterval(checkOverdueTasks, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
        {/* Recommended Crops Section */}
        {showRecommendedCrops && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 mb-6"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Sparkles size={24} className="text-white" />
              <h2 className="text-xl font-bold text-white">AI Recommended Crops</h2>
            </div>
            <p className="text-white/90 text-sm mb-4">
              Based on your soil analysis, these crops are perfect for your land. Add them to start growing!
            </p>
            
            <div className="space-y-3">
              {JSON.parse(localStorage.getItem('recommended_crops') || '[]').map((crop: any, index: number) => (
                <motion.div
                  key={crop.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{crop.name}</h3>
                    <p className="text-white/80 text-sm">{crop.variety}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                        {crop.suitability}% match
                      </span>
                      <span className="text-white/70 text-xs">{crop.expectedYield}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addRecommendedCrop(crop.name)}
                    disabled={isGeneratingTodos}
                    className="bg-white text-purple-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingTodos ? 'Adding...' : 'Add Crop'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        {crops.map((crop, cropIndex) => (
          <motion.div
            key={crop.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + cropIndex * 0.1 }}
            className="bg-cream rounded-3xl p-6"
          >
            {/* Crop Info */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-black mb-4">{crop.name} - {t('crop')} {cropIndex + 1}</h2>
              
              {/* Crop Health Status */}
              <div className="mb-4 p-4 bg-white rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-black">Crop Health Status</h3>
                  <span className="text-sm text-gray-500">
                    Updated: {new Date(crop.lastHealthUpdate).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Health Score</span>
                      <span>{crop.health}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${crop.health}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-3 rounded-full ${
                          crop.health >= 75 ? 'bg-green-500' :
                          crop.health >= 50 ? 'bg-yellow-500' :
                          crop.health >= 25 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                  <div className={`px-3 py-2 rounded-full text-sm font-semibold flex items-center space-x-1 ${getHealthStatus(crop.health).color}`}>
                    <span>{getHealthStatus(crop.health).icon}</span>
                    <span>{getHealthStatus(crop.health).text}</span>
                  </div>
                </div>
                
                {/* Health Factors */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">
                      {crop.todos.filter(t => t.completed).length}
                    </div>
                    <div className="text-gray-600">Completed</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="font-semibold text-orange-600">
                      {crop.todos.filter(t => !t.completed).length}
                    </div>
                    <div className="text-gray-600">Pending</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-semibold text-red-600">
                      {crop.todos.filter(t => t.isOverdue && !t.completed).length}
                    </div>
                    <div className="text-gray-600">Overdue</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-black text-sm">
                <div><span className="font-semibold">{t('cropName')}:</span> {crop.name}</div>
                <div><span className="font-semibold">{t('variety')}:</span> {crop.variety}</div>
                <div><span className="font-semibold">{t('season')}:</span> {crop.season}</div>
                <div><span className="font-semibold">{t('sowingDate')}:</span> {crop.sowingDate}</div>
                <div className="col-span-2"><span className="font-semibold">{t('area')}:</span> {crop.area}</div>
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
                          : todo.isOverdue 
                            ? 'border-red-400 bg-red-50 text-transparent hover:border-red-500'
                            : 'border-gray-400 text-transparent hover:border-green-400'
                      }`}
                    >
                      {todo.completed && <Check size={16} />}
                    </motion.button>
                    <div className="flex-1">
                      <span className={`text-black ${
                        todo.completed ? 'line-through opacity-60' : 
                        todo.isOverdue ? 'text-red-600 font-medium' : ''
                      }`}>
                        {todo.text}
                        {todo.isOverdue && !todo.completed && (
                          <span className="ml-2 text-red-500 text-xs font-bold">OVERDUE</span>
                        )}
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          todo.isOverdue && !todo.completed 
                            ? 'text-red-600 bg-red-100' 
                            : getPriorityColor(todo.priority)
                        }`}>
                          {todo.priority}
                        </span>
                        {todo.dueDate && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {todo.dueDate}
                          </span>
                        )}
                        {todo.completed && todo.completedAt && (
                          <span className="text-xs text-green-600 flex items-center">
                            <CheckCircle size={12} className="mr-1" />
                            Completed {new Date(todo.completedAt).toLocaleDateString()}
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