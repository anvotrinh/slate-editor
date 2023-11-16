import React from 'react';
import { useSlate } from 'slate-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setLinkModalFormat, setLinkModalText } from '../../../store/modal';
import { isBlockActive } from '../../../utils/block';
import i18n from '../../../utils/i18n';
import { toFormalURL } from '../../../utils/link';
import EmbedContent from '../embed/EmbedContent';

const LinkModalOptions = (): JSX.Element | null => {
  const editor = useSlate();
  const dispatch = useAppDispatch();
  const { isInfoLoading } = useAppSelector((state) => state.embed);
  const {
    linkElement,
    linkModalUrl,
    linkModalFormat,
    linkModalText,
    linkModalFetchedEmbed,
  } = useAppSelector((state) => state.modal);

  const isEditingMode = !!linkElement;
  if (isEditingMode) {
    return (
      <div className="modal-editorTextForm__detail">
        <div className="modal-editorTextForm__detailList">
          <label className="insertLinkDetailList__label">
            {i18n.get('text_label')}
          </label>
          <input
            className="insertLinkDetailList__inputText"
            type="text"
            value={linkModalText}
            onChange={(e) => dispatch(setLinkModalText(e.target.value))}
          />
        </div>
      </div>
    );
  }

  if (!linkModalUrl) {
    return null;
  }

  if (isInfoLoading) {
    return (
      <div className="modal-editorTextForm__loading">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="modal-editorTextForm__detail">
      <div className="modal-editorTextForm__detailList">
        <ul className="insertLinkDetailList">
          <li className="insertLinkDetailList__item">
            <input
              className="insertLinkDetailList__inputRadio"
              id="insertLinkByUrl"
              checked={linkModalFormat === 'url'}
              type="radio"
              name="format"
              onChange={() => dispatch(setLinkModalFormat('url'))}
            />
            <label
              className="insertLinkDetailList__label insertLinkDetailList__label--radio"
              htmlFor="insertLinkByUrl"
            >
              URL
              <p className="insertLinkDetailList__dummyLinkText">
                {toFormalURL(linkModalUrl)}
              </p>
            </label>
          </li>
          <li className="insertLinkDetailList__item">
            <input
              className="insertLinkDetailList__inputRadio"
              id="insertLinkByText"
              checked={linkModalFormat === 'text'}
              type="radio"
              name="format"
              onChange={() => dispatch(setLinkModalFormat('text'))}
            />
            <label
              className="insertLinkDetailList__label insertLinkDetailList__label--radio"
              htmlFor="insertLinkByText"
            >
              Text
              <input
                className="insertLinkDetailList__inputText"
                type="text"
                value={linkModalText}
                onChange={(e) => dispatch(setLinkModalText(e.target.value))}
              />
            </label>
          </li>
          {linkModalFetchedEmbed && !isBlockActive(editor, 'footnote') && (
            <li className="insertLinkDetailList__item">
              <input
                className="insertLinkDetailList__inputRadio"
                id="insertLinkByEmbed"
                checked={linkModalFormat === 'embed'}
                type="radio"
                name="format"
                onChange={() => dispatch(setLinkModalFormat('embed'))}
              />
              <label
                className="insertLinkDetailList__label insertLinkDetailList__label--radio"
                htmlFor="insertLinkByEmbed"
              >
                Embed
                <div className="insertLinkDetailList__embed">
                  <div className="ma">
                    <EmbedContent element={linkModalFetchedEmbed} />
                  </div>
                </div>
              </label>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LinkModalOptions;
