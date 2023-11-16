// Common types

export type BaseApiResponse = {
  ok: boolean;
  error?: string;
};

export type BaseApiRequest = {
  config?: ApiRequestConfig;
};

export type ApiRequestConfig = {
  abortSignal?: AbortSignal;
};

export type Paging = {
  total: number;
  count: number;
  offset: number;
  limit: number;
  has_next: boolean;
};

// Main API types

export type ChImage = {
  id: string;
  filename: string;
  url: string;
  url_w: number;
  url_h: number;
  data_url: string;
  content_type: string;
  thumb_360: string;
  caption: string;
  created_at: string;
  updated_at: string;
  used_by_post: boolean;
  unit: ChUnit;
};

export type ChUnit = {
  id: string;
  name: string;
  copyright_owner: string;
  header_image: ChUnitHeaderImage | null;
  profile_image: ChUnitProfileImage | null;
  language: string;
  timezone: string;
  header_type: string;
  signature_color: string;
  default_post_expire_days: number;
  ga_tracking_id: string;
  website_url: string;
  twitter_url: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  labels?: string[];
  default_licensee_ids: string[];
};

export type ChUnitHeaderImage = {
  url: string;
  thumb_360: string;
};

export type ChUnitProfileImage = {
  url: string;
  square_200: string;
};

export type Post = {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  status: PostStatus;
  description: string;
  published_at: string;
  expired_at: string;
  cover_image: PostImage | null;
  images: PostImage[];
  unit: ChUnit;
  body: string;
  authors: Author[] | null;
  series: Series | null;
  topic: Topic | null;
  thumbnail: ThumbImage | null;
  markdown: string;
  tags: string[] | null;
  licensee_ids: string[];
  source_url: string;
};

export type PostStatus = 'public' | 'private' | 'draft';

export type PostImage = {
  id: string;
  url: string;
  thumb_360: string;
};

export type ThumbImage = {
  url: string;
};

export type Series = {
  id: string;
  title: string;
  cover_image: PostImage | null;
};

export type Topic = {
  id: string;
  title: string;
};

export type Author = {
  id: string;
  email: string;
  name: string;
  job_title: string;
  about: string;
  profile_image: ProfileImage | null;
};

export type ProfileImage = {
  url: string;
  thumb_360: string;
  square_200: string;
};

export type TableContentHeader = {
  level: number;
  content: string;
  padding_left: number;
  has_indent: boolean;
  header_id: number;
};

export type Member = {
  id: string;
  email: string;
  name: string;
};

export type Licensee = {
  id: string;
  name: string;
  profile_image: ProfileImage | null;
};

export type SeriesWithType = Series & {
  type: 'series';
};
export type TopicWithType = Topic & {
  type: 'topics';
};
export type AuthorWithType = Author & {
  type: 'authors';
};
export type LicenseeWithType = Licensee & {
  type: 'licensees';
};
export type UnionObject =
  | SeriesWithType
  | TopicWithType
  | AuthorWithType
  | LicenseeWithType;
export type UnionObjectType = UnionObject['type'];

export type TagStat = {
  name: string;
  post_count: number;
};
