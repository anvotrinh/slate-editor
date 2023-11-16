import React from 'react';
import i18n from '../../utils/i18n';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { openPublishModal } from '../../store/modal';
import { setNotifyCurator, setShouldValidateTitle } from '../../store/post';
import { PostStatus } from '../../apis';
import {
  getPostDisplayState,
  isPublishedPost,
  showAlertMessage,
} from '../../utils/common';

const draftLabelMap: Record<string, string> = {
  new: i18n.get('save_draft'),
  draft: i18n.get('update'),
  publishing: i18n.get('revert_to_draft'),
  private: i18n.get('update'),
};

const saveLabelMap: Record<string, string> = {
  new: i18n.get('go_publish'),
  draft: i18n.get('go_publish'),
  publishing: i18n.get('go_update'),
  published: i18n.get('go_update'),
  private: i18n.get('go_publish'),
  expired: i18n.get('go_update'),
};

type Props = {
  savePost: (status: PostStatus) => void;
};
const HeaderMenuSave = ({ savePost }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { post, isSaving } = useAppSelector((state) => state.post);
  const postState = getPostDisplayState(post);

  const handleSaveDraft = () => {
    if (postState === 'private') {
      savePost('private');
      return;
    }

    if (isPublishedPost(post) && postState !== 'publishing') {
      showAlertMessage('error_draft_published_post');
      return;
    }
    dispatch(setShouldValidateTitle(true));
    if (!post.title) return;
    savePost('draft');
  };

  const handleSave = () => {
    dispatch(setShouldValidateTitle(true));
    if (!post.title) return;
    dispatch(setNotifyCurator(false));
    dispatch(openPublishModal());
  };

  const draftLabel = draftLabelMap[postState];
  const saveLabel = saveLabelMap[postState];
  return (
    <div className="mainHeader__rightContent">
      {draftLabel && (
        <button
          className="mainHeader__button mainHeader__button--positive-o"
          type="button"
          disabled={isSaving}
          onClick={handleSaveDraft}
        >
          {draftLabel}
        </button>
      )}
      <button
        className="mainHeader__button mainHeader__button--positive"
        type="button"
        disabled={isSaving}
        onClick={handleSave}
      >
        {saveLabel}
      </button>
    </div>
  );
};

export default HeaderMenuSave;
