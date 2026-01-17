import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { runMigrations } from './src/db/migrations';
import Navigation from './src/navigation/RootNavigator';

export default function App() {
  useEffect(() => {
    runMigrations();
  }, []);

  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
