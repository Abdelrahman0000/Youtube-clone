import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Typography, Box, Stack, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Loader from './Loader';
import Videos from './Videos';
import SubscribeButton from './SubscribeButton';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { formatCount, decodeEntities } from '../utils/helpers';

export default function VideoDetail() {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const [channelInfo, setChannelInfo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setVideoDetail(null);
    setVideos(null);
    setChannelInfo(null);

    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`).then((data) =>
      setVideoDetail(data.items[0])
    );

    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`).then(
      (data) => setVideos(data.items)
    );
  }, [id]);

  const channelId = videoDetail?.snippet?.channelId;

  useEffect(() => {
    if (!channelId) return;
    fetchFromAPI(`channels?part=snippet,statistics&id=${channelId}`)
      .then((data) => setChannelInfo(data?.items?.[0]))
      .catch(() => {});
  }, [channelId]);

  if (!videoDetail?.snippet) return <Loader />;

  const {
    snippet: { title, channelTitle },
    statistics: { viewCount, likeCount },
  } = videoDetail;

  const channelAvatar =
    channelInfo?.snippet?.thumbnails?.default?.url ||
    channelInfo?.snippet?.thumbnails?.high?.url;

  return (
    <Box minHeight="95vh">
      <Stack direction={{ xs: 'column', md: 'row' }}>
        <Box flex={1}>
          <Box sx={{ width: '100% ', position: 'sticky', top: '86px' }}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              className="react-player"
              controls
            />
            <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
              {decodeEntities(title)}
            </Typography>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              sx={{ color: '#fff' }}
              py={1}
              px={2}
              gap={1}
            >
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Link to={`/channel/${channelId}`}>
                  <Avatar
                    src={channelAvatar}
                    alt={channelTitle}
                    sx={{ width: 40, height: 40 }}
                  />
                </Link>
                <Box>
                  <Link to={`/channel/${channelId}`}>
                    <Typography variant="subtitle1" color="#fff">
                      {decodeEntities(channelTitle)}
                      <CheckCircleIcon
                        sx={{ fontSize: '12px', color: 'gray', ml: '5px' }}
                      />
                    </Typography>
                  </Link>
                  {channelInfo?.statistics?.subscriberCount && (
                    <Typography variant="caption" color="gray">
                      {formatCount(channelInfo.statistics.subscriberCount)}{' '}
                      subscribers
                    </Typography>
                  )}
                </Box>
                <SubscribeButton
                  channel={{
                    id: channelId,
                    title: channelTitle,
                    thumbnail: channelAvatar,
                  }}
                  sx={{ ml: 1 }}
                />
              </Stack>
              <Stack direction="row" gap="20px" alignItems="center">
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {formatCount(viewCount)} views
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {formatCount(likeCount)} likes
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Box
          px={2}
          py={{ md: 1, xs: 5 }}
          sx={{ width: { xs: 'auto', md: '340px' } }}
          justifyContent="center"
          alignItems="center"
        >
          {videos && <Videos videos={videos} direction="column" />}
        </Box>
      </Stack>
    </Box>
  );
}
