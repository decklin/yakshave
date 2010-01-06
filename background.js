var defaults = {
    altIsMeta: true,
    debugEnabled: false,
    bindingFiles: ['bindings/base.js', 'bindings/emacs.js'],
    urlEnabled: false,
    bindingUrl: 'http://localhost:2562/bindings.js',
    bindingText: ''
};

for (var k in defaults) {
    if (!config.has(k)) {
        config.set(k, defaults[k]);
    }
};

// The callback here might be a real function in our environment, or
// it might be a wrapper created by the extension machinery that
// serializes its args to JSON and sends them over to something that
// will unpack them and call the content script's original callback.
// So... We both set the context *and* pass the XHR back as an argument.
// Normal code will ignore args and use the context, and the extension
// wrapper will ignore context and send back the arg. It's ugly, but
// it makes everyone else's life easier.

function xhr(req, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(req.method, req.url, true);
    for (h in req.headers) {
        xhr.setRequestHeader(h, req.headers[h]);
    }
    xhr.onreadystatechange = function() {
        if (this.readyState === 4)
            callback.call(this, this);
    };
    xhr.send(req.data);
}

// Global cache so we don't re-fetch them for every content script
// FIXME: this is racy, a page could load and run the content script
// immediately after we load and before the files are read.

var bindingFiles;

function fetchBindingFiles() {
    bindingFiles = [
        {name: 'options.html', text: config.get('bindingText')}
    ];

    var fileNames = config.get('bindingFiles');
    if (config.get('urlEnabled'))
        fileNames.push(config.get('bindingUrl'));

    fileNames.forEach(function(f) {
        xhr({method: 'GET', url: f}, function() {
            bindingFiles.push({name: f, text: this.responseText});
        });
    });
}

fetchBindingFiles();

// XHR will go through the simple callback interface. It would be nice
// if we could put this below with a name (we can only sanely use the
// callback interface for one thing), but sending the results back
// asynchronously would be painful for binding authors. Bindings should
// look easy.
//
// See discussion in xhr() above for why the last argument is called
// 'send' and not 'callback'.

chrome.extension.onRequest.addListener(function(req, src, send) {
    xhr(req, send);
});

// Everything else will be on its own port. TODO: Should send updated
// bindings to all tabs on change.

chrome.extension.onConnect.addListener(function(port) {
    switch (port.name) {
    case 'getConfig':
        port.onMessage.addListener(function(req) {
            port.postMessage({
                debugEnabled: config.get('debugEnabled'),
                altIsMeta: config.get('altIsMeta')
            });
        });
        break;
    case 'getBindings':
        port.onMessage.addListener(function(req) {
            port.postMessage({
                bindingFiles: bindingFiles
            });
        });
        break;
    case 'reloadBindings':
        port.onMessage.addListener(function(req) {
            fetchBindingFiles();
        });
        break;
    }
});
