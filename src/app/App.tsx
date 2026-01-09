import { AppProviders } from './providers';
import { MainPage } from '@/pages/main/ui/MainPage';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <MainPage />
      </ErrorBoundary>
    </AppProviders>
  );
}

export default App;
