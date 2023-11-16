import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as api from '../apis';
import { UnionObject, UnionObjectType } from '../apis';
import { AppDispatch, RootState } from './index';
import { chLicensees, initialPost, unit } from '../utils/const';
import { createSeries } from './series';
import { createTopic } from './topic';

export const recentObjects = createAsyncThunk<
  api.ObjectResponse,
  UnionObjectType,
  {
    rejectValue: string;
  }
>('sidebar/recent', async (type, { rejectWithValue }) => {
  if (type === 'authors' || type === 'licensees') return rejectWithValue('');
  const res = await api.recentObjects(type);
  if (!res.ok) {
    return rejectWithValue(res?.error || '');
  }
  return res;
});

export const listObject = createAsyncThunk<
  [UnionObjectType, string, api.ObjectResponse],
  UnionObjectType,
  {
    state: RootState;
    dispatch: AppDispatch;
    rejectValue: string;
  }
>('sidebar/list', async (type, { rejectWithValue, getState, dispatch }) => {
  const sidebarSate = getState().sidebar;
  if (type === 'licensees') return rejectWithValue('');

  dispatch(setIsListLoading({ type, isLoading: true }));
  const query = sidebarSate[type].viewMoreSearchInput;
  const res = await api.listObject({ type, query });
  dispatch(setIsListLoading({ type, isLoading: false }));
  if (!res.ok) {
    return rejectWithValue(res?.error || '');
  }
  return [type, query, res];
});

export type SectionData = {
  isActive: boolean;
  all: UnionObject[];
  using: UnionObject[];
  recent: UnionObject[];
  searchInput: string;
  isListLoading: boolean;
  isViewMoreModalOpen: boolean;
  viewMoreSearchInput: string;
  viewMoreSelected: UnionObject[];
  viewMoreLastQuery: string;
};

const getInitialSectionData = (): SectionData => ({
  isActive: false,
  all: [],
  using: [],
  recent: [],
  searchInput: '',
  isListLoading: false,
  isViewMoreModalOpen: false,
  viewMoreSearchInput: '',
  viewMoreSelected: [],
  viewMoreLastQuery: '',
});

const initialSidebarState = (): SidebarState => {
  const initialState: SidebarState = {
    series: getInitialSectionData(),
    topics: getInitialSectionData(),
    authors: getInitialSectionData(),
    licensees: getInitialSectionData(),
  };

  const {
    id: postId,
    series,
    topic,
    authors,
    licensee_ids: licenseeIds,
  } = initialPost;
  if (series) {
    initialState.series.isActive = true;
    initialState.series.using.push({ type: 'series', ...series });
  }
  if (topic) {
    initialState.topics.isActive = true;
    initialState.topics.using.push({ type: 'topics', ...topic });
  }
  if (authors && authors.length) {
    initialState.authors.isActive = true;
    initialState.authors.using = authors.map((author) => ({
      type: 'authors',
      ...author,
    }));
  }

  // initial for licensees
  const defaultLicenseeIds = unit.default_licensee_ids;
  let usingLicensees = [];
  if (postId) {
    usingLicensees = chLicensees.filter((licensee) => {
      return licenseeIds.indexOf(licensee.id) !== -1;
    });
  } else {
    usingLicensees = chLicensees.filter((licensee) => {
      return defaultLicenseeIds.indexOf(licensee.id) !== -1;
    });
  }
  initialState.licensees.isActive = usingLicensees.length > 0;
  initialState.licensees.recent = chLicensees.map((licensee) => ({
    type: 'licensees',
    ...licensee,
  }));
  initialState.licensees.using = usingLicensees.map((licensee) => ({
    type: 'licensees',
    ...licensee,
  }));

  return initialState;
};

