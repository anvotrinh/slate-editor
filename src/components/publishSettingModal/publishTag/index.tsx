import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { resetPublishTagState } from '../../../store/publishTag';
import i18n from '../../../utils/i18n';
import RecommendList from './RecommendList';
import SuggestionList from './SuggestionList';
import TagInput from './TagInput';

type Props = {
  getPostBodyMarkdown: () => string;
};
const PublishSettingTag = (props: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { isPublishModalOpen } = useAppSelector((state) => state.modal);

  useEffect(() => {
    if (!isPublishModalOpen) return;
    dispatch(resetPublishTagState());
  }, [dispatch, isPublishModalOpen]);

  return (
    <div className="modal-editFormList__addLabelWrapper">
      <TagInput />
      <SuggestionList />
      <p className="modal-editFormList__subTitle">
        {i18n.get('recommend_tags')}
      </p>
      <RecommendList {...props} />
    </div>
  );
};

export default PublishSettingTag;
