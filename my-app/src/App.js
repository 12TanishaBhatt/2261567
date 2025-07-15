import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/Homepage';
import StatsPage from './pages/Statspage';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/Errorboundary';
import logger from './utils/logger';

logger.info('Application started');

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ErrorBoundary>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/:shortcode" element={<RedirectHandler />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

function RedirectHandler() {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  useEffect(() => {
    const redirect = async () => {
      try {
        const longUrl = await api.redirect(shortcode, 'direct');
        window.location.href = longUrl;
      } catch (error) {
        navigate('/', { state: { error: error.message } });
      }
    };

    redirect();
  }, [shortcode, navigate, api]);

  return <div>Redirecting...</div>;
}

export default App;