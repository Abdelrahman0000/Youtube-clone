import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Avatar, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  demoThumbnailUrl,
  demoVideoUrl,
  demoVideoTitle,
  demoChannelUrl,
  demoChannelTitle,
} from '../utils/constants';
import { formatDuration, decodeEntities } from '../utils/helpers';

export default function VideoCard({
  video: {
    id: { videoId },
    snippet,
  },
  duration,
  channelAvatar,
}) {
  const length = formatDuration(duration);
  const channelLink = snippet?.channelId
    ? `/channel/${snippet.channelId}`
    : demoChannelUrl;

  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '358px', md: '290px' },
        boxShadow: 'none',
        borderRadius: '0',
        background: 'transparent',
      }}
    >
      <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            image={snippet?.thumbnails?.high?.url || demoThumbnailUrl}
            alt={snippet?.title}
            sx={{ width: { xs: '100%', sm: '358px' }, height: 180 }}
          />
          {length && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 6,
                right: 6,
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 600,
                px: '5px',
                py: '1px',
                borderRadius: '4px',
              }}
            >
              {length}
            </Box>
          )}
        </Box>
      </Link>
      <CardContent
        sx={{
          background: '#1e1e1e',
          height: '106px',
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
        }}
      >
        <Link to={channelLink}>
          <Avatar
            src={channelAvatar}
            alt={decodeEntities(snippet?.channelTitle) || demoChannelTitle}
            sx={{ width: 36, height: 36, mt: '2px' }}
          />
        </Link>
        <Box>
          <Link to={videoId ? `/video/${videoId}` : demoVideoUrl}>
            <Typography variant="subtitle1" fontWeight="bold" color="#FFF">
              {decodeEntities(snippet?.title)?.slice(0, 60) || demoVideoTitle.slice(0, 60)}
            </Typography>
          </Link>
          <Link to={channelLink}>
            <Typography variant="subtitle2" color="gray">
              {decodeEntities(snippet?.channelTitle) || demoChannelTitle}
              <CheckCircleIcon
                sx={{ fontSize: '12px', color: 'gray', ml: '5px' }}
              />
            </Typography>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
