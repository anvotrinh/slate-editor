import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node } from 'slate';

import * as api from '../apis';
import { BlockQuoteElement } from '../components/editor/blockquote';
import { EmbedElement } from '../components/editor/embed';
import { LinkElement } from '../components/editor/link';
import { createEmbedElement } from '../utils/embed';
import { infoEmbeddedPage } from './embed';
import { CodeElement } from '../components/editor/code';
import { parsePost } from './post';

export type LinkFormat = 'url' | 'text' | 'embed';
export type PreviewModalDevice = 'mobile' | 'pc';

type OpenLinkModalPayload = {
  linkElement?: LinkElement;
  url?: string;
};

type ModalState = {
  // blockquote modal
  isBlockQuoteCiteModalOpen: boolean;
  blockQuoteElement: BlockQuoteElement | null;
  // image modal
  isImageModalOpen: boolean;
  // link modal
  isLinkModalOpen: boolean;
  linkElement: LinkElement | null;
  linkModalUrl: string;
  linkModalFormat: LinkFormat;
  linkModalText: string;
  linkModalFetchedEmbed: EmbedElement | null;
  shouldLinkModalPreserveText: boolean;
  // code language modal
  isCodeLanguageModalOpen: boolean;
  codeElement: CodeElement | null;
  codeModalLanguage: string;
  // preview modal
  isPreviewModalOpen: boolean;
  previewModalDevice: PreviewModalDevice;
  previewModalArticleData: Omit<api.ParsePostResponse, 'ok' | 'error'>;
  // publish modal
  isPublishModalOpen: boolean;
  // go private modal
  isGoPrivateModalOpen: boolean;
  // cover image crop modal
  isCoverImageCropModalOpen: boolean;
  coverImageToBeCroppedUrl: string;
};

