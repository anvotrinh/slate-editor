import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../../../../hooks/redux';
import ArticleAuthor from './ArticleAuthor';
import { loadEmbedToDOM } from '../utils';
import ArticleDateAndShareButton from './ArticleDateAndShareButton';

type Props = {
  coverImageHtml: string;
};

const ArticleMobile = ({ coverImageHtml }: Props): JSX.Element | null => {
  const { post } = useAppSelector((state) => state.post);
  const { isPreviewModalOpen, previewModalDevice, previewModalArticleData } =
    useAppSelector((state) => state.modal);
  const { html } = previewModalArticleData;
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isPreviewModalOpen || !html) return;
    articleRef.current && loadEmbedToDOM(articleRef.current);
  }, [isPreviewModalOpen, html]);

  const { title, subtitle, unit } = post;
  const containerStyle =
    previewModalDevice === 'mobile' ? {} : { display: 'none' };

  return (
    <div
      className="modal-preview__article modal-preview__article--mobile"
      style={containerStyle}
    >
      <h1 className="modal-preview__title modal-preview__title--mobile">
        {title} {subtitle}
      </h1>
      <ArticleAuthor />
      <ArticleDateAndShareButton />
      <div className="modal-preview__articleBody">
        <article
          ref={articleRef}
          className="ma ma--mobilePatch"
          dangerouslySetInnerHTML={{ __html: `${coverImageHtml}${html}` }}
          onClick={(e) => e.preventDefault()}
        />
        {unit.copyright_owner && (
          <p className="modal-preview__copyrightOwner modal-preview__copyrightOwner--mobile">
            &copy; {unit.copyright_owner}
          </p>
        )}
      </div>
    </div>
  );
};

export default ArticleMobile;
