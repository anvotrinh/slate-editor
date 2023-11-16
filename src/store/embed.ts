import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '.';
import * as api from '../apis';
import { delay } from '../utils/common';

export const infoEmbeddedPage = createAsyncThunk<
  api.InfoEmbeddedPageResponse,
  string,
  {
    state: RootState;
    dispatch: AppDispatch;
  }
>('embed/info', async (url, { rejectWithValue, signal }) => {
  await delay(1000);
  if (signal.aborted) return rejectWithValue('');
  const res = await api.infoEmbeddedPage({
    url,
    config: { abortSignal: signal },
  });
  if (!res.ok) {
    return rejectWithValue(res?.error || '');
  }
  return res;
});

type EmbedState = {
  isInfoLoading: boolean;
};

const initialState: EmbedState = {
  isInfoLoading: false,
};

const embedSlice = createSlice({
  name: 'embed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(infoEmbeddedPage.pending, (state) => {
      state.isInfoLoading = true;
    });
    builder.addCase(infoEmbeddedPage.fulfilled, (state) => {
      state.isInfoLoading = false;
    });
    builder.addCase(infoEmbeddedPage.rejected, (state, action) => {
      if (action.error.name !== 'AbortError') {
        state.isInfoLoading = false;
      }
    });
  },
});

export default embedSlice.reducer;
