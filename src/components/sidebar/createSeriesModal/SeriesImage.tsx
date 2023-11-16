import React, { forwardRef, Ref, useImperativeHandle, useRef } from 'react';
import Dropzone from 'react-dropzone';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import i18n from '../../../utils/i18n';
import {
  deleteCreateSeriesImage,
  checkSeriesCoverImage,
} from '../../../store/series';
import { showAlertMessage } from '../../../utils/common';

export type SeriesImageRef = {
  getCoverImageFile: () => File | null;
};
type Props = {
  children?: React.ReactNode;
};
const SeriesImage = (_: Props, ref: Ref<SeriesImageRef>): JSX.Element => {
  const dispatch = useAppDispatch();
  const { createSeriesCoverImage } = useAppSelector((state) => state.series);
  const coverImageFile = useRef<File | null>(null);
  useImperativeHandle(
    ref,
    (): SeriesImageRef => ({
      getCoverImageFile: () => {
        return coverImageFile.current;
      },
    })
  );

  const handleDrop = async (files: File[]) => {
    if (files.length === 0) return;
    const resultAction = await dispatch(checkSeriesCoverImage(files[0]));
    if (checkSeriesCoverImage.rejected.match(resultAction)) {
      showAlertMessage('Invalid image');
      return;
    }
    coverImageFile.current = files[0];
  };

  if (!createSeriesCoverImage) {
    return (
      <Dropzone onDrop={handleDrop} accept="image/*" multiple={false}>
        {({ getRootProps, getInputProps, open }) => (
          <div
            {...getRootProps({
              className: 'modal-editFormList__imageUploadArea',
            })}
          >
            <input {...getInputProps()} />
            <div
              className="modal-editFormList__imageUploadAreaDescription"
              onClick={open}
            >
              {i18n.get('dropzone_description').split('\\n').join('\n')}
            </div>
          </div>
        )}
      </Dropzone>
    );
  }

  return (
    <div className="modal-editFormList__imageUploadArea">
      <img
        className="modal-editFormList__imageUploadImg"
        src={createSeriesCoverImage}
        alt="thumbnail"
        width="300"
        height="300"
      />
      <button
        className="modal-editFormList__imageUploadDeleteButton"
        type="button"
        onClick={() => dispatch(deleteCreateSeriesImage())}
      >
        <i className="fa fa-trash" aria-hidden="true"></i>
      </button>
    </div>
  );
};

export default forwardRef(SeriesImage);
