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

    var clamp = function(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); };
    var nRows = function(s) { return clamp(s.split('\n').length, 4, 40); }

    $('bindingText').value = config.get('bindingText');
    $('bindingText').rows = nRows(config.get('bindingText'));
}

function save() {
    config.set('altIsMeta', $('altIsMeta').checked);

    var isChecked = function(t) { return t.checked; };
    var getValue = function(t) { return t.value; };
    config.set('bindingFiles', $$('file').filter(isChecked).map(getValue));
    config.set('bindingText', $('bindingText').value);

    var reloadPort = chrome.extension.connect({name: 'reloadBindings'});
    reloadPort.postMessage(null);
}
