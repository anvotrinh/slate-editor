import React, { useEffect, useRef } from 'react';
import { FaDesktop, FaMobileAlt } from 'react-icons/fa';
import cx from 'classnames';

import Modal from '../../modal';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import ArticlePC from './article/ArticlePC';
import ArticleMobile from './article/ArticleMobile';
import { closePreviewModal, setPreviewModalDevice } from '../../../store/modal';
import i18n from '../../../utils/i18n';
import { activeTableContentHeading, getAllPCHeadings } from './utils';
import { ImageBlob } from '../../coverImage/utils';

export type Props = {
  coverImageBlob: ImageBlob | null;
};

const PreviewModal = ({ coverImageBlob }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { post } = useAppSelector((state) => state.post);
  const { isPreviewModalOpen, previewModalDevice, previewModalArticleData } =
    useAppSelector((state) => state.modal);
  const mobileScrollContainerRef = useRef<HTMLDivElement>(null);
  const pcScrollContainerRef = useRef<HTMLDivElement>(null);
  const headingElementsRef = useRef<HTMLElement[]>([]);

  const { html } = previewModalArticleData;
  useEffect(() => {
    if (!isPreviewModalOpen || !html) return;
    headingElementsRef.current = getAllPCHeadings();
  }, [isPreviewModalOpen, html]);

  const close = () => {
    dispatch(closePreviewModal());
  };

  const pcDeviceClass = cx({
    modal__switchDevice: true,
    'modal__switchDevice--active': previewModalDevice === 'pc',
  });
  const mobileDeviceClass = cx({
    modal__switchDevice: true,
    'modal__switchDevice--mobile': true,
    'modal__switchDevice--active': previewModalDevice === 'mobile',
  });
  const previewClass = cx({
    'modal-preview': true,
    'modal-preview--pc': previewModalDevice === 'pc',
  });
  const previewWrapperClass = cx({
    'modal-preview__wrapper': true,
    'modal-preview__wrapper--mobile': previewModalDevice === 'mobile',
  });
  const previewWrapperStyle = {
    display: previewModalDevice === 'mobile' ? 'block' : 'flex',
  };

  const contentWrapperClass = cx({
    'modal-preview__contentsWrapper': true,
    'modal-preview__contentsWrapper--pc': previewModalDevice === 'pc',
  });

  let coverImageUrl = '';
  if (coverImageBlob) {
    coverImageUrl = coverImageBlob.url;
  } else if (post.cover_image) {
    coverImageUrl = post.cover_image.url;
  }
  let coverImageHtml = '';
  if (coverImageUrl) {
    coverImageHtml = `<div class="ma__figure"><figure class="maFigure"><div class="maFigure__imgWrapper"><img class="maFigure__img" src="${coverImageUrl}"></div></figure></div>`;
  }
  return (
    <Modal isOpen={isPreviewModalOpen} onClose={close}>
      <div style={{ height: '100%' }}>
        <section className="modal__wrapper modal__wrapper--full">
          <header className="modal__header">
            <h5 className="modal__title">{i18n.get('preview')}</h5>
            <button
              className={mobileDeviceClass}
              onClick={() => dispatch(setPreviewModalDevice('mobile'))}
              type="button"
            >
              <FaMobileAlt />
            </button>
            <button
              className={pcDeviceClass}
              onClick={() => dispatch(setPreviewModalDevice('pc'))}
              type="button"
            >
              <FaDesktop />
            </button>
          </header>
          <div className="modal__body modal__body--full modal__body--preview">
            <div
              className={previewClass}
              ref={pcScrollContainerRef}
              onScroll={() =>
                activeTableContentHeading(
                  pcScrollContainerRef.current,
                  headingElementsRef.current
                )
              }
            >
              <div
                className={previewWrapperClass}
                style={previewWrapperStyle}
                ref={mobileScrollContainerRef}
              >
                <div className={contentWrapperClass}>
                  <ArticleMobile coverImageHtml={coverImageHtml} />
                  <ArticlePC coverImageHtml={coverImageHtml} />
                </div>
              </div>
            </div>
          </div>
          <footer className="modal__footer">
            <div className="modal__buttonWrapper" />
            <div className="modal__buttonWrapper">
              <button className="modal__button" type="button" onClick={close}>
                {i18n.get('close')}
              </button>
            </div>
          </footer>
        </section>
      </div>
    </Modal>
  );
};

export default PreviewModal;
