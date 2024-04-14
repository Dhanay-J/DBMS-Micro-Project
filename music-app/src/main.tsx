import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
// import App from './App.tsx'
import './index.css'
import Home from './components/Home.tsx'
import Player from './components/Player.tsx'
import Songs from './components/Songs.tsx'
import PlayLists from './components/PlayLists.tsx'
import Artists from './components/Artists.tsx'
import MusicNavbar from './components/Navbar.tsx'



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MusicNavbar />
      <div className='p-5'></div>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/player' element={<Player />} />
        <Route path='/songs' element={<Songs />} />
        <Route path='/playlists' element={<PlayLists />} />
        <Route path='/artists' element={<Artists />} />
      </Routes>

      <div className='p-5'></div>
    </BrowserRouter>
    <Player />
  </React.StrictMode>,
)
