import moment from 'moment';
import { Post } from '../apis';
import i18n from './i18n';

export function encodeURL(url: string): string {
  return url.replace(/\)/g, '%29');
}

export function showConfirmMessage(key: string): boolean {
  return confirm(i18n.get(key));
}

export function showAlertMessage(
  key: string | undefined,
  defaultKey?: string
): void {
  if (!key) return;
  if (defaultKey && !i18n.has(key)) {
    alert(i18n.get(defaultKey));
    return;
  }
  alert(i18n.get(key));
}

export function delay(time: number): Promise<unknown> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export type PostDisplayState =
  | 'new'
  | 'draft'
  | 'publishing'
  | 'private'
  | 'expired'
  | 'published';
export function getPostDisplayState(post: Post): PostDisplayState {
  const { published_at: publishedAt, expired_at: expiredAt } = post;
  const now = moment();
  const isPublishing = publishedAt !== '' && moment(publishedAt) > now;
  const isExpired = expiredAt !== '' && moment(expiredAt) < now;

  if (!post.id) {
    return 'new';
  } else if (post.status === 'draft') {
    return 'draft';
  } else if (isPublishing) {
    return 'publishing';
  } else if (post.status === 'private') {
    return 'private';
  } else if (isExpired) {
    return 'expired';
  }
  return 'published';
}

export function isPublishedPost(post: Post): boolean {
  return ['public', 'private'].includes(post.status);
}
