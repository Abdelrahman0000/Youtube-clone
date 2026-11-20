import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/system';
import VideoCard from './VideoCard';
import ChannelCard from './ChannelCard';
import { fetchFromAPI } from '../utils/fetchFromAPI';

// Enriches video items with contentDetails (duration) and channel avatars
// using two batched API calls for the whole list.
export default function Videos({ videos }) {
  const [durations, setDurations] = useState({});
  const [avatars, setAvatars] = useState({});

  useEffect(() => {
    if (!videos?.length) return;

    const videoIds = videos
      .map((item) => item?.id?.videoId)
      .filter(Boolean);
    const channelIds = [
      ...new Set(
        videos
          .map((item) => item?.snippet?.channelId || item?.id?.channelId)
          .filter(Boolean)
      ),
    ];

    if (videoIds.length) {
      fetchFromAPI(
        `videos?part=contentDetails&id=${videoIds.slice(0, 50).join(',')}`
      )
        .then((data) => {
          const map = {};
          (data?.items || []).forEach((v) => {
            map[v.id] = v?.contentDetails?.duration;
          });
          setDurations(map);
        })
        .catch(() => {});
    }

    if (channelIds.length) {
      fetchFromAPI(
        `channels?part=snippet&id=${channelIds.slice(0, 50).join(',')}`
      )
        .then((data) => {
          const map = {};
          (data?.items || []).forEach((c) => {
            map[c.id] =
              c?.snippet?.thumbnails?.default?.url ||
              c?.snippet?.thumbnails?.high?.url;
          });
          setAvatars(map);
        })
        .catch(() => {});
    }
  }, [videos]);

  return (
    <Stack flexDirection="row" justifyContent="center" flexWrap="wrap" gap={2}>
      {videos.map((item, idx) => (
        <Box key={idx}>
          {item.id.videoId && (
            <VideoCard
              video={item}
              duration={durations[item.id.videoId]}
              channelAvatar={avatars[item?.snippet?.channelId]}
            />
          )}
          {item.id.channelId && <ChannelCard chanelItems={item} />}
        </Box>
      ))}
    </Stack>
  );
}
