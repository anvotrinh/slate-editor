import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import cx from 'classnames';

import i18n from '../../utils/i18n';
import { showAlertMessage } from '../../utils/common';
import { setSingleMode } from '../../store/image';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { openCoverImageCropModal, openImageModal } from '../../store/modal';
import { ImageBlob } from './utils';
import { deleteCoverImage } from '../../store/post';

type Props = {
  imageBlob: ImageBlob | null;
  setImageBlob: (imageBlob: ImageBlob | null) => void;
};
const CoverImageDragDrop = ({
  imageBlob,
  setImageBlob,
}: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const { post } = useAppSelector((state) => state.post);

  const handleImageClick = () => {
    dispatch(setSingleMode(true));
    dispatch(openImageModal());
  };

  // if the screen have a Dropzone Component, and user try to drag an image. It'll
  // cause a bug that the cursor doesn't display while dragging. A solution for this bug is
  // unmount another Dropzone Component. The cursor will work again.
  const [showSubDropzone, setShowSubDropzone] = useState(true);
  useEffect(() => {
    setShowSubDropzone(false);
  }, []);

  const handleDrop = (files: File[]) => {
    if (!files.length) {
      showAlertMessage('invalid_image');
      return;
    }
    const imageUrl = URL.createObjectURL(files[0]);
    dispatch(openCoverImageCropModal(imageUrl));
  };

  const hasImage = !!(imageBlob || post.cover_image);
  let imageUrl = '';
  if (imageBlob) {
    imageUrl = imageBlob.url;
  } else if (post.cover_image) {
    imageUrl = post.cover_image.url;
  }
  return (
    <div className="editor__coverImage js-editorEditImage">
      {showSubDropzone && <Dropzone>{() => <></>}</Dropzone>}
      <Dropzone accept="image/*" onDrop={handleDrop} multiple={false} noClick>
        {({ getRootProps, isDragActive, getInputProps }) => (
          <div
            {...getRootProps({
              className: cx('editorCoverImage', {
                'js-dropArea': isDragActive,
              }),
            })}
          >
            <input {...getInputProps()} />
            {hasImage ? (
              <div
                className="editorCoverImage__imgWrapper"
                onClick={handleImageClick}
              >
                <img className="editorCoverImage__img" src={imageUrl} />
              </div>
            ) : (
              <div
                className="editorCoverImage__insertArea"
                onClick={handleImageClick}
              >
                <p className="editorCoverImage__text">
                  {i18n.get('drop_area_message')}
                </p>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {hasImage && (
        <div className="deleteButton">
          <button
            className="menuItem"
            type="button"
            onClick={() => {
              dispatch(deleteCoverImage());
              setImageBlob(null);
            }}
          >
            <i className="fa fa-trash" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CoverImageDragDrop;
