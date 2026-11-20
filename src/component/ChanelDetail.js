import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Videos from './Videos';
import Loader from './Loader';
import SubscribeButton from './SubscribeButton';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { formatCount, decodeEntities } from '../utils/helpers';

export default function ChanelDetail() {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    setChannelDetail(undefined);
    setVideos(null);
    const fetchResults = async () => {
      const data = await fetchFromAPI(
        `channels?part=snippet,statistics,brandingSettings&id=${id}`
      );
      setChannelDetail(data?.items[0]);

      const videosData = await fetchFromAPI(
        `search?channelId=${id}&part=snippet%2Cid&order=date`
      );
      setVideos(videosData?.items);
    };

    fetchResults();
  }, [id]);

  const snippet = channelDetail?.snippet;
  const stats = channelDetail?.statistics;
  const banner =
    channelDetail?.brandingSettings?.image?.bannerExternalUrl;
  const avatar =
    snippet?.thumbnails?.high?.url || snippet?.thumbnails?.default?.url;

  return (
    <Box minHeight="95vh">
      {banner ? (
        <Box
          sx={{
            height: { xs: '120px', md: '200px' },
            background:
              'linear-gradient(90deg, rgba(220,8,255,1) 23%, rgba(0,117,255,1) 74%)',
            backgroundImage: `url(${banner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : (
        <div
          style={{
            background:
              'linear-gradient(90deg, rgba(220,8,255,1) 23%, rgba(0,117,255,1) 74%)',
            height: '200px',
          }}
        />
      )}

      {snippet ? (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          gap={{ xs: 1, sm: 3 }}
          px={{ xs: 2, md: 6 }}
          mt="-60px"
          mb={3}
          sx={{ textAlign: { xs: 'center', sm: 'left' } }}
        >
          <Avatar
            src={avatar}
            alt={decodeEntities(snippet.title)}
            sx={{
              width: 128,
              height: 128,
              border: '4px solid #000',
            }}
          />
          <Box flex={1}>
            <Typography variant="h5" fontWeight="bold" color="#fff">
              {decodeEntities(snippet.title)}
              <CheckCircleIcon
                sx={{ fontSize: '16px', color: 'gray', ml: '6px' }}
              />
            </Typography>
            <Typography variant="body2" color="gray" sx={{ mt: 0.5 }}>
              {[
                stats?.subscriberCount &&
                  `${formatCount(stats.subscriberCount)} subscribers`,
                stats?.videoCount && `${formatCount(stats.videoCount)} videos`,
              ]
                .filter(Boolean)
                .join(' • ')}
            </Typography>
            {snippet.description && (
              <Typography
                variant="body2"
                color="gray"
                sx={{ mt: 0.5, maxWidth: '720px' }}
              >
                {decodeEntities(snippet.description)?.slice(0, 160)}
                {snippet.description.length > 160 ? '…' : ''}
              </Typography>
            )}
          </Box>
          <SubscribeButton
            channel={{ id, title: snippet.title, thumbnail: avatar }}
          />
        </Stack>
      ) : (
        <Box mt="-110px">
          <Loader />
        </Box>
      )}

      <Typography
        variant="h6"
        fontWeight="bold"
        color="#fff"
        px={{ xs: 2, md: 6 }}
        mb={2}
      >
        Latest <span style={{ color: '#f31503' }}>Videos</span>
      </Typography>
      {videos && <Videos videos={videos} />}
    </Box>
  );
}
