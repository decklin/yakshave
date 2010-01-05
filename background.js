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

// Shitty XHR wrapper, take 3 or 4. Action!

function xhr(req, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(req.method, req.url, true);
    for (h in req.headers) {
        xhr.setRequestHeader(h, req.headers[h]);
    }
    xhr.onreadystatechange = function() {
        if (this.readyState === 4)
            callback.call(this);
    };
    xhr.send(req.data);
}

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
            config.get('bindingFiles').forEach(function(f) {
                xhr({method: 'GET', url: f}, function() {
                    port.postMessage({
                        name: f,
                        text: this.responseText
                    });
                });
            });
            port.postMessage({
                name: 'options.html',
                text: config.get('bindingText')
            });
        });
        break;
    }
});
