import { configureStore } from '@reduxjs/toolkit';
import editor from './editor';
import modal from './modal';
import image from './image';
import post from './post';
import embed from './embed';
import sidebar from './sidebar';
import series from './series';
import publishTag from './publishTag';

export const store = configureStore({
  reducer: {
    editor,
    modal,
    image,
    post,
    embed,
    sidebar,
    series,
    publishTag,
  },
});

export type AbortThunk = {
  abort: () => void;
};
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
