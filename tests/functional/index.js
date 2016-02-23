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
                return findLiByClass (indexPage, 'demo', 'far_master_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyMasterElements(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Elements': function () {
                return findLiByClass (indexPage, 'demo', 'far_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyElements(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok FreeElements': function () {
                return findLiByClass (indexPage, 'demo', 'far_free_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyFreeElements(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Master CloseSpan': function () {
                return findSpanByClass (indexPage, 'demo', 'far_master_elements', 'fa-times')
                    .getVisibleText()
                    .then(function (children) {
                        assert.equal(children.length, 3);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Master EditSpan': function () {
                return findSpanByClass (indexPage, 'demo', 'far_master_elements', 'fa-pencil')
                    .getVisibleText()
                    .then(function (children) {
                        assert.equal(children.length, 3);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Elements CloseSpan': function () {
                return findSpanByClass (indexPage, 'demo', 'far_elements', 'fa-times')
                    .getVisibleText()
                    .then(function (children) {
                        assert.equal(children.length, 3);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Elements EditSpan': function () {
                return findSpanByClass (indexPage, 'demo', 'far_elements', 'fa-pencil')
                    .getVisibleText()
                    .then(function (children) {
                        assert.equal(children.length, 3);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Free Elements CloseSpan': function () {
                return findSpanByClass (indexPage, 'demo', 'far_free_elements', 'fa-times')
                    .getVisibleText()
                    .then(function (children) {
                        assert.equal(children.length, 3);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Free Elements EditSpan': function () {
                return findSpanByClass (indexPage, 'demo', 'far_free_elements', 'fa-pencil')
                    .getVisibleText()
                    .then(function (children) {
                        assert.equal(children.length, 3);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Init Ok Free Elements TagSpan': function () {
                return findSpanByClass (indexPage, 'demo', 'far_free_elements', 'fa-tag')
                    .getVisibleText()
                    .then(function (children) {
                        assert.equal(children.length, 3);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Select Markets. Show correct elements': function () {
                findLiByUid(indexPage, 'demo', 1)
                    .click();

                return findLiByClass (indexPage, 'demo', 'far_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyElementsSelectMarkets(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Select Professional services. Show correct elements': function () {
                findLiByUid(indexPage, 'demo', 4)
                    .click();

                return findLiByClass (indexPage, 'demo', 'far_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyElementsSelectProfessionalServices(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Select Health. Show correct elements': function () {
                findLiByUid(indexPage, 'demo', 5)
                    .click();

                return findLiByClass (indexPage, 'demo', 'far_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyElementsSelectHealth(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Tag Pharmacy to Health': function () {
                findLiByUid(indexPage, 'demo', 5)
                    .click();
                findTagByUid(indexPage, 'demo', 7)
                    .click();

                return findLiByClass (indexPage, 'demo', 'far_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyElementsSelectHealthTagPharmacy(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Tag Pharmacy to Health. Show correct elements': function () {
                findLiByUid(indexPage, 'demo', 5)
                    .click();
                findTagByUid(indexPage, 'demo', 7)
                    .click();
                return findLiByClass (indexPage, 'demo', 'far_free_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyFreeElementsHealthTagPharmacy(children);
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'New Element Master. Variety': function () {
                findSpanByText(indexPage, 'demo', 'New')
                    .click()
                    .type('Variety');
                return findLiByClass (indexPage, 'demo', 'far_master_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyMasterElementsPlusNew(children, 'Variety');
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'New Free Element. Cinema': function () {
                findSpanByText(indexPage, 'demo', 'New FREE element')
                    .click()
                    .type('Cinema');
                return findLiByClass (indexPage, 'demo', 'far_free_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyFreeElementsPlusNew(children, 'Cinema');
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            },
            'Select Element Master Markets and New element PopCorn': function () {
                findSpanByText(indexPage, 'demo', 'Markets')
                    .click();
                findSpanByText(indexPage, 'demo', 'New element')
                    .click()
                    .type('PopCorn');
                return findLiByClass (indexPage, 'demo', 'far_elements')
                    .getVisibleText()
                    .then(function (children) {
                        verifyElementsPlusNew(children, 'PopCorn');
                    }, function (error) {
                        console.error(error);
                        return false;
                    });
            }
        };
    });

    function findLiByUid (page, div, uid) {
        return page
            .init()
            .findByXpath("//div[@id='" + div + "']/div/ul/li[@data-uid='" + uid + "']");
    }

    function findTagByUid (page, div, uid) {
        return page
            .init()
            .findByXpath("//div[@id='" + div + "']/div/ul/li[@data-uid='" + uid + "']/span");
    }

    function findLiByClass (page, id, classText) {
        return page
            .init()
            .findById(id)
            .findByClassName(classText)
            .findAllByTagName('li')
    }

    function findSpanByClass (page, id, classText, classSpan) {
        return page
            .init()
            .findById(id)
            .findByClassName(classText)
            .findAllByClassName(classSpan)
    }

    function findSpanByText (page, div, text) {
        return page
            .init()
            .findByXpath("//div[@id='" + div + "']/div/ul/li/span[text()='" + text + "']");
    }

    function verifyMasterElements(elements) {
        var elementsExpected = ['Markets', 'Professional services', 'Health', 'New'];

        return assert.deepEqual(elements, elementsExpected);
    }

    function verifyElements(elements) {
        var elementsExpected = ['', '', '', ''];

        return assert.deepEqual(elements, elementsExpected);
    }

    function verifyElementsSelectMarkets(elements) {
        var elementsExpected = ['Supermarket', 'Fruit Store', '', 'New element'];

        return assert.deepEqual(elements, elementsExpected);
    }

    function verifyElementsSelectProfessionalServices(elements) {
        var elementsExpected = ['', '', 'Hardware', 'New element'];

        return assert.deepEqual(elements, elementsExpected);
    }

    function verifyElementsSelectHealth(elements) {
        var elementsExpected = ['', '', '', 'New element'];

        return assert.deepEqual(elements, elementsExpected);
    }

    function verifyElementsSelectHealthTagPharmacy(elements) {
        var elementsExpected = ['', '', '', 'Pharmacy', 'New element'];

        return assert.deepEqual(elements, elementsExpected);
    }

    function verifyFreeElementsHealthTagPharmacy(elements) {
        var elementsExpected = ['Optics', 'Shoes', 'New FREE element'];

        return assert.deepEqual(elements, elementsExpected);
    }

    function verifyMasterElementsPlusNew(elements, newElement) {
        var elementsExpected = ['Markets', 'Professional services', 'Health', newElement,  'New'];

        return assert.deepEqual(elements, elementsExpected);
    }

    function verifyElementsPlusNew(elements, newElement) {
        var elementsExpected = ['Supermarket', 'Fruit Store', '', 'PopCorn', 'New element'];

        return assert.deepEqual(elements, elementsExpected);
    }

    function verifyFreeElementsPlusNew(elements, newElement) {
        var elementsExpected = ['Pharmacy', 'Optics', 'Shoes', 'Cinema', 'New FREE element'];

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
