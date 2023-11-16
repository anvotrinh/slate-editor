import React, { useCallback, useEffect, useRef, useState } from 'react';
import Editor, { SlateEditorRef } from './components/editor';
import Header from './components/header';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import i18n from './utils/i18n';
import { savePost, setPostSubtitle, setPostTitle } from './store/post';
import CoverImage from './components/coverImage';
import PublishSettingModal from './components/publishSettingModal';
import GoPrivateModal from './components/header/GoPrivateModal';
import CoverImageCropModal from './components/coverImage/CoverImageCropModal';
import { ImageBlob } from './components/coverImage/utils';
import Sidebar from './components/sidebar';
import { PostStatus } from './apis';
import { showAlertMessage } from './utils/common';
import { initialPost, unitId } from './utils/const';

function App(): JSX.Element {
  const { editorMode, slateInitialValue } = useAppSelector(
    (state) => state.editor
  );
  const dispatch = useAppDispatch();
  const { post, isSaved, shouldValidateTitle } = useAppSelector(
    (state) => state.post
  );
  const [coverImageBlob, setCoverImageBlob] = useState<ImageBlob | null>(null);
  const editorRef = useRef<SlateEditorRef>(null);

  const onBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (isSaved) return null;
      const bodyMarkdown = editorRef.current?.getContentMarkdown() || '';
      const hasUnsavedChanges =
        post.title !== initialPost.title ||
        post.subtitle !== initialPost.subtitle ||
        bodyMarkdown !== initialPost.markdown ||
        post.cover_image !== initialPost.cover_image ||
        !!coverImageBlob;

      if (hasUnsavedChanges) {
        const msg = 'unsavedWarning';
        e.returnValue = msg;
        return msg;
      }
      return null;
    },
    [post, coverImageBlob, isSaved]
  );

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [onBeforeUnload]);

  const handleSavePost = async (status: PostStatus) => {
    const payload = {
      status,
      coverImageBlob: coverImageBlob?.blob || null,
      bodyMarkdown: editorRef.current?.getContentMarkdown() || '',
    };
    const resultAction = await dispatch(savePost(payload));
    if (savePost.rejected.match(resultAction)) {
      showAlertMessage(resultAction.payload, 'update_failed');
      return;
    }
    setTimeout(() => {
      window.location.href = `/cms/ch/${unitId}/posts`;
    }, 1000);
  };

  const getPostBodyMarkdown = () =>
    editorRef.current?.getContentMarkdown() || '';

  return (
    <div>
      <div className="page__wrapper">
        <div className="page__leftBar">
          <Sidebar />
        </div>
        <div className="page__main">
          <main className="main">
            <Header savePost={handleSavePost} />
            <div className="main__contents main__contents--editor">
              <div className="editor">
                {initialPost.cover_image && (
                  <CoverImage
                    imageBlob={coverImageBlob}
                    setImageBlob={setCoverImageBlob}
                  />
                )}
                <div className="modal-editFormList__inputWrapper">
                  <input
                    type="text"
                    onChange={(e) => dispatch(setPostTitle(e.target.value))}
                    value={post.title}
                    className="editor__mainTitle"
                    placeholder={i18n.get('title')}
                    autoFocus
                  />
                  {shouldValidateTitle && post.title === '' && (
                    <div className="modal-editFormList__error modal-editFormList__error--title">
                      <p className="modal-editFormList__text">
                        {i18n.get('empty_title_message')}
                      </p>
                    </div>
                  )}
                </div>
                {initialPost.subtitle !== '' && (
                  <input
                    type="text"
                    onChange={(e) => dispatch(setPostSubtitle(e.target.value))}
                    value={post.subtitle}
                    className="editor__subTitle"
                    placeholder={i18n.get('subtitle_placeholder')}
                  />
                )}
                <Editor
                  key={editorMode}
                  ref={editorRef}
                  initialValue={slateInitialValue}
                  coverImageBlob={coverImageBlob}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="page__modal">
        <CoverImageCropModal setImageBlob={setCoverImageBlob} />
        <PublishSettingModal
          savePost={handleSavePost}
          getPostBodyMarkdown={getPostBodyMarkdown}
        />
        <GoPrivateModal savePost={handleSavePost} />
      </div>
    </div>
  );
}

export default App;
