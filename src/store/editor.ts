import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Descendant } from 'slate';
import { initialPost } from '../utils/const';
import deserialize from '../utils/deserialize';
import { getEditorModeLocal } from '../utils/editorMode';
import { getEmptyParagraph } from '../utils/paragraph';
import { parsePost } from './post';

type EditorState = {
  editorMode: EditorMode;
  editorReadOnly: boolean;
  markdownText: string;
  slateInitialValue: Descendant[];
};

export type EditorMode = 'richText' | 'markdown';

const getSlateValueFromInitialPost = (): Descendant[] => {
  if (!initialPost.body) {
    return [getEmptyParagraph()];
  }
  return deserialize(initialPost.body);
};

const initialState: EditorState = {
  editorMode: getEditorModeLocal(),
  editorReadOnly: false,
  markdownText: initialPost.markdown,
  slateInitialValue: getSlateValueFromInitialPost(),
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setEditorMode: (state, action: PayloadAction<EditorMode>) => {
      state.editorMode = action.payload;
    },
    setMarkdownText: (state, action: PayloadAction<string>) => {
      state.markdownText = action.payload;
    },
    setSlateInitialValue: (state, action: PayloadAction<Descendant[]>) => {
      state.slateInitialValue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(parsePost.pending, (state) => {
      state.editorReadOnly = true;
    });
    builder.addCase(parsePost.fulfilled, (state) => {
      state.editorReadOnly = false;
    });
    builder.addCase(parsePost.rejected, (state) => {
      state.editorReadOnly = false;
    });
  },
});

export const { setEditorMode, setMarkdownText, setSlateInitialValue } =
  editorSlice.actions;
export default editorSlice.reducer;
