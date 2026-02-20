import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { ScanResults } from './pages/ScanResults';
import { Insights } from './pages/Insights';
import { Settings } from './pages/Settings';
import { AppLayout } from './components/AppLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/scan" element={<Dashboard />} />
          <Route path="/scan/:id" element={<ScanResults />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
