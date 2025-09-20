import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Cloud, TrendingUp, FileText, Banknote, Clock, AlertTriangle } from 'lucide-react';
import { useNotifications, Notification } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const { t } = useLanguage();

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'weather':
        return Cloud;
      case 'price':
        return TrendingUp;
      case 'scheme':
        return FileText;
      case 'loan':
        return Banknote;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'border-red-500 bg-red-50';
    if (priority === 'medium') return 'border-orange-500 bg-orange-50';
    
    switch (type) {
      case 'weather':
        return 'border-blue-500 bg-blue-50';
      case 'price':
        return 'border-green-500 bg-green-50';
      case 'scheme':
        return 'border-purple-500 bg-purple-50';
      case 'loan':
        return 'border-indigo-500 bg-indigo-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
          
          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-cream">
              <div className="flex items-center space-x-2">
                <Bell size={24} className="text-black" />
                <h2 className="text-xl font-bold text-black">{t('notifications')}</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} className="text-black" />
              </button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {t('markAllAsRead')}
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Bell size={48} className="mb-4 opacity-50" />
                  <p className="text-center">{t('noNotifications')}</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type);
                    const colorClass = getNotificationColor(notification.type, notification.priority);
                    
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border-l-4 ${colorClass} ${
                          !notification.isRead ? 'shadow-md' : 'opacity-75'
                        } cursor-pointer hover:shadow-lg transition-all`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${
                            notification.priority === 'high' ? 'bg-red-100' :
                            notification.priority === 'medium' ? 'bg-orange-100' :
                            'bg-blue-100'
                          }`}>
                            <Icon size={16} className={
                              notification.priority === 'high' ? 'text-red-600' :
                              notification.priority === 'medium' ? 'text-orange-600' :
                              'text-blue-600'
                            } />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-black text-sm truncate">
                                {notification.title}
                              </h4>
                              {notification.priority === 'high' && (
                                <AlertTriangle size={14} className="text-red-500 flex-shrink-0 ml-2" />
                              )}
                            </div>
                            
                            <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Clock size={12} />
                                <span>{formatTime(notification.timestamp)}</span>
                              </div>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(notification.id);
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1"
                              >
                                <X size={12} />
                              </button>
                            </div>
                            
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-4 right-4"></div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;