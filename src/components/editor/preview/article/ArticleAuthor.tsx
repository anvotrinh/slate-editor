import React from 'react';

import { useAppSelector } from '../../../../hooks/redux';
import { Author } from '../../../../apis';

const ArticleAuthor = (): JSX.Element | null => {
  const { authors } = useAppSelector((state) => state.sidebar);

  const chosenAuthors = authors.using as Author[];
  if (!authors.isActive || chosenAuthors.length === 0) return null;

  return (
    <>
      {chosenAuthors && chosenAuthors.length > 0 && (
        <p className="modal-preview__author">
          <span className="modal-preview__-">By</span>
          {chosenAuthors.map((author) => (
            <span className="modal-preview__authorName" key={author.id}>
              {author.name}
            </span>
          ))}
        </p>
      )}
    </>
  );
};

export default ArticleAuthor;
