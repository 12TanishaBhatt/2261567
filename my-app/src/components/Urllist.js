import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Link,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import logger from '../utils/logger';

function UrlList({ urls }) {
  logger.info('UrlList rendered', { urlsCount: urls.length });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    logger.info('URL copied to clipboard', { text });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Your Shortened URLs
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Original URL</TableCell>
              <TableCell>Short URL</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => (
              <TableRow key={url.shortcode}>
                <TableCell sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Tooltip title={url.longUrl}>
                    <span>{url.longUrl}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Link href={`/${url.shortcode}`} target="_blank" rel="noopener">
                    {`http://localhost:3000/${url.shortcode}`}
                  </Link>
                </TableCell>
                <TableCell>{formatDate(url.expiry)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Copy short URL">
                    <IconButton onClick={() => handleCopy(`http://localhost:3000/${url.shortcode}`)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Open in new tab">
                    <IconButton
                      href={`/${url.shortcode}`}
                      target="_blank"
                      rel="noopener"
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default UrlList;