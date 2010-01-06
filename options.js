function $(id) {
    return document.getElementById(id);
}

function init() {
    $('altIsMeta').checked = config.get('altIsMeta');

    var clamp = function(n, lo, hi) { return Math.min(hi, Math.max(lo, n)); };
    var nRows = function(s) { return clamp(s.split('\n').length, 4, 40); }
    $('bindingText').value = config.get('bindingText');
    $('bindingText').rows = nRows(config.get('bindingText'));
}

function save() {
    config.set('altIsMeta', $('altIsMeta').checked);
    config.set('bindingText', $('bindingText').value);
}
