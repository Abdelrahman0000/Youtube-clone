import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper , IconButton} from '@mui/material'
import {Search} from '@mui/icons-material'

import { borderRadius } from '@mui/system'

export default function Searchbar() {
  const [searchterm , setSearh]=useState('');
    const navigate = useNavigate();

  const onhandleSubmit = (e) => {
    e.preventDefault();

    if (searchterm) {
      navigate(`/search/${searchterm}`);

      setSearh('');
    }
  };
  return (
    <Paper 
    component="form"
    onSubmit={onhandleSubmit}
    sx={{
        border:'1px solid #e3e3e3',
        borderRadius:'20px',
pl:2,
boxShadow:'none',
mr:{sm:5}
    }}
    >
<input type="text"
className='search-bar'
placeholder='Search...'
value={searchterm}
onChange={(e)=>setSearh(e.target.value)}
/>
<IconButton type='submit' sx={{p:'10px' ,color:'red'}}>
    <Search />
</IconButton>
    </Paper>
  )
}
