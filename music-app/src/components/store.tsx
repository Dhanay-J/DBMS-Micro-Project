import { configureStore } from "@reduxjs/toolkit";
import {song} from "./reducer";
import {playlist} from "./reducer";

export const store = configureStore({
    reducer: {
        song : song,
        playlist : playlist
    }
});