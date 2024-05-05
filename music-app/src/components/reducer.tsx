import { createSlice } from "@reduxjs/toolkit";



const song_ = createSlice({
    name:'SONG',
    initialState:{url:'', songid:0, title:""},
    reducers:{
        setURL(state,action){
            // console.log('setMusic', action.payload.url);
            return {url:action.payload.url, songid:action.payload.songid, title:action.payload.title};
        },
        clearURL(state,action){
            // console.log('clearMusic',action.payload);
            return {url:'', songid:0, title:""};
        }

    }
});

const playlist_ = createSlice({
    name:'PLAYLIST',
    initialState:{playlists:0},
    reducers:{
        setPlaylistData(state,action){
            // console.log('setMusic', action.payload.url);
            return {playlists:action.payload.count};
        },

    }
});




export const {setURL,clearURL} = song_.actions;

export const {setPlaylistData} = playlist_.actions;
export const playlist = playlist_.reducer;

export const song = song_.reducer;