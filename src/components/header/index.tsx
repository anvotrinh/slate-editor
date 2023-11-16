import React from 'react';

import { PostStatus } from '../../apis';
import HeaderMenuLabel from './HeaderMenuLabel';
import HeaderGoPrivate from './HeaderGoPrivate';
import HeaderMenuSave from './HeaderMenuSave';

type Props = {
  savePost: (status: PostStatus) => void;
};
const Header = ({ savePost }: Props): JSX.Element => {
  return (
    <div className="main__header">
      <header className="mainHeader">
        <div className="mainHeader__leftContent">
          <div className="mainHeader__content">
            <HeaderMenuLabel />
          </div>
        </div>
        <HeaderGoPrivate />
        <HeaderMenuSave savePost={savePost} />
      </header>
    </div>
  );
};

export default Header;
