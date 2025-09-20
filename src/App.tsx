import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AuthScreen from './screens/AuthScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import DashboardScreen from './screens/DashboardScreen';
import CropScreen from './screens/CropScreen';
import WeatherScreen from './screens/WeatherScreen';
import PestDetectionScreen from './screens/PestDetectionScreen';
import MarketScreen from './screens/MarketScreen';
import GovernmentSchemesScreen from './screens/GovernmentSchemesScreen';
import BankLoansScreen from './screens/BankLoansScreen';
import ProfileScreen from './screens/ProfileScreen';

export type Screen = 'registration' | 'dashboard' | 'crop' | 'weather' | 'pest' | 'market' | 'schemes' | 'loans' | 'profile';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('registration');

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show auth screen if user is not logged in
  if (!user) {
    return <AuthScreen />;
  }

  // Convert user data to match existing userProfile interface
  const userProfile = {
    firstName: user.firstName,
    lastName: user.lastName,
    mobile: user.mobile,
    isRegistered: true
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen onNavigate={navigateTo} userProfile={userProfile} />;
      case 'crop':
        return <CropScreen onBack={() => navigateTo('dashboard')} />;
      case 'weather':
        return <WeatherScreen onBack={() => navigateTo('dashboard')} />;
      case 'pest':
        return <PestDetectionScreen onBack={() => navigateTo('dashboard')} />;
      case 'market':
        return <MarketScreen onBack={() => navigateTo('dashboard')} />;
      case 'schemes':
        return <GovernmentSchemesScreen onBack={() => navigateTo('dashboard')} userProfile={userProfile} />;
      case 'loans':
        return <BankLoansScreen onBack={() => navigateTo('dashboard')} userProfile={userProfile} />;
      case 'profile':
        return <ProfileScreen onBack={() => navigateTo('dashboard')} />;
      default:
        return <DashboardScreen onNavigate={navigateTo} userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="max-w-md lg:max-w-lg xl:max-w-xl mx-auto relative">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </div>
    </div>
  );
};

function App() {

  return (
    <AuthProvider>
      <NotificationProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;