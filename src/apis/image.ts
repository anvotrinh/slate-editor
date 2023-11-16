import { axiosGet, axiosPost } from '.';
import { unitId } from '../utils/const';
import { BaseApiResponse, BaseApiRequest, Paging, ChImage } from './types';

export type SearchImagesParams = BaseApiRequest & {
  query: string;
  page: number;
};
export type SearchImagesResponse = BaseApiResponse & {
  data: {
    images: ChImage[];
    paging: Paging;
  };
};
export const searchImages = ({
  query,
  page,
  config,
}: SearchImagesParams): Promise<SearchImagesResponse> => {
  return axiosGet(`/cms/ch/${unitId}/images/search`, {
    ...config,
    params: {
      query,
      page,
    },
  });
};

export type UploadImageParams = BaseApiRequest & {
  file: File | Blob;
};
export type UploadImageResponse = BaseApiResponse & {
  data: ChImage;
};
export const uploadImage = ({
  file,
  config,
}: UploadImageParams): Promise<UploadImageResponse> => {
  const data = new FormData();
  data.append('file', file);

  return axiosPost(`/cms/ch/${unitId}/images/upload`, data, {
    ...config,
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
};

export type UpdateImageParams = BaseApiRequest & {
  imageId: string;
  caption?: string;
};
export type UpdateImageResponse = BaseApiResponse & {
  data: ChImage;
};
export const updateImage = ({
  imageId,
  caption,
}: UpdateImageParams): Promise<UpdateImageResponse> => {
  const data = new FormData();
  data.append('image_id', imageId);
  if (caption !== undefined) {
    data.append('caption', caption);
  }

  return axiosPost(`/cms/ch/${unitId}/images/update`, data);
};

export type DeleteImageParams = BaseApiRequest & {
  imageId: string;
};
export const deleteImage = ({
  imageId,
}: DeleteImageParams): Promise<BaseApiResponse> => {
  const data = new FormData();
  data.append('image_id', imageId);

  return axiosPost(`/cms/ch/${unitId}/images/delete`, data);
};
