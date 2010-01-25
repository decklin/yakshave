yak.bindings.add({
    // These should probably be moved to a new file (info.js)
    'l': {
        exclude: yak.textElements,
        onkeydown: yak.functions.goBack
    },
    'u': {
        exclude: yak.textElements,
        onkeydown: yak.functions.goUp
    },
    't': {
        exclude: yak.textElements,
        onkeydown: yak.functions.goRoot
    }
});
