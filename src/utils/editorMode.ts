import { EditorMode } from '../store/editor';
import { initialPost } from './const';

const STORAGE_KEY = 'editorMode';
const DEFAULT_MODE = 'richText';

const unsupportedSyntaxes = [
  '<!-- nordot-rich-editor-unsupported -->',
  '<nordot-rich-editor-unsupported>',
];

export function isRichEditorUnsupported(htmlBody: string): boolean {
  return unsupportedSyntaxes.some((syntax) => htmlBody.includes(syntax));
}

function isValidMode(mode: string | null): mode is EditorMode {
  return mode === 'richText' || mode === 'markdown';
}

export function setEditorModeLocal(mode: EditorMode): void {
  localStorage.setItem(STORAGE_KEY, mode);
}

export function getEditorModeLocal(): EditorMode {
  const mode = localStorage.getItem(STORAGE_KEY);
  if (isValidMode(mode)) {
    return mode;
  }

  setEditorModeLocal(DEFAULT_MODE);
  return DEFAULT_MODE;
}

export function getInitialEditorMode(): EditorMode {
  return isRichEditorUnsupported(initialPost.body)
    ? 'markdown'
    : getEditorModeLocal();
}
