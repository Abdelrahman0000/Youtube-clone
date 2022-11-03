import React from 'react'
import { Stack } from '@mui/system'
import { Link } from 'react-router-dom'
import {logo} from '../utils/constants'
import Searchbar from './Searchbar'
import zIndex from '@mui/material/styles/zIndex'
export default function Navbar() {
  return (
    <Stack 
    direction="row"
    alignItems="center"
    p={2}
    sx={{position:'sticky' ,zIndex:'1000' , backgroundColor:'#000' ,top:'0', justifyContent:'space-between'}}
    >
<Link to='/' style={{display:'flex' ,alignItems:'center'}}>
  <img src={logo} height={45} alt="" />
</Link>
<Searchbar />
    </Stack>
  )
}
