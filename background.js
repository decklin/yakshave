config.defaults({
    altIsMeta: true,
    debugEnabled: false,
    bindingFiles: ['bindings/base.js', 'bindings/emacs.js'],
    urlEnabled: false,
    bindingUrl: 'http://localhost:2562/bindings.js',
    bindingText: ''
});

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
    for (var h in req.headers) {
        xhr.setRequestHeader(h, req.headers[h]);
    }

    xhr.onreadystatechange = function() {
        if (this.readyState === 4)
            callback.call(this, this);
    };

    if (typeof req.data === 'string') {
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send(req.data);
    } else if (typeof req.data === 'object') {
        var pairs = [];
        for (var k in req.data) {
            pairs.push(k + '=' + encodeURIComponent(req.data[k]))
        }
        xhr.setRequestHeader('Content-Type',
                             'application/x-www-form-urlencoded');
        xhr.send(pairs.join('&'));
    } else {
        xhr.send(null);
    }
}

// Binding-script cache. XHR is async, of course, so we can't depend
// on the list being filled in any particular order. Therefore we give
// each file a numeric priority corresponding to where they are on the
// options page (textarea is last, so it always overrides others).
//
// FIXME: There is no way for a content script to tell that the list
// is in fact populated. This is going to fail on a cold start with a
// bunch of tabs. Maybe.

var bindingFiles;

function fetchBindingFiles() {
    bindingFiles = [{
        name: 'options.html',
        text: config.get('bindingText'),
        priority: Number.MAX_VALUE
    }];

    var fileNames = config.get('bindingFiles');
    if (config.get('urlEnabled'))
        fileNames.push(config.get('bindingUrl'));

    fileNames.forEach(function(f, i) {
        xhr({method: 'GET', url: f}, function() {
            bindingFiles.push({
                name: f,
                text: this.responseText,
                priority: i
            });
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
    case 'tabs':
        port.onMessage.addListener(function(req) {
            handleTabReq(req);
        });
        break;
    }
});

// Just current tab for now, but we should figure out a way to let
// bindings select and manipulate the tab object.

function handleTabReq(req) {
    if (req.create) {
        chrome.tabs.create(req.create);
    } else if (req.update) {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.update(tab.id, req.update);
        });
    } else if (req.move) {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.move(tab.id, req.move);
        });
    } else if (req.remove) {
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.remove(tab.id, req.remove);
        });
    }
}
