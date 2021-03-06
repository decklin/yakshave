// Since we only have scrolling commands in here so far, we can do
// everything with precooked functions.

yak.bindings.add({
    'C-b': {
        exclude: yak.textElements,
        onkeydown: yak.functions.colLeft
    },
    // This one is problematic in that it shadows the find box (and I
    // don't know how to trigger said box from a C-s binding). Kludge it
    // by checking if we are scrolled all the way to the right (modulo
    // scrollbar width).
    'C-f': {
        exclude: yak.textElements,
        onkeydown: function(event) {
            if (window.innerWidth + window.scrollX < document.width)
                return yak.functions.colRight();
            else
                return false;
        }
    },
    'C-p': {
        exclude: yak.textElements,
        onkeydown: yak.functions.lineUp
    },
    'C-n': {
        exclude: yak.textElements,
        onkeydown: yak.functions.lineDown
    },
    'M-v': {
        exclude: yak.textElements,
        onkeydown: yak.functions.pageUp
    },
    'C-v': {
        exclude: yak.textElements,
        onkeydown: yak.functions.pageDown
    },
    'C-a': {
        exclude: yak.textElements,
        onkeydown: yak.functions.gotoLeft
    },
    'C-e': {
        exclude: yak.textElements,
        onkeydown: yak.functions.gotoRight
    },
    'M-<': {
        exclude: yak.textElements,
        onkeydown: yak.functions.gotoTop
    },
    'M->': {
        exclude: yak.textElements,
        onkeydown: yak.functions.gotoBottom
    },
    'M-n': {
        exclude: yak.textElements,
        onkeydown: yak.functions.tabRight
    },
    'M-p': {
        exclude: yak.textElements,
        onkeydown: yak.functions.tabLeft
    },
    'M-:': {
        onkeydown: function(event) {
            eval(prompt('Eval:'));
        }
    }
});
