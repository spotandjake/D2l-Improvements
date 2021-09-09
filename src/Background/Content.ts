// Inject The Stop 
const script = document.createElement('script');
script.innerText = 'window.stop()';
document.body.appendChild(script);
// Clear Page
document.head.replaceChildren();
document.body.replaceChildren();
// Fetch Our Content
fetch(chrome.runtime.getURL('./Foreground/index.html'), { credentials: 'include' }).then(async (_content) => {
  const content = await _content.text();
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(content, 'text/html');
  const rebuildNode = (node: Element): Element => {
    let newNode;
    switch (node.nodeName) {
      case 'SCRIPT':
        newNode = document.createElement('script');
        if ((<HTMLScriptElement>node).async) newNode.async = (<HTMLScriptElement>node).async;
        if ((<HTMLScriptElement>node).defer) newNode.defer = (<HTMLScriptElement>node).defer;
        if ((<HTMLScriptElement>node).noModule) newNode.noModule = (<HTMLScriptElement>node).noModule;
        if ((<HTMLScriptElement>node).src) newNode.src = (<HTMLScriptElement>node).src;
        if ((<HTMLScriptElement>node).type) newNode.type = (<HTMLScriptElement>node).type;
        if ((<HTMLScriptElement>node).textContent) newNode.textContent = (<HTMLScriptElement>node).textContent;
        if ((<HTMLScriptElement>node).id) newNode.id = (<HTMLScriptElement>node).id;
        break;
      case 'META':
      case 'TITLE':
        newNode = node.cloneNode(true);
        break;
      default:
        newNode = node.cloneNode(true);
    }
    return <Element>newNode;
  };
  [...htmlDoc.head.children].forEach((node) => {
    document.head.appendChild(rebuildNode(node));
  });
  [...htmlDoc.body.children].forEach((node) => {
    document.body.appendChild(rebuildNode(node));
  });
  // Make Sure Our Content Loads
}).catch(e => console.log(e));