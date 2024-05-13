// import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './components/Home.tsx'
import Songs from './components/Songs.tsx'
import PlayLists from './components/PlayLists.tsx'
import Artists from './components/Artists.tsx'
import MusicNavbar from './components/Navbar.tsx'
import Player from './components/Player.tsx'
import Login from './components/Login.tsx'
import { Provider } from 'react-redux'
import { store } from './components/store.tsx'
import Register from './components/Register.tsx'
import Admin from './components/Admin.tsx'

function App() {
  
        const loca = useLocation();
  
   return (
    <>

      <MusicNavbar />
      
      <Provider store={store}>

        <div className='p-5'>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/songs' element={<Songs />} />
                <Route path='/playlists' element={<PlayLists />} />
                <Route path='/artists' element={<Artists />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/admin' element={<Admin />} />
            </Routes>
            {loca.pathname == '/login' || loca.pathname === '/register' ? '' : <Player />}
                
        
        </div>
      </Provider>
    
    </>
  );
}

export default App;
