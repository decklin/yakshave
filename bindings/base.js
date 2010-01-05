// WebKit normally scrolls 1 line on up/down and the viewport's height
// minus 1 line on pageup/pagedown. FIXME: need this to scale with font.

var lineHeight = 40;

// A simple binding that can be used in both the Emacs and vi flavors.
// I am assuming that most people who have gotten this far were raised
// on *nix Netscape's behavior of backspace = page up. Firefox had an
// option kludge to do the same.
//
// If you are a Mac user and really hate this and think it should be
// broken out, holler at me. I'll think of something else to use here.

function scrollPages(n) {
    var direction = n >= 0 ? 1 : -1;
    var distance = Math.abs(n) * window.innerHeight - lineHeight;
    window.scrollBy(0, direction * distance);
}

yak.bindings.add({
    'DEL': {
        exclude: yak.textElements,
        onkeydown: function(event) { scrollPages(-1); }
    }
});
