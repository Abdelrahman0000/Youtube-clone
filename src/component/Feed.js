import React,{useEffect,useState} from 'react'
import { Stack , Box ,Typography} from '@mui/material'
import Sidebar from'./Sidebar'
import Videos from './Videos'
import {fetchFromAPI } from '../utils/fetchFromAPI'
export default function Feed() {

  const [selectedCategory, setSelectedCategory] = useState("New");
  const [videos, setVideos] = useState(null);
  useEffect(() => {
    setVideos(null);

    fetchFromAPI(`search?part=snippet&q=${selectedCategory}`)
        .then((data) =>  setVideos(data.items))

        
    }, [selectedCategory]);
   
  return (

<Stack sx={{flexDirection:{sx:'column',md:'row'} }}>
  <Box sx={{
    height:{sx:'auto',md:'92vh'},
    px:{sx:0,md:2},
borderRight:'1px solid #3d3d3d'

  }}>
    <Sidebar setselectcate={setSelectedCategory} selectcate={selectedCategory} />
<Typography className='copyright' variant='body2' sx={{mt:1.5, color:'#fff'}}>CopyRight 2022 Khalifa</Typography>


  </Box>
  <Box p={2} sx={{overflowY:'auto' , height:'90hv' , flex:2}}>
    <Typography variant='h4' fontWeight='bold'  mb={2} sx={{color:'white'}}>{selectedCategory} <span style={{color:'#f31503'}}>Videos</span></Typography>
   
 { videos &&   <Videos videos={videos}/>
}
  </Box>
</Stack>

  )
}
