import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../apis';

export const createTopic = createAsyncThunk<
  api.Topic,
  string,
  {
    rejectValue: string;
  }
>('topic/create', async (title, { rejectWithValue }) => {
  const res = await api.createTopic({ title });
  if (!res.ok) {
    return rejectWithValue(res?.error || '');
  }
  return res.topic;
});
