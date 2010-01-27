config.defaults({
    altIsMeta: true,
    debugEnabled: false,
    bindingFiles: ['bindings/base.js', 'bindings/emacs.js'],
    urlEnabled: false,
    bindingUrl: 'http://localhost:2562/bindings.js',
    bindingText: '',
    blacklist: [],
    username: '',
    password: ''
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

    if (req.authenticate) {
        var creds = config.get('username') + ':' + config.get('password');
        var auth = 'Basic ' + Base64.encode(creds);
        xhr.setRequestHeader('Authorization', auth);
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
            pairs.push(k + '=' + encodeURIComponent(req.data[k]));
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

// Every request that needs to implicitly hold on to a callback will
// use the "simple" interface. The request should always have a 'type'
// property set so we can decide what to do with it.
//
// See discussion in xhr() above for why the last argument is called
// 'send' and not 'callback'.

chrome.extension.onRequest.addListener(function(msg, src, send) {
    switch (msg.type) {
    case 'xhr':
        xhr(msg.req, send);
        break;
    case 'tabs.getAllInWindow':
        chrome.tabs.getAllInWindow(msg.id, send);
        break;
    case 'tabs.getSelected':
        chrome.tabs.getSelected(msg.id, send);
        break;
    case 'tabs.create':
        chrome.tabs.create(msg.info, send);
        break;
    case 'tabs.update':
        chrome.tabs.update(msg.id, msg.info, send);
        break;
    case 'tabs.move':
        chrome.tabs.move(msg.id, msg.info, send);
        break;
    case 'tabs.remove':
        chrome.tabs.remove(msg.id, msg.info, send);
        break;
    }
});

// Things that are purely message-based will use ports.

chrome.extension.onConnect.addListener(function(port) {
    switch (port.name) {
    case 'getConfig':
        port.onMessage.addListener(function(req) {
            port.postMessage({
                debugEnabled: config.get('debugEnabled'),
                altIsMeta: config.get('altIsMeta'),
                bindingEnabled: !isBlacklisted(req)
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
        // TODO: Should send updated bindings to all tabs on change.
        port.onMessage.addListener(function(req) {
            fetchBindingFiles();
        });
        break;
    }
});

function isBlacklisted(url) {
    return config.get('blacklist').some(function(pat) {
        return RegExp(pat).test(url);
    });
}
