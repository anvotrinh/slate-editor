import { axiosGet, TagStat } from '.';
import { BaseApiRequest, BaseApiResponse } from './types';

export type ListTagStatParams = BaseApiRequest & {
  name: string;
};
export type ListTagStatResponse = BaseApiResponse & {
  tag_stats: TagStat[];
};
export const listTagStat = ({
  name,
}: ListTagStatParams): Promise<ListTagStatResponse> => {
  return axiosGet('/cms/ch/tagStats/list', {
    params: { name, offset: 0, limit: 20 },
  });
};
