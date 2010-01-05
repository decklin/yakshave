// Since we only have scrolling commands in here so far, we can do
// everything with precooked functions.

yak.bindings.add({
    'C-b': {
        exclude: yak.textElements,
        onkeydown: yak.functions.colLeft
    },
    'C-f': {
        exclude: yak.textElements,
        onkeydown: yak.functions.colRight
    },
    'C-p': {
        exclude: yak.textElements,
        onkeydown: yak.functions.lineUp
    },
    'C-n': {
        exclude: yak.textElements,
        onkeydown: yak.functions.lineDown
    },
    'M-<': {
        exclude: yak.textElements,
        onkeydown: yak.functions.gotoTop
    },
    'M->': {
        exclude: yak.textElements,
        onkeydown: yak.functions.gotoBottom
    }
});
