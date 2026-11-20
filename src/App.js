import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import SearchFeed from './component/SearchFeed';

import VideoDetail from './component/VideoDetail';
import ChanelDetail from './component/ChanelDetail';
import Feed from './component/Feed';
import Navbar from './component/Navbar';
import SubscriptionsFeed from './component/SubscriptionsFeed';

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ backgroundColor: '#000' }}>
        <Navbar />

        <Routes>
          <Route path="/" exact element={<Feed />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="/channel/:id" element={<ChanelDetail />} />
          <Route path="/search/:searchTerm" element={<SearchFeed />} />
          <Route path="/subscriptions" element={<SubscriptionsFeed />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
