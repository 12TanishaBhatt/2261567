import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import logger from '../utils/logger';

function UrlForm({ onShorten, maxUrls, currentCount }) {
  const [longUrl, setLongUrl] = useState('');
  const [validityMinutes, setValidityMinutes] = useState(30);
  const [customShortcode, setCustomShortcode] = useState('');
  const [errors, setErrors] = useState({});

  logger.info('UrlForm rendered', { maxUrls, currentCount });

  const validate = () => {
    const newErrors = {};
    
    try {
      new URL(longUrl);
    } catch {
      newErrors.longUrl = 'Please enter a valid URL';
    }

    if (validityMinutes <= 0) {
      newErrors.validityMinutes = 'Validity must be positive';
    }

    if (customShortcode && !/^[a-zA-Z0-9_-]{4,20}$/.test(customShortcode)) {
      newErrors.customShortcode = 'Shortcode must be 4-20 alphanumeric characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logger.info('Form submission attempted');

    if (validate()) {
      onShorten({
        longUrl,
        validityMinutes: parseInt(validityMinutes, 10),
        customShortcode: customShortcode.trim() || undefined
      });
      resetForm();
    } else {
      logger.warn('Form validation failed', { errors });
    }
  };

  const resetForm = () => {
    setLongUrl('');
    setValidityMinutes(30);
    setCustomShortcode('');
    setErrors({});
  };

  const canAddMore = currentCount < maxUrls;

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Shorten a new URL
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Long URL"
              variant="outlined"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              error={!!errors.longUrl}
              helperText={errors.longUrl}
              required
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Validity (minutes)"
              type="number"
              variant="outlined"
              value={validityMinutes}
              onChange={(e) => setValidityMinutes(e.target.value)}
              error={!!errors.validityMinutes}
              helperText={errors.validityMinutes || 'Default: 30'}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              label="Custom shortcode (optional)"
              variant="outlined"
              value={customShortcode}
              onChange={(e) => setCustomShortcode(e.target.value)}
              error={!!errors.customShortcode}
              helperText={errors.customShortcode}
            />
          </Grid>
          <Grid item xs={12} md={1} display="flex" alignItems="center">
            <Tooltip title={canAddMore ? "Shorten URL" : `Maximum ${maxUrls} URLs reached`}>
              <span>
                <IconButton
                  color="primary"
                  type="submit"
                  disabled={!canAddMore}
                  sx={{ height: '56px', width: '56px' }}
                >
                  <AddIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
      {!canAddMore && (
        <Typography color="error" variant="body2" mt={1}>
          You've reached the maximum of {maxUrls} URLs. Shorten more after clearing some.
        </Typography>
      )}
    </Paper>
  );
}

export default UrlForm;