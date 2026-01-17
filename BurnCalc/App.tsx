import { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';

import { runMigrations } from './src/db/migrations';
import Navigation from './src/navigation/RootNavigator';

export default function App() {
  useEffect(() => {
    runMigrations();
  }, []);

  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
