import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as api from '../apis';
import { RootState } from './index';

export const checkSeriesCoverImage = createAsyncThunk<
  string,
  File,
  {
    rejectValue: string;
  }
>('series/validCoverSeries', async (file, { rejectWithValue }) => {
  const res = await api.validCoverSeries({ file });
  if (!res.ok) {
    return rejectWithValue(res?.error || '');
  }
  return URL.createObjectURL(file);
});

export const createSeries = createAsyncThunk<
  api.Series,
  File | null,
  {
    state: RootState;
    rejectValue: string;
  }
>('series/create', async (imageFile, { rejectWithValue, getState }) => {
  const { createSeriesTitle, createSeriesDescription } = getState().series;

  const params: api.CreateSeriesParams = {
    title: createSeriesTitle,
    description: createSeriesDescription,
    uploadStatus: imageFile ? 'update' : 'delete',
  };
  if (imageFile) {
    params.coverImage = imageFile;
  }
  const res = await api.createSeries(params);
  if (!res.ok) {
    return rejectWithValue(res?.error || '');
  }
  return res.series;
});

type SeriesState = {
  isCreateSeriesModalOpen: boolean;
  createSeriesTitle: string;
  createSeriesDescription: string;
  createSeriesCoverImage: string;
};

const initialState: SeriesState = {
  isCreateSeriesModalOpen: false,
  createSeriesTitle: '',
  createSeriesDescription: '',
  createSeriesCoverImage: '',
};

export const seriesSlice = createSlice({
  name: 'series',
  initialState,
  reducers: {
    openCreateSeriesModal: (state, action: PayloadAction<string>) => {
      state.isCreateSeriesModalOpen = true;
      state.createSeriesTitle = action.payload;
    },
    closeCreateSeriesModal: (state) => {
      state.isCreateSeriesModalOpen = false;
      state.createSeriesTitle = '';
      state.createSeriesDescription = '';
      state.createSeriesCoverImage = '';
    },
    setCreateSeriesTitle: (state, action: PayloadAction<string>) => {
      state.createSeriesTitle = action.payload;
    },
    setCreateSeriesDescription: (state, action: PayloadAction<string>) => {
      state.createSeriesDescription = action.payload;
    },
    deleteCreateSeriesImage: (state) => {
      state.createSeriesCoverImage = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkSeriesCoverImage.fulfilled, (state, action) => {
      state.createSeriesCoverImage = action.payload;
    });
    builder.addCase(createSeries.fulfilled, (state) => {
      state.createSeriesTitle = '';
      state.createSeriesDescription = '';
      state.createSeriesCoverImage = '';
    });
  },
});

export const {
  openCreateSeriesModal,
  closeCreateSeriesModal,
  setCreateSeriesTitle,
  setCreateSeriesDescription,
  deleteCreateSeriesImage,
} = seriesSlice.actions;
export default seriesSlice.reducer;
