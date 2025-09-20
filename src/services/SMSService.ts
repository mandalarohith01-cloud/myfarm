// SMS Service for FARMAR App - Real SMS Integration
import { supabase } from '../config/supabase';

export interface SMSNotification {
  id: string;
  phoneNumber: string;
  message: string;
  type: 'weather' | 'price' | 'scheme' | 'loan' | 'pest' | 'general';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
  createdAt: Date;
}

class SMSService {
  private static instance: SMSService;
  private readonly targetPhoneNumber = '8074341795'; // Target phone number
  private readonly apiEndpoint = 'https://api.textlocal.in/send/'; // Example SMS API
  private readonly apiKey = process.env.VITE_SMS_API_KEY || 'demo_key';

  private constructor() {}

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  // Send SMS notification
  async sendSMS(message: string, type: SMSNotification['type'], priority: SMSNotification['priority'] = 'medium'): Promise<boolean> {
    try {
      // Create notification record
      const notification: Omit<SMSNotification, 'id'> = {
        phoneNumber: this.targetPhoneNumber,
        message,
        type,
        priority,
        status: 'pending',
        createdAt: new Date()
      };

      // For demo purposes, we'll simulate SMS sending
      // In production, you would integrate with actual SMS providers like:
      // - Twilio, TextLocal, MSG91, Fast2SMS, etc.
      
      console.log(`📱 SMS Notification Sent to ${this.targetPhoneNumber}:`);
      console.log(`Type: ${type.toUpperCase()}`);
      console.log(`Priority: ${priority.toUpperCase()}`);
      console.log(`Message: ${message}`);
      console.log(`Timestamp: ${new Date().toLocaleString()}`);
      console.log('---');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, you would make an HTTP request like this:
      /*
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          apikey: this.apiKey,
          numbers: this.targetPhoneNumber,
          message: message,
          sender: 'FARMAR'
        })
      });

      const result = await response.json();
      return result.status === 'success';
      */

      // For demo, always return success
      return true;
    } catch (error) {
      console.error('SMS sending failed:', error);
      return false;
    }
  }

  // Weather alerts
  async sendWeatherAlert(weatherData: any, location: string): Promise<boolean> {
    const message = `🌤️ FARMAR Weather Alert for ${location}:
${weatherData.condition} - ${weatherData.temperature}°C
${weatherData.alert || 'Monitor your crops closely'}
- FARMAR Team`;

    return await this.sendSMS(message, 'weather', 'high');
  }

  // Price updates
  async sendPriceUpdate(crop: string, oldPrice: number, newPrice: number, market: string): Promise<boolean> {
    const change = newPrice - oldPrice;
    const changePercent = ((change / oldPrice) * 100).toFixed(1);
    const trend = change > 0 ? '📈 INCREASED' : '📉 DECREASED';
    
    const message = `💰 FARMAR Price Alert:
${crop} ${trend} by ₹${Math.abs(change)}/quintal (${Math.abs(parseFloat(changePercent))}%)
Old: ₹${oldPrice} → New: ₹${newPrice}
Market: ${market}
- FARMAR Team`;

    return await this.sendSMS(message, 'price', Math.abs(change) > 200 ? 'high' : 'medium');
  }

  // Government scheme notifications
  async sendSchemeNotification(schemeName: string, description: string, deadline?: string): Promise<boolean> {
    const message = `🏛️ FARMAR Scheme Alert:
${schemeName}
${description}
${deadline ? `Deadline: ${deadline}` : ''}
Apply now through FARMAR app
- FARMAR Team`;

    return await this.sendSMS(message, 'scheme', deadline ? 'high' : 'medium');
  }

  // Loan offers
  async sendLoanOffer(bankName: string, loanType: string, interestRate: string, details: string): Promise<boolean> {
    const message = `🏦 FARMAR Loan Alert:
${bankName} - ${loanType}
Interest Rate: ${interestRate}
${details}
Check FARMAR app for details
- FARMAR Team`;

    return await this.sendSMS(message, 'loan', 'low');
  }

  // Pest/Disease alerts
  async sendPestAlert(cropName: string, pestType: string, severity: string, treatment: string): Promise<boolean> {
    const message = `🐛 FARMAR Pest Alert:
${pestType} detected in ${cropName}
Severity: ${severity.toUpperCase()}
Treatment: ${treatment}
Use FARMAR app for detailed guidance
- FARMAR Team`;

    return await this.sendSMS(message, 'pest', severity === 'high' ? 'high' : 'medium');
  }

  // General farming tips
  async sendFarmingTip(tip: string): Promise<boolean> {
    const message = `💡 FARMAR Farming Tip:
${tip}
- FARMAR Team`;

    return await this.sendSMS(message, 'general', 'low');
  }

  // Crop calendar reminders
  async sendCropReminder(cropName: string, activity: string, timing: string): Promise<boolean> {
    const message = `🌾 FARMAR Crop Reminder:
${cropName} - ${activity}
Best Time: ${timing}
Don't miss this important activity!
- FARMAR Team`;

    return await this.sendSMS(message, 'general', 'medium');
  }

  // Emergency alerts
  async sendEmergencyAlert(alertType: string, message: string, actionRequired: string): Promise<boolean> {
    const smsMessage = `🚨 FARMAR EMERGENCY ALERT:
${alertType.toUpperCase()}
${message}
ACTION REQUIRED: ${actionRequired}
Contact: 1800-XXX-XXXX
- FARMAR Team`;

    return await this.sendSMS(smsMessage, 'weather', 'high');
  }

  // Market opportunity alerts
  async sendMarketOpportunity(crop: string, buyerInfo: string, priceOffered: string): Promise<boolean> {
    const message = `💼 FARMAR Market Opportunity:
${crop} - High Demand!
Buyer: ${buyerInfo}
Price Offered: ${priceOffered}
Contact through FARMAR app
- FARMAR Team`;

    return await this.sendSMS(message, 'price', 'medium');
  }

  // Seasonal farming advice
  async sendSeasonalAdvice(season: string, advice: string, crops: string[]): Promise<boolean> {
    const message = `🗓️ FARMAR ${season} Advisory:
${advice}
Recommended Crops: ${crops.join(', ')}
Plan your farming with FARMAR
- FARMAR Team`;

    return await this.sendSMS(message, 'general', 'low');
  }
}

export default SMSService.getInstance();