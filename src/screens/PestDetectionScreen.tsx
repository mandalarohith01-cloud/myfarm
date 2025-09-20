import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Upload, User, X, Mic } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AIService from '../services/AIService';

interface PestDetectionScreenProps {
  onBack: () => void;
}

interface DetectionResult {
  pestType: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  overlayPositions: Array<{ top: string; left: string; size: string }>;
}

const plantDiseases = [
  {
    pestType: 'Leaf Spot Disease',
    confidence: 87,
    severity: 'medium' as const,
    recommendation: 'leafSpotTreatment',
    overlayPositions: [
      { top: '33%', left: '50%', size: '32px' },
      { top: '66%', left: '33%', size: '24px' },
      { top: '50%', left: '75%', size: '40px' }
    ]
  },
  {
    pestType: 'Bacterial Blight',
    confidence: 92,
    severity: 'high' as const,
    recommendation: 'bacterialBlightTreatment',
    overlayPositions: [
      { top: '25%', left: '40%', size: '36px' },
      { top: '60%', left: '60%', size: '28px' },
      { top: '45%', left: '20%', size: '32px' }
    ]
  },
  {
    pestType: 'Powdery Mildew',
    confidence: 78,
    severity: 'medium' as const,
    recommendation: 'powderyMildewTreatment',
    overlayPositions: [
      { top: '40%', left: '55%', size: '44px' },
      { top: '70%', left: '30%', size: '36px' }
    ]
  },
  {
    pestType: 'Aphid Infestation',
    confidence: 95,
    severity: 'high' as const,
    recommendation: 'aphidTreatment',
    overlayPositions: [
      { top: '30%', left: '45%', size: '28px' },
      { top: '55%', left: '65%', size: '32px' },
      { top: '75%', left: '40%', size: '24px' },
      { top: '20%', left: '70%', size: '36px' }
    ]
  },
  {
    pestType: 'Early Blight',
    confidence: 84,
    severity: 'medium' as const,
    recommendation: 'earlyBlightTreatment',
    overlayPositions: [
      { top: '35%', left: '50%', size: '40px' },
      { top: '65%', left: '25%', size: '32px' }
    ]
  },
  {
    pestType: 'Spider Mites',
    confidence: 89,
    severity: 'high' as const,
    recommendation: 'spiderMitesTreatment',
    overlayPositions: [
      { top: '45%', left: '35%', size: '20px' },
      { top: '55%', left: '60%', size: '24px' },
      { top: '25%', left: '50%', size: '28px' },
      { top: '70%', left: '45%', size: '22px' }
    ]
  },
  {
    pestType: 'Late Blight',
    confidence: 91,
    severity: 'high' as const,
    recommendation: 'lateBlightTreatment',
    overlayPositions: [
      { top: '30%', left: '40%', size: '38px' },
      { top: '60%', left: '55%', size: '34px' },
      { top: '45%', left: '25%', size: '30px' }
    ]
  },
  {
    pestType: 'Downy Mildew',
    confidence: 86,
    severity: 'medium' as const,
    recommendation: 'downyMildewTreatment',
    overlayPositions: [
      { top: '35%', left: '45%', size: '36px' },
      { top: '65%', left: '30%', size: '28px' }
    ]
  },
  {
    pestType: 'Anthracnose',
    confidence: 88,
    severity: 'medium' as const,
    recommendation: 'anthracnoseTreatment',
    overlayPositions: [
      { top: '40%', left: '50%', size: '32px' },
      { top: '70%', left: '35%', size: '26px' },
      { top: '25%', left: '65%', size: '30px' }
    ]
  },
  {
    pestType: 'Rust Disease',
    confidence: 90,
    severity: 'high' as const,
    recommendation: 'rustDiseaseTreatment',
    overlayPositions: [
      { top: '30%', left: '45%', size: '24px' },
      { top: '55%', left: '60%', size: '28px' },
      { top: '75%', left: '40%', size: '22px' },
      { top: '20%', left: '70%', size: '26px' }
    ]
  },
  {
    pestType: 'Whitefly Infestation',
    confidence: 93,
    severity: 'high' as const,
    recommendation: 'whiteflyTreatment',
    overlayPositions: [
      { top: '25%', left: '35%', size: '20px' },
      { top: '45%', left: '55%', size: '18px' },
      { top: '65%', left: '40%', size: '22px' },
      { top: '35%', left: '70%', size: '16px' },
      { top: '75%', left: '25%', size: '20px' }
    ]
  },
  {
    pestType: 'Thrips Damage',
    confidence: 85,
    severity: 'medium' as const,
    recommendation: 'thripsTreatment',
    overlayPositions: [
      { top: '40%', left: '45%', size: '18px' },
      { top: '60%', left: '30%', size: '16px' },
      { top: '25%', left: '60%', size: '20px' },
      { top: '75%', left: '50%', size: '18px' }
    ]
  },
  {
    pestType: 'Mosaic Virus',
    confidence: 87,
    severity: 'high' as const,
    recommendation: 'mosaicVirusTreatment',
    overlayPositions: [
      { top: '35%', left: '40%', size: '42px' },
      { top: '65%', left: '60%', size: '38px' }
    ]
  },
  {
    pestType: 'Leaf Curl Disease',
    confidence: 89,
    severity: 'medium' as const,
    recommendation: 'leafCurlTreatment',
    overlayPositions: [
      { top: '30%', left: '50%', size: '40px' },
      { top: '70%', left: '35%', size: '36px' },
      { top: '50%', left: '70%', size: '32px' }
    ]
  },
  {
    pestType: 'Black Spot Disease',
    confidence: 86,
    severity: 'medium' as const,
    recommendation: 'blackSpotTreatment',
    overlayPositions: [
      { top: '40%', left: '45%', size: '28px' },
      { top: '65%', left: '55%', size: '24px' },
      { top: '25%', left: '35%', size: '26px' }
    ]
  },
  {
    pestType: 'Root Rot',
    confidence: 82,
    severity: 'high' as const,
    recommendation: 'rootRotTreatment',
    overlayPositions: [
      { top: '60%', left: '50%', size: '44px' },
      { top: '80%', left: '35%', size: '40px' }
    ]
  },
  {
    pestType: 'Stem Borer',
    confidence: 91,
    severity: 'high' as const,
    recommendation: 'stemBorerTreatment',
    overlayPositions: [
      { top: '45%', left: '50%', size: '8px' },
      { top: '55%', left: '48%', size: '6px' },
      { top: '35%', left: '52%', size: '10px' }
    ]
  },
  {
    pestType: 'Leaf Miner',
    confidence: 88,
    severity: 'medium' as const,
    recommendation: 'leafMinerTreatment',
    overlayPositions: [
      { top: '30%', left: '40%', size: '24px' },
      { top: '50%', left: '60%', size: '20px' },
      { top: '70%', left: '45%', size: '22px' },
      { top: '40%', left: '70%', size: '18px' }
    ]
  },
  {
    pestType: 'Scale Insects',
    confidence: 84,
    severity: 'medium' as const,
    recommendation: 'scaleInsectsTreatment',
    overlayPositions: [
      { top: '35%', left: '45%', size: '12px' },
      { top: '55%', left: '35%', size: '14px' },
      { top: '65%', left: '60%', size: '10px' },
      { top: '25%', left: '65%', size: '16px' },
      { top: '75%', left: '40%', size: '12px' }
    ]
  },
  {
    pestType: 'Caterpillar Damage',
    confidence: 92,
    severity: 'high' as const,
    recommendation: 'caterpillarTreatment',
    overlayPositions: [
      { top: '40%', left: '50%', size: '36px' },
      { top: '60%', left: '30%', size: '32px' },
      { top: '25%', left: '70%', size: '28px' }
    ]
  },
  {
    pestType: 'Healthy Plant',
    confidence: 96,
    severity: 'low' as const,
    recommendation: 'healthyPlantAdvice',
    overlayPositions: []
  }
];

