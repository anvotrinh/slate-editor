import cx from 'classnames';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppSelector } from '../../../hooks/redux';
import ImageModalItem from './ImageModalItem';
import ImageModalItemLoading from './ImageModalItemLoading';

type Props = {
  isDragActive: boolean;
  onScrollNext: (shouldReset: boolean) => void;
};

const ImageModalContent = ({
  isDragActive,
  onScrollNext,
}: Props): JSX.Element => {
  const { images, isSearchLoading, hasNextSearchPage } = useAppSelector(
    (state) => state.image
  );

  const listClass = cx({
    'modal-editorImage__list': true,
    'js-dropArea': isDragActive,
  });
  return (
    <div className={listClass}>
      <ul
        id="js-scrollableImageList"
        className="imageList imageList--editor js-uploadedImageList"
      >
        <InfiniteScroll
          dataLength={images.length}
          next={() => onScrollNext(false)}
          hasMore={hasNextSearchPage}
          loader={<ImageModalItemLoading />}
          scrollableTarget="js-scrollableImageList"
        >
          {images.map((image) => (
            <ImageModalItem key={image.id} image={image} />
          ))}
          {isSearchLoading && images.length === 0 && <ImageModalItemLoading />}
        </InfiniteScroll>
      </ul>
    </div>
  );
};

export default ImageModalContent;
