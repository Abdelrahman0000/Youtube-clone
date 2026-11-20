import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Avatar, Stack } from '@mui/material';
import Videos from './Videos';
import Loader from './Loader';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import {
  getSubscriptions,
  onSubscriptionsChange,
} from '../utils/subscriptions';

export default function SubscriptionsFeed() {
  const [channels, setChannels] = useState(() => getSubscriptions());
  const [videos, setVideos] = useState(null);

  useEffect(() => {
    return onSubscriptionsChange(() => setChannels(getSubscriptions()));
  }, []);

  useEffect(() => {
    setVideos(null);
    if (!channels.length) return;

    let cancelled = false;
    const load = async () => {
      const collected = [];
      for (const channel of channels.slice(0, 12)) {
        try {
          const data = await fetchFromAPI(
            `search?channelId=${channel.id}&part=snippet&order=date&maxResults=5&type=video`
          );
          collected.push(...(data?.items || []));
        } catch {
          // skip channels that fail
        }
        if (cancelled) return;
      }
      collected.sort(
        (a, b) =>
          new Date(b?.snippet?.publishedAt || 0) -
          new Date(a?.snippet?.publishedAt || 0)
      );
      setVideos(collected);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [channels]);

  return (
    <Box p={2} sx={{ overflowY: 'auto', flex: 2 }} minHeight="95vh">
      <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: 'white' }}>
        Latest from your <span style={{ color: '#f31503' }}>Subscriptions</span>
      </Typography>

      {channels.length > 0 && (
        <Stack
          direction="row"
          gap={3}
          mb={3}
          sx={{ overflowX: 'auto', pb: 1 }}
        >
          {channels.map((channel) => (
            <Link
              key={channel.id}
              to={`/channel/${channel.id}`}
              style={{ textAlign: 'center', flexShrink: 0 }}
            >
              <Avatar
                src={channel.thumbnail}
                alt={channel.title}
                sx={{
                  width: 72,
                  height: 72,
                  margin: 'auto',
                  border: '2px solid #3d3d3d',
                }}
              />
              <Typography
                variant="caption"
                color="#fff"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  maxWidth: 90,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {channel.title}
              </Typography>
            </Link>
          ))}
        </Stack>
      )}

      {channels.length === 0 ? (
        <Typography color="gray" variant="body1">
          You are not following any channels yet. Open a channel and press
          Subscribe to see its latest videos here.
        </Typography>
      ) : videos ? (
        <Videos videos={videos} />
      ) : (
        <Loader />
      )}
    </Box>
  );
}
