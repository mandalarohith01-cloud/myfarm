import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';

// Service to handle different types of notifications
export class NotificationService {
  private static instance: NotificationService;
  private addNotification: any;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setNotificationHandler(addNotification: any) {
    this.addNotification = addNotification;
  }

  // Weather notifications
  sendWeatherAlert(message: string, severity: 'low' | 'medium' | 'high' = 'medium') {
    if (this.addNotification) {
      this.addNotification({
        type: 'weather',
        title: 'Weather Alert',
        message,
        priority: severity,
        data: { timestamp: new Date() }
      });
    }
  }

  // Price update notifications
  sendPriceUpdate(crop: string, oldPrice: number, newPrice: number, market: string) {
    const change = newPrice - oldPrice;
    const changePercent = ((change / oldPrice) * 100).toFixed(1);
    const isIncrease = change > 0;
    
    if (this.addNotification) {
      this.addNotification({
        type: 'price',
        title: 'Price Update',
        message: `${crop} price ${isIncrease ? 'increased' : 'decreased'} by ₹${Math.abs(change)}/quintal (${changePercent}%) in ${market}`,
        priority: Math.abs(change) > 200 ? 'high' : 'medium',
        data: { crop, oldPrice, newPrice, market, change }
      });
    }
  }

  // Government scheme notifications
  sendSchemeNotification(schemeName: string, message: string, deadline?: string) {
    if (this.addNotification) {
      this.addNotification({
        type: 'scheme',
        title: 'New Government Scheme',
        message: `${schemeName}: ${message}`,
        priority: deadline ? 'high' : 'medium',
        data: { schemeName, deadline }
      });
    }
  }

  // Loan notifications
  sendLoanNotification(bankName: string, loanType: string, interestRate: string, message: string) {
    if (this.addNotification) {
      this.addNotification({
        type: 'loan',
        title: 'New Loan Offer',
        message: `${bankName}: ${loanType} at ${interestRate} - ${message}`,
        priority: 'low',
        data: { bankName, loanType, interestRate }
      });
    }
  }

  // Crop-specific notifications
  sendCropAlert(cropName: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    if (this.addNotification) {
      this.addNotification({
        type: 'weather', // Using weather type for crop alerts
        title: `${cropName} Alert`,
        message,
        priority,
        data: { cropName }
      });
    }
  }
}

// Hook to use notification service
export const useNotificationService = () => {
  const { addNotification } = useNotifications();
  const service = NotificationService.getInstance();
  
  React.useEffect(() => {
    service.setNotificationHandler(addNotification);
  }, [addNotification]);

  return service;
};