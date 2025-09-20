import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  completedAt?: string;
}

export interface Crop {
  id: number;
  name: string;
  variety: string;
  season: string;
  sowingDate: string;
  area: string;
  location?: string;
  soilType?: string;
  irrigationType?: string;
  expectedHarvest?: string;
  notes?: string;
  todos: TodoItem[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  status: 'active' | 'harvested' | 'failed';
  progress: number; // 0-100 percentage
}

interface CropContextType {
  crops: Crop[];
  addCrop: (cropData: Omit<Crop, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'status' | 'progress'>) => void;
  updateCrop: (cropId: number, updates: Partial<Crop>) => void;
  deleteCrop: (cropId: number) => void;
  toggleTodo: (cropId: number, todoId: number) => void;
  addTodo: (cropId: number, todo: Omit<TodoItem, 'id'>) => void;
  updateTodo: (cropId: number, todoId: number, updates: Partial<TodoItem>) => void;
  deleteTodo: (cropId: number, todoId: number) => void;
  getCropById: (cropId: number) => Crop | undefined;
  getCropsByStatus: (status: Crop['status']) => Crop[];
  isLoading: boolean;
}

const CropContext = createContext<CropContextType | undefined>(undefined);

export const useCrops = () => {
  const context = useContext(CropContext);
  if (!context) {
    throw new Error('useCrops must be used within a CropProvider');
  }
  return context;
};

interface CropProviderProps {
  children: ReactNode;
}

export const CropProvider: React.FC<CropProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Load crops from localStorage when user changes
  useEffect(() => {
    if (user) {
      loadUserCrops(user.id);
      setHasInitialized(true);
    } else {
      setCrops([]);
      setHasInitialized(false);
    }
    setIsLoading(false);
  }, [user]);

  // Save crops to localStorage whenever crops change
  useEffect(() => {
    if (user && hasInitialized) {
      saveUserCrops(user.id, crops);
    }
  }, [crops, user, hasInitialized]);

