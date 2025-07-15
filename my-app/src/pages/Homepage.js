import React, { useState } from 'react';
import { Box, Container, Typography, Snackbar, Alert } from '@mui/material';
import UrlForm from '../components/Urlform';
import UrlList from '../components/Urllist';
import logger from '../utils/logger';

function HomePage({ location }) {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(location?.state?.error || null);

  logger.info('HomePage rendered', { urlsCount: urls.length });

  const handleShorten = async (urlData) => {
    try {
      const newUrl = await api.shortenUrl(
        urlData.longUrl,
        urlData.validityMinutes,
        urlData.customShortcode
      );
      setUrls([...urls, newUrl]);
      setError(null);
    } catch (err) {
      logger.error('URL shortening failed', { error: err.message });
      setError(err.message);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Shortener
        </Typography>
        <UrlForm onShorten={handleShorten} maxUrls={5} currentCount={urls.length} />
        {urls.length > 0 && <UrlList urls={urls} />}
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default HomePage;