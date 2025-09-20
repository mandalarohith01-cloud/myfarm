// AI Service for FARMAR App
import { supabase } from '../config/supabase';

export interface AIAnalysisResult {
  confidence: number;
  recommendations: string[];
  severity?: 'low' | 'medium' | 'high';
  treatment?: string;
  nextSteps?: string[];
}

export interface CropRecommendation {
  cropName: string;
  variety: string;
  sowingDate: string;
  expectedYield: string;
  profitability: number;
  riskLevel: 'low' | 'medium' | 'high';
  reasons: string[];
}

export interface WeatherPrediction {
  date: string;
  temperature: { min: number; max: number };
  rainfall: number;
  humidity: number;
  windSpeed: number;
  recommendation: string;
  cropImpact: string;
}

class AIService {
  private static instance: AIService;
  private apiKey: string = '';

  private constructor() {
    // Initialize with environment variables
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // 1. PEST AND DISEASE DETECTION
  async analyzePlantImage(imageBase64: string, language: string = 'en'): Promise<AIAnalysisResult> {
    try {
      // Option 1: Use OpenAI Vision API
      if (this.apiKey && this.apiKey !== 'your_openai_api_key_here' && this.apiKey.startsWith('sk-')) {
        return await this.analyzeWithOpenAI(imageBase64, language);
      }
      
      // Option 2: Use local AI analysis (fallback)
      console.log('Using local AI analysis (OpenAI API key not configured or invalid)');
      return await this.analyzeWithLocalAI(imageBase64, language);
    } catch (error) {
      console.error('AI Analysis error, falling back to local analysis:', error);
      return this.getFallbackAnalysis(imageBase64, language);
    }
  }

  private async analyzeWithOpenAI(imageBase64: string, language: string): Promise<AIAnalysisResult> {
    const languageInstructions = this.getLanguageInstructions(language);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this plant image for diseases, pests, or health issues. Provide: 1) Disease/pest name 2) Confidence level (0-100) 3) Severity (low/medium/high) 4) Treatment recommendations 5) Prevention steps. ${languageInstructions} Format as JSON.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    // Check for OpenAI API errors first
    if (data.error) {
      console.error('OpenAI API Error:', data.error.message);
      throw new Error(`OpenAI API Error: ${data.error.message}`);
    }
    
    // Validate API response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Invalid OpenAI API response structure:', data);
      throw new Error('Invalid API response structure');
    }
    
    if (!data.choices[0].message || !data.choices[0].message.content) {
      console.error('Missing message content in API response:', data);
      throw new Error('Missing message content in API response');
    }
    
    let analysis;
    try {
      analysis = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', data.choices[0].message.content);
      throw new Error('Failed to parse AI response');
    }
    
    return {
      confidence: analysis.confidence || 85,
      recommendations: analysis.treatment || [],
      severity: analysis.severity || 'medium',
      treatment: analysis.treatment_details || 'Apply recommended fungicide',
      nextSteps: analysis.prevention || []
    };
  }

  private async analyzeWithLocalAI(imageBase64: string, language: string): Promise<AIAnalysisResult> {
    // Simulate AI analysis using image characteristics
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const analysis = this.performColorAnalysis(imageData, language);
        resolve(analysis);
      };
      img.src = `data:image/jpeg;base64,${imageBase64}`;
    });
  }

  private performColorAnalysis(imageData: ImageData | undefined, language: string): AIAnalysisResult {
    if (!imageData) {
      return this.getFallbackAnalysis('', language);
    }

    const data = imageData.data;
    let redPixels = 0, brownPixels = 0, yellowPixels = 0, greenPixels = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      
      if (r > 150 && g < 100 && b < 100) redPixels++;
      else if (r > 100 && g > 80 && b < 60) brownPixels++;
      else if (r > 200 && g > 200 && b < 100) yellowPixels++;
      else if (g > 150 && r < 100 && b < 100) greenPixels++;
    }

    const totalPixels = data.length / 4;
    const redRatio = redPixels / totalPixels;
    const brownRatio = brownPixels / totalPixels;
    const yellowRatio = yellowPixels / totalPixels;
    const greenRatio = greenPixels / totalPixels;

    // AI-like decision making based on color analysis
    if (redRatio > 0.1) {
      return {
        confidence: 87,
        recommendations: this.getLocalizedRecommendations('bacterial_blight', language),
        severity: 'high',
        treatment: this.getLocalizedTreatment('bacterial_blight', language),
        nextSteps: this.getLocalizedNextSteps('bacterial_blight', language)
      };
    } else if (brownRatio > 0.15) {
      return {
        confidence: 92,
        recommendations: this.getLocalizedRecommendations('leaf_spot', language),
        severity: 'medium',
        treatment: this.getLocalizedTreatment('leaf_spot', language),
        nextSteps: this.getLocalizedNextSteps('leaf_spot', language)
      };
    } else if (yellowRatio > 0.2) {
      return {
        confidence: 78,
        recommendations: this.getLocalizedRecommendations('aphid', language),
        severity: 'medium',
        treatment: this.getLocalizedTreatment('aphid', language),
        nextSteps: this.getLocalizedNextSteps('aphid', language)
      };
    } else if (greenRatio > 0.6) {
      return {
        confidence: 96,
        recommendations: this.getLocalizedRecommendations('healthy', language),
        severity: 'low',
        treatment: this.getLocalizedTreatment('healthy', language),
        nextSteps: this.getLocalizedNextSteps('healthy', language)
      };
    }

    return this.getFallbackAnalysis('', language);
  }

  private getFallbackAnalysis(imageBase64: string, language: string): AIAnalysisResult {
    return {
      confidence: 75,
      recommendations: this.getLocalizedRecommendations('general', language),
      severity: 'medium',
      treatment: this.getLocalizedTreatment('general', language),
      nextSteps: this.getLocalizedNextSteps('general', language)
    };
  }

  // 2. CROP RECOMMENDATION SYSTEM
  async getCropRecommendations(
    location: string,
    soilType: string,
    season: string,
    farmSize: number,
    budget: number
  ): Promise<CropRecommendation[]> {
    try {
      if (this.apiKey) {
        return await this.getAICropRecommendations(location, soilType, season, farmSize, budget);
      }
      return this.getLocalCropRecommendations(location, soilType, season, farmSize, budget);
    } catch (error) {
      console.error('Crop recommendation error:', error);
      return this.getDefaultCropRecommendations();
    }
  }

  private async getAICropRecommendations(
    location: string,
    soilType: string,
    season: string,
    farmSize: number,
    budget: number
  ): Promise<CropRecommendation[]> {
    const prompt = `As an agricultural AI expert, recommend the best 5 crops for:
    Location: ${location}
    Soil Type: ${soilType}
    Season: ${season}
    Farm Size: ${farmSize} acres
    Budget: ₹${budget}
    
    For each crop, provide: name, variety, sowing date, expected yield, profitability score (1-10), risk level, and reasons. Format as JSON array.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  }

  private getLocalCropRecommendations(
    location: string,
    soilType: string,
    season: string,
    farmSize: number,
    budget: number
  ): CropRecommendation[] {
    // AI-like logic for crop recommendations
    const recommendations: CropRecommendation[] = [];
    
    // Season-based recommendations
    if (season.toLowerCase().includes('kharif') || season.toLowerCase().includes('monsoon')) {
      recommendations.push({
        cropName: 'Paddy',
        variety: 'BPT 5204 (Sona Masuri)',
        sowingDate: 'June 15 - July 15',
        expectedYield: '45-50 quintals/acre',
        profitability: 8,
        riskLevel: 'low',
        reasons: ['High demand', 'Suitable for monsoon', 'Good market price', 'Government support']
      });
    }

    if (season.toLowerCase().includes('rabi') || season.toLowerCase().includes('winter')) {
      recommendations.push({
        cropName: 'Wheat',
        variety: 'HD 2967',
        sowingDate: 'November 15 - December 15',
        expectedYield: '35-40 quintals/acre',
        profitability: 7,
        riskLevel: 'low',
        reasons: ['Stable market', 'Winter suitable', 'MSP available', 'Low water requirement']
      });
    }

    // Budget-based recommendations
    if (budget > 50000) {
      recommendations.push({
        cropName: 'Tomato',
        variety: 'Arka Rakshak',
        sowingDate: 'Year round (protected cultivation)',
        expectedYield: '400-500 quintals/acre',
        profitability: 9,
        riskLevel: 'medium',
        reasons: ['High returns', 'Year-round cultivation', 'Good export potential', 'Value addition possible']
      });
    }

    return recommendations.slice(0, 5);
  }

  private getDefaultCropRecommendations(): CropRecommendation[] {
    return [
      {
        cropName: 'Paddy',
        variety: 'BPT 5204',
        sowingDate: 'June-July',
        expectedYield: '45 quintals/acre',
        profitability: 8,
        riskLevel: 'low',
        reasons: ['Staple crop', 'Government support', 'Reliable market']
      }
    ];
  }

  // 3. WEATHER-BASED FARMING ADVICE
  async getWeatherBasedAdvice(weatherData: any, crops: string[]): Promise<string[]> {
    const advice: string[] = [];
    
    // AI logic for weather-based recommendations
    if (weatherData.rainfall > 50) {
      advice.push('Heavy rainfall expected. Ensure proper drainage in fields.');
      advice.push('Postpone fertilizer application until rain stops.');
      advice.push('Check for fungal diseases in crops.');
    }
    
    if (weatherData.temperature > 35) {
      advice.push('High temperature alert. Increase irrigation frequency.');
      advice.push('Provide shade for sensitive crops.');
      advice.push('Harvest mature crops before heat stress.');
    }
    
    if (weatherData.humidity > 80) {
      advice.push('High humidity may cause fungal diseases. Apply preventive fungicides.');
      advice.push('Improve air circulation in crop canopy.');
    }

    return advice;
  }

  // 4. MARKET PRICE PREDICTION
  async predictMarketPrices(crop: string, location: string, days: number = 7): Promise<any[]> {
    // Simulate AI-based price prediction
    const basePrice = this.getBasePrice(crop);
    const predictions = [];
    
    for (let i = 1; i <= days; i++) {
      const variation = (Math.random() - 0.5) * 0.1; // ±10% variation
      const predictedPrice = basePrice * (1 + variation);
      
      predictions.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: Math.round(predictedPrice),
        confidence: Math.round(85 + Math.random() * 10), // 85-95% confidence
        trend: variation > 0 ? 'up' : 'down'
      });
    }
    
    return predictions;
  }

  private getBasePrice(crop: string): number {
    const basePrices: { [key: string]: number } = {
      'paddy': 2700,
      'wheat': 2100,
      'tomato': 45,
      'onion': 35,
      'potato': 25,
      'corn': 1800
    };
    
    return basePrices[crop.toLowerCase()] || 2000;
  }

  // 5. SMART IRRIGATION RECOMMENDATIONS
  async getIrrigationAdvice(
    soilMoisture: number,
    weather: any,
    cropStage: string,
    cropType: string
  ): Promise<{
    shouldIrrigate: boolean;
    waterAmount: string;
    timing: string;
    reason: string;
  }> {
    let shouldIrrigate = false;
    let waterAmount = '0 mm';
    let timing = 'Not needed';
    let reason = '';

    // AI logic for irrigation decisions
    if (soilMoisture < 30) {
      shouldIrrigate = true;
      waterAmount = '25-30 mm';
      timing = 'Early morning (6-8 AM)';
      reason = 'Soil moisture is below optimal level';
    } else if (weather.temperature > 35 && soilMoisture < 50) {
      shouldIrrigate = true;
      waterAmount = '15-20 mm';
      timing = 'Evening (6-8 PM)';
      reason = 'High temperature stress prevention';
    } else if (cropStage === 'flowering' && soilMoisture < 60) {
      shouldIrrigate = true;
      waterAmount = '20-25 mm';
      timing = 'Early morning';
      reason = 'Critical flowering stage requires adequate moisture';
    } else {
      reason = 'Soil moisture is adequate';
    }

    return { shouldIrrigate, waterAmount, timing, reason };
  }

  // 6. FERTILIZER RECOMMENDATIONS
  async getFertilizerRecommendations(
    soilTestResults: any,
    cropType: string,
    cropStage: string,
    targetYield: number
  ): Promise<{
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    micronutrients: string[];
    applicationSchedule: string[];
    organicAlternatives: string[];
  }> {
    // AI-based fertilizer calculation
    const baseNPK = this.getBaseNPK(cropType);
    const stageMultiplier = this.getStageMultiplier(cropStage);
    const yieldMultiplier = targetYield / 40; // Assuming 40 quintals as base yield

    return {
      nitrogen: Math.round(baseNPK.N * stageMultiplier * yieldMultiplier),
      phosphorus: Math.round(baseNPK.P * stageMultiplier * yieldMultiplier),
      potassium: Math.round(baseNPK.K * stageMultiplier * yieldMultiplier),
      micronutrients: ['Zinc Sulphate', 'Iron Sulphate', 'Boron'],
      applicationSchedule: [
        'Basal: 50% N, 100% P, 50% K',
        '30 days: 25% N',
        '60 days: 25% N, 50% K'
      ],
      organicAlternatives: ['Vermicompost', 'Neem cake', 'Bone meal', 'Wood ash']
    };
  }

  private getBaseNPK(cropType: string): { N: number; P: number; K: number } {
    const npkValues: { [key: string]: { N: number; P: number; K: number } } = {
      'paddy': { N: 120, P: 60, K: 40 },
      'wheat': { N: 120, P: 60, K: 40 },
      'tomato': { N: 200, P: 100, K: 150 },
      'onion': { N: 100, P: 50, K: 50 },
      'potato': { N: 180, P: 80, K: 100 }
    };
    
    return npkValues[cropType.toLowerCase()] || { N: 100, P: 50, K: 50 };
  }

  private getStageMultiplier(stage: string): number {
    const multipliers: { [key: string]: number } = {
      'seedling': 0.3,
      'vegetative': 0.8,
      'flowering': 1.2,
      'fruiting': 1.0,
      'maturity': 0.2
    };
    
    return multipliers[stage.toLowerCase()] || 1.0;
  }

  // Language support methods
  private getLanguageInstructions(language: string): string {
    const instructions: { [key: string]: string } = {
      'en': 'Respond in English.',
      'hi': 'Respond in Hindi (हिंदी में जवाब दें).',
      'te': 'Respond in Telugu (తెలుగులో సమాధానం ఇవ్వండి).',
      'pa': 'Respond in Punjabi (ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ).',
      'ta': 'Respond in Tamil (தமிழில் பதிலளிக்கவும்).',
      'bn': 'Respond in Bengali (বাংলায় উত্তর দিন).',
      'gu': 'Respond in Gujarati (ગુજરાતીમાં જવાબ આપો).',
      'mr': 'Respond in Marathi (मराठीत उत्तर द्या).',
      'kn': 'Respond in Kannada (ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ).',
      'ml': 'Respond in Malayalam (മലയാളത്തിൽ ഉത്തരം നൽകുക).'
    };
    return instructions[language] || instructions['en'];
  }

  private getLocalizedRecommendations(diseaseType: string, language: string): string[] {
    const recommendations: { [key: string]: { [key: string]: string[] } } = {
      'bacterial_blight': {
        'en': ['Apply copper-based fungicide', 'Improve air circulation', 'Remove affected leaves'],
        'hi': ['तांबा आधारित कवकनाशी लगाएं', 'हवा का संचार बेहतर बनाएं', 'प्रभावित पत्तियों को हटाएं'],
        'te': ['రాగి ఆధారిత శిలీంధ్రనాశకం వేయండి', 'గాలి ప్రసరణను మెరుగుపరచండి', 'ప్రభావిత ఆకులను తొలగించండి'],
        'ta': ['செம்பு அடிப்படையிலான பூஞ்சைக் கொல்லியைப் பயன்படுத்துங்கள்', 'காற்று சுழற்சியை மேம்படுத்துங்கள்', 'பாதிக்கப்பட்ட இலைகளை அகற்றுங்கள்']
      },
      'leaf_spot': {
        'en': ['Apply Mancozeb fungicide', 'Improve plant spacing', 'Remove infected debris'],
        'hi': ['मैंकोजेब कवकनाशी लगाएं', 'पौधों के बीच दूरी बढ़ाएं', 'संक्रमित मलबा हटाएं'],
        'te': ['మాంకోజెబ్ శిలీంధ్రనాশకం వేయండి', 'మొక్కల మధ్య దూరం పెంచండి', 'సంక్రమిత వ్యర్థాలను తొలగించండి'],
        'ta': ['மான்கோசெப் பூஞ்சைக் கொல்லியைப் பயன்படுத்துங்கள்', 'தாவர இடைவெளியை மேம்படுத்துங்கள்', 'பாதிக்கப்பட்ட குப்பைகளை அகற்றுங்கள்']
      },
      'aphid': {
        'en': ['Apply neem oil', 'Use yellow sticky traps', 'Introduce beneficial insects'],
        'hi': ['नीम का तेल लगाएं', 'पीले चिपचिपे जाल का उपयोग करें', 'लाभकारी कीड़े लाएं'],
        'te': ['వేప నూనె వేయండి', 'పసుపు అంటుకునే ఉచ్చులు వాడండి', 'ప్రయోజనకరమైన కీటకాలను తీసుకురండి'],
        'ta': ['வேப்ப எண்ணெயைப் பயன்படுத்துங்கள்', 'மஞ்சள் ஒட்டும் பொறிகளைப் பயன்படுத்துங்கள்', 'நன்மை செய்யும் பூச்சிகளை அறிமுகப்படுத்துங்கள்']
      },
      'healthy': {
        'en': ['Continue current care', 'Maintain nutrition', 'Regular monitoring'],
        'hi': ['वर्तमान देखभाल जारी रखें', 'पोषण बनाए रखें', 'नियमित निगरानी करें'],
        'te': ['ప్రస్తుత సంరక్షణ కొనసాగించండి', 'పోషణను కొనసాగించండి', 'క్రమం తప్పకుండా పర్యవేక్షించండి'],
        'ta': ['தற்போதைய பராமரிப்பைத் தொடருங்கள்', 'ஊட்டச்சத்தை பராமரிக்கவும்', 'வழக்கமான கண்காணிப்பு']
      },
      'general': {
        'en': ['Monitor plant closely', 'Ensure proper watering', 'Check for pests regularly'],
        'hi': ['पौधे की बारीकी से निगरानी करें', 'उचित पानी सुनिश्चित करें', 'नियमित रूप से कीटों की जांच करें'],
        'te': ['మొక్కను దగ్గరగా పర్యవేక్షించండి', 'సరైన నీటిపారుదల నిర్ధారించండి', 'క్రమం తప్పకుండా కీటకాలను తనిఖీ చేయండి'],
        'ta': ['தாவரத்தை நெருக்கமாக கண்காணிக்கவும்', 'சரியான நீர்ப்பாசனத்தை உறுதி செய்யுங்கள்', 'வழக்கமாக பூச்சிகளை சரிபார்க்கவும்']
      }
    };
    
    return recommendations[diseaseType]?.[language] || recommendations[diseaseType]?.['en'] || recommendations['general']['en'];
  }

  private getLocalizedTreatment(diseaseType: string, language: string): string {
    const treatments: { [key: string]: { [key: string]: string } } = {
      'bacterial_blight': {
        'en': 'Bacterial Blight detected. Apply Streptocycline 500ppm + Copper oxychloride 0.25%',
        'hi': 'बैक्टीरियल ब्लाइट का पता चला। स्ट्रेप्टोसाइक्लिन 500ppm + कॉपर ऑक्सीक्लोराइड 0.25% लगाएं',
        'te': 'బ్యాక్టీరియల్ బ్లైట్ గుర్తించబడింది. స్ట్రెప్టోసైక్లిన్ 500ppm + కాపర్ ఆక్సీక్లోరైడ్ 0.25% వేయండి',
        'ta': 'பாக்டீரியல் ப்ளைட் கண்டறியப்பட்டது. ஸ்ட்ரெப்டோசைக்ளின் 500ppm + காப்பர் ஆக்சிக்ளோரைடு 0.25% பயன்படுத்துங்கள்'
      },
      'leaf_spot': {
        'en': 'Leaf Spot Disease. Spray Mancozeb 0.25% or Carbendazim 0.1%',
        'hi': 'पत्ती धब्बा रोग। मैंकोजेब 0.25% या कार्बेंडाजिम 0.1% का छिड़काव करें',
        'te': 'ఆకు మచ్చ వ్యాధి. మాంకోజెబ్ 0.25% లేదా కార్బెండాజిమ్ 0.1% స్ప్రే చేయండి',
        'ta': 'இலை புள்ளி நோய். மான்கோசெப் 0.25% அல்லது கார்பெண்டாசிம் 0.1% தெளிக்கவும்'
      },
      'aphid': {
        'en': 'Aphid infestation detected. Spray Imidacloprid 0.05% or Neem oil 0.5%',
        'hi': 'एफिड संक्रमण का पता चला। इमिडाक्लोप्रिड 0.05% या नीम तेल 0.5% का छिड़काव करें',
        'te': 'అఫిడ్ సంక్రమణ గుర్తించబడింది. ఇమిడాక్లోప్రిడ్ 0.05% లేదా వేప నూనె 0.5% స్ప్రే చేయండి',
        'ta': 'அஃபிட் தொற்று கண்டறியப்பட்டது. இமிடாக்ளோப்ரிட் 0.05% அல்லது வேப்ப எண்ணெய் 0.5% தெளிக்கவும்'
      },
      'healthy': {
        'en': 'Plant appears healthy. Continue good agricultural practices.',
        'hi': 'पौधा स्वस्थ दिखता है। अच्छी कृषि पद्धतियों को जारी रखें।',
        'te': 'మొక్క ఆరోగ్యంగా కనిపిస్తుంది. మంచి వ్యవసాయ పద్ధతులను కొనసాగించండి.',
        'ta': 'தாவரம் ஆரோக்கியமாக தெரிகிறது. நல்ல விவசாய நடைமுறைகளைத் தொடருங்கள்.'
      },
      'general': {
        'en': 'General plant care recommended. Consult local agricultural expert if symptoms persist.',
        'hi': 'सामान्य पौधे की देखभाल की सिफारिश की जाती है। यदि लक्षण बने रहें तो स्थानीय कृषि विशेषज्ञ से सलाह लें।',
        'te': 'సాధారణ మొక్క సంరక్షణ సిఫార్సు చేయబడింది. లక్షణాలు కొనసాగితే స్థానిక వ్యవసాయ నిపుణుడిని సంప్రదించండి.',
        'ta': 'பொதுவான தாவர பராமரிப்பு பரிந்துரைக்கப்படுகிறது. அறிகுறிகள் தொடர்ந்தால் உள்ளூர் விவசாய நிபுணரை அணுகவும்.'
      }
    };
    
    return treatments[diseaseType]?.[language] || treatments[diseaseType]?.['en'] || treatments['general']['en'];
  }

  private getLocalizedNextSteps(diseaseType: string, language: string): string[] {
    const nextSteps: { [key: string]: { [key: string]: string[] } } = {
      'bacterial_blight': {
        'en': ['Monitor daily', 'Ensure proper drainage', 'Avoid overhead watering'],
        'hi': ['दैनिक निगरानी करें', 'उचित जल निकासी सुनिश्चित करें', 'ऊपरी पानी से बचें'],
        'te': ['ప్రతిరోజూ పర్యవేక్షించండి', 'సరైన నీటి నిష్కాసన నిర్ధారించండి', 'పైనుండి నీరు పోయడం మానండి'],
        'ta': ['தினமும் கண்காணிக்கவும்', 'சரியான வடிகால் உறுதி செய்யுங்கள்', 'மேல் நீர்ப்பாசனத்தைத் தவிர்க்கவும்']
      },
      'leaf_spot': {
        'en': ['Weekly monitoring', 'Maintain field hygiene', 'Balanced fertilization'],
        'hi': ['साप्ताहिक निगरानी', 'खेत की स्वच्छता बनाए रखें', 'संतुलित उर्वरीकरण'],
        'te': ['వారానికొకసారి పర్యవేక్షణ', 'పొలం పరిశుభ్రత కొనసాగించండి', 'సమతుల్య ఎరువులు'],
        'ta': ['வாராந்திர கண்காணிப்பு', 'வயல் சுகாதாரத்தை பராமரிக்கவும்', 'சமச்சீர் உரமிடுதல்']
      },
      'aphid': {
        'en': ['Check weekly', 'Monitor natural enemies', 'Avoid excessive nitrogen'],
        'hi': ['साप्ताहिक जांच करें', 'प्राकृतिक शत्रुओं की निगरानी करें', 'अत्यधिक नाइट्रोजन से बचें'],
        'te': ['వారానికొకసారి తనిఖీ చేయండి', 'సహజ శత్రువులను పర్యవేక్షించండి', 'అధిక నత్రజని మానండి'],
        'ta': ['வாரந்தோறும் சரிபார்க்கவும்', 'இயற்கை எதிரிகளை கண்காணிக்கவும்', 'அதிக நைட்ரஜனைத் தவிர்க்கவும்']
      },
      'healthy': {
        'en': ['Regular watering', 'Balanced fertilization', 'Preventive care'],
        'hi': ['नियमित पानी', 'संतुलित उर्वरीकरण', 'निवारक देखभाल'],
        'te': ['క్రమం తప్పకుండా నీరు', 'సమతుల్య ఎరువులు', 'నివారణ సంరక్షణ'],
        'ta': ['வழக்கமான நீர்ப்பாசனம்', 'சமச்சீர் உரமிடுதல்', 'தடுப்பு பராமரிப்பு']
      },
      'general': {
        'en': ['Daily observation', 'Maintain plant hygiene', 'Proper nutrition'],
        'hi': ['दैनिक अवलोकन', 'पौधे की स्वच्छता बनाए रखें', 'उचित पोषण'],
        'te': ['ప్రతిరోజూ పరిశీలన', 'మొక్క పరిశుభ్రత కొనసాగించండి', 'సరైన పోషణ'],
        'ta': ['தினசரி கண்காணிப்பு', 'தாவர சுகாதாரத்தை பராமரிக்கவும்', 'சரியான ஊட்டச்சத்து']
      }
    };
    
    return nextSteps[diseaseType]?.[language] || nextSteps[diseaseType]?.['en'] || nextSteps['general']['en'];
  }
}

export default AIService.getInstance();