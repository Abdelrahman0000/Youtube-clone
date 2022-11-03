import React from 'react'
import { Stack } from '@mui/system'
import { categories } from '../utils/constants' 
export default function Sidebar({setselectcate,selectcate }) {
  
  return (
    <Stack direction='row' sx={{overflowY:'auto' , flexDirection:{md:'column'} ,height:{sx:'auto' , md:'95%'}}}>
      {categories.map((cate)=>(
        <button className='category-btn'
        onClick={()=>setselectcate(cate.name)}
        style={{background: cate.name ===selectcate && '#Fc1503', color:'#fff'}}
        key={cate.name}
      
        >
          <span 
        style={{color: cate.name ===selectcate ? '#fff': '#Fc1503' , marginRight:'15px'}}>{cate.icon}</span>
          <span style={{opacity: cate.name ===selectcate ? '1': '0.8' }}>{cate.name}</span>
        </button>
      ))}
    </Stack>
  )
}
