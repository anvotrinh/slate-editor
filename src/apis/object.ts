import { Author, axiosGet, BaseApiRequest, Series, Topic } from '.';
import { BaseApiResponse } from './types';
import { unitId } from '../utils/const';

type ObjectType = 'series' | 'topics' | 'authors';
export type ObjectResponse = BaseApiResponse & {
  series?: Series[];
  topics?: Topic[];
  authors?: Author[];
};

export const recentObjects = (type: ObjectType): Promise<ObjectResponse> => {
  return axiosGet(`/cms/ch/${unitId}/${type}/recent`);
};

export type ListObjectParams = BaseApiRequest & {
  type: ObjectType;
  query: string;
};
export const listObject = ({
  type,
  query,
}: ListObjectParams): Promise<ObjectResponse> => {
  return axiosGet(`/cms/ch/${unitId}/${type}/list`, {
    params: {
      query,
      offset: 0,
      limit: 100,
      author_only: true,
    },
  });
};
