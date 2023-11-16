import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';
import 'moment-timezone';

import { RootState } from '.';
import * as api from '../apis';
import { Post } from '../apis';
import { ImageBlob } from '../components/coverImage/utils';
import { getPostDisplayState } from '../utils/common';
import { initialPost, member, unit } from '../utils/const';
import {
  isUnlimitedDate,
  isZeroDate,
  toUnitTimezoneDate,
  unlimitedISOTime,
  zeroISOTime,
} from '../utils/date';
import overlay from '../utils/overlay';

export const parsePost = createAsyncThunk<
  api.ParsePostResponse,
  api.ParsePostParams,
  {
    rejectValue: string;
  }
>('post/parse', async (params, { rejectWithValue }) => {
  const res = await api.parsePost(params);
  if (!res.ok) {
    return rejectWithValue(res?.error || '');
  }
  return res;
});

export const savePost = createAsyncThunk<
  api.BaseApiResponse,
  {
    status: api.PostStatus;
    coverImageBlob: Blob | null;
    bodyMarkdown: string;
  },
  {
    rejectValue: string;
    state: RootState;
  }
>('post/save', async (params, { rejectWithValue, getState }) => {
  const {
    post,
    publishOption,
    expireOption,
    isNotifyCurator,
    isSourceUrlActive,
  } = getState().post;
  const { series, topics, authors, licensees } = getState().sidebar;
  const { selectedTags } = getState().publishTag;
  // upload cover image if any changes
  let coverImageId = '';
  if (params.coverImageBlob) {
    const uploadRes = await api.uploadImage({ file: params.coverImageBlob });
    if (!uploadRes.ok) {
      return rejectWithValue(uploadRes?.error || '');
    }
    coverImageId = uploadRes.data.id;
  } else if (post.cover_image) {
    coverImageId = post.cover_image.id;
  }
  // get publishedAt and expiredAt date
  const initialPostState = getPostDisplayState(initialPost);
  let { published_at: publishedAt, expired_at: expiredAt } = post;
  const { default_post_expire_days: defaultPostExpireDays } = unit;
  if (params.status === 'draft') {
    publishedAt = zeroISOTime;
    expiredAt = zeroISOTime;
  } else {
    if (publishOption === 'current_time') {
      publishedAt = moment().tz('UTC').format();
    }
    if (expireOption === 'no_date') {
      expiredAt = unlimitedISOTime;
    } else if (expireOption === 'unit_default') {
      expiredAt = moment(publishedAt)
        .add(defaultPostExpireDays, 'days')
        .format();
    }
  }
  // other params
  let savePostParams: api.SavePostParams = {
    postId: post.id,
    status: params.status,
    title: post.title,
    subtitle: post.subtitle,
    body: params.bodyMarkdown,
    publishedAt: publishedAt,
    expiredAt: expiredAt,
    seriesId:
      series.isActive && series.using.length > 0 ? series.using[0].id : '',
    topicId:
      topics.isActive && topics.using.length > 0 ? topics.using[0].id : '',
    authorIds: authors.isActive
      ? authors.using.map((author) => author.id).join(',')
      : '',
    sourceUrl: isSourceUrlActive ? post.source_url : '',
    licenseeIds: licensees.isActive
      ? licensees.using.map((licensee) => licensee.id).join(',')
      : '',
    coverImageId: coverImageId,
  };

  if (params.status !== 'draft') {
    savePostParams.tags = selectedTags.join(',');
  }

  if (initialPostState === 'published' && params.status === 'private') {
    savePostParams = {
      postId: post.id,
      status: params.status,
    };
  }

  if (post.id === '') {
    savePostParams.creatorId = member.id;
  } else {
    savePostParams.updaterId = member.id;
    savePostParams.isNotifyCurator = isNotifyCurator;
  }

  const saveRes = await api.savePost(savePostParams);
  if (!saveRes.ok) {
    return rejectWithValue(saveRes?.error || '');
  }
  return saveRes;
});

export type PublishOption = 'current_time' | 'select_date';
export type ExpireOption = 'no_date' | 'unit_default' | 'select_date';
type PostState = {
  post: Post;
  publishOption: PublishOption;
  expireOption: ExpireOption;
  isSaving: boolean;
  isSaved: boolean;
  isNotifyCurator: boolean;
  shouldValidateTitle: boolean;
  coverImage: ImageBlob | null;
  isSourceUrlActive: boolean;
};

const getInitialPublishOption = (): PublishOption => {
  return isZeroDate(initialPost.published_at) ? 'current_time' : 'select_date';
};
const getInitialExpireOption = (): ExpireOption => {
  const { expired_at: expiredAt } = initialPost;
  const { default_post_expire_days: defaultPostExpireDays } = unit;
  if (isUnlimitedDate(expiredAt)) {
    return 'no_date';
  } else if (isZeroDate(expiredAt)) {
    return defaultPostExpireDays ? 'unit_default' : 'no_date';
  }
  return 'select_date';
};
const initialState: PostState = {
  post: initialPost,
  publishOption: getInitialPublishOption(),
  expireOption: getInitialExpireOption(),
  isSaving: false,
  isSaved: false,
  isNotifyCurator: false,
  shouldValidateTitle: !!initialPost.title,
  coverImage: null,
  isSourceUrlActive: !!initialPost.source_url,
};

const postSlice = createSlice({
  name: 'post',
  initialState: initialState,
  reducers: {
    setPostTitle: (state, action: PayloadAction<string>) => {
      state.post.title = action.payload;
    },
    setPostSubtitle: (state, action: PayloadAction<string>) => {
      state.post.subtitle = action.payload;
    },
    setPostPublishedAt: (state, action: PayloadAction<string>) => {
      state.post.published_at = toUnitTimezoneDate(action.payload);
    },
    setPostExpiredAt: (state, action: PayloadAction<string>) => {
      state.post.expired_at = toUnitTimezoneDate(action.payload);
    },
    setPublishOption: (state, action: PayloadAction<PublishOption>) => {
      state.publishOption = action.payload;
    },
    setExpireOption: (state, action: PayloadAction<ExpireOption>) => {
      state.expireOption = action.payload;
    },
    setNotifyCurator: (state, action: PayloadAction<boolean>) => {
      state.isNotifyCurator = action.payload;
    },
    setShouldValidateTitle: (state, action: PayloadAction<boolean>) => {
      state.shouldValidateTitle = action.payload;
    },
    deleteCoverImage: (state) => {
      state.post.cover_image = null;
    },
    setPostSourceUrl: (state, action: PayloadAction<string>) => {
      state.post.source_url = action.payload;
    },
    setIsSourceUrlActive: (state, action: PayloadAction<boolean>) => {
      state.isSourceUrlActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(savePost.pending, (state) => {
      state.isSaving = true;
      overlay.show();
    });
    builder.addCase(savePost.fulfilled, (state) => {
      state.isSaving = false;
      state.isSaved = true;
      overlay.hide();
    });
    builder.addCase(savePost.rejected, (state) => {
      state.isSaving = false;
      overlay.hide();
    });
  },
});
export const {
  setPostTitle,
  setPostSubtitle,
  setPostPublishedAt,
  setPostExpiredAt,
  setPublishOption,
  setExpireOption,
  setNotifyCurator,
  setShouldValidateTitle,
  deleteCoverImage,
  setPostSourceUrl,
  setIsSourceUrlActive,
} = postSlice.actions;
export default postSlice.reducer;
