import React, { useEffect, useRef } from 'react';
import { useAppSelector } from '../../../../hooks/redux';
import ArticleAuthor from './ArticleAuthor';
import { loadEmbedToDOM } from '../utils';
import ArticleDateAndShareButton from './ArticleDateAndShareButton';

type Props = {
  coverImageHtml: string;
};

const ArticlePC = ({ coverImageHtml }: Props): JSX.Element | null => {
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
  const containerStyle = previewModalDevice === 'pc' ? {} : { display: 'none' };

  return (
    <div className="modal-preview__-" style={containerStyle}>
      <div className=" modal-preview__titleWrapper--pc">
        <h1 className="modal-preview__title modal-preview__title--pc">
          {title} {subtitle}
        </h1>
        <ArticleDateAndShareButton />
        <ArticleAuthor />
      </div>
      <div className="modal-preview__articleBodyWrapper">
        <div className="modal-preview__articleBody modal-preview__articleBody--pc">
          <div className="modal-preview__-">
            <article ref={articleRef} onClick={(e) => e.preventDefault()}>
              <div
                className="ma"
                dangerouslySetInnerHTML={{ __html: `${coverImageHtml}${html}` }}
              />
            </article>
          </div>
          {unit.copyright_owner && (
            <p className="modal-preview__copyrightOwner modal-preview__copyrightOwner--pc">
              &copy; {unit.copyright_owner}
            </p>
          )}
        </div>
        <div className="modal-preview__rightbar">
          <div className="modal-preview__adStickyWrapper">
            <div className="modal-preview__dummyAd modal-preview__dummyAd--rectangle" />
            <div className="modal-preview__dummyAd modal-preview__dummyAd--tall" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePC;
