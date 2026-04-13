import { AppConfigProvider } from './context/AppConfigContext';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <AppConfigProvider>
      <HomePage />
    </AppConfigProvider>
  );
}

