import { axiosPost, BaseApiRequest, BaseApiResponse, Series } from '.';
import { unitId } from '../utils/const';

export type ValidCoverSeriesParams = BaseApiRequest & {
  file: File | Blob;
};
export const validCoverSeries = ({
  file,
}: ValidCoverSeriesParams): Promise<BaseApiResponse> => {
  const data = new FormData();
  data.append('file', file);

  return axiosPost(`/cms/ch/${unitId}/series/validCoverSeries`, data, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export type CreateSeriesParams = BaseApiRequest & {
  title: string;
  coverImage?: File;
  description: string;
  uploadStatus: string;
};

export type CreateSeriesResponse = BaseApiResponse & {
  series: Series;
};
export const createSeries = ({
  title,
  coverImage,
  description,
  uploadStatus,
  config,
}: CreateSeriesParams): Promise<CreateSeriesResponse> => {
  const data = new FormData();
  data.append('title', title);
  data.append('description', description);
  data.append('upload_status', uploadStatus);
  if (coverImage !== undefined) {
    data.append('cover_image', coverImage);
  }
  return axiosPost(`/cms/ch/${unitId}/series/createSeries`, data, {
    ...config,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};
