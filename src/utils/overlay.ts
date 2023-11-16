import { isHTMLElement } from './dom';

class Overlay {
  overlayDOM: HTMLElement | null = null;
  constructor() {
    this.overlayDOM = document.querySelector('.js-loadingWindow');
    if (this.overlayDOM) return;
    // if not exist, add loading dom to body
    const wrapperDOM = document.createElement('div');
    wrapperDOM.innerHTML =
      '<div class="js-loadingWindow"><div class="js-loadingWindow__item"><span></span><span></span><span></span><span></span><span></span></div></div>';
    if (wrapperDOM.childNodes.length !== 1) return;
    if (!isHTMLElement(wrapperDOM.childNodes[0])) return;
    this.overlayDOM = wrapperDOM.childNodes[0];
    document.body.appendChild(this.overlayDOM);
  }

  hide = (): void => {
    this.overlayDOM && this.overlayDOM.classList.remove('show');
  };

  show = (): void => {
    this.overlayDOM && this.overlayDOM.classList.add('show');
  };
}

export default new Overlay();
