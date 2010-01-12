yak.bindings.add({
    // I assume that most people who have gotten this far were raised on
    // Netscape's behavior of Backspace = PageUp.
    'DEL': {
        exclude: yak.textElements,
        onkeydown: yak.functions.pageUp
    },
    // Erase character. Normally, the GTK+ key theme takes care of it, but
    // there is a bug (which I need to file) where password fields don't
    // interpret keys like normal GTK+ text entry widgets. So, we do it
    // ourselves. Emacs may eventually override this for numeric args.
    'C-u': {
        include: yak.textElements,
        onkeydown: function(event) {
            event.target.value = ''
        }
    }
});
