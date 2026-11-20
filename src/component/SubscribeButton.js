import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import {
  isSubscribed,
  toggleSubscription,
  onSubscriptionsChange,
} from '../utils/subscriptions';

export default function SubscribeButton({ channel, sx = {} }) {
  const [subscribed, setSubscribed] = useState(() => isSubscribed(channel?.id));

  useEffect(() => {
    setSubscribed(isSubscribed(channel?.id));
    return onSubscriptionsChange(() =>
      setSubscribed(isSubscribed(channel?.id))
    );
  }, [channel?.id]);

  if (!channel?.id) return null;

  return (
    <Button
      onClick={() =>
        toggleSubscription({
          id: channel.id,
          title: channel.title,
          thumbnail: channel.thumbnail,
        })
      }
      startIcon={subscribed ? <NotificationsOutlinedIcon /> : null}
      sx={{
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: 'bold',
        px: 2,
        backgroundColor: subscribed ? '#272727' : '#f1f1f1',
        color: subscribed ? '#f1f1f1' : '#0f0f0f',
        '&:hover': { backgroundColor: subscribed ? '#3d3d3d' : '#d9d9d9' },
        ...sx,
      }}
    >
      {subscribed ? 'Subscribed' : 'Subscribe'}
    </Button>
  );
}
