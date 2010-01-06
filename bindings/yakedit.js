// An example of how to send data to an HTTP server for processing and
// get it back. Note that the XHR callback gets a different context.
//
// FIXME: I want this to be C-c C-c or maybe C-x C-f. Needs to implement
// multi-key bindings (punt first time, set flag, run on second press if
// nothing else has happened.)

yak.bindings.add({
    'M-C-e': {
        include: yak.textElements,
        onkeydown: function(event) {
            var url = 'http://localhost:2562/edit';
            var req = {
                method: 'POST',
                url: url,
                headers: {'Content-Type': 'text/plain; charset=utf-8'},
                data: this.value
            };
            yak.xhr(req, function() {
                event.target.value = this.responseText.replace(/\n$/, '');
            });
        }
    },
    'C-S': {
        onkeydown: function(event) {
            var url = 'http://localhost:2562/style/edit?url=' + location.href;
            yak.xhr({method: 'POST', url: url});
        }
    }
});
