// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home.tsx'
import Songs from './components/Songs.tsx'
import PlayLists from './components/PlayLists.tsx'
import Artists from './components/Artists.tsx'
import MusicNavbar from './components/Navbar.tsx'
import Player from './components/Player.tsx'
import { useState, createContext } from 'react'

export const MusicContext = createContext(null);

function App() {
  
   return (
    <>
    <MusicNavbar />
  <div className='p-5'>
      
    <Routes>

    <Route path="/" element={<Home />} />
    <Route path='/player' element={<Player />} />
    <Route path='/songs' element={<Songs />} />
    <Route path='/playlists' element={<PlayLists />} />
    <Route path='/artists' element={<Artists />} />
    </Routes>
  </div>

    
    </>
  )
}

export default App
