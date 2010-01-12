// If you are wondering why this file exists at all, your humble author
// admits to being a level-5 Viper user.

yak.bindings.add({
    'h': {
        exclude: yak.textElements,
        onkeydown: yak.functions.colLeft
    },
    'j': {
        exclude: yak.textElements,
        onkeydown: yak.functions.lineDown
    },
    'k': {
        exclude: yak.textElements,
        onkeydown: yak.functions.lineUp
    },
    'l': {
        exclude: yak.textElements,
        onkeydown: yak.functions.colRight
    },
    'g': {
        exclude: yak.textElements,
        onkeydown: yak.functions.gotoTop
    },
    'G': {
        exclude: yak.textElements,
        onkeydown: yak.functions.gotoBottom
    },
    '0': {
        exclude: yak.textElements,
        onkeydown: yak.functions.gotoLeft
    },
    '$': {
        exclude: yak.textElements,
        onkeydown: yak.functions.gotoRight
    },
    'C-d': {
        exclude: yak.textElements,
        onkeydown: function(event) {
            yak.functions.scrollPages(0.5);
        }
    },
    'C-u': {
        exclude: yak.textElements,
        onkeydown: function(event) {
            yak.functions.scrollPages(-0.5);
        }
    },
    'B': {
        exclude: yak.textElements,
        onkeydown: yak.functions.goBack
    }
});
