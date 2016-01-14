;(function(window, jQuery, undefined) {
    'use strict';

    var defaults = {
            'version'             : '1.0',
            'id_container'        : 'demo',
            'template' : { // HTML segments
                'new_element'     : '<span class="display" contenteditable="true">Add new</span>',
                'edit_element'    : '<span class="fa fa-pencil display-edit"></span>',
                'close_element'   : '<span class="fa fa-times display-close close-element"></span>',
                'assign_element'  : '<span class="fa fa-tag display-tag"></span>'
            },
            'demo_values': JSON.parse(
                '{ "far_master_elements" : [' +
                '{ "id":"1" , "desc":"Alimentacion" },' +
                '{ "id":"4" , "desc":"Servicios profesionales" },' +
                '{ "id":"5" , "desc":"Salud" } ],' +
                '  "far_free_elements" : [' +
                '{ "id":"7" , "desc":"Farmacia" },' +
                '{ "id":"8" , "desc":"Optica" },' +
                '{ "id":"9" , "desc":"Parafarmacia" } ],' +
                '  "far_elements" : [' +
                '{ "id":"1" , "desc":"Ferreteria", "relId": "1" },' +
                '{ "id":"4" , "desc":"Supermercado", "relId": "1" },' +
                '{ "id":"5" , "desc":"Bar / Restaurante", "relId": "4" } ]}'
            )
    },
    settings = {},

    methods = {
        init : function (opts) {
            return this.each(function () {

                if ($.isEmptyObject(settings)) {
                    settings = $.extend(true, defaults, opts);
                    // non configurable settings
                    settings.$content_el = $(this);
                }

                methods.createElements(settings.demo_values['far_master_elements'], 'far_master_elements', 1);
                methods.createElements(settings.demo_values['far_elements'], 'far_elements', 2);
                methods.createElements(settings.demo_values['far_free_elements'], 'far_free_elements', 3);

                settings.ulWatcher = settings.$content_el.find('ul');
                settings.masterWatcher = settings.ulWatcher.filter('.far_master_elements');
                settings.elementsWatcher = settings.ulWatcher.filter('.far_elements');
                settings.freeElementsWatcher = settings.ulWatcher.filter('.far_free_elements');

                //
                // Event methods
                //
                // Enter Key disable edit
                settings.ulWatcher.on('keypress', '.display', function (e) {
                    return e.which != 13;
                });
                // Selected element
                settings.ulWatcher.on('click', 'li' , methods.masterSelected);
                settings.elementsWatcher.on('click', 'li' , methods.elementsSelected);
                settings.freeElementsWatcher.on('click', 'li' , methods.freeElementsSelected);
                // Select child categories from master
                settings.masterWatcher.on('click focus', 'li', methods.selectChildCategories);
                // Edit element
                settings.ulWatcher.on('click', '.display-edit', methods.editElement);
////                settings.ulWatcher.on('focusout', '.display', methods.uneditElement);
                // New element Master
                settings.masterWatcher.on('click', '.newElementMaster', methods.newElementMaster);
                // New element
                settings.elementsWatcher.on('click', '.newElement', methods.newElement);
                // New free element
                settings.freeElementsWatcher.on('click', '.newElementFree', methods.newFreeElement);
                // Tagged free element
                settings.freeElementsWatcher.on('click', '.display-tag', methods.assignElement);
                // Remove group categories
                settings.masterWatcher.on('click', '.close-element', methods.removeMasterElement);
                // Remove element
                settings.elementsWatcher.on('click', '.close-element', methods.removeElement);
                // Remove free categories
                settings.freeElementsWatcher.on('click', '.close-element', methods.removeFreeElement);
            });
        },
        masterSelected: function () {
            var li = $(this);
            var span = li.find('span');
            var id = span.data('uid');

            settings.masterWatcher.attr('data-id-selected', id);
            span.filter('[data-relid = "' + id + '"]').closest('li').show();
            span.filter('[id = "newElement"]').closest('li').show();
            li.closest('ul').find('.elementSelected').removeClass('elementSelected');
            li.addClass('elementSelected');
        },
        elementsSelected: function () {
            var li = $(this);

            li.closest('ul').find('.elementSelected').removeClass('elementSelected');
            li.addClass('elementSelected');
        },
        freeElementsSelected: function() {
            var li = $(this);

            li.closest('ul').find('.elementSelected').removeClass('elementSelected');
            li.addClass('elementSelected');
        },
        selectChildCategories: function() {
            var id = $(this).data('uid');
            var ul_master = $(this).closest('ul');
            var li_child = settings.elementsWatcher.find('li');

            ul_master.attr('data-id-selected', id);
            li_child.not('[data-relid = "' + id + '"]').not('.newElement').hide();
            li_child.filter('[data-relid = "' + id + '"]').show();
        },
        editElement: function () {
            var element = $(this).closest('li').find('.display');

            element.attr('contenteditable', 'true');
            element.focusin();
            methods.selectText(element);
        },
        uneditElement: function () {
            $(this).attr('contenteditable', 'false');
        },
        assignElement: function () {
            var element = $(this).closest('li').detach();
            element.find('.display-tag').remove();

            var idMaster = settings.masterWatcher.attr('data-id-selected');
            element.attr('data-relid', idMaster);
            settings.elementsWatcher.find('.newElement').closest('li').before(element);
        },
        newElementMaster: function () {
            var newElement = methods.template_li_new_item(1);
            var newEdit = methods.template_edit_element();
            var newClose = methods.template_close_element();
            var uid_data = methods.generateUUID();

            var li = $(this).closest('li');
            var ul = $(this).closest('ul');
            var span = $(this).find('.display');

//            li.find('.display-close ').addClass('close-element');
            li.removeClass('newElementMaster');
            li.attr('data-uid',uid_data);
            ul.attr('data-id-selected', uid_data);

            span.after(newClose);
            span.after(newEdit);
            methods.selectText(span);
            li.after(newElement);
        },
        newElement: function () {
            var newElement = methods.template_li_new_item(2);
            var newEdit = methods.template_edit_element();
            var newClose = methods.template_close_element();
            var uid_data = methods.generateUUID();

            var li = $(this).closest('li');
            var span = $(this).find('.display');

            li.removeClass('newElement');
            $(this).attr('data-uid',uid_data);

            var idMaster = settings.masterWatcher.attr('data-id-selected');
            li.attr('data-relid', idMaster);

            span.after(newClose);
            span.after(newEdit);
            methods.selectText(span);
            span.closest('li').after(newElement);
        },
        newFreeElement: function () {
            var newElement = methods.template_li_new_item(3);
            var newEdit = methods.template_edit_element();
            var newClose = methods.template_close_element();
            var uid_data = methods.generateUUID();
            var newAssign = methods.template_assign_element();

            var li = $(this).closest('li');
            var span = $(this).find('.display');

            //li.find('.display-close').addClass('close-element');
            li.removeClass('newElementFree');
            $(this).attr('data-uid',uid_data);

            span.after(newClose);
            span.after(newEdit);
            span.after(newAssign);
            methods.selectText(span);
            li.after(newElement);
        },
        removeElement: function () {
            var newAssign = methods.template_assign_element();
            var element = $(this).closest('li').detach();

            element.find('.display').removeAttr('data-relid');
            element.find('.display').before(newAssign);
            settings.freeElementsWatcher.find('.newElementFree').closest('li').before(element);
            //$('#free_categories').find('#newFreeElement').closest('li').before(element);
        },
        removeFreeElement: function () {
            $(this).closest('li').remove();
        },
        removeMasterElement: function () {
            // TODO: Delete all dependencies
            var id = $(this).closest('li').find('.display').attr('data-uid');
            var rels = $('#categories').find('[data-relid = "' + id + '"]');
            var rels_li = rels.closest('li');

            rels.removeAttr('data-relid');
            rels_li.prepend(methods.template_assign_element());
            rels_li.detach();
            $('#free_categories').find('#newFreeElement').closest('li').before(rels_li);
            $(this).closest('li').remove();
            // TODO: Discover how hide new element
            $('#categories').find('#newElement').closest('li').hide();
            // TODO: Discover how hide new element
        },
        template_li_master: function (values) {
            return $(
                '<li data-uid="' + values.id + '">' +
                    '<span class="display" " contenteditable="false">' + values.desc + '</span>' +
                    settings.template.edit_element +
                    settings.template.close_element +
                '</li>'
            );
        },
        template_li: function (values) {
            return $(
                '<li data-uid="' + values.id + '" data-relid="' + values.relId + '">' +
                '<span class="display" contenteditable="false">' + values.desc + '</span>' +
                settings.template.edit_element +
                settings.template.close_element +
                '</li>'
            );
        },
        template_li_free: function (values) {
            return $(
                '<li data-uid="' + values.id + '">' +
                    settings.template.assign_element +
                    '<span class="display" contenteditable="false">' + values.desc + '</span>' +
                    settings.template.edit_element +
                    settings.template.close_element +
                '</li>'
            );
        },
        template_edit_element: function () {
            return $(
                settings.template.edit_element
            );
        },
        template_close_element: function () {
            return $(
              settings.template.close_element
            );
        },
        template_assign_element: function () {
            return $(
                settings.template.assign_element
            );
        },
        template_li_new_item: function (elementType) {
            if(elementType == 1) {
                return $(
                    '<li class="newElementMaster">' +
                    settings.template.new_element +
                    '</li>'
                );
            } else if(elementType == 2) {
                return $(
                    '<li class="newElement">' +
                    settings.template.new_element +
                    '</li>'
                );
            } else {
                return $(
                    '<li class="newElementFree">' +
                    settings.template.new_element +
                    '</li>'
                );
            }
        },
        template_ul: function (idUl) {
            return $(
                '<ul class="' + idUl + '">' +
                '</<ul>'
            );
        },
        createElements: function (obj, idUl, listType) {
            methods.template_ul(idUl).appendTo('div');

            $.each(obj, function (i, val) {
                if(listType == 1) {
                    methods.template_li_master(val).appendTo('.' + idUl);
                } else if(listType == 2) {
                    methods.template_li(val).appendTo('.' + idUl);
                } else {
                    methods.template_li_free(val).appendTo('.' + idUl);
                }
            });
            methods.template_li_new_item(listType).appendTo('.' + idUl);
        },
        generateUUID: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        },
        selectText: function (elem) {
            var doc = document;
            var element = elem[0];

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
        }
    };

    $.fn.adminGroupLists = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.joyride');
        }
    };

})(window, jQuery);
