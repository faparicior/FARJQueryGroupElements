define([
    'intern!object',
    'intern/chai!assert',
    '../support/pages/IndexPage'
], function (registerSuite, assert, IndexPage) {
    registerSuite(function () {
        var indexPage;
        return {
            // on setup, we create an IndexPage instance
            // that we will use for all the tests
            setup: function () {
                indexPage = new IndexPage(this.remote);
            },

            'Init Ok Master': function () {
                return indexPage
                    .init()
                    .findById('demo')
                    .findByClassName('far_master_elements')
                    .findAllByTagName('li')
                    .getVisibleText()
                    .then(function (children) {
                        verifyMasterElements(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Elements': function () {
                return indexPage
                    .init()
                    .findById('demo')
                    .findByClassName('far_elements')
                    .findAllByTagName('li')
                    .getVisibleText()
                    .then(function (children) {
                        verifyElements(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok FreeElements': function () {
                return indexPage
                    .init()
                    .findById('demo')
                    .findByClassName('far_free_elements')
                    .findAllByTagName('li')
                    .getVisibleText()
                    .then(function (children) {
                        verifyFreeElements(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Master CloseSpan': function () {
                return indexPage
                    .init()
                    .findById('demo')
                    .findByClassName('far_master_elements')
                    .findAllByClassName('fa-times')
                    .then(function (children) {
                        assert.equal(children.length, 3);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Master EditSpan': function () {
                return indexPage
                    .init()
                    .findById('demo')
                    .findByClassName('far_master_elements')
                    .findAllByClassName('fa-pencil')
                    .then(function (children) {
                        assert.equal(children.length, 3);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
        };
    });

    function verifyMasterElements(elements) {
        var elementsExpected = ['Markets', 'Professional services', 'Health', 'New'];

        return assert.deepEqual(elements, elementsExpected);
    }
    function verifyElements(elements) {
        var elementsExpected = ['', '', '', ''];

        return assert.deepEqual(elements, elementsExpected);
    }
    function verifyFreeElements(elements) {
        var elementsExpected = ['Pharmacy', 'Optics', 'Shoes', 'New FREE element'];

        return assert.deepEqual(elements, elementsExpected);
    }

    // Helper methods
    function logArrayElements(element, index, array) {
        console.info("a[" + index + "] = " + element);
    }

});
