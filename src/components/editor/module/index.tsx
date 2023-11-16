import React from 'react';
import { RenderElementProps } from 'slate-react';

import { CustomText } from '../Leaf';
import { isElementHasType } from '../../../utils/element';

const Module = ({
  attributes,
  children,
  element,
}: RenderElementProps): JSX.Element | null => {
  if (!isElementHasType<ModuleElement>(element, 'module')) return null;
  return (
    <div className="ma__customModule" {...attributes}>
      <div className="maCustomModule">
        <p className="maCustomModule__title">Module</p>
        <p className="maCustomModule__id">
          <span className="maCustomModule__label">MODULE ID:</span>
          <span className="maCustomModule__data">{element.moduleId}</span>
        </p>
        <p className="maCustomModule__id">
          <span className="maCustomModule__label">CONTEXT ID:</span>
          <span className="maCustomModule__data">
            {element.moduleContextId}
          </span>
        </p>
        {children}
      </div>
    </div>
  );
};

export type ModuleElement = {
  type: 'module';
  moduleId: string;
  moduleContextId: string;
  children: CustomText[];
};

export default Module;