const initialState: ModalState = {
  // blockquote modal
  isBlockQuoteCiteModalOpen: false,
  blockQuoteElement: null,
  // image modal
  isImageModalOpen: false,
  // link modal
  isLinkModalOpen: false,
  linkElement: null,
  linkModalUrl: '',
  linkModalFormat: 'text',
  linkModalText: '',
  linkModalFetchedEmbed: null,
  shouldLinkModalPreserveText: false,
  // code language modal
  isCodeLanguageModalOpen: false,
  codeElement: null,
  codeModalLanguage: '',
  // preview modal
  isPreviewModalOpen: false,
  previewModalDevice: 'mobile',
  previewModalArticleData: {
    html: '',
    headers: [],
  },
  // publish modal
  isPublishModalOpen: false,
  // go private modal
  isGoPrivateModalOpen: false,
  // cover image crop modal
  isCoverImageCropModalOpen: false,
  coverImageToBeCroppedUrl: '',
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    // blockquote modal
    openBlockQuoteCiteModal: (
      state,
      action: PayloadAction<BlockQuoteElement>
    ) => {
      state.isBlockQuoteCiteModalOpen = true;
      state.blockQuoteElement = action.payload;
    },
    closeBlockQuoteCiteModal: (state) => {
      state.isBlockQuoteCiteModalOpen = false;
      state.blockQuoteElement = null;
    },
    // image modal
    openImageModal: (state) => {
      state.isImageModalOpen = true;
    },
    closeImageModal: (state) => {
      state.isImageModalOpen = false;
    },
    // link modal
    openLinkModal: (
      state,
      action: PayloadAction<OpenLinkModalPayload | undefined>
    ) => {
      const { linkElement, url } = action.payload || {};
      state.isLinkModalOpen = true;
      state.linkElement = linkElement || null;
      state.linkModalUrl = url || state.linkModalUrl;
    },
    closeLinkModal: (state) => {
      state.isLinkModalOpen = false;
      state.linkElement = null;
      state.linkModalUrl = '';
      state.linkModalFormat = 'text';
      state.linkModalText = '';
      state.linkModalFetchedEmbed = null;
      state.shouldLinkModalPreserveText = false;
    },
    setLinkElementAndInfo: (state, action: PayloadAction<LinkElement>) => {
      const linkElement = action.payload;
      state.linkElement = linkElement;
      state.linkModalUrl = linkElement.url;
      state.linkModalText = Node.string(linkElement);
    },
    setLinkModalUrl: (state, action: PayloadAction<string>) => {
      state.linkModalUrl = action.payload;
    },
    setLinkModalFormat: (state, action: PayloadAction<LinkFormat>) => {
      state.linkModalFormat = action.payload;
    },
    setLinkModalText: (state, action: PayloadAction<string>) => {
      state.linkModalText = action.payload;
    },
    setShouldLinkModalPreserveText: (state, action: PayloadAction<boolean>) => {
      state.shouldLinkModalPreserveText = action.payload;
    },
    // code language modal
    openCodeLanguageModal: (state, action: PayloadAction<CodeElement>) => {
      state.isCodeLanguageModalOpen = true;
      state.codeElement = action.payload;
      state.codeModalLanguage = action.payload.language;
    },
    closeCodeLanguageModal: (state) => {
      state.isCodeLanguageModalOpen = false;
      state.codeElement = null;
      state.codeModalLanguage = '';
    },
    setCodeModalLanguage: (state, action: PayloadAction<string>) => {
      state.codeModalLanguage = action.payload;
    },
    // preview modal
    openPreviewModal: (state) => {
      state.isPreviewModalOpen = true;
    },
    closePreviewModal: (state) => {
      state.isPreviewModalOpen = false;
      state.previewModalDevice = 'mobile';
    },
    setPreviewModalDevice: (
      state,
      action: PayloadAction<PreviewModalDevice>
    ) => {
      state.previewModalDevice = action.payload;
    },
    // publish modal
    openPublishModal: (state) => {
      state.isPublishModalOpen = true;
    },
    closePublishModal: (state) => {
      state.isPublishModalOpen = false;
    },
    // go private modal
    openGoPrivateModal: (state) => {
      state.isGoPrivateModalOpen = true;
    },
    closeGoPrivateModal: (state) => {
      state.isGoPrivateModalOpen = false;
    },
    // cover image crop modal
    openCoverImageCropModal: (state, action: PayloadAction<string>) => {
      state.coverImageToBeCroppedUrl = action.payload;
      state.isCoverImageCropModalOpen = true;
    },
    closeCoverImageCropModal: (state) => {
      state.isCoverImageCropModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(infoEmbeddedPage.pending, (state) => {
      state.linkModalFetchedEmbed = null;
      if (!state.shouldLinkModalPreserveText) {
        state.linkModalText = '';
      }
    });
    builder.addCase(infoEmbeddedPage.fulfilled, (state, action) => {
      const { url, iframe_url, title } = action.payload.embeddedpage;
      const embedElement = createEmbedElement(url, iframe_url);
      state.linkModalFetchedEmbed = embedElement;
      state.linkModalText = state.shouldLinkModalPreserveText
        ? state.linkModalText
        : title;
      // switch to embed format if none text twitter
      if (
        embedElement &&
        embedElement.type === 'embed-twitter' &&
        !state.linkModalText
      ) {
        state.linkModalFormat = 'embed';
      }
    });
    builder.addCase(parsePost.fulfilled, (state, action) => {
      state.previewModalArticleData = action.payload;
    });
  },
});

export const {
  openBlockQuoteCiteModal,
  closeBlockQuoteCiteModal,
  openImageModal,
  closeImageModal,
  openLinkModal,
  closeLinkModal,
  setLinkElementAndInfo,
  setLinkModalUrl,
  setLinkModalFormat,
  setLinkModalText,
  setShouldLinkModalPreserveText,
  openCodeLanguageModal,
  closeCodeLanguageModal,
  setCodeModalLanguage,
  openPreviewModal,
  closePreviewModal,
  setPreviewModalDevice,
  openPublishModal,
  closePublishModal,
  openGoPrivateModal,
  closeGoPrivateModal,
  openCoverImageCropModal,
  closeCoverImageCropModal,
} = modalSlice.actions;
export default modalSlice.reducer;