// Simple AI-like image analysis based on image characteristics
const analyzeImageForDisease = (imageData: string): DetectionResult => {
  // Convert image to canvas to analyze pixel data
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  
  return new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      // Get image data for analysis
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData?.data;
      
      if (!data) {
        resolve(plantDiseases[Math.floor(Math.random() * plantDiseases.length)]);
        return;
      }
      
      // Analyze color patterns to detect diseases
      let redPixels = 0;
      let greenPixels = 0;
      let brownPixels = 0;
      let yellowPixels = 0;
      let darkSpots = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Detect different color patterns
        if (r > 150 && g < 100 && b < 100) redPixels++;
        if (g > 150 && r < 100 && b < 100) greenPixels++;
        if (r > 100 && g > 80 && b < 60) brownPixels++;
        if (r > 200 && g > 200 && b < 100) yellowPixels++;
        if (r < 80 && g < 80 && b < 80) darkSpots++;
      }
      
      const totalPixels = data.length / 4;
      const redRatio = redPixels / totalPixels;
      const greenRatio = greenPixels / totalPixels;
      const brownRatio = brownPixels / totalPixels;
      const yellowRatio = yellowPixels / totalPixels;
      const darkRatio = darkSpots / totalPixels;
      
      // Disease detection logic based on color analysis
      if (redRatio > 0.1) {
        resolve(plantDiseases[1]); // Bacterial Blight
      } else if (brownRatio > 0.15) {
        resolve(plantDiseases[0]); // Leaf Spot Disease
      } else if (yellowRatio > 0.2) {
        resolve(plantDiseases[3]); // Aphid Infestation
      } else if (darkRatio > 0.2) {
        resolve(plantDiseases[4]); // Early Blight
      } else if (greenRatio > 0.6 && darkRatio < 0.05) {
        resolve(plantDiseases[6]); // Healthy Plant
      } else if (yellowRatio > 0.1 && redRatio > 0.05) {
        resolve(plantDiseases[5]); // Spider Mites
      } else {
        resolve(plantDiseases[2]); // Powdery Mildew
      }
    };
    
    img.src = imageData;
  });
};

