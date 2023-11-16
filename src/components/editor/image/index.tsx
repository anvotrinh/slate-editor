import React from 'react';
import { RenderElementProps, useFocused, useSlate } from 'slate-react';
import cx from 'classnames';
import { FaTrashAlt } from 'react-icons/fa';

import { CustomText } from '../Leaf';
import { removeImage } from '../../../utils/image';
import { isInsideOf } from '../../../utils/block';
import { isElementHasType, isElementSelected } from '../../../utils/element';

const Image = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  const editor = useSlate();
  const isSelected = isElementSelected(editor, element);
  const isFocused = useFocused();
  if (!isElementHasType<ImageElement>(element, 'image')) return null;

  const { src, naturalWidth, caption } = element;

  const isFloatRight = naturalWidth < 600;
  const isFloatCenter = naturalWidth >= 600;
  const isInsideBox = isInsideOf(editor, element, ['box', 'blockquote']);
  const containerClass = cx({
    'js-editorEditImage': true,
    ma__void: true,
    'ma__figure ma__void--image': true,
    'ma__void--imageCenter': isFloatCenter,
    'ma__figure--right ma__void--imageRight': isFloatRight,
    'ma__figure--boxed ma__void--imageBoxed': isInsideBox,
    'ma__figure--boxedRight ma__void--imageBoxedRight':
      isInsideBox && isFloatRight,
  });

  const btnStyle = isSelected && isFocused ? {} : { display: 'none' };
  const imgClass = cx({
    maFigure__img: true,
    editing: isSelected && isFocused,
  });
  return (
    <div className={containerClass} {...attributes}>
      {children}
      <div className="maFigure">
        <div className="maFigure__imgWrapper">
          <img className={imgClass} src={src} alt={caption} />
        </div>
        <div className="maFigure__figcaption">{caption}</div>
        <ul className="menuList" style={btnStyle}>
          <li className="menuListItem">
            <button
              className="menuItem"
              type="button"
              onMouseDown={() => removeImage(editor, element)}
            >
              <FaTrashAlt aria-hidden="true" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export type ImageElement = {
  type: 'image';
  id: string;
  src: string;
  caption: string;
  naturalWidth: number;
  children: CustomText[];
};

export default Image;