  const loadUserCrops = (userId: string) => {
    try {
      const savedCrops = localStorage.getItem(`farmar_crops_${userId}`);
      if (savedCrops) {
        const parsedCrops = JSON.parse(savedCrops).map((crop: any) => ({
          ...crop,
          createdAt: typeof crop.createdAt === 'string' ? crop.createdAt : new Date(crop.createdAt).toISOString(),
          updatedAt: typeof crop.updatedAt === 'string' ? crop.updatedAt : new Date(crop.updatedAt).toISOString(),
          todos: crop.todos.map((todo: any) => ({
            ...todo,
            completedAt: todo.completedAt ? 
              (typeof todo.completedAt === 'string' ? todo.completedAt : new Date(todo.completedAt).toISOString()) 
              : undefined
          }))
        }));
        setCrops(parsedCrops.map((crop: any) => ({
          ...crop,
          createdAt: crop.createdAt,
          updatedAt: crop.updatedAt,
          todos: crop.todos.map((todo: any) => ({
            ...todo,
            completedAt: todo.completedAt
          }))
        })));
        console.log(`Loaded ${parsedCrops.length} crops for user ${userId}`);
      } else {
        // Initialize with sample crop for new users
        const sampleCrop: Crop = {
          id: 1,
          name: 'Paddy',
          variety: 'BPT 5204 (Sona Masuri)',
          season: 'Kharif (Monsoon)',
          sowingDate: new Date().toISOString().split('T')[0],
          area: '2 Acres',
          location: 'Hyderabad',
          soilType: 'Black Cotton Soil',
          irrigationType: 'Flood Irrigation',
          expectedHarvest: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          notes: 'First crop entry - AI generated recommendations',
          todos: [
            { 
              id: 1, 
              text: 'AI Recommendation: Prepare seedbed with proper leveling', 
              completed: false, 
              priority: 'high', 
              dueDate: 'Day 1-3' 
            },
            { 
              id: 2, 
              text: 'AI Recommendation: Apply basal fertilizer (NPK 120:60:40 kg/ha)', 
              completed: false, 
              priority: 'high', 
              dueDate: 'Before transplanting' 
            },
            { 
              id: 3, 
              text: 'AI Recommendation: Maintain 2-3 cm water level', 
              completed: false, 
              priority: 'high', 
              dueDate: 'Daily monitoring' 
            },
            { 
              id: 4, 
              text: 'AI Recommendation: Monitor for stem borer and leaf folder', 
              completed: false, 
              priority: 'medium', 
              dueDate: 'Weekly inspection' 
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId,
          status: 'active',
          progress: 15
        };
        setCrops([sampleCrop]);
        console.log(`Initialized sample crop for new user ${userId}`);
      }
    } catch (error) {
      console.error('Error loading crops:', error);
      setCrops([]);
    }
  };

  const saveUserCrops = (userId: string, cropsToSave: Crop[]) => {
    try {
      localStorage.setItem(`farmar_crops_${userId}`, JSON.stringify(cropsToSave));
      console.log(`Saved ${cropsToSave.length} crops for user ${userId}`);
    } catch (error) {
      console.error('Error saving crops:', error);
    }
  };

  const addCrop = (cropData: Omit<Crop, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'status' | 'progress'>) => {
    if (!user) return;

    const newCrop: Crop = {
      ...cropData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id,
      status: 'active',
      progress: 0
    };

    setCrops(prev => [...prev, newCrop]);
  };

  const updateCrop = (cropId: number, updates: Partial<Crop>) => {
    setCrops(prev => prev.map(crop => 
      crop.id === cropId 
        ? { ...crop, ...updates, updatedAt: new Date().toISOString() }
        : crop
    ));
  };

  const deleteCrop = (cropId: number) => {
    setCrops(prev => prev.filter(crop => crop.id !== cropId));
  };

  const toggleTodo = (cropId: number, todoId: number) => {
    setCrops(prev => prev.map(crop => 
      crop.id === cropId 
        ? {
            ...crop,
            todos: crop.todos.map(todo => 
              todo.id === todoId 
                ? { 
                    ...todo, 
                    completed: !todo.completed,
                    completedAt: !todo.completed ? new Date().toISOString() : undefined
                  }
                : todo
            ),
            updatedAt: new Date().toISOString(),
            progress: calculateCropProgress(crop.todos.map(todo => 
              todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            ))
          }
        : crop
    ));
  };

  const addTodo = (cropId: number, todo: Omit<TodoItem, 'id'>) => {
    setCrops(prev => prev.map(crop => 
      crop.id === cropId 
        ? {
            ...crop,
            todos: [...crop.todos, { ...todo, id: Date.now() }],
            updatedAt: new Date().toISOString()
          }
        : crop
    ));
  };

  const updateTodo = (cropId: number, todoId: number, updates: Partial<TodoItem>) => {
    setCrops(prev => prev.map(crop => 
      crop.id === cropId 
        ? {
            ...crop,
            todos: crop.todos.map(todo => 
              todo.id === todoId ? { ...todo, ...updates } : todo
            ),
            updatedAt: new Date().toISOString()
          }
        : crop
    ));
  };

  const deleteTodo = (cropId: number, todoId: number) => {
    setCrops(prev => prev.map(crop => 
      crop.id === cropId 
        ? {
            ...crop,
            todos: crop.todos.filter(todo => todo.id !== todoId),
            updatedAt: new Date().toISOString()
          }
        : crop
    ));
  };

  const getCropById = (cropId: number): Crop | undefined => {
    return crops.find(crop => crop.id === cropId);
  };

  const getCropsByStatus = (status: Crop['status']): Crop[] => {
    return crops.filter(crop => crop.status === status);
  };

  const calculateCropProgress = (todos: TodoItem[]): number => {
    if (todos.length === 0) return 0;
    const completedTodos = todos.filter(todo => todo.completed).length;
    return Math.round((completedTodos / todos.length) * 100);
  };

  return (
    <CropContext.Provider value={{
      crops,
      addCrop,
      updateCrop,
      deleteCrop,
      toggleTodo,
      addTodo,
      updateTodo,
      deleteTodo,
      getCropById,
      getCropsByStatus,
      isLoading,
    }}>
      {children}
    </CropContext.Provider>
  );
};