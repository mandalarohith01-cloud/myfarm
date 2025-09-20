import { useEffect } from 'react';
import SMSService from '../services/SMSService';

// Hook to send real-time SMS notifications to 8074341795
export const useRealTimeSMS = (userCrops: any[] = [], userLocation: string = 'Hyderabad') => {
  useEffect(() => {
    // Send welcome SMS when hook initializes
    const sendWelcomeSMS = async () => {
      await SMSService.sendSMS(
        `🌾 Welcome to FARMAR! Your smart farming companion is now active. You'll receive important farming alerts, weather updates, and market prices on this number. Happy Farming! - FARMAR Team`,
        'general',
        'medium'
      );
    };

    sendWelcomeSMS();

    // Weather monitoring with SMS alerts
    const weatherInterval = setInterval(async () => {
      const weatherAlerts = [
        {
          condition: 'Heavy Rainfall',
          temperature: 28,
          alert: 'Ensure proper drainage in fields. Protect crops from waterlogging.'
        },
        {
          condition: 'High Winds',
          temperature: 32,
          alert: 'Secure young plants and temporary structures. Check for crop damage.'
        },
        {
          condition: 'Temperature Drop',
          temperature: 18,
          alert: 'Protect sensitive crops from cold. Cover if necessary.'
        },
        {
          condition: 'Hailstorm Warning',
          temperature: 25,
          alert: 'URGENT: Cover crops immediately. Hailstorm expected in 2 hours.'
        },
        {
          condition: 'Drought Conditions',
          temperature: 38,
          alert: 'Water conservation critical. Plan irrigation carefully.'
        }
      ];

      // 20% chance of weather SMS every 3 minutes
      if (Math.random() < 0.2) {
        const weather = weatherAlerts[Math.floor(Math.random() * weatherAlerts.length)];
        await SMSService.sendWeatherAlert(weather, userLocation);
      }
    }, 180000); // Every 3 minutes

    // Price monitoring with SMS alerts
    const priceInterval = setInterval(async () => {
      if (userCrops.length > 0) {
        const crops = ['Paddy', 'Wheat', 'Tomato', 'Onion', 'Cotton', 'Sugarcane'];
        const markets = ['Hyderabad APMC', 'Warangal Market', 'Nizamabad Mandi'];
        
        const randomCrop = crops[Math.floor(Math.random() * crops.length)];
        const randomMarket = markets[Math.floor(Math.random() * markets.length)];
        const basePrice = 2500;
        const oldPrice = basePrice + Math.floor(Math.random() * 500);
        const priceChange = (Math.random() - 0.5) * 400; // -200 to +200
        const newPrice = oldPrice + priceChange;

        // 15% chance of price SMS every 4 minutes
        if (Math.random() < 0.15) {
          await SMSService.sendPriceUpdate(randomCrop, oldPrice, newPrice, randomMarket);
        }
      }
    }, 240000); // Every 4 minutes

    // Government scheme notifications
    const schemeInterval = setInterval(async () => {
      const schemes = [
        {
          name: 'PM-KISAN Samman Nidhi',
          description: 'New installment of ₹2000 credited to eligible farmers',
        },
        {
          name: 'Pradhan Mantri Fasal Bima Yojana',
          description: 'Crop insurance enrollment deadline extended',
          deadline: '30th March 2024'
        },
        {
          name: 'Soil Health Card Scheme',
          description: 'Free soil testing camps in your district',
        },
        {
          name: 'Organic Farming Promotion',
          description: 'Subsidy increased to 50% for organic certification',
        }
      ];

      // 10% chance of scheme SMS every 5 minutes
      if (Math.random() < 0.1) {
        const scheme = schemes[Math.floor(Math.random() * schemes.length)];
        await SMSService.sendSchemeNotification(
          scheme.name,
          scheme.description,
          scheme.deadline
        );
      }
    }, 300000); // Every 5 minutes

    // Loan offers
    const loanInterval = setInterval(async () => {
      const loanOffers = [
        {
          bank: 'State Bank of India',
          type: 'Crop Loan',
          rate: '7.0%',
          details: 'Special rate for Kharif season. Quick approval in 48 hours.'
        },
        {
          bank: 'HDFC Bank',
          type: 'Farm Equipment Loan',
          rate: '8.5%',
          details: 'Up to ₹25 lakhs for tractors and equipment.'
        },
        {
          bank: 'ICICI Bank',
          type: 'Land Purchase Loan',
          rate: '9.2%',
          details: 'Up to 85% financing for agricultural land.'
        }
      ];

      // 8% chance of loan SMS every 6 minutes
      if (Math.random() < 0.08) {
        const loan = loanOffers[Math.floor(Math.random() * loanOffers.length)];
        await SMSService.sendLoanOffer(loan.bank, loan.type, loan.rate, loan.details);
      }
    }, 360000); // Every 6 minutes

    // Pest and disease alerts
    const pestInterval = setInterval(async () => {
      const pestAlerts = [
        {
          crop: 'Paddy',
          pest: 'Stem Borer',
          severity: 'high',
          treatment: 'Apply Chlorantraniliprole 18.5% SC @ 3ml/10L water'
        },
        {
          crop: 'Tomato',
          pest: 'Late Blight',
          severity: 'medium',
          treatment: 'Spray Mancozeb 75% WP @ 25g/10L water'
        },
        {
          crop: 'Cotton',
          pest: 'Bollworm',
          severity: 'high',
          treatment: 'Use Bt cotton varieties and monitor regularly'
        }
      ];

      // 12% chance of pest SMS every 7 minutes
      if (Math.random() < 0.12) {
        const alert = pestAlerts[Math.floor(Math.random() * pestAlerts.length)];
        await SMSService.sendPestAlert(alert.crop, alert.pest, alert.severity, alert.treatment);
      }
    }, 420000); // Every 7 minutes

    // Farming tips and reminders
    const tipsInterval = setInterval(async () => {
      const farmingTips = [
        'Apply organic manure 15 days before sowing for better soil health',
        'Check soil moisture at 6 inches depth before irrigation',
        'Rotate crops every season to prevent soil nutrient depletion',
        'Use yellow sticky traps to monitor and control flying pests',
        'Maintain farm records for better planning and government benefits'
      ];

      const cropReminders = [
        {
          crop: 'Paddy',
          activity: 'First top dressing of Urea',
          timing: '21 days after transplanting'
        },
        {
          crop: 'Wheat',
          activity: 'Crown root initiation irrigation',
          timing: '20-25 days after sowing'
        },
        {
          crop: 'Tomato',
          activity: 'Pruning and staking',
          timing: '30 days after transplanting'
        }
      ];

      // 15% chance of tip SMS every 8 minutes
      if (Math.random() < 0.15) {
        if (Math.random() < 0.6) {
          // Send farming tip
          const tip = farmingTips[Math.floor(Math.random() * farmingTips.length)];
          await SMSService.sendFarmingTip(tip);
        } else {
          // Send crop reminder
          const reminder = cropReminders[Math.floor(Math.random() * cropReminders.length)];
          await SMSService.sendCropReminder(reminder.crop, reminder.activity, reminder.timing);
        }
      }
    }, 480000); // Every 8 minutes

    // Market opportunities
    const marketInterval = setInterval(async () => {
      const opportunities = [
        {
          crop: 'Organic Vegetables',
          buyer: 'Metro Cash & Carry',
          price: '₹50-80/kg premium rates'
        },
        {
          crop: 'Basmati Rice',
          buyer: 'Export Company',
          price: '₹4500-5000/quintal'
        },
        {
          crop: 'Fresh Fruits',
          buyer: 'BigBasket',
          price: 'Direct procurement at farm gate'
        }
      ];

      // 5% chance of market opportunity SMS every 10 minutes
      if (Math.random() < 0.05) {
        const opportunity = opportunities[Math.floor(Math.random() * opportunities.length)];
        await SMSService.sendMarketOpportunity(
          opportunity.crop,
          opportunity.buyer,
          opportunity.price
        );
      }
    }, 600000); // Every 10 minutes

    // Seasonal advice
    const seasonalInterval = setInterval(async () => {
      const currentMonth = new Date().getMonth();
      const seasonalAdvice = [
        {
          season: 'Kharif Preparation',
          advice: 'Prepare fields for monsoon crops. Check seed availability.',
          crops: ['Paddy', 'Cotton', 'Sugarcane', 'Maize']
        },
        {
          season: 'Rabi Planning',
          advice: 'Plan winter crops. Ensure irrigation facilities.',
          crops: ['Wheat', 'Mustard', 'Gram', 'Pea']
        },
        {
          season: 'Summer Management',
          advice: 'Focus on water conservation and summer vegetables.',
          crops: ['Watermelon', 'Cucumber', 'Fodder crops']
        }
      ];

      // 3% chance of seasonal advice SMS every 12 minutes
      if (Math.random() < 0.03) {
        const advice = seasonalAdvice[Math.floor(Math.random() * seasonalAdvice.length)];
        await SMSService.sendSeasonalAdvice(advice.season, advice.advice, advice.crops);
      }
    }, 720000); // Every 12 minutes

    // Cleanup intervals on unmount
    return () => {
      clearInterval(weatherInterval);
      clearInterval(priceInterval);
      clearInterval(schemeInterval);
      clearInterval(loanInterval);
      clearInterval(pestInterval);
      clearInterval(tipsInterval);
      clearInterval(marketInterval);
      clearInterval(seasonalInterval);
    };
  }, [userCrops, userLocation]);
};