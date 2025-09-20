import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Phone, CheckCircle, Clock, AlertCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SMSStatusProps {
  isVisible: boolean;
  onClose: () => void;
}

interface SMSLog {
  id: string;
  timestamp: Date;
  phoneNumber: string;
  message: string;
  type: string;
  status: 'sent' | 'pending' | 'failed';
}

const SMSNotificationStatus: React.FC<SMSStatusProps> = ({ isVisible, onClose }) => {
  const { t } = useLanguage();
  const [smsLogs, setSmsLogs] = useState<SMSLog[]>([]);
  const [totalSent, setTotalSent] = useState(0);

  useEffect(() => {
    // Listen for SMS logs from console
    const originalLog = console.log;
    console.log = (...args) => {
      originalLog(...args);
      
      // Capture SMS notifications
      if (args[0] && args[0].includes('📱 SMS Notification Sent')) {
        const newLog: SMSLog = {
          id: Date.now().toString(),
          timestamp: new Date(),
          phoneNumber: '8074341795',
          message: args[3] || 'SMS notification sent',
          type: args[1] || 'general',
          status: 'sent'
        };
        
        setSmsLogs(prev => [newLog, ...prev.slice(0, 19)]); // Keep last 20
        setTotalSent(prev => prev + 1);
      }
    };

    return () => {
      console.log = originalLog;
    };
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'weather': return '🌤️';
      case 'price': return '💰';
      case 'scheme': return '🏛️';
      case 'loan': return '🏦';
      case 'pest': return '🐛';
      default: return '📱';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* SMS Status Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-4 bg-white rounded-3xl shadow-2xl z-50 flex flex-col max-w-md mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-green-500 rounded-t-3xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">SMS Notifications</h2>
                  <p className="text-sm text-blue-100">Live SMS Status</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Stats */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{totalSent}</div>
                  <div className="text-xs text-gray-600">Total Sent</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">8074341795</div>
                  <div className="text-xs text-gray-600">Target Number</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{smsLogs.length}</div>
                  <div className="text-xs text-gray-600">Recent Logs</div>
                </div>
              </div>
            </div>

            {/* SMS Logs */}
            <div className="flex-1 overflow-y-auto p-4">
              {smsLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Phone size={48} className="mb-4 opacity-50" />
                  <p className="text-center">No SMS sent yet</p>
                  <p className="text-sm text-center mt-2">SMS notifications will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {smsLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{getTypeIcon(log.type)}</div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Phone size={14} className="text-gray-500" />
                              <span className="text-sm font-medium text-gray-900">
                                {log.phoneNumber}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                              {log.status === 'sent' && <CheckCircle size={12} className="inline mr-1" />}
                              {log.status === 'pending' && <Clock size={12} className="inline mr-1" />}
                              {log.status === 'failed' && <AlertCircle size={12} className="inline mr-1" />}
                              {log.status}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                            {log.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 capitalize">
                              {log.type} notification
                            </span>
                            <span className="text-xs text-gray-500">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>SMS notifications are active</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SMSNotificationStatus;