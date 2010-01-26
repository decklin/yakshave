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

function lines(s) { return s ? s.split('\n') : []; }
function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); }
function rows(n) { return clamp(n, 4, 40); }

function init() {
    $('altIsMeta').checked = config.get('altIsMeta');

    $$('file').forEach(function(t) {
        if (config.get('bindingFiles').indexOf(t.value) !== -1)
            t.checked = true;
    });

    $('urlEnabled').checked = config.get('urlEnabled');
    $('bindingUrl').value = config.get('bindingUrl');

    $('bindingText').value = config.get('bindingText');
    $('bindingText').rows = rows(lines(config.get('bindingText')).length)

    $('blacklist').value = config.get('blacklist').join('\n');
    $('blacklist').rows = rows(config.get('blacklist').length);

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

    config.set('blacklist', lines($('blacklist').value));

    config.set('username', $('username').value);
    config.set('password', $('password').value);

    var reloadPort = chrome.extension.connect({name: 'reloadBindings'});
    reloadPort.postMessage(null);
}
