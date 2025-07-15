import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClicksIcon from '@mui/icons-material/TouchApp';
import logger from '../utils/logger';

function UrlStats({ url }) {
  logger.info('UrlStats rendered', { shortcode: url.shortcode });

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Box mb={4}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" width="100%">
            <Box flexGrow={1}>
              <Typography variant="subtitle1">
                <LinkIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {`http://localhost:3000/${url.shortcode}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <AccessTimeIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                Created: {formatDate(url.createdAt)} | Expires: {formatDate(url.expiry)}
              </Typography>
            </Box>
            <Chip
              icon={<ClicksIcon />}
              label={`${url.clicks} clicks`}
              color={url.clicks > 0 ? 'primary' : 'default'}
              variant="outlined"
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" gutterBottom>
            Original URL: {url.longUrl}
          </Typography>
          
          {url.clicks > 0 ? (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Source</TableCell>
                    <TableCell>Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {url.clickData.map((click, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(click.timestamp)}</TableCell>
                      <TableCell>{click.source}</TableCell>
                      <TableCell>{click.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No clicks recorded yet.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

export default UrlStats;