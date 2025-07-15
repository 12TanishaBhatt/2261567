import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Alert } from '@mui/material';
import UrlStats from '../components/UrlStats';
import logger from '../utils/logger';

function StatsPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  logger.info('StatsPage rendered');

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const allUrls = await api.getAllUrls();
        setUrls(allUrls);
        setError(null);
      } catch (err) {
        logger.error('Failed to fetch URLs', { error: err.message });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Statistics
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : urls.length === 0 ? (
          <Typography>No URLs have been shortened yet.</Typography>
        ) : (
          urls.map((url) => <UrlStats key={url.shortcode} url={url} />)
        )}
      </Box>
    </Container>
  );
}

export default StatsPage;