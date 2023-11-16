import React from 'react';

import { TableContentHeader } from '../../../../apis';
import ArticleTableContentHeader from './ArticleTableContentHeader';

type Props = {
  tableContentHeaders: TableContentHeader[];
  goToHeader: (headerId: string) => void;
};

const ArticleTableContent = ({
  tableContentHeaders,
  goToHeader,
}: Props): JSX.Element => {
  return (
    <ol className="maIndexList">
      {tableContentHeaders.map((header, i) => (
        <ArticleTableContentHeader
          key={i}
          tableContentHeader={header}
          goToHeader={goToHeader}
        />
      ))}
    </ol>
  );
};

export default ArticleTableContent;
