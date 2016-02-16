define(function (require) {
    // the page object is created as a constructor
    // so we can provide the remote Command object
    // at runtime
    function IndexPage(remote) {
        this.remote = remote;
    }

    IndexPage.prototype = {
        constructor: IndexPage,

        // the login function accepts username and password
        // and returns a promise that resolves to `true` on
        // success or rejects with an error on failure
        init: function (username, password) {
            return this.remote
                .get(require.toUrl('demo/index.html'))
                .setFindTimeout(5000)
        }
    };

    return IndexPage;
});
