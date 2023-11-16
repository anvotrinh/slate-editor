import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { chooseTag, listRecommendTag } from '../../../store/publishTag';

type Props = {
  getPostBodyMarkdown: () => string;
};
const RecommendList = ({ getPostBodyMarkdown }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { selectedTags, recommendTags, isRecommendLoading } = useAppSelector(
    (state) => state.publishTag
  );
  const { isPublishModalOpen } = useAppSelector((state) => state.modal);

  useEffect(() => {
    if (!isPublishModalOpen) return;
    const bodyMarkdown = getPostBodyMarkdown();
    dispatch(listRecommendTag(bodyMarkdown));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublishModalOpen]);

  const filteredRecommendTags = recommendTags.filter(
    (v) => !selectedTags.includes(v)
  );
  return (
    <div className="modal-editFormList__tagList">
      {isRecommendLoading && (
        <div className="modal-editFormList__loader">
          <div className="loader" />
        </div>
      )}
      <ul className="editorTagList">
        {filteredRecommendTags.map((tag, index) => (
          <li
            key={index}
            className="editorTagList__item"
            onClick={() => dispatch(chooseTag(tag))}
          >
            <span className="tagProperty">
              <p className="tagProperty__title">{tag}</p>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendList;
