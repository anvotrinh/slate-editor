import React from 'react';

import { useAppSelector } from '../../hooks/redux';
import { getPostDisplayState } from '../../utils/common';
import { initialPost, unit } from '../../utils/const';
import i18n from '../../utils/i18n';
import PublishSettingPublishDate from './PublishSettingPublishDate';
import { formatDate } from '../../utils/date';

const PublishSettingPublishDisplay = (): JSX.Element | null => {
  const { post } = useAppSelector((state) => state.post);
  const { published_at: publishedAt } = post;

  const postDisplayState = getPostDisplayState(initialPost);
  switch (postDisplayState) {
    case 'new':
    case 'draft':
    case 'publishing':
      return <PublishSettingPublishDate />;
    case 'published':
    case 'private': {
      return (
        <div className="setDisclosure" style={{ color: 'black' }}>
          <p key="p" className="setDisclosure__date">
            {`${i18n.get('published_at')}: `}
            <span className="setDisclosure__dateDetail">
              {formatDate(publishedAt, unit.timezone)}
            </span>
          </p>
        </div>
      );
    }
    case 'expired':
      return (
        <div
          className="setDisclosure setDisclosure--expiredStatus"
          style={{ color: 'black' }}
        >
          <p className="setDisclosure__date setDisclosure__date--expiredStatus">
            {`${i18n.get('published_at')}: `}
            <span className="setDisclosure__dateDetail">
              {formatDate(publishedAt, unit.timezone)}
            </span>
          </p>
        </div>
      );
    default:
      return null;
  }
};

export default PublishSettingPublishDisplay;
