;(function(window, jQuery, undefined) {
    'use strict';

    var defaults = {
            'version'              : '1.0',
            'template' : { // HTML segments
                'element_master'  : '<span class="display" id="newElementMaster" contenteditable="true">Add new</span>',
                'element'         : '<span class="display" id="newElement" contenteditable="true">Add new</span>',
                'element_free'    : '<span class="display" id="newFreeElement" contenteditable="true">Add new</span>',
                'edit_element'    : '<span class="fa fa-pencil display-edit "></span>',
                'close_element'   : '<span class="fa fa-times display-close close-element"></span>',
                'assign_element'  : '<span class="fa fa-tag display-tag "></span>'
            },
            'demo_values': JSON.parse(
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
            )
    },
    settings = {},

    methods = {
        init : function (opts) {
            return this.each(function () {
                if ($.isEmptyObject(settings)) {
                    settings = $.extend(true, defaults, opts);

                    // non configurable settings
                    settings.document = window.document;
                    settings.$document = $(settings.document);
                    settings.$window = $(window);
                    settings.$content_el = $(this);
                }
                methods.createElements(settings.demo_values['group_categories'], 'group_categories', 1);
                methods.createElements(settings.demo_values['categories'], 'categories', 2);
                methods.createElements(settings.demo_values['free_categories'], 'free_categories', 3);

                //
                // Event methods
                //
                var ulWatcher = jQuery('ul');
                var groupWatcher = jQuery('#group_categories');
                var categoriesWatcher = jQuery('#categories');
                var freeCategoriesWatcher = jQuery('#free_categories');

                // Enter Key disable edit
                ulWatcher.on('keypress', '.display', function (e) {
                    return e.which != 13;
                });

                // Selected element
                groupWatcher.on('click', 'li' , methods.groupSelected);
                categoriesWatcher.on('click', 'li' , methods.categoriesSelected);
                freeCategoriesWatcher.on('click', 'li' , methods.freeCategoriesSelected);

                // Select child categories from master
                groupWatcher.on('click focus', '.display', methods.selectChildCategories);

                // Edit element
                ulWatcher.on('click', '.display-edit', methods.editElement);
                ulWatcher.on('focusout', '.display', methods.uneditElement);
                // New element Master
                ulWatcher.on('focus', '#newElementMaster', methods.newElementMaster);
                // New element
                ulWatcher.on('focus', '#newElement', methods.newElement);
                // New free element
                ulWatcher.on('focus', '#newFreeElement', methods.newFreeElement);
                // Tagged free element
                ulWatcher.on('click', '.display-tag', methods.assignElement);
                // Remove group categories
                groupWatcher.on('click', '.close-element', methods.removeMasterElement);
                // Remove element
                categoriesWatcher.on('click', '.close-element', methods.removeElement);
                // Remove free categories
                freeCategoriesWatcher.on('click', '.close-element', methods.removeFreeElement);
            });
        },
        groupSelected: function () {
            var id = $(this).data('uid');
            var spanCategories = $('#categories li span');
            console.log(id);
            $(this).closest('ul').attr('data-id-selected', id);
            spanCategories.filter('[data-relid = "' + id + '"]').closest('li').show();
            spanCategories.filter('[id = "newElement"]').closest('li').show();
            $(this).closest('ul').find('.elementSelected').removeClass('elementSelected');
            $(this).addClass('elementSelected');
        },
        categoriesSelected: function () {
            $(this).closest('ul').find('.elementSelected').removeClass('elementSelected');
            $(this).addClass('elementSelected');
        },
        freeCategoriesSelected: function() {
            $(this).closest('ul').find('.elementSelected').removeClass('elementSelected');
            $(this).addClass('elementSelected');
        },
        selectChildCategories: function() {
            var id = $(this).data('uid');
            var spanCategories = $('#categories li span');

            $(this).closest('ul').attr('data-id-selected', id);
            spanCategories.closest('li').hide();
            spanCategories.filter('[data-relid = "' + id + '"]').closest('li').show();
            spanCategories.filter('[id = "newElement"]').closest('li').show();
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

            var idMaster = $('#group_categories').attr('data-id-selected');
            element.find('.display').attr('data-relid', idMaster);
            $('#categories').find('#newElement').closest('li').before(element);
        },
        newElementMaster: function () {
            var newElement = methods.template_li_new_item(1);
            var newEdit = methods.template_edit_element();
            var newClose = methods.template_close_element();
            var uid_data = methods.generateUUID();

            $(this).closest('li').find('.display-close ').addClass('close-element');
            $(this).removeAttr('id');
            $(this).attr('data-uid',uid_data);
            $(this).closest('ul').attr('data-id-selected', uid_data);

            $(this).after(newClose);
            $(this).after(newEdit);
            methods.selectText($(this));
            $(this).closest('li').after(newElement);
        },
        newElement: function () {
            var newElement = methods.template_li_new_item(2);
            var newEdit = methods.template_edit_element();
            var newClose = methods.template_close_element();
            var uid_data = methods.generateUUID();

            $(this).closest('li').find('.display-close ').addClass('close-element');
            $(this).removeAttr('id');
            $(this).attr('data-uid',uid_data);

            var idMaster = $('#group_categories').attr('data-id-selected');
            $(this).attr('data-relid',idMaster);

            $(this).after(newClose);
            $(this).after(newEdit);
            methods.selectText($(this));
            $(this).closest('li').after(newElement);
        },
        newFreeElement: function () {
            var newElement = methods.template_li_new_item(3);
            var newEdit = methods.template_edit_element();
            var newClose = methods.template_close_element();
            var uid_data = methods.generateUUID();
            var newAssign = methods.template_assign_element();

            $(this).closest('li').find('.display-close').addClass('close-element');
            $(this).removeAttr('id');
            $(this).attr('data-uid',uid_data);

            $(this).after(newClose);
            $(this).after(newEdit);
            $(this).after(newAssign);
            methods.selectText($(this));
            $(this).closest('li').after(newElement);
        },
        removeElement: function () {
            var newAssign = methods.template_assign_element();
            var element = $(this).closest('li').detach();

            element.find('.display').removeAttr('data-relid');
            element.find('.display').before(newAssign);
            $('#free_categories').find('#newFreeElement').closest('li').before(element);
        },
        removeFreeElement: function () {
            $(this).closest('li').remove();
        },
        removeMasterElement: function () {
            // TODO: Delete all dependencies
            var id = $(this).closest('li').find('.display').attr('data-uid');
            var rels = $('#categories').find('[data-relid = "' + id + '"]');
            console.log(rels);
            // TODO-END: Delete all dependencies

//            $(this).closest('li').remove();
        },
        template_li_master: function (values) {
            return $(
                '<li>' +
                    '<span class="display" data-uid="' + values.id + '" contenteditable="false">' + values.desc + '</span>' +
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
        template_li: function (values) {
            return $(
                '<li>' +
                    '<span class="display" data-uid="' + values.id + '" data-relid="' + values.relId + '" contenteditable="false">' + values.desc + '</span>' +
                    settings.template.edit_element +
                    settings.template.close_element +
                '</li>'
            );
        },
        template_li_free: function (values) {
            return $(
                '<li>' +
                settings.template.assign_element +
                '<span class="display" data-uid="' + values.id + '" data-relid="' + values.relId + '" contenteditable="false">' + values.desc + '</span>' +
                settings.template.edit_element +
                settings.template.close_element +
                '</li>'
            );
        },
        template_li_new_item: function (elementType) {
            if(elementType == 1) {
                return $(
                    '<li>' +
                    settings.template.element_master +
                    '</li>'
                );
            } else if(elementType == 2) {
                return $(
                    '<li>' +
                    settings.template.element +
                    '</li>'
                );
            } else {
                return $(
                    '<li>' +
                    settings.template.element_free +
                    '</li>'
                );
            }
        },
        template_ul: function (idUl) {
            return $(
                '<ul id="' + idUl + '">' +
                '</<ul>'
            );
        },
        createElements: function (obj, idUl, listType) {
            methods.template_ul(idUl).appendTo('div');

            $.each(obj, function (i, val) {
                if(listType == 1) {
                    methods.template_li_master(val).appendTo('#' + idUl);
                } else if(listType == 2) {
                    methods.template_li(val).appendTo('#' + idUl);
                } else {
                    methods.template_li_free(val).appendTo('#' + idUl);
                }
            });
            methods.template_li_new_item(listType).appendTo('#' + idUl);
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
