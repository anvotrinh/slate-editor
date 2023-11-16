import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import * as api from '../apis';
import {
  getTagInputError,
  normalizeTag,
} from '../components/publishSettingModal/utils';
import { initialPost } from '../utils/const';

export const listTagStat = createAsyncThunk<
  [string, api.TagStat[]],
  string,
  {
    rejectValue: string;
  }
>('publishTag/list', async (name, { rejectWithValue }) => {
  const res = await api.listTagStat({ name });
  if (!res.ok) {
    return rejectWithValue(res?.error || '');
  }
  return [name, res.tag_stats];
});

export const listRecommendTag = createAsyncThunk<
  string[],
  string,
  {
    rejectValue: string;
    state: RootState;
  }
>(
  'publishTag/recommend',
  async (bodyMarkdown, { rejectWithValue, getState }) => {
    const { title, subtitle } = getState().post.post;
    const res = await api.recommendPost({
      title,
      subtitle,
      body: bodyMarkdown,
    });
    if (!res.ok) {
      return rejectWithValue(res?.error || '');
    }
    return res.recommend?.tags || [];
  }
);

export type PublishTagState = {
  isRecommendLoading: boolean;
  isSuggestLoading: boolean;
  selectedTags: string[];
  recommendTags: string[];
  suggestionTagStats: api.TagStat[];
  tagInput: string;
  tagInputError: string;
  isFocusTagInput: boolean;
  selectedSuggestionIndex: number;
  isSuggestionListHovered: boolean;
};

const initialState: PublishTagState = {
  isRecommendLoading: false,
  isSuggestLoading: false,
  selectedTags: initialPost.tags || [],
  recommendTags: [],
  suggestionTagStats: [],
  tagInput: '',
  tagInputError: '',
  isFocusTagInput: false,
  selectedSuggestionIndex: -1,
  isSuggestionListHovered: false,
};

export const publishTagSlice = createSlice({
  name: 'publishTag',
  initialState,
  reducers: {
    addTag: (state) => {
      if (state.selectedTags.length >= 5 || state.tagInputError) return;
      state.selectedTags.push(normalizeTag(state.tagInput));
      state.tagInput = '';
      state.suggestionTagStats = [];
      state.selectedSuggestionIndex = -1;
    },
    chooseTag: (state, action: PayloadAction<string>) => {
      if (state.selectedTags.length >= 5) return;
      state.tagInput = '';
      state.suggestionTagStats = [];
      state.selectedSuggestionIndex = -1;
      state.selectedTags.push(action.payload);
    },
    deleteTag: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload === undefined) {
        state.selectedTags = state.selectedTags.slice(0, -1);
        return;
      }
      state.selectedTags = state.selectedTags.filter(
        (tag) => tag !== action.payload
      );
    },
    setTagInputText: (state, action: PayloadAction<string>) => {
      state.tagInput = action.payload;
      state.tagInputError = getTagInputError(action.payload);
      state.selectedSuggestionIndex = -1;
      state.suggestionTagStats = [];
    },
    focusTagInput: (state) => {
      state.isFocusTagInput = true;
      state.tagInput = '';
      state.tagInputError = '';
      state.suggestionTagStats = [];
      state.isSuggestionListHovered = false;
    },
    blurTagInput: (state) => {
      state.isFocusTagInput = false;
      state.tagInput = '';
      state.tagInputError = '';
      state.suggestionTagStats = [];
      state.isSuggestionListHovered = false;
      state.selectedSuggestionIndex = -1;
    },
    setSelectedSuggestionIndex: (state, action: PayloadAction<number>) => {
      state.selectedSuggestionIndex = action.payload;
    },
    setIsSuggestionListHovered: (state, action: PayloadAction<boolean>) => {
      state.isSuggestionListHovered = action.payload;
    },
    resetPublishTagState: (state) => ({
      ...initialState,
      isRecommendLoading: state.isRecommendLoading,
      selectedTags: state.selectedTags,
    }),
  },
  extraReducers: (builder) => {
    // listTagStat
    builder.addCase(listTagStat.pending, (state) => {
      state.isSuggestLoading = true;
    });
    builder.addCase(listTagStat.fulfilled, (state, action) => {
      state.isSuggestLoading = false;
      const [input, tagStats] = action.payload;
      if (state.tagInput !== input) return;
      state.suggestionTagStats = tagStats.filter(
        (tagStat) => !state.selectedTags.includes(tagStat.name)
      );
    });
    builder.addCase(listTagStat.rejected, (state) => {
      state.isSuggestLoading = false;
    });
    // listRecommendTag
    builder.addCase(listRecommendTag.pending, (state) => {
      state.isRecommendLoading = true;
    });
    builder.addCase(listRecommendTag.fulfilled, (state, action) => {
      state.isRecommendLoading = false;
      state.recommendTags = action.payload;
    });
    builder.addCase(listRecommendTag.rejected, (state) => {
      state.isRecommendLoading = false;
    });
  },
});
export const {
  setTagInputText,
  focusTagInput,
  blurTagInput,
  addTag,
  chooseTag,
  deleteTag,
  setSelectedSuggestionIndex,
  setIsSuggestionListHovered,
  resetPublishTagState,
} = publishTagSlice.actions;

export default publishTagSlice.reducer;
