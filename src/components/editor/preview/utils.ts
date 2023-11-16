import throttle from 'lodash/throttle';
import { IAceOptions } from 'react-ace';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-perl';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-diff';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/ext-static_highlight';

declare global {
  const ace: {
    acequire: (
      moduleName: string
    ) => (domElement: Element, options: IAceOptions) => void;
  };
}

let prevTableContentHeading: HTMLElement | null;
const headingActiveClass = 'maIndexList__indexLink--active';
export const activeTableContentHeading = throttle(
  (scrollContainer: HTMLElement | null, articleHeadings: HTMLElement[]) => {
    if (!scrollContainer) return;
    const containerTop = scrollContainer.getBoundingClientRect().top;
    // remove prev active class
    prevTableContentHeading &&
      prevTableContentHeading.classList.remove(headingActiveClass);
    // get the current heading
    let currentArticleHeading: HTMLElement | null = null;
    for (let i = 0; i < articleHeadings.length; i++) {
      const articleHeading: HTMLElement = articleHeadings[i];
      const articleHeadingTop = articleHeading.getBoundingClientRect().top;
      const articleHeadingHeight = articleHeading.offsetHeight;
      if (containerTop > articleHeadingTop - articleHeadingHeight) {
        currentArticleHeading = articleHeading;
      } else {
        break;
      }
    }
    // preserve to the prev
    if (currentArticleHeading) {
      const currentTableContentHeading = document.querySelector<HTMLElement>(
        `.ma__index--pc a[href="#${currentArticleHeading.getAttribute('id')}"]`
      );
      if (currentTableContentHeading) {
        currentTableContentHeading.classList.add(headingActiveClass);
        prevTableContentHeading = currentTableContentHeading;
      }
    }
  },
  150
);

const pcHeadingSelectors = [
  '.modal-preview__articleBody--pc .ma__h1',
  '.modal-preview__articleBody--pc .ma__h2',
  '.modal-preview__articleBody--pc .ma__h3',
  '.modal-preview__articleBody--pc .ma__h4',
  '.modal-preview__articleBody--pc .ma__h5',
  '.modal-preview__articleBody--pc .ma__h6',
];
export const getAllPCHeadings = (): HTMLElement[] => {
  return Array.from(
    document.querySelectorAll<HTMLElement>(pcHeadingSelectors.join(', '))
  );
};

export const loadEmbedToDOM = (dom: HTMLElement): void => {
  window.instgrm.Embeds.process();
  window.twttr.widgets.load(dom);
  window.FB.XFBML.parse(dom);
  const highlight = ace.acequire('ace/ext/static_highlight');
  const qsa = document.querySelectorAll('.js-codeHighlight');
  qsa.forEach(function (codeEl) {
    highlight(codeEl, {
      mode: 'ace/mode/' + codeEl.getAttribute('data-ace-mode'),
      theme: 'ace/theme/solarized_dark',
      minLines: 2,
      maxLines: 5000,
      startLineNumber: 1,
      showGutter: false,
      fontSize: 14,
    });
  });
};
