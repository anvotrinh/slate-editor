import { axiosGet } from '.';
import { BaseApiRequest, BaseApiResponse } from './types';

export type InfoEmbeddedPageParams = BaseApiRequest & {
  url: string;
};
export type InfoEmbeddedPageResponse = BaseApiResponse & {
  embeddedpage: {
    iframe_url: string;
    title: string;
    url: string;
  };
};
export const infoEmbeddedPage = ({
  url,
}: InfoEmbeddedPageParams): Promise<InfoEmbeddedPageResponse> => {
  return axiosGet('/cms/embeddedPages.info', { params: { url } });
};
