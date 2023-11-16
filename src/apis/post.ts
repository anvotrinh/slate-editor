import { axiosGet, axiosPost, PostStatus, TableContentHeader } from '.';
import { unitId } from '../utils/const';
import { BaseApiResponse, BaseApiRequest } from './types';

type ParsePostFormat = 'editor' | 'html';
export type ParsePostParams = BaseApiRequest & {
  body: string;
  format: ParsePostFormat;
};
export type ParsePostResponse = BaseApiResponse & {
  html: string;
  headers: TableContentHeader[];
};
export const parsePost = ({
  body,
  format,
}: ParsePostParams): Promise<ParsePostResponse> => {
  const data = new FormData();
  data.append('body', body);
  data.append('body_format', 'markdown');
  data.append('format', format);

  return axiosPost(`/cms/ch/${unitId}/posts/parse`, data);
};

export type SavePostParams = {
  postId: string;
  status: PostStatus;
  title?: string;
  subtitle?: string;
  body?: string;
  publishedAt?: string;
  expiredAt?: string;
  seriesId?: string;
  topicId?: string;
  authorIds?: string;
  sourceUrl?: string;
  licenseeIds?: string;
  tags?: string;
  coverImageId?: string;
  creatorId?: string;
  updaterId?: string;
  isNotifyCurator?: boolean;
};
export const savePost = async ({
  postId,
  status,
  title,
  subtitle,
  body,
  publishedAt,
  expiredAt,
  seriesId,
  topicId,
  authorIds,
  sourceUrl,
  licenseeIds,
  tags,
  coverImageId,
  creatorId,
  updaterId,
  isNotifyCurator,
}: SavePostParams): Promise<BaseApiResponse> => {
  const data = new FormData();
  data.append('post_id', postId);
  data.append('status', status);
  if (title !== undefined) {
    data.append('title', title);
  }
  if (subtitle !== undefined) {
    data.append('subtitle', subtitle);
  }
  if (body !== undefined) {
    data.append('body', body);
  }
  if (publishedAt !== undefined) {
    data.append('published_at', publishedAt);
  }
  if (expiredAt !== undefined) {
    data.append('expired_at', expiredAt);
  }
  if (seriesId !== undefined) {
    data.append('series_id', seriesId);
  }
  if (topicId !== undefined) {
    data.append('topic_id', topicId);
  }
  if (authorIds !== undefined) {
    data.append('author_ids', authorIds);
  }
  if (sourceUrl !== undefined) {
    data.append('source_url', sourceUrl);
  }
  if (licenseeIds !== undefined) {
    data.append('licensee_ids', licenseeIds);
  }
  if (tags !== undefined) {
    data.append('tags', tags);
  }
  if (coverImageId !== undefined) {
    data.append('cover_image_id', coverImageId);
  }
  if (creatorId !== undefined) {
    data.append('creator_id', creatorId);
  }
  if (updaterId !== undefined) {
    data.append('updater_id', updaterId);
  }
  if (isNotifyCurator !== undefined) {
    data.append('is_notify_curator', isNotifyCurator ? 'true' : 'false');
  }

  return axiosPost(
    `/cms/ch/${unitId}/posts/${postId ? 'update' : 'create'}`,
    data
  );
};

export type RecommendPostParams = BaseApiRequest & {
  title: string;
  subtitle: string;
  body: string;
};
type RecommendPostData = {
  tags: string[];
};
export type RecommendPostResponse = BaseApiResponse & {
  recommend: RecommendPostData | null;
};
export const recommendPost = ({
  title,
  subtitle,
  body,
}: RecommendPostParams): Promise<RecommendPostResponse> => {
  return axiosGet(`/cms/ch/${unitId}/posts/recommend`, {
    params: {
      limit: 5,
      title,
      subtitle,
      body,
      body_format: 'markdown',
    },
  });
};
