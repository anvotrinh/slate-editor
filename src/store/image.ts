import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { RootState, AppDispatch } from '.';
import * as api from '../apis';

export const searchImages = createAsyncThunk<
  api.SearchImagesResponse,
  boolean,
  {
    state: RootState;
    dispatch: AppDispatch;
    rejectValue: string;
  }
>(
  'image/search',
  async (shouldReset, { rejectWithValue, getState, dispatch, signal }) => {
    if (shouldReset) {
      dispatch(resetSearchResult());
    }
    const res = await api.searchImages({
      query: getState().image.searchQuery,
      page: getState().image.nextSearchPage,
      config: { abortSignal: signal },
    });
    if (!res.ok) {
      return rejectWithValue(res?.error || '');
    }
    return res;
  }
);

export const deleteImage = createAsyncThunk<
  string,
  string,
  {
    dispatch: AppDispatch;
    rejectValue: string;
  }
>('image/delete', async (imageId, { dispatch, rejectWithValue }) => {
  dispatch(deleteImageLocal(imageId));
  const res = await api.deleteImage({ imageId });
  if (!res.ok) {
    return rejectWithValue(res?.error || '');
  }
  return imageId;
});

type UploadRejectedValue = {
  error: string;
  tempId: string;
};
export const uploadImage = createAsyncThunk<
  [string, api.ChImage],
  File,
  {
    dispatch: AppDispatch;
    rejectValue: UploadRejectedValue;
  }
>('image/upload', async (file, { dispatch, rejectWithValue, signal }) => {
  const tempId = uuidv4();
  dispatch(addLoadingImage(tempId));
  const res = await api.uploadImage({ file, config: { abortSignal: signal } });
  if (!res.ok) {
    return rejectWithValue({ error: res?.error || '', tempId });
  }
  return [tempId, res.data];
});

export const updateImage = createAsyncThunk<
  api.ChImage,
  api.UpdateImageParams,
  {
    rejectValue: string;
  }
>('image/update', async (params, { rejectWithValue }) => {
  const res = await api.updateImage(params);
  if (!res.ok) {
    return rejectWithValue(res?.error || '');
  }
  return res.data;
});

type ImageState = {
  singleMode: boolean;
  images: StoreImage[];
  selectedImageIds: string[];
  searchQuery: string;
  isSearchLoading: boolean;
  hasNextSearchPage: boolean;
  nextSearchPage: number;
};

export type StoreImage = {
  id: string;
  isLoading?: boolean;
  isNew?: boolean;
  caption: string;
  thumb_360: string;
  url: string;
  url_w: number;
};

const initialState: ImageState = {
  singleMode: false,
  images: [],
  selectedImageIds: [],
  searchQuery: '',
  isSearchLoading: false,
  hasNextSearchPage: false,
  nextSearchPage: 1,
};

const imageSlice = createSlice({
  name: 'image',
  initialState: initialState,
  reducers: {
    setSingleMode: (state, action: PayloadAction<boolean>) => {
      state.singleMode = action.payload;
    },
    changeSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleImageSelected: (state, action: PayloadAction<string>) => {
      if (state.selectedImageIds.includes(action.payload)) {
        state.selectedImageIds = state.selectedImageIds.filter(
          (id) => id !== action.payload
        );
      } else {
        if (state.singleMode) state.selectedImageIds = [];
        state.selectedImageIds.push(action.payload);
      }
    },
    addLoadingImage: (state, action: PayloadAction<string>) => {
      state.selectedImageIds.push(action.payload);
      state.images.unshift({
        id: action.payload,
        isLoading: true,
        isNew: true,
        caption: '',
        thumb_360: '',
        url: '',
        url_w: 0,
      });
    },
    updateCaptionLocal: (
      state,
      action: PayloadAction<{ imageId: string; caption: string }>
    ) => {
      const { imageId, caption } = action.payload;
      state.images = state.images.map((image) =>
        image.id === imageId
          ? {
              ...image,
              caption,
            }
          : image
      );
    },
    deleteImageLocal: (state, action: PayloadAction<string>) => {
      // delete in images
      state.images = state.images.filter(
        (image) => image.id !== action.payload
      );
      // delete in selected ids
      state.selectedImageIds = state.selectedImageIds.filter(
        (id) => id !== action.payload
      );
    },
    resetSearchResult: (state) => {
      state.images = [];
      state.selectedImageIds = [];
      state.hasNextSearchPage = false;
      state.nextSearchPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchImages.pending, (state) => {
      state.isSearchLoading = true;
    });
    builder.addCase(searchImages.fulfilled, (state, action) => {
      const { images, paging } = action.payload.data;
      const noDuplicatedImages = images.filter((image) =>
        state.images.every((stateImage) => stateImage.id !== image.id)
      );
      state.images = state.images.concat(noDuplicatedImages);
      state.isSearchLoading = false;
      state.hasNextSearchPage = paging.has_next;
      state.nextSearchPage++;
    });
    builder.addCase(searchImages.rejected, (state) => {
      state.isSearchLoading = false;
    });
    builder.addCase(uploadImage.fulfilled, (state, action) => {
      const [tempId, resImage] = action.payload;
      // update loading image to response image
      state.images = state.images.map((image) =>
        image.id === tempId ? { ...resImage, isNew: true } : image
      );
      // update selected id to new id
      state.selectedImageIds = state.selectedImageIds.map((id) =>
        id === tempId ? resImage.id : id
      );
    });
    builder.addCase(uploadImage.rejected, (state, action) => {
      const tempId = action.payload?.tempId;
      // delete temp image in images
      state.images = state.images.filter((image) => image.id !== tempId);
      // delete temp id in selected ids
      state.selectedImageIds = state.selectedImageIds.filter(
        (id) => id !== tempId
      );
    });
  },
});

export const {
  setSingleMode,
  changeSearchQuery,
  toggleImageSelected,
  addLoadingImage,
  updateCaptionLocal,
  deleteImageLocal,
  resetSearchResult,
} = imageSlice.actions;
export default imageSlice.reducer;
