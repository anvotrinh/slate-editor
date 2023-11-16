export function scrollToHTMLElement(
  scrollContainer: HTMLElement,
  toElementSelector: string
): void {
  const toElement = document.querySelector(toElementSelector);
  if (!toElement) return;

  const toElementTop = toElement.getBoundingClientRect().top;
  const scrollContainerTop = scrollContainer.getBoundingClientRect().top;
  const top = toElementTop - scrollContainerTop + scrollContainer.scrollTop;
  scrollContainer.scrollTo({ top, behavior: 'smooth' });
}

export const isHTMLElement = (n: Node): n is HTMLElement => {
  return n.nodeType === Node.ELEMENT_NODE;
};

export const isHTMLText = (n: Node): n is Text => {
  return n.nodeType === Node.TEXT_NODE;
};
