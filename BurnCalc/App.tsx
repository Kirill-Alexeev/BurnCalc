import { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { runMigrations } from './src/db/migrations';
import Navigation from './src/navigation/RootNavigator';
import { useNotificationNavigation } from './src/navigation/navigationSetup';
import { requestNotificationPermissions } from './src/services/notificationService';

// Компонент-обертка для инициализации уведомлений
function NotificationWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initNotifications = async () => {
      await requestNotificationPermissions();
    };
    initNotifications();
  }, []);

  // Инициализируем навигацию по уведомлениям
  useNotificationNavigation();

  return <>{children}</>;
}

export default function App() {
  useEffect(() => {
    runMigrations();
  }, []);

  return (
    <AuthProvider>
      <NotificationWrapper>
        <Navigation />
      </NotificationWrapper>
    </AuthProvider>
  );
}