var defaults = {
    altIsMeta: true,
    bindingFiles: ['bindings/base.js', 'bindings/emacs.js'],
    bindingText: ''
};

for (var k in defaults) {
    if (!config.has(k)) {
        config.set(k, defaults[k]);
    }
};

// TODO: Should send updated bindings to all tabs on change.

chrome.extension.onConnect.addListener(function(port) {
    switch (port.name) {
    case 'getConfig':
        port.onMessage.addListener(function(req) {
            port.postMessage({
                altIsMeta: config.get('altIsMeta')
            });
        });
        break;
    case 'getBindings':
        port.onMessage.addListener(function(req) {
            port.postMessage({
                name: 'options.html',
                text: config.get('bindingText')
            });
        });
        break;
    }
});
