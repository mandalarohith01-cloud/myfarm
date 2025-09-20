import { useEffect } from 'react';
import { useNotificationService } from '../services/NotificationService';

// Hook to simulate real-time notifications based on user's crops and location
export const useRealTimeNotifications = (userCrops: any[] = [], userLocation: string = 'Hyderabad') => {
  const notificationService = useNotificationService();

  useEffect(() => {
    // Simulate weather monitoring
    const weatherInterval = setInterval(() => {
      const weatherAlerts = [
        'Heavy rainfall expected in next 24 hours. Ensure proper drainage in fields.',
        'High winds forecasted. Secure young plants and temporary structures.',
        'Temperature drop expected. Protect sensitive crops from cold.',
        'Hailstorm warning issued. Cover crops if possible.',
        'Drought conditions detected. Plan water conservation measures.',
        'Pest activity high due to humid conditions. Monitor crops closely.',
      ];

      // 15% chance of weather alert every 2 minutes
      if (Math.random() < 0.15) {
        const alert = weatherAlerts[Math.floor(Math.random() * weatherAlerts.length)];
        notificationService.sendWeatherAlert(alert, 'high');
      }
    }, 120000); // Every 2 minutes

    // Simulate price monitoring for user's crops
    const priceInterval = setInterval(() => {
      if (userCrops.length > 0) {
        const randomCrop = userCrops[Math.floor(Math.random() * userCrops.length)];
        const basePrice = 2500; // Base price for simulation
        const oldPrice = basePrice + Math.floor(Math.random() * 500);
        const priceChange = (Math.random() - 0.5) * 400; // -200 to +200
        const newPrice = oldPrice + priceChange;

        // 10% chance of price update every 3 minutes
        if (Math.random() < 0.1) {
          notificationService.sendPriceUpdate(
            randomCrop.name || 'Paddy',
            oldPrice,
            newPrice,
            `${userLocation} APMC`
          );
        }
      }
    }, 180000); // Every 3 minutes

    // Simulate government scheme notifications
    const schemeInterval = setInterval(() => {
      const schemes = [
        {
          name: 'PM-KISAN Samman Nidhi',
          message: 'New installment of ₹2000 has been credited to eligible farmers',
        },
        {
          name: 'Pradhan Mantri Fasal Bima Yojana',
          message: 'Crop insurance enrollment deadline extended till month end',
          deadline: '30th of this month'
        },
        {
          name: 'Soil Health Card Scheme',
          message: 'Free soil testing camps organized in your district',
        },
        {
          name: 'Organic Farming Scheme',
          message: 'Subsidy increased to 50% for organic certification',
        },
      ];

      // 8% chance of scheme notification every 5 minutes
      if (Math.random() < 0.08) {
        const scheme = schemes[Math.floor(Math.random() * schemes.length)];
        notificationService.sendSchemeNotification(
          scheme.name,
          scheme.message,
          scheme.deadline
        );
      }
    }, 300000); // Every 5 minutes

    // Simulate loan offer notifications
    const loanInterval = setInterval(() => {
      const loanOffers = [
        {
          bank: 'State Bank of India',
          type: 'Crop Loan',
          rate: '7.0%',
          message: 'Special interest rate for Kharif season'
        },
        {
          bank: 'HDFC Bank',
          type: 'Farm Equipment Loan',
          rate: '8.5%',
          message: 'Quick approval within 48 hours'
        },
        {
          bank: 'ICICI Bank',
          type: 'Land Purchase Loan',
          rate: '9.2%',
          message: 'Up to 85% financing available'
        },
        {
          bank: 'Punjab National Bank',
          type: 'Dairy Loan',
          rate: '7.5%',
          message: 'Special scheme for dairy farmers'
        },
      ];

      // 5% chance of loan notification every 7 minutes
      if (Math.random() < 0.05) {
        const loan = loanOffers[Math.floor(Math.random() * loanOffers.length)];
        notificationService.sendLoanNotification(
          loan.bank,
          loan.type,
          loan.rate,
          loan.message
        );
      }
    }, 420000); // Every 7 minutes

    // Cleanup intervals on unmount
    return () => {
      clearInterval(weatherInterval);
      clearInterval(priceInterval);
      clearInterval(schemeInterval);
      clearInterval(loanInterval);
    };
  }, [userCrops, userLocation, notificationService]);
};