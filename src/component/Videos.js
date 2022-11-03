import React from 'react'
import { Stack,Box } from '@mui/system'
import VideoCard from './VideoCard'
import ChannelCard from './ChannelCard'
export default function Videos({videos}) {
    
  return (
   <Stack flexDirection='row' justifyContent='center' flexWrap="wrap" gap={2} >

{videos.map((item,idx)=>(
<Box key={idx}>
{item.id.videoId &&<VideoCard video={item} />}
{item.id.channelId &&<ChannelCard chanelItems={item} />}
</Box>
))}

   </Stack>
  )
}
