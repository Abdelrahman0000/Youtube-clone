import React,{useEffect,useState} from 'react'
import { Box ,Typography} from '@mui/material'
import Videos from './Videos'
import {fetchFromAPI } from '../utils/fetchFromAPI'
import { useParams } from 'react-router-dom'
export default function SearchFeed() {

  const [videos, setVideos] = useState(null);
  const {searchTerm}=useParams();
  useEffect(() => {
    setVideos(null);

    fetchFromAPI(`search?part=snippet&q=${searchTerm}`)
        .then((data) =>  setVideos(data.items))

        
    }, [searchTerm]);
   console.log(111111111111111111111111111111111111111111111111111,searchTerm)
  return (
    <Box p={2} sx={{overflowY:'auto' , height:'90hv' , flex:2}}>
    <Typography variant='h4' fontWeight='bold'  mb={2} sx={{color:'white'}}>Search Result For : <span style={{color:'#f31503'}}>{searchTerm}</span> Videos</Typography>
   
 { videos &&   <Videos videos={videos}/>
}
  </Box>

  )
}
