import React from 'react';
import cx from 'classnames';
import { useAppSelector } from '../../../../hooks/redux';
import moment from 'moment';

const ArticleDateAndShareButton = (): JSX.Element | null => {
  const { post } = useAppSelector((state) => state.post);
  const { previewModalDevice } = useAppSelector((state) => state.modal);
  const shareButtonClassName = cx('modal-preview__snsDummyButton', {
    'modal-preview__snsDummyButton--mobile': previewModalDevice === 'mobile',
  });
  const publishedAt =
    post.published_at === ''
      ? ''
      : moment(post.published_at).format('YYYY/MM/DD HH:mm');

  return (
    <div className="modal-preview__dateWrapper">
      <p className="modal-preview__date">{publishedAt}</p>
      <div className="modal-preview__sns">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div className={shareButtonClassName} key={i} />
        ))}
      </div>
    </div>
  );
};

export default ArticleDateAndShareButton;
