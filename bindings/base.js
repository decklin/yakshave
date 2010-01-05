// First, let's define some basic functions so that we don't duplicate
// code in both emacs.js and vi.js later. We can also declare private
// variables within a file to share between functions/bindings.

// WebKit normally scrolls 1 line on up/down and the viewport's height
// minus 1 line on pageup/pagedown. FIXME: need this to scale with font.

var lineHeight = 40;

// The same? Why not.

var lineWidth = 40;

yak.functions.add({
    scrollLines: function(n) {
        window.scrollBy(0, n * lineHeight);
    },
    scrollCols: function(n) {
        window.scrollBy(n * lineWidth, 0);
    },
    colLeft: function() {
        yak.functions.scrollCols(-1);
    },
    colRight: function() {
        yak.functions.scrollCols(1);
    },
    lineUp: function() {
        yak.functions.scrollLines(-1);
    },
    lineDown: function() {
        yak.functions.scrollLines(1);
    },
    scrollPages: function(n) {
        var direction = n >= 0 ? 1 : -1;
        var distance = Math.abs(n) * window.innerHeight - lineHeight;
        window.scrollBy(0, direction * distance);
    },
    pageDown: function() {
        yak.functions.scrollPages(1);
    },
    pageUp: function() {
        yak.functions.scrollPages(-1);
    },
    gotoBottom: function() {
        window.scroll(0, document.height);
    },
    gotoTop: function() {
        window.scroll(0, 0);
    }
});

// A simple binding that can be used in both the Emacs and vi flavors.
// I am assuming that most people who have gotten this far were raised
// on *nix Netscape's behavior of backspace = page up. Firefox had an
// option kludge to do the same.
//
// If you are a Mac user and really hate this and think it should be
// broken out, holler at me. I'll think of something else to use here.

yak.bindings.add({
    'DEL': {
        exclude: yak.textElements,
        onkeydown: yak.functions.pageUp
    }
});
