import React from 'react'
import { Box, CardContent, CardMedia, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from 'react-router-dom';
import { demoProfilePicture } from '../utils/constants';
import { display } from '@mui/system';
export default function ChannelCard({chanelItems ,marginTop}) {
  return (
  <Box sx={{boxShadow:'none',
borderRadiuse:'20px',
display:'flex',
justifyContent:'center',
alignItems:'center',
width: { xs: '356px', md: '290px' },
height: '326px',
margin: 'auto',
marginTop,
}}>

<Link to={`/channel/${chanelItems?.id?.channelId}`}>
<CardContent sx={{display:'flex',flexDirection:'column',justifyContent:'center',textAlign:'center',color:'#fff'}}>
<CardMedia   image={chanelItems?.snippet?.thumbnails?.high?.url || demoProfilePicture}
          alt={chanelItems?.snippet?.title}
          sx={{ borderRadius: '50%', height: '180px', width: '180px', mb: 2, border: '1px solid #e3e3e3' }}
        />
                <Typography variant="h6">
          {chanelItems?.snippet?.title}{' '}
          <CheckCircleIcon sx={{ fontSize: '14px', color: 'gray', ml: '5px' }} />
        </Typography>
        {chanelItems?.statistics?.subscriberCount && (
          <Typography sx={{ fontSize: '15px', fontWeight: 500, color: 'gray' }}>
            {parseInt(chanelItems?.statistics?.subscriberCount).toLocaleString('en-US')} Subscribers
          </Typography>
        )}
</CardContent>
</Link>

</Box>
  )
}
