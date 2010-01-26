function $(id) {
    return document.getElementById(id);
}

function $$(classname) {
    var nodeList = document.getElementsByClassName(classname);
    var elts = [];
    for (var i = 0; i < nodeList.length; i++)
        elts.push(nodeList[i]);
    return elts;
}

function init() {
    $('altIsMeta').checked = config.get('altIsMeta');

    $$('file').forEach(function(t) {
        if (config.get('bindingFiles').indexOf(t.value) !== -1)
            t.checked = true;
    });

    $('urlEnabled').checked = config.get('urlEnabled');
    $('bindingUrl').value = config.get('bindingUrl');

    var clamp = function(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); };
    var lines = function(s) { return s.split('\n').length; };

    $('bindingText').value = config.get('bindingText');
    $('bindingText').rows = clamp(lines(config.get('bindingText')), 4, 40);

    $('blacklist').value = config.get('blacklist').join('\n');
    $('blacklist').rows = clamp(config.get('blacklist').length, 4, 40);

    $('username').value = config.get('username');
    $('password').value = config.get('password');
}

function save() {
    config.set('altIsMeta', $('altIsMeta').checked);

    var isChecked = function(t) { return t.checked; };
    var getValue = function(t) { return t.value; };
    config.set('bindingFiles', $$('file').filter(isChecked).map(getValue));

    config.set('urlEnabled', $('urlEnabled').checked);
    config.set('bindingUrl', $('bindingUrl').value);

    config.set('bindingText', $('bindingText').value);

    config.set('blacklist', $('blacklist').value.split('\n'));

    config.set('username', $('username').value);
    config.set('password', $('password').value);

    var reloadPort = chrome.extension.connect({name: 'reloadBindings'});
    reloadPort.postMessage(null);
}
