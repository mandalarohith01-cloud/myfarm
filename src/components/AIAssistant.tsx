import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Mic, MicOff, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AIService from '../services/AIService';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI farming assistant. I can help you with crop recommendations, pest identification, weather advice, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(message);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();
    
    // Get localized responses based on current language
    const getLocalizedResponse = (key: string) => {
      const responses: { [key: string]: { [lang: string]: string } } = {
        diseaseHelp: {
          en: `I can help you identify plant diseases! Here's what you can do:

🔍 **Disease Identification:**
- Take a clear photo of the affected plant
- Go to Pest Detection screen
- Upload or capture the image
- I'll analyze it and provide treatment recommendations

📋 **Common Signs to Look For:**
- Yellow or brown spots on leaves
- Wilting or drooping
- Unusual growth patterns
- Insect damage

Would you like me to guide you through the pest detection process?`,
          hi: `मैं पौधों की बीमारियों की पहचान में आपकी मदद कर सकता हूं! यहां बताया गया है कि आप क्या कर सकते हैं:

🔍 **रोग पहचान:**
- प्रभावित पौधे की स्पष्ट तस्वीर लें
- कीट पहचान स्क्रीन पर जाएं
- छवि अपलोड करें या कैप्चर करें
- मैं इसका विश्लेषण करूंगा और उपचार की सिफारिशें प्रदान करूंगा

📋 **देखने योग्य सामान्य संकेत:**
- पत्तियों पर पीले या भूरे धब्बे
- मुरझाना या झुकना
- असामान्य वृद्धि पैटर्न
- कीट क्षति

क्या आप चाहते हैं कि मैं आपको कीट पहचान प्रक्रिया के माध्यम से मार्गदर्शन करूं?`,
          te: `మొక్కల వ్యాధుల గుర్తింపులో నేను మీకు సహాయం చేయగలను! మీరు ఏమి చేయవచ్చో ఇక్కడ ఉంది:

🔍 **వ్యాధి గుర్తింపు:**
- ప్రభావిత మొక్క యొక్క స్పష్టమైన ఫోటో తీయండి
- కీటకాల గుర్తింపు స్క్రీన్‌కు వెళ్లండి
- చిత్రాన్ని అప్‌లోడ్ చేయండి లేదా క్యాప్చర్ చేయండి
- నేను దానిని విశ్లేషిస్తాను మరియు చికిత్స సిఫార్సులను అందిస్తాను

📋 **చూడవలసిన సాధారణ సంకేతాలు:**
- ఆకులపై పసుపు లేదా గోధుమ రంగు మచ్చలు
- వాడిపోవడం లేదా వంగిపోవడం
- అసాధారణ పెరుగుదల నమూనాలు
- కీటకాల నష్టం

కీటకాల గుర్తింపు ప్రక్రియ ద్వారా నేను మీకు మార్గదర్శనం చేయాలని మీరు అనుకుంటున్నారా?`,
          ta: `தாவர நோய்களை அடையாளம் காண நான் உங்களுக்கு உதவ முடியும்! நீங்கள் என்ன செய்யலாம் என்பது இங்கே:

🔍 **நோய் அடையாளம்:**
- பாதிக்கப்பட்ட தாவரத்தின் தெளிவான புகைப்படம் எடுக்கவும்
- பூச்சி கண்டறிதல் திரைக்கு செல்லவும்
- படத்தை பதிவேற்றவும் அல்லது கைப்பற்றவும்
- நான் அதை பகுப்பாய்வு செய்து சிகிச்சை பரிந்துரைகளை வழங்குவேன்

📋 **பார்க்க வேண்டிய பொதுவான அறிகுறிகள்:**
- இலைகளில் மஞ்சள் அல்லது பழுப்பு புள்ளிகள்
- வாடுதல் அல்லது தொங்குதல்
- அசாதாரண வளர்ச்சி முறைகள்
- பூச்சி சேதம்

பூச்சி கண்டறிதல் செயல்முறையின் மூலம் நான் உங்களுக்கு வழிகாட்ட வேண்டுமா?`
        },
        cropRecommendations: {
          en: `🌾 **AI Crop Recommendations for your area:**

Based on current conditions, here are the best crops for you:

1. **Paddy** (BPT 5204 - Sona Masuri)
   • Expected Yield: 45-50 quintals/acre
   • Profitability: 8/10
   • Risk Level: Low
   • Best Sowing: June 15 - July 15

2. **Tomato** (Arka Rakshak)
   • Expected Yield: 400-500 quintals/acre
   • Profitability: 9/10
   • Risk Level: Medium
   • Best Sowing: Year round (protected cultivation)

3. **Wheat** (HD 2967)
   • Expected Yield: 35-40 quintals/acre
   • Profitability: 7/10
   • Risk Level: Low
   • Best Sowing: November 15 - December 15

💡 These recommendations are based on your location, season, and current market conditions. Would you like detailed information about any specific crop?`,
          hi: `🌾 **आपके क्षेत्र के लिए AI फसल सिफारिशें:**

वर्तमान स्थितियों के आधार पर, यहां आपके लिए सबसे अच्छी फसलें हैं:

1. **धान** (BPT 5204 - सोना मसूरी)
   • अपेक्षित उपज: 45-50 क्विंटल/एकड़
   • लाभप्रदता: 8/10
   • जोखिम स्तर: कम
   • सर्वोत्तम बुआई: 15 जून - 15 जुलाई

2. **टमाटर** (अर्का रक्षक)
   • अपेक्षित उपज: 400-500 क्विंटल/एकड़
   • लाभप्रदता: 9/10
   • जोखिम स्तर: मध्यम
   • सर्वोत्तम बुआई: साल भर (संरक्षित खेती)

3. **गेहूं** (HD 2967)
   • अपेक्षित उपज: 35-40 क्विंटल/एकड़
   • लाभप्रदता: 7/10
   • जोखिम स्तर: कम
   • सर्वोत्तम बुआई: 15 नवंबर - 15 दिसंबर

💡 ये सिफारिशें आपके स्थान, मौसम और वर्तमान बाजार स्थितियों पर आधारित हैं। क्या आप किसी विशिष्ट फसल के बारे में विस्तृत जानकारी चाहते हैं?`,
          te: `🌾 **మీ ప్రాంతానికి AI పంట సిఫార్సులు:**

ప్రస్తుత పరిస్థితుల ఆధారంగా, మీకు ఉత్తమమైన పంటలు ఇవి:

1. **వరి** (BPT 5204 - సోనమసూరి)
   • అంచనా దిగుబడి: 45-50 క్వింటల్స్/ఎకరం
   • లాభదాయకత: 8/10
   • రిస్క్ లెవల్: తక్కువ
   • ఉత్తమ విత్తనం: జూన్ 15 - జూలై 15

2. **టమాటో** (అర్క రక్షక్)
   • అంచనా దిగుబడి: 400-500 క్వింటల్స్/ఎకరం
   • లాభదాయకత: 9/10
   • రిస్క్ లెవల్: మధ్యమ
   • ఉత్తమ విత్తనం: ఏడాది పొడవునా (రక్షిత సాగు)

3. **గోధుమ** (HD 2967)
   • అంచనా దిగుబడి: 35-40 క్వింటల్స్/ఎకరం
   • లాభదాయకత: 7/10
   • రిస్క్ లెవల్: తక్కువ
   • ఉత్తమ విత్తనం: నవంబర్ 15 - డిసెంబర్ 15

💡 ఈ సిఫార్సులు మీ స్థానం, సీజన్ మరియు ప్రస్తుత మార్కెట్ పరిస్థితుల ఆధారంగా ఉన్నాయి. మీరు ఏదైనా నిర్దిష్ట పంట గురించి వివరణాత్మక సమాచారం కావాలా?`,
          ta: `🌾 **உங்கள் பகுதிக்கான AI பயிர் பரிந்துரைகள்:**

தற்போதைய நிலைமைகளின் அடிப்படையில், உங்களுக்கான சிறந்த பயிர்கள் இவை:

1. **நெல்** (BPT 5204 - சோனமசூரி)
   • எதிர்பார்க்கப்படும் விளைச்சல்: 45-50 குவிண்டல்/ஏக்கர்
   • லாபகரத்தன்மை: 8/10
   • ஆபத்து நிலை: குறைவு
   • சிறந்த விதைப்பு: ஜூன் 15 - ஜூலை 15

2. **தக்காளி** (அர்க்க ரக்ஷக்)
   • எதிர்பார்க்கப்படும் விளைச்சல்: 400-500 குவிண்டல்/ஏக்கர்
   • லாபகரத்தன்மை: 9/10
   • ஆபத்து நிலை: நடுத்தர
   • சிறந்த விதைப்பு: ஆண்டு முழுவதும் (பாதுகாக்கப்பட்ட சாகுபடி)

3. **கோதுமை** (HD 2967)
   • எதிர்பார்க்கப்படும் விளைச்சல்: 35-40 குவிண்டல்/ஏக்கர்
   • லாபகரத்தன்மை: 7/10
   • ஆபத்து நிலை: குறைவு
   • சிறந்த விதைப்பு: நவம்பர் 15 - டிசம்பர் 15

💡 இந்த பரிந்துரைகள் உங்கள் இடம், பருவம் மற்றும் தற்போதைய சந்தை நிலைமைகளின் அடிப்படையில் அமைந்தவை. ஏதேனும் குறிப்பிட்ட பயிரைப் பற்றிய விரிவான தகவல் வேண்டுமா?`
        }
      };
      
      return responses[key]?.[language] || responses[key]?.['en'] || '';
    };

    if (message.includes('disease') || message.includes('pest') || message.includes('sick')) {
      return getLocalizedResponse('diseaseHelp');
    }

    if (message.includes('crop') || message.includes('recommend') || message.includes('plant')) {
      return getLocalizedResponse('cropRecommendations');
    }

    if (message.includes('weather') || message.includes('rain') || message.includes('temperature')) {
      return `🌤️ **Weather-Based Farming Advice:**

**Current Conditions Analysis:**
- Monitor weather alerts in the Weather section
- Heavy rain expected: Ensure proper drainage
- High temperatures: Increase irrigation frequency
- High humidity: Watch for fungal diseases

**Smart Recommendations:**
- Check weather forecasts daily
- Plan field activities based on weather
- Protect crops during extreme weather
- Use weather data for irrigation scheduling

Would you like specific advice for your current crops?`;
    }

    if (message.includes('fertilizer') || message.includes('nutrition') || message.includes('npk')) {
      return `🧪 **AI Fertilizer Recommendations:**

**General Guidelines:**
- Soil testing is crucial for accurate recommendations
- Apply fertilizers based on crop growth stage
- Consider organic alternatives for soil health

**NPK Application Schedule:**
1. **Basal Application:** 50% N, 100% P, 50% K at sowing
2. **First Top Dressing:** 25% N at 30 days
3. **Second Top Dressing:** 25% N, 50% K at 60 days

**Organic Alternatives:**
- Vermicompost for slow-release nutrients
- Neem cake for pest control + nutrition
- Bone meal for phosphorus
- Wood ash for potassium

Need specific recommendations for your crop? Tell me your crop type and growth stage!`;
    }

    if (message.includes('market') || message.includes('price') || message.includes('sell')) {
      return `📈 **Market Intelligence & Price Predictions:**

**Current Market Trends:**
- Paddy: ₹2,650-2,850/quintal (Stable)
- Tomato: ₹40-45/kg (Rising trend)
- Onion: ₹30-35/kg (Seasonal variation)

**AI Price Predictions:**
- Prices likely to increase by 5-8% in next 15 days
- Festival season driving demand
- Weather conditions affecting supply

**Selling Tips:**
- Monitor daily price updates in Market section
- Consider value addition for better prices
- Time your harvest based on price predictions
- Connect with multiple buyers for best rates

Check the Market section for real-time prices and trends!`;
    }

    if (message.includes('irrigation') || message.includes('water') || message.includes('watering')) {
      return `💧 **Smart Irrigation Guidance:**

**AI-Based Watering Schedule:**
- **Morning (6-8 AM):** Best time for irrigation
- **Evening (6-8 PM):** Alternative for hot weather
- **Avoid midday:** High evaporation losses

**Soil Moisture Guidelines:**
- Seedling stage: Keep soil moist (60-70%)
- Vegetative stage: Moderate moisture (50-60%)
- Flowering stage: Adequate moisture (60-70%)
- Fruiting stage: Consistent moisture (55-65%)

**Water-Saving Tips:**
- Use drip irrigation for efficiency
- Mulching to reduce evaporation
- Check soil moisture before watering
- Consider weather forecast

Would you like specific irrigation advice for your crops?`;
    }

    // Default response
    const defaultResponses: { [lang: string]: string } = {
      en: `I'm here to help with all your farming needs! I can assist you with:

🌱 **Crop Management:** Recommendations, planting schedules, variety selection
🐛 **Pest & Disease:** Identification, treatment, prevention
🌤️ **Weather Advice:** Weather-based farming decisions
💧 **Irrigation:** Smart watering schedules and tips
🧪 **Fertilizers:** NPK recommendations, organic alternatives
📈 **Market Intelligence:** Price predictions, selling strategies

Just ask me anything about farming, or use the quick action buttons below!`,
      hi: `मैं आपकी सभी कृषि आवश्यकताओं में मदद के लिए यहाँ हूँ! मैं आपकी सहायता कर सकता हूँ:

🌱 **फसल प्रबंधन:** सिफारिशें, रोपण कार्यक्रम, किस्म चयन
🐛 **कीट और रोग:** पहचान, उपचार, रोकथाम
🌤️ **मौसम सलाह:** मौसम आधारित कृषि निर्णय
💧 **सिंचाई:** स्मार्ट पानी देने का कार्यक्रम और सुझाव
🧪 **उर्वरक:** NPK सिफारिशें, जैविक विकल्प
📈 **बाजार बुद्धिमत्ता:** मूल्य भविष्यवाणी, बिक्री रणनीति

खेती के बारे में मुझसे कुछ भी पूछें, या नीचे दिए गए त्वरित कार्य बटन का उपयोग करें!`,
      te: `మీ అన్ని వ్యవసాయ అవసరాలతో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను! నేను మీకు సహాయం చేయగలను:

🌱 **పంట నిర్వహణ:** సిఫార్సులు, నాటడం షెడ్యూల్స్, రకం ఎంపిక
🐛 **కీటకాలు & వ్యాధులు:** గుర్తింపు, చికిత్స, నివారణ
🌤️ **వాతావరణ సలహా:** వాతావరణ ఆధారిత వ్యవసాయ నిర్ణయాలు
💧 **నీటిపారుదల:** స్మార్ట్ నీరు పెట్టే షెడ్యూల్స్ మరియు చిట్కాలు
🧪 **ఎరువులు:** NPK సిఫార్సులు, సేంద్రీయ ప్రత్యామ్నాయాలు
📈 **మార్కెట్ ఇంటెలిజెన్స్:** ధర అంచనాలు, అమ్మకపు వ్యూహాలు

వ్యవసాయం గురించి నన్ను ఏదైనా అడగండి, లేదా క్రింద ఉన్న త్వరిత చర్య బటన్లను ఉపయోగించండి!`,
      ta: `உங்கள் அனைத்து விவசாய தேவைகளுக்கும் உதவ நான் இங்கே இருக்கிறேன்! நான் உங்களுக்கு உதவ முடியும்:

🌱 **பயிர் மேலாண்மை:** பரிந்துரைகள், நடவு அட்டவணைகள், வகை தேர்வு
🐛 **பூச்சி & நோய்:** அடையாளம், சிகிச்சை, தடுப்பு
🌤️ **வானிலை ஆலோசனை:** வானிலை அடிப்படையிலான விவசாய முடிவுகள்
💧 **நீர்ப்பாசனம:** ஸ்மார்ட் நீர் அட்டவணைகள் மற்றும் குறிப்புகள்
🧪 **உரங்கள்:** NPK பரிந்துரைகள், இயற்கை மாற்றுகள்
📈 **சந்தை நுண்ணறிவு:** விலை கணிப்புகள், விற்பனை உத்திகள்

விவசாயத்தைப் பற்றி என்னிடம் எதையும் கேளுங்கள், அல்லது கீழே உள்ள விரைவு செயல் பொத்தான்களைப் பயன்படுத்துங்கள்!`
    };
    
    return defaultResponses[language] || defaultResponses['en'];
  };

  const { language } = useLanguage();

  const quickActions = [
    { label: t('analyzePlantDisease'), action: 'disease' },
    { label: t('cropRecommendations'), action: 'crops' },
    { label: t('weatherAdvice'), action: 'weather' },
    { label: t('fertilizerGuide'), action: 'fertilizer' },
    { label: t('marketPrices'), action: 'market' },
    { label: t('irrigationTips'), action: 'irrigation' }
  ];

  const handleQuickAction = (action: string) => {
    const actionMessages: { [key: string]: { [lang: string]: string } } = {
      'disease': {
        en: 'How can I identify and treat plant diseases?',
        hi: 'मैं पौधों की बीमारियों की पहचान और इलाज कैसे कर सकता हूं?',
        te: 'మొక్కల వ్యాధులను ఎలా గుర్తించి చికిత్స చేయాలి?',
        ta: 'தாவர நோய்களை எவ்வாறு அடையாளம் கண்டு சிகிச்சையளிப்பது?'
      },
      'crops': {
        en: 'What crops should I plant this season?',
        hi: 'इस मौसम में मुझे कौन सी फसलें लगानी चाहिए?',
        te: 'ఈ సీజన్‌లో నేను ఏ పంటలు నాటాలి?',
        ta: 'இந்த பருவத்தில் நான் என்ன பயிர்களை நடவேண்டும்?'
      },
      'weather': {
        en: 'Give me weather-based farming advice',
        hi: 'मुझे मौसम आधारित कृषि सलाह दें',
        te: 'నాకు వాతావరణ ఆధారిత వ్యవసాయ సలహా ఇవ్వండి',
        ta: 'எனக்கு வானிலை அடிப்படையிலான விவசாய ஆலோசனை கொடுங்கள்'
      },
      'fertilizer': {
        en: 'What fertilizers should I use for my crops?',
        hi: 'मुझे अपनी फसलों के लिए कौन से उर्वरक का उपयोग करना चाहिए?',
        te: 'నా పంటలకు ఏ ఎరువులు వాడాలి?',
        ta: 'என் பயிர்களுக்கு என்ன உரங்களைப் பயன்படுத்த வேண்டும்?'
      },
      'market': {
        en: 'Show me current market prices and trends',
        hi: 'मुझे वर्तमान बाजार की कीमतें और रुझान दिखाएं',
        te: 'ప్రస్తుత మార్కెట్ ధరలు మరియు ట్రెండ్‌లను చూపించండి',
        ta: 'தற்போதைய சந்தை விலைகள் மற்றும் போக்குகளைக் காட்டுங்கள்'
      },
      'irrigation': {
        en: 'Help me with irrigation scheduling',
        hi: 'सिंचाई कार्यक्रम में मेरी मदद करें',
        te: 'నీటిపారుదల షెడ్యూలింగ్‌లో నాకు సహాయం చేయండి',
        ta: 'நீர்ப்பாசன திட்டமிடலில் எனக்கு உதவுங்கள்'
      }
    };

    const message = actionMessages[action]?.[language] || actionMessages[action]?.['en'] || 'Help me with farming';
    handleSendMessage(message);
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* AI Assistant Panel */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-3xl z-50 flex flex-col max-w-md mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-green-500 to-blue-500 rounded-t-3xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Bot size={24} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{t('aiFarmAssistant')}</h2>
                  <p className="text-sm text-green-100">
                    {language === 'hi' ? 'उन्नत AI द्वारा संचालित' :
                     language === 'te' ? 'అధునాతన AI ద్వారా శక్తివంతం' :
                     language === 'ta' ? 'மேம்பட்ட AI ஆல் இயக்கப்படுகிறது' :
                     'Powered by Advanced AI'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-black'
                  }`}>
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles size={16} className="text-blue-500" />
                        <span className="text-xs font-semibold text-blue-500">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={16} className="text-blue-500" />
                      <span className="text-xs font-semibold text-blue-500">AI Assistant</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-600 mb-2">Quick Actions:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.action}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickAction(action.action)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                    placeholder={t('askMeAnything')}
                    className="w-full px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={startVoiceRecognition}
                  disabled={isListening}
                  className={`p-3 rounded-full transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AIAssistant;