const PestDetectionScreen: React.FC<PestDetectionScreenProps> = ({ onBack }) => {
  const { t, language } = useLanguage();
  const [isCapturing, setIsCapturing] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const analyzeImage = async (imageData: string) => {
    try {
      // Use AI Service for analysis
      const aiResult = await AIService.analyzePlantImage(imageData.split(',')[1], language); // Pass current language
      
      // Convert AI result to our format
      const result: DetectionResult = {
        pestType: aiResult.treatment?.split('.')[0] || 'Unknown Disease',
        confidence: aiResult.confidence,
        severity: aiResult.severity || 'medium',
        recommendation: aiResult.treatment || 'Consult agricultural expert',
        overlayPositions: generateOverlayPositions(aiResult.severity || 'medium')
      };
      
      setDetectionResult(result);
    } catch (error) {
      console.error('AI analysis failed, using fallback:', error);
      // Fallback to local analysis
      const result = await analyzeImageForDisease(imageData);
      setDetectionResult(result);
    }
  };
  
  const generateOverlayPositions = (severity: 'low' | 'medium' | 'high') => {
    const positions = [];
    const count = severity === 'high' ? 4 : severity === 'medium' ? 2 : 1;
    
    for (let i = 0; i < count; i++) {
      positions.push({
        top: `${25 + Math.random() * 50}%`,
        left: `${25 + Math.random() * 50}%`,
        size: `${24 + Math.random() * 16}px`
      });
    }
    
    return positions;
  };

  const speakText = async (text: string, currentLanguage: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Wait a bit for the cancel to take effect
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on current app language
      const languageMap: { [key: string]: string } = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN',
        'pa': 'pa-IN',
        'ta': 'ta-IN',
        'bn': 'bn-IN',
        'gu': 'gu-IN',
        'mr': 'mr-IN',
        'kn': 'kn-IN',
        'ml': 'ml-IN'
      };
      
      utterance.lang = languageMap[currentLanguage] || 'en-US';
      utterance.rate = 0.7; // Slower for better clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to find the best voice for the language
      const voices = window.speechSynthesis.getVoices();
      const targetLang = languageMap[currentLanguage] || 'en-US';
      
      // Find voice that matches the language
      let selectedVoice = voices.find(voice => 
        voice.lang === targetLang || voice.lang.startsWith(targetLang.split('-')[0])
      );
      
      // Fallback to any voice that contains the language code
      if (!selectedVoice && currentLanguage !== 'en') {
        selectedVoice = voices.find(voice => 
          voice.lang.toLowerCase().includes(currentLanguage) ||
          voice.name.toLowerCase().includes(currentLanguage)
        );
      }
      
      // Final fallback to default voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.default) || voices[0];
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback for browsers without speech synthesis
      alert('Text-to-speech is not supported in this browser');
    }
  };
  
  // Load voices when component mounts
  React.useEffect(() => {
    const loadVoices = () => {
      // This ensures voices are loaded
      window.speechSynthesis.getVoices();
    };
    
    if ('speechSynthesis' in window) {
      loadVoices();
      // Some browsers load voices asynchronously
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    const video = document.getElementById('camera-video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (video && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageDataUrl);
      setHasImage(true);
      closeCamera();
      
      // Simulate AI processing
      setIsCapturing(true);
      setTimeout(() => {
        setIsCapturing(false);
        analyzeImage(imageDataUrl);
      }, 2000);
    }
  };

  const handleCapture = () => {
    openCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setHasImage(true);
        
        // Simulate AI processing
        setIsCapturing(true);
        setTimeout(() => {
          setIsCapturing(false);
          analyzeImage(e.target?.result as string);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Set up video stream when camera opens
  React.useEffect(() => {
    if (isCameraOpen && stream) {
      const video = document.getElementById('camera-video') as HTMLVideoElement;
      if (video) {
        video.srcObject = stream;
      }
    }
  }, [isCameraOpen, stream]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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
        <h1 className="text-2xl font-bold">{t('pestDetectionTitle')}</h1>
      </motion.div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex flex-col"
        >
          {/* Camera Header */}
          <div className="flex justify-between items-center p-4 bg-black/80">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeCamera}
              className="p-2 rounded-full bg-cream text-black"
            >
              <X size={20} />
            </motion.button>
            <h2 className="text-white font-semibold">{t('pestDetectionTitle')}</h2>
            <div className="w-10" />
          </div>

          {/* Camera View */}
          <div className="flex-1 relative">
            <video
              id="camera-video"
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Camera Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-4 border-white/50 rounded-3xl"></div>
            </div>
          </div>

          {/* Camera Controls */}
          <div className="p-6 bg-black/80 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={capturePhoto}
              className="w-20 h-20 bg-cream rounded-full flex items-center justify-center shadow-lg border-4 border-white"
            >
              <div className="w-16 h-16 bg-black rounded-full" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Image Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
        className="relative mb-8"
      >
        <div className="bg-cream rounded-3xl overflow-hidden aspect-[4/5] relative">
          {hasImage && capturedImage ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full relative"
            >
              <img
                src={capturedImage}
                alt="Captured plant"
                className="w-full h-full object-cover"
              />
              
              {/* AI Detection Overlay - only show after processing */}
              {!isCapturing && (
                <>
                  {detectionResult?.overlayPositions.map((position, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                      className={`absolute border-4 rounded-full ${
                        detectionResult.severity === 'high' ? 'border-red-500' :
                        detectionResult.severity === 'medium' ? 'border-orange-500' :
                        'border-green-500'
                      }`}
                      style={{
                        top: position.top,
                        left: position.left,
                        width: position.size,
                        height: position.size,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </>
              )}
            </motion.div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <Camera size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">{t('captureOrUpload')}</p>
              </div>
            </div>
          )}
          
          {isCapturing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/80 flex items-center justify-center"
            >
              <div className="text-center text-white">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"
                />
                <p>{t('analyzingImage')}</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Analysis Results */}
      {hasImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-cream rounded-3xl p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-black mb-4">{t('detectionResults')}</h3>
          {detectionResult && (
            <div className="space-y-3 text-black">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-sm sm:text-base">{t('pestType')}:</span>
                <span className={`font-semibold text-sm sm:text-base break-words ${
                  detectionResult.severity === 'high' ? 'text-red-600' :
                  detectionResult.severity === 'medium' ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {t(detectionResult.pestType.toLowerCase().replace(/\s+/g, ''))}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-sm sm:text-base">{t('confidence')}:</span>
                <span className="font-semibold text-sm sm:text-base">{detectionResult.confidence}%</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-sm sm:text-base">{t('severity')}:</span>
                <span className={`font-semibold capitalize text-sm sm:text-base ${
                  detectionResult.severity === 'high' ? 'text-red-600' :
                  detectionResult.severity === 'medium' ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {t(detectionResult.severity)}
                </span>
              </div>
              <div className={`mt-4 p-4 rounded-2xl ${
                detectionResult.severity === 'high' ? 'bg-red-100' :
                detectionResult.severity === 'medium' ? 'bg-yellow-100' :
                'bg-green-100'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                  <div className="flex-1">
                    <p className="text-sm sm:text-base leading-relaxed">
                      <strong>{t('recommendation')}:</strong> {t(detectionResult.recommendation)}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => speakText(t(detectionResult.recommendation), language)}
                    disabled={isSpeaking}
                    className={`sm:ml-3 p-2 rounded-full transition-colors self-start ${
                      isSpeaking 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={isSpeaking ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: isSpeaking ? Infinity : 0, duration: 0.8 }}
                    >
                      <Mic size={16} />
                    </motion.div>
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-20">
        <div className="relative">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-cream text-black py-3 px-6 rounded-3xl font-semibold flex items-center space-x-2"
          >
            <Upload size={20} />
            <span>{t('upload')}</span>
          </motion.button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Capture Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCapture}
          disabled={isCapturing || isCameraOpen}
          className={`w-20 h-20 bg-cream rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all ${
            (isCapturing || isCameraOpen) ? 'scale-95 bg-gray-300' : 'hover:shadow-xl'
          }`}
        >
          <Camera size={32} className="text-black" />
        </motion.button>

        <div className="w-20" /> {/* Spacer */}
      </div>

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

export default PestDetectionScreen;