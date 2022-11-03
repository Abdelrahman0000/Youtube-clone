import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";

import Videos from './Videos';
import ChannelCard from "./ChannelCard";
import {fetchFromAPI} from '../utils/fetchFromAPI'
import zIndex from "@mui/material/styles/zIndex";

export default function ChanelDetail() {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchResults = async () => {
      const data = await fetchFromAPI(`channels?part=snippet&id=${id}`);

      setChannelDetail(data?.items[0]);

      const videosData = await fetchFromAPI(`search?channelId=${id}&part=snippet%2Cid&order=date`);

      setVideos(videosData?.items);
    };

    fetchResults();
  }, [id]);
  
  return (

<Box minHeight="95vh">
<div style={{background: ' linear-gradient(90deg, rgba(220,8,255,1) 23%, rgba(0,117,255,1) 74%)',
height:'300px',
zIndex:10
}}></div>
<ChannelCard chanelItems={ChanelDetail} marginTop='-110px' />

{ videos &&   <Videos videos={videos} />}
</Box>

  )
}
