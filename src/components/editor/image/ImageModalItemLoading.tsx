import React from 'react';

const ImageModalItemLoading = (): JSX.Element => (
  <li className="imageList__item">
    <div className="imageList__imgWrapper imageList__imgWrapper--more">
      <div className="imageList__loader">
        <div className="loader" />
      </div>
    </div>
    <div className="imageList__info">
      <textarea className="imageList__textarea" disabled />
    </div>
  </li>
);

export default ImageModalItemLoading;
