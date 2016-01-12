$(function() {

    // Initial values
    var values =
        '{ "group_categories" : [' +
        '{ "id":"1" , "desc":"Alimentacion" },' +
        '{ "id":"4" , "desc":"Servicios profesionales" },' +
        '{ "id":"5" , "desc":"Salud" } ],' +
        '  "free_categories" : [' +
        '{ "id":"7" , "desc":"Farmacia" },' +
        '{ "id":"8" , "desc":"Optica" },' +
        '{ "id":"9" , "desc":"Parafarmacia" } ],' +
        '  "categories" : [' +
        '{ "id":"1" , "desc":"Ferreteria", "relId": "1" },' +
        '{ "id":"4" , "desc":"Supermercado", "relId": "1" },' +
        '{ "id":"5" , "desc":"Bar / Restaurante", "relId": "4" } ]}'
        ;

    var obj = JSON.parse(values);

    //
    // Constructor
    //
    function createElements(obj, idUl, listType) {

        constructUlElement(idUl).appendTo('div');

        $.each(obj, function (i, val) {
            if(listType == 1) {
                constructLiElementMaster(val).appendTo('#' + idUl);
            } else if(listType == 2) {
                constructLiElement(val).appendTo('#' + idUl);
            } else {
                constructLiFreeElement(val).appendTo('#' + idUl);
            }
        });
        constructLiNewItemElement(listType).appendTo('#' + idUl);
    }

    function constructLiElementMaster(values) {
        return $(
            '<li>' +
            '<span class="display" data-uid="' + values.id + '" contenteditable="false">' + values.desc + '</span>' +
            '<span class="fa fa-pencil display-edit "></span>' +
            '<span class="fa fa-times display-close close-element"></span>' +
            '</li>'
        );
    }

    function constructEditElement(values) {
        return $(
            '<span class="fa fa-pencil display-edit "></span>'
        );
    }

    function constructAssignElement(values) {
        return $(
            '<span class="fa fa-tag display-tag "></span>'
        );
    }

    function constructLiElement(values) {
        return $(
            '<li>' +
            '<span class="display" data-uid="' + values.id + '" data-relid="' + values.relId + '" contenteditable="false">' + values.desc + '</span>' +
            '<span class="fa fa-pencil display-edit "></span>' +
            '<span class="fa fa-times display-close close-element"></span>' +
            '</li>'
        );
    }

    function constructLiFreeElement(values) {
        return $(
            '<li>' +
            '<span class="fa fa-tag display-tag"></span>' +
            '<span class="display" data-uid="' + values.id + '" data-relid="' + values.relId + '" contenteditable="false">' + values.desc + '</span>' +
            '<span class="fa fa-pencil display-edit "></span>' +
            '<span class="fa fa-times display-close close-element"></span>' +
            '</li>'
        );
    }

    function getLiElements() {
        var liElements = [];

        $('ul').find('.display').not('#newElement').each( function (i, val) {
            liElements.push({ id: $(val).data('id'), desc: val.innerHTML});
        });

        return liElements;
    }

    function constructLiNewItemElement(elementType) {
        if(elementType == 1) {
            return $(
                '<li>' +
                '<span class="display" id="newElementMaster" contenteditable="true">Add new</span>' +
                '<span class="fa fa-times display-close "></span>' +
                '</li>'
            );
        } else if(elementType == 2) {
            return $(
                '<li>' +
                '<span class="display" id="newElement" contenteditable="true">Add new</span>' +
                '<span class="fa fa-times display-close "></span>' +
                '</li>'
            );
        } else {
            return $(
                '<li>' +
                '<span class="display" id="newFreeElement" contenteditable="true">Add new</span>' +
                '<span class="fa fa-times display-close "></span>' +
                '</li>'
            );
        }
    }

    function constructUlElement(idUl) {
        return $(
            '<ul id="' + idUl + '">' +
            '</<ul>'
        );
    }


    //
    // Auxiliary functions
    //
    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    };

    jQuery.fn.selectText = function(){
        var doc = document;
        var element = this[0];

        if (doc.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
        } else if (window.getSelection) {
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    };

    // ************ CODE **************
    // ****

    createElements(obj['group_categories'], 'group_categories', 1);
    createElements(obj['categories'], 'categories', 2);
    createElements(obj['free_categories'], 'free_categories', 3);

//    obj.categories = getLiElements('group_categories');
//    obj.categories = getLiElements('categories');

    // ****
    // ************ CODE **************


    //
    // Event handlers
    //

    // Enter Key disable edit
    $('ul').on('keypress', '.display', function (e) {
        return e.which != 13;
    });

    // Selected element
    $('#group_categories').on('click','li' , function (e) {
        var id = $(this).data('uid');

        $(this).parent().parent().attr('data-id-selected', id);
        $('#categories li span').filter('[data-relid = "' + id + '"]').parent().show();
        $('#categories li span').filter('[id = "newElement"]').parent().show();
        $(this).closest('ul').find('.elementSelected').removeClass('elementSelected');
        $(this).addClass('elementSelected');
    });

    $('#categories').on('click','li' , function (e) {
        $(this).closest('ul').find('.elementSelected').removeClass('elementSelected');
        $(this).addClass('elementSelected');
    });

    $('#free_categories').on('click','li' , function (e) {
        $(this).closest('ul').find('.elementSelected').removeClass('elementSelected');
        $(this).addClass('elementSelected');
    });


    // Select child categories from master
    $('#group_categories').on('click focus','.display' , function (e) {
        var id = $(this).data('uid');

        $(this).closest('ul').attr('data-id-selected', id);
        $('#categories li span').parent().hide();
        $('#categories li span').filter('[data-relid = "' + id + '"]').parent().show();
        $('#categories li span').filter('[id = "newElement"]').parent().show();
    });

    // Edit element
    $('ul').on('click', '.display-edit', function () {
        $(this).closest('li').find('.display').attr('contenteditable', 'true');
        $(this).closest('li').find('.display').focusin();
        $(this).closest('li').find('.display').selectText();
    });

    $('ul').on('focusout', '.display', function () {
        $(this).attr('contenteditable', 'false');
    });

    // New element Master
    $('ul').on('focus', '#newElementMaster', function () {
        var newElement = constructLiNewItemElement(1);
        var newEdit = constructEditElement();
        var uid_data = generateUUID();

        $(this).parent().find('.display-close ').addClass('close-element');
        $(this).removeAttr('id');
        $(this).attr('data-uid',uid_data);
        $(this).parent().parent().attr('data-id-selected', uid_data);
        $(this).after(newEdit);
        $(this).selectText();
        $(this).parent().after(newElement);
    });

    // New element
    $('ul').on('focus', '#newElement', function () {
        var newElement = constructLiNewItemElement(2);
        var newEdit = constructEditElement();
        var uid_data = generateUUID();

        $(this).parent().find('.display-close ').addClass('close-element');
        $(this).removeAttr('id');
        $(this).attr('data-uid',uid_data);

        var idMaster = $('#group_categories').attr('data-id-selected');
        $(this).attr('data-relid',idMaster);
        $(this).after(newEdit);
        $(this).selectText();
        $(this).parent().after(newElement);
    });

    // New free element
    $('ul').on('focus', '#newFreeElement', function () {
        var newElement = constructLiNewItemElement(3);
        var newEdit = constructEditElement();
        var newAssign = constructAssignElement();
        var uid_data = generateUUID();

        $(this).parent().find('.display-close').addClass('close-element');
        $(this).removeAttr('id');
        $(this).attr('data-uid',uid_data);

        $(this).after(newEdit);
        $(this).after(newAssign);
        $(this).selectText();
        $(this).parent().after(newElement);
    });

    // Tagged free element
    $('ul').on('click', '.display-tag', function () {

        var element = $(this).closest('li').detach();
        element.find('.display-tag').remove();

        var idMaster = $('#group_categories').attr('data-id-selected');
        element.find('.display').attr('data-relid', idMaster);
        $('#categories').find('#newElement').closest('li').before(element);
    });

    // Remove group categories
    $('ul#group_categories').on('click', '.close-element', function () {
        $(this).parent().remove();

        // TODO: Delete all dependencies
    });

    // Remove element
    $('ul#categories').on('click', '.close-element', function () {
        var newAssign = constructAssignElement();
        var element = $(this).parent().detach();
        element.find('.display').removeAttr('data-relid');
        element.find('.display').before(newAssign);
        $('#free_categories').find('#newFreeElement').closest('li').before(element);
    });

    // Remove free categories
    $('ul#free_categories').on('click', '.close-element', function () {
        $(this).parent().remove();
    });

});
