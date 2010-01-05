// These are the event types we might care about. Users write 'onkeydown'
// etc. as the property name since that sort of seems natural from HTML.

var keyEventTypes = [
    'keydown',
    'keyup',
    'keypress'
];

// I am attempting to match Emacs's notation (GNU Emacs 23.1) here.
// Entries I'm unsure about are marked with a ???. This should not be
// taken to imply that the others are all correct.

var keyCodes = {
    '<Cancel>': 3, // ???
    '<Help>': 6, // ???
    'DEL': 8,
    'TAB': 9,
    '<Clear>': 12, // ???
    'LFD': 13,
    'RET': 14,
    '<Shift>': 16, // ???
    '<Control>': 17, // ???
    '<Alt>': 18, // ???
    '<pause>': 19,
    '<CapsLock>': 20, // ???
    'ESC': 27,
    'SPC': 32,
    '<next>': 33,
    '<prior>': 34,
    '<end>': 35,
    '<home>': 36,
    '<left>': 37,
    '<up>': 38,
    '<right>': 39,
    '<down>': 40,
    '<print>': 44,
    '<insert>': 45,
    '<delete>': 46,
    '0': 48,
    '1': 49,
    '2': 50,
    '3': 51,
    '4': 52,
    '5': 53,
    '6': 54,
    '7': 55,
    '8': 56,
    '9': 57,
    ';': 59,
    '=': 61,
    'a': 65,
    'b': 66,
    'c': 67,
    'd': 68,
    'e': 69,
    'f': 70,
    'g': 71,
    'h': 72,
    'i': 73,
    'j': 74,
    'k': 75,
    'l': 76,
    'm': 77,
    'n': 78,
    'o': 79,
    'p': 80,
    'q': 81,
    'r': 82,
    's': 83,
    't': 84,
    'u': 85,
    'v': 86,
    'w': 87,
    'x': 88,
    'y': 89,
    'z': 90,
    '<menu>': 93,
    '<kp-0>': 96,
    '<kp-1>': 97,
    '<kp-2>': 98,
    '<kp-3>': 99,
    '<kp-4>': 100,
    '<kp-5>': 101,
    '<kp-6>': 102,
    '<kp-7>': 103,
    '<kp-8>': 104,
    '<kp-9>': 105,
    '<kp-multiply>': 106,
    '<kp-add>': 107,
    '<kp-backtab>': 108, // ???
    '<kp-subtract>': 109,
    '<kp-decimal>': 110,
    '<kp-divide>': 111,
    '<f1>': 112,
    '<f2>': 113,
    '<f3>': 114,
    '<f4>': 115,
    '<f5>': 116,
    '<f6>': 117,
    '<f7>': 118,
    '<f8>': 119,
    '<f9>': 120,
    '<f10>': 121,
    '<f11>': 122,
    '<f12>': 123,
    '<f13>': 124,
    '<f14>': 125,
    '<f15>': 126,
    '<f16>': 127,
    '<f17>': 128,
    '<f18>': 129,
    '<f19>': 130,
    '<f20>': 131,
    '<f21>': 132,
    '<f22>': 133,
    '<f23>': 134,
    '<f24>': 135,
    '<NumLock>': 144,
    '<Scroll_Lock>': 145,
    ',': 188,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    '\'': 222,
    '<Meta>': 224 // ???
};

// The DOM keycodes are of course caseless so we need to know what key a
// shifted character was on. My reference for this was looking down at my
// keyboard so it's probably very broken for locales other than en_US.

var shifted = {
    'A': 'a',
    'B': 'b',
    'C': 'c',
    'D': 'd',
    'E': 'e',
    'F': 'f',
    'G': 'g',
    'H': 'h',
    'I': 'i',
    'J': 'j',
    'K': 'k',
    'L': 'l',
    'M': 'm',
    'N': 'n',
    'P': 'p',
    'Q': 'q',
    'R': 'r',
    'S': 's',
    'T': 't',
    'U': 'u',
    'V': 'v',
    'W': 'w',
    'X': 'x',
    'Y': 'y',
    'Z': 'z',
    ')': '0',
    '!': '1',
    '@': '2',
    '#': '3',
    '$': '4',
    '%': '5',
    '&': '6',
    '&': '7',
    '*': '8',
    ')': '9',
    '"': '\'',
    '+': '=',
    ':': ';',
    '<': ',',
    '>': '.',
    '?': '/',
    '_': '-',
    '{': '[',
    '}': ']',
    '~': '`',
    '\\': '|'
};

// Insert your own "double bucky" joke here.

var bucky = {
    C: 'ctrl',
    M: 'meta',
    A: 'alt',
    S: 'shift'
};

var buckies = [
    'ctrl',
    'meta',
    'alt',
    'shift'
];

