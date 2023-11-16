import React, { CSSProperties } from 'react';
import cx from 'classnames';

import { TableContentHeader } from '../../../../apis';

type Props = {
  tableContentHeader: TableContentHeader;
  goToHeader: (headerId: string) => void;
};

const ArticleTableContentHeader = ({
  tableContentHeader,
  goToHeader,
}: Props): JSX.Element => {
  const { level, has_indent, padding_left, header_id, content } =
    tableContentHeader;

  const liClassName = cx({
    maIndexList__item: true,
    'maIndexList__item--indent': level > 1,
    'maIndexList__item--hasIndent': level <= 1 && has_indent,
  });
  const linkClassName = cx({
    maIndexList__indexLink: true,
    'maIndexList__indexLink--indent': level > 1,
  });
  const linkStyle: CSSProperties = {};
  if (level > 2) {
    linkStyle.paddingLeft = `${padding_left}px`;
  }
  const headerId = `#h-no-${header_id}`;
  return (
    <li key={header_id} className={liClassName}>
      <a
        onClick={(e) => {
          e.preventDefault();
          goToHeader(headerId);
        }}
        className={linkClassName}
        style={linkStyle}
        href={headerId}
      >
        {content}
      </a>
    </li>
  );
};

export default ArticleTableContentHeader;
