var safeExternalLink = /(noopener|noreferrer) (noopener|noreferrer)/;
var protocolLink = /^[\w-_]+:/;

module.exports = (cb, root) => {
  if (typeof window != 'object') throw new Error('Window is not an object');
  root = root || window.document;
  if (typeof root != 'object') throw new Error('Root is not an object');

  window.addEventListener('click', (ev) => {
    if ((ev.button && ev.button !== 0) || ev.ctrlKey || ev.metaKey || ev.altKey || ev.shiftKey || ev.defaultPrevented) return;

    const traverse = (node) => {
      if (!node || node === root) return;

      if (node.localName !== 'a' || node.href === undefined) {
        return traverse(node.parentNode);
      }

      return node;
    };

    const anchor = traverse(ev.target);

    if (!anchor) return;

    if (window.location.origin !== anchor.origin || anchor.hasAttribute('download') || (anchor.getAttribute('target') === '_blank' && safeExternalLink.test(anchor.getAttribute('rel'))) || protocolLink.test(anchor.getAttribute('href'))) return;

    ev.preventDefault();
    cb(anchor);
  });
};