export type SidebarState = {
  series: SectionData;
  topics: SectionData;
  authors: SectionData;
  licensees: SectionData;
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: initialSidebarState(),
  reducers: {
    setIsActive: (
      state,
      action: PayloadAction<{ type: UnionObjectType; isActive: boolean }>
    ) => {
      const { type, isActive } = action.payload;
      state[type].isActive = isActive;
    },
    toggleUsingItem: (
      state,
      action: PayloadAction<{ type: UnionObjectType; item: UnionObject }>
    ) => {
      const { type, item } = action.payload;
      const { using } = state[type];
      // close modal if series or topics
      if (type === 'series' || type === 'topics') {
        state[type].isViewMoreModalOpen = false;
      }
      // toggle using
      const index = using.findIndex((v) => v.id === item.id);
      if (index === -1) {
        if (type === 'series' || type === 'topics') state[type].using = [];
        state[type].using.push(item);
        return;
      }
      state[type].using = using.filter((_, i) => i !== index);
    },
    toggleViewMoreSelectedItem: (
      state,
      action: PayloadAction<{ type: UnionObjectType; item: UnionObject }>
    ) => {
      const { type, item } = action.payload;
      const { viewMoreSelected } = state[type];
      const index = viewMoreSelected.findIndex((v) => v.id === item.id);
      if (index === -1) {
        state[type].viewMoreSelected.push(item);
        return;
      }
      state[type].viewMoreSelected = viewMoreSelected.filter(
        (_, i) => i !== index
      );
    },
    applyViewMoreSelectedItem: (
      state,
      action: PayloadAction<UnionObjectType>
    ) => {
      const type = action.payload;
      state[type].using = state[type].viewMoreSelected;
      state[type].isViewMoreModalOpen = false;
      state[type].viewMoreSelected = [];
      state[type].viewMoreSearchInput = '';
      state[type].viewMoreLastQuery = '';
    },
    setIsListLoading: (
      state,
      action: PayloadAction<{ type: UnionObjectType; isLoading: boolean }>
    ) => {
      const { type, isLoading } = action.payload;
      state[type].isListLoading = isLoading;
    },
    openViewMoreModal: (state, action: PayloadAction<UnionObjectType>) => {
      const type = action.payload;
      state[type].isViewMoreModalOpen = true;
      state[type].viewMoreSelected = state[type].using;
    },
    closeViewMoreModal: (state, action: PayloadAction<UnionObjectType>) => {
      const type = action.payload;
      state[type].isViewMoreModalOpen = false;
      state[type].viewMoreSelected = [];
      state[type].viewMoreSearchInput = '';
      state[type].viewMoreLastQuery = '';
    },
    applyViewMoreSearchInput: (
      state,
      action: PayloadAction<UnionObjectType>
    ) => {
      const type = action.payload;
      state[type].viewMoreLastQuery = state[type].viewMoreSearchInput;
    },
    setViewMoreSearchInput: (
      state,
      action: PayloadAction<{ type: UnionObjectType; input: string }>
    ) => {
      const { type, input } = action.payload;
      state[type].viewMoreSearchInput = input;
    },
    setSearchInput: (
      state,
      action: PayloadAction<{ type: UnionObjectType; input: string }>
    ) => {
      const { type, input } = action.payload;
      state[type].searchInput = input;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(recentObjects.fulfilled, (state, action) => {
      const { series, topics } = action.payload;
      if (series) {
        state.series.recent = series.map((item) => ({
          type: 'series',
          ...item,
        }));
      }
      if (topics) {
        state.topics.recent = topics.map((item) => ({
          type: 'topics',
          ...item,
        }));
      }
    });
    builder.addCase(listObject.fulfilled, (state, action) => {
      const [type, query, res] = action.payload;
      state[type].viewMoreLastQuery = query;
      const { series, topics, authors } = res;
      if (series) {
        state.series.all = series.map((item) => ({ type: 'series', ...item }));
      }
      if (topics) {
        state.topics.all = topics.map((item) => ({ type: 'topics', ...item }));
      }
      if (authors) {
        state.authors.all = [];
        authors.forEach((author) => {
          if (state.authors.all.some((a) => a.id === author.id)) return;
          state.authors.all.push({
            type: 'authors',
            ...author,
          });
        });
      }
    });
    builder.addCase(createSeries.fulfilled, (state, action) => {
      state.series.using = [{ type: 'series', ...action.payload }];
    });
    builder.addCase(createTopic.fulfilled, (state, action) => {
      state.topics.using = [{ type: 'topics', ...action.payload }];
    });
  },
});
export const {
  setIsActive,
  toggleUsingItem,
  toggleViewMoreSelectedItem,
  applyViewMoreSelectedItem,
  openViewMoreModal,
  closeViewMoreModal,
  setIsListLoading,
  applyViewMoreSearchInput,
  setViewMoreSearchInput,
  setSearchInput,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
