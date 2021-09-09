(function(){'use strict';// Inject The Stop 
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
    const rebuildNode = (node) => {
        let newNode;
        switch (node.nodeName) {
            case 'SCRIPT':
                newNode = document.createElement('script');
                if (node.async)
                    newNode.async = node.async;
                if (node.defer)
                    newNode.defer = node.defer;
                if (node.noModule)
                    newNode.noModule = node.noModule;
                if (node.src)
                    newNode.src = node.src;
                if (node.type)
                    newNode.type = node.type;
                if (node.textContent)
                    newNode.textContent = node.textContent;
                if (node.id)
                    newNode.id = node.id;
                break;
            case 'META':
            case 'TITLE':
                newNode = node.cloneNode(true);
                break;
            default:
                newNode = node.cloneNode(true);
        }
        return newNode;
    };
    [...htmlDoc.head.children].forEach((node) => {
        document.head.appendChild(rebuildNode(node));
    });
    [...htmlDoc.body.children].forEach((node) => {
        document.body.appendChild(rebuildNode(node));
    });
    // Make Sure Our Content Loads
}).catch(e => console.log(e));}());