// XXX: how do I define a getter/setter for *any* property, not just a
// predetermined one? Then we could look and feel like localStorage
// instead of this clunky interface.

var config = {
    has: function(key) {
        return key in localStorage;
    },
    get: function(key) {
        if (this.has(key)) {
            try {
                return JSON.parse(localStorage[key]);
            } catch(e) {
                return null;
            }
        }
    },
    set: function(key, value) {
        localStorage[key] = JSON.stringify(value);
    }
};