// The fact that you can't just do debug.log = console.log still kinda
// itches me about JavaScript. I mean, I get why not -- we could bring
// in an implementation of bind() from Prototype.js or whoever to do
// what I *mean* with that assignment, but it would be overkill for one
// little function.
//
// (If you *don't* get it, check out John Resig's superb tutorial
// "Learning Advanced JavaScript".)

var debug = {
    enabled: false,
    log: function() {
        if (this.enabled) {
            console.log.apply(console, arguments);
        }
    }
};

// Our representation of an Emacs-ish key descripton.

function Key(desc) {
    var parts = desc.split('-');
    var c = parts.pop(), p;

    if (c in shifted) {
        this.shift = true;
        this.code = keyCodes[shifted[c]];
    } else {
        this.code = keyCodes[c];
    }

    while ((p = parts.pop()))
        this[bucky[p]] = true;
}

// Which is held within this larger object.

function Binding(desc) {
    this.description = desc;
    this.key = new Key(desc);
}

Binding.prototype = {
    include: [HTMLElement],
    exclude: [],

    validFor: function(elt) {
        var eltIs = function(c) { return elt instanceof c; };
        return this.include.some(eltIs) && !this.exclude.some(eltIs);
    },

    matchKey: function(event) {
        var key = this.key;
        if (key.code === event.keyCode) {
            var need = buckies.filter(function(b) { return key[b]; });
            var dontNeed = buckies.filter(function(b) { return !key[b]; });
            var isPressed = function(b) { return event[b+'Key']; };
            var notPressed = function(b) { return !event[b+'Key']; };
            var matched = need.every(isPressed) && dontNeed.every(notPressed);

            var showBucky = function(bs) {
                return bs.length > 0 ? bs.join('+') : 'none';
            };
            debug.log('matching', key.code, 'need ' + showBucky(need),
                'pressed ' + showBucky(buckies.filter(isPressed)));

            return matched;
        } else {
            return false;
        }
    }
};

// This is the API for user binding scripts. To share any value between
// bindings, set a property on yak.variables (which is reserved for
// that purpose). For everything else here, don't touch except through
// the add() interfaces.
//
// textElements is not used internally, but 80% of bindings are going to
// want to refer to it, so it gets to be a top-level property for the sake
// of brevity.

var yak = {
    // Principle of least surprise: the callback is called in the XHR's
    // context with no arguments.

    xhr: function(req, callback) {
        chrome.extension.sendRequest(req, function(xhr) {
            if (callback)
                callback.call(xhr);
        });
    },

    textElements: [
        HTMLInputElement,
        HTMLTextAreaElement
    ],

    functions: {
        add: function(fns) {
            for (var f in fns)
                this[f] = fns[f];
        }
    },

    bindings: {
        bindingList: [],
        add: function(templates) {
            for (var desc in templates) {
                var t = templates[desc];
                var b = new Binding(desc);
                for (var k in t) b[k] = t[k];
                debug.log('bound', desc, 'to', b);
                this.bindingList.push(b);
            }
        }
    },

    variables: {
        foo: 'bar'
    }
};

// We want to be able to debug bindings load, so we need to set up both
// ports and send out a request to get the debug state first. When the
// answer comes back, we can talk to the bindings port.
//
// You might ask why there isn't just one port and one message. When a
// binding file is edited/added/removed, we'll want the background
// page to send us the new set, so we want to leave a connection open.
// This isn't implemented yet.

var configPort = chrome.extension.connect({name: 'getConfig'});
var bindingPort = chrome.extension.connect({name: 'getBindings'});

configPort.onMessage.addListener(function (msg) {
    debug.enabled = msg.debugEnabled;

    if (msg.altIsMeta)
        bucky.M = 'alt';

    bindingPort.postMessage(null);
});

bindingPort.onMessage.addListener(function (msg) {
    // XXX: this will need to clear bindings and remove their listeners first.
    msg.bindingFiles.forEach(function(f) {
        try {
            debug.log('loading', f.name, '('+f.text.length+' bytes)');
            eval('(function(){' + f.text + '})();');
        } catch(e) {
            console.log('Error parsing ' + f.name, e);
        }
    });
});

// Set it off!

configPort.postMessage(null);

// And while that goes, set up the event listeners.

keyEventTypes.forEach(function(t) {
    document.addEventListener(t, function(event) {
        if (t === 'keydown')
            debug.log(t, event.keyCode, event);
        if (dispatch('on' + t))
            event.preventDefault();
    }, false);
});

function dispatch(t) {
    return yak.bindings.bindingList.some(function(b) {
        if (t in b && b.validFor(event.target) && b.matchKey(event))
            return (b[t].call(event.target, event) !== false);
        else
            return false;
    });
    return handled;
}
