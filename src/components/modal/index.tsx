import React, { TouchEvent, MouseEvent, useEffect, useRef } from 'react';

type Props = {
  children: JSX.Element;
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({ children, isOpen, onClose }: Props): JSX.Element | null => {
  const clickedElm = useRef<EventTarget>();

  const handleWrapperEvent = (e: TouchEvent | MouseEvent) => {
    if (!isOpen) return;
    switch (e.type) {
      case 'mousedown':
      case 'touchstart':
        clickedElm.current = e.target;
        return;
      case 'mouseup':
      case 'touchend': {
        if (e.target === clickedElm.current && e.target === e.currentTarget) {
          onClose();
        }
      }
    }
  };

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [onClose]);

  useEffect(() => {
    const pageMain = document.querySelectorAll<HTMLElement>('.page__main')[0];
    if (isOpen) {
      document.body.classList.add('js-noScroll');
      pageMain.style.zIndex = '5';
    } else {
      document.body.classList.remove('js-noScroll');
      pageMain.style.zIndex = '1';
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div
      className="modal"
      onMouseDown={handleWrapperEvent}
      onMouseUp={handleWrapperEvent}
      onTouchStart={handleWrapperEvent}
      onTouchEnd={handleWrapperEvent}
    >
      {children}
    </div>
  );
};

export default Modal;
