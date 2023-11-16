import { axiosPost, BaseApiRequest, BaseApiResponse, Topic } from '.';
import { unitId } from '../utils/const';

export type CreateTopicParam = BaseApiRequest & {
  title: string;
};

export type CreateTopicResponse = BaseApiResponse & {
  topic: Topic;
};
export const createTopic = ({
  title,
}: CreateTopicParam): Promise<CreateTopicResponse> => {
  const data = new FormData();
  data.append('title', title);
  return axiosPost(`/cms/ch/${unitId}/topics/createTopic`, data);
};
