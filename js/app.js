;(function(window, jQuery, undefined) {
    'use strict';

    var settings = {},

    methods = {
        init : function (opts) {
            return this.each(function () {

//                if ($.isEmptyObject(settings)) {
                    settings = $.extend(true, $.fn.adminGroupLists.defaults, opts);
                    // non configurable settings
                    console.log(settings);
//                }
                settings.$content_el = $(this);
                settings.id_container = $(this).attr('id');

                methods.createElements(settings.values['far_master_elements'], 'far_master_elements', 1);
                methods.createElements(settings.values['far_elements'], 'far_elements', 2);
                methods.createElements(settings.values['far_free_elements'], 'far_free_elements', 3);
                $(this).data('settings', $.extend(true, {} , settings));

                settings.ulWatcher = settings.$content_el.find('ul');
                settings.masterWatcher = settings.ulWatcher.filter('.far_master_elements');
                settings.elementsWatcher = settings.ulWatcher.filter('.far_elements');
                settings.freeElementsWatcher = settings.ulWatcher.filter('.far_free_elements');

                //
                // Event methods
                //
                // Enter Key disable edit
                settings.ulWatcher.on('keypress', '.far_display', function (e) {
                    return e.which != 13;
                });
                // Selected element
                settings.masterWatcher.on('click', 'li' , methods.masterSelected);
                settings.elementsWatcher.on('click', 'li' , methods.elementsSelected);
                settings.freeElementsWatcher.on('click', 'li' , methods.freeElementsSelected);
                // Select child categories from master
                settings.masterWatcher.on('click focus', 'li', methods.selectChildCategories);
                // Edit element
                settings.ulWatcher.on('click', '.far_display-edit', methods.editElement);
                settings.ulWatcher.on('focusout', '.far_display', methods.uneditElement);
                // New element Master
                settings.masterWatcher.on('click', '.newElementMaster', methods.newElementMaster);
                // New element
                settings.elementsWatcher.on('click', '.newElement', methods.newElement);
                // New free element
                settings.freeElementsWatcher.on('click', '.newElementFree', methods.newFreeElement);
                // Tagged free element
                settings.freeElementsWatcher.on('click', '.far_display-tag', methods.assignElement);
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
            var div = li.closest('div');
            var ul = li.closest('ul');
            var id = li.data('uid');
            var li_child_newelement = div.find('.far_elements').find('li').filter('.newElement');

            ul.attr('data-id-selected', id);
            ul.find('.elementSelected').removeClass('elementSelected');
            li.addClass('elementSelected');

            // Controls event that shows 'Add new' in element
            /*
            if(li_child_newelement.attr('data-eventhide')){
                li_child_newelement.removeAttr('data-eventhide');
            } else {
                li_child_newelement.show();
            }
            */
            li_child_newelement.show();
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
            var li = $(this);
            var div = li.closest('div');
            var ul_master = li.closest('ul');
            var li_child = div.find('.far_elements').find('li');
            var id = li.data('uid');

            ul_master.attr('data-id-selected', id);
            li_child.not('[data-relid = "' + id + '"]').not('.newElement').hide();
            li_child.filter('[data-relid = "' + id + '"]').show();
        },
        editElement: function () {
            var element = $(this).closest('li').find('.far_display');

            element.attr('contenteditable', 'true');
            element.focusin();
            methods.selectText(element);
        },
        uneditElement: function () {
            $(this).attr('contenteditable', 'false');
        },
        assignElement: function () {
            var li = $(this).closest('li');
            var div = li.closest('div');
            var element = li.detach();
            var idMaster = div.find('.far_master_elements').attr('data-id-selected');

            element.find('.far_display-tag').remove();
            element.attr('data-relid', idMaster);
            div.find('.far_elements').find('.newElement').closest('li').before(element);
        },
        newElementMaster: function () {
            var newElement = methods.template_li_new_item(1);
            var newEdit = methods.template_edit_element();
            var newClose = methods.template_close_element();
            var uid_data = methods.generateUUID();

            var li = $(this).closest('li');
            var ul = $(this).closest('ul');
            var span = $(this).find('.far_display');

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
            var span = $(this).find('.far_display');

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
            var span = $(this).find('.far_display');

            li.removeClass('newElementFree');
            $(this).attr('data-uid',uid_data);

            span.before(newAssign);
            span.after(newClose);
            span.after(newEdit);
            methods.selectText(span);
            li.after(newElement);
        },
        removeElement: function () {
            var li = $(this).closest('li');
            var div = li.closest('div');
            var element = li.detach();
            var newAssign = methods.template_assign_element();

            element.find('.far_display').removeAttr('data-relid');
            element.find('.far_display').before(newAssign);
            div.find('.far_free_elements').find('.newElementFree').closest('li').before(element);
        },
        removeFreeElement: function () {
            $(this).closest('li').remove();
        },
        removeMasterElement: function () {
            var li_master = $(this).closest('li');
            var id = li_master.attr('data-uid');
            var div = li_master.closest('div');
            var ul = li_master.closest('ul');


            var li_child = div.find('.far_elements').find('li');
            var li_child_elements = li_child.filter('[data-relid = "' + id + '"]');
            var li_child_newelement = li_child.filter('.newElement');
            var ul_free_elements = div.find('.far_free_elements');

            li_child_elements.prepend(methods.template_assign_element());
            li_child_elements.detach();
            li_child_newelement.hide();

            ul_free_elements.find('li').filter('.newElementFree').before(li_child_elements);
            // Controls event that shows 'Add new' in element
            //li_child_newelement.attr('data-eventhide', 'true');
            li_master.remove();
        },
        template_li_master: function (values) {
            return $(
                '<li data-uid="' + values.id + '">' +
                    '<span class="far_display" " contenteditable="false">' + values.desc + '</span>' +
                    settings.template.edit_element +
                    settings.template.close_element +
                '</li>'
            );
        },
        template_li: function (values) {
            return $(
                '<li data-uid="' + values.id + '" data-relid="' + values.relId + '" style="display: none;">' +
                '<span class="far_display" contenteditable="false">' + values.desc + '</span>' +
                settings.template.edit_element +
                settings.template.close_element +
                '</li>'
            );
        },
        template_li_free: function (values) {
            return $(
                '<li data-uid="' + values.id + '">' +
                    settings.template.assign_element +
                    '<span class="far_display" contenteditable="false">' + values.desc + '</span>' +
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
        template_li_new_item: function (elementType, hidden) {
            if(elementType == 1) {
                return $(
                    '<li class="newElementMaster">' +
                    settings.template.new_element +
                    '</li>'
                );
            } else if(elementType == 2) {
                if (hidden){
                    return $(
                        '<li class="newElement" style="display: none;">' +
                        settings.template.new_element +
                        '</li>'
                    );

                } else {
                    return $(
                        '<li class="newElement">' +
                        settings.template.new_element +
                        '</li>'
                    );
                }
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
        createElements: function (obj,ulClass, listType) {
            var ulElement = settings.$content_el.find('.' + ulClass);

            if(!ulElement.length) {
                ulElement = methods.template_ul(ulClass);
                ulElement.appendTo('#' + settings.id_container);
            }

            $.each(obj, function (i, val) {
                if(listType == 1) {
                    methods.template_li_master(val).appendTo(ulElement);
                } else if(listType == 2) {
                    methods.template_li(val).appendTo(ulElement);
                } else {
                    methods.template_li_free(val).appendTo(ulElement);
                }
            });
            if(listType == 2) {
                methods.template_li_new_item(listType, true).appendTo(ulElement);
            } else {
                methods.template_li_new_item(listType).appendTo(ulElement);
            }
        },
        getAllElements: function () {
            var settings = $(this).data('settings');
            var container_el = $('#' + settings.id_container);
            var json_send = {};

            json_send['far_master_elements'] = methods.getElements(container_el, '.far_master_elements', '.newElementMaster');
            json_send['far_free_elements'] = methods.getElements(container_el, '.far_free_elements', '.newElementFree');
            json_send['far_elements'] = methods.getElements(container_el, '.far_elements', '.newElement');
            //console.log(json_send);
            //console.log(JSON.stringify(json_send));
            return json_send;
        },
        getElements: function (container_el, groupElements, classNewElements) {
            var master = [];
            var group_elements = container_el.find(groupElements);
            var elements_each = group_elements.find('li').not(classNewElements);
            elements_each.each(function() {
                var element = {};
                element.id = $(this).attr('data-uid');
                element.desc = $(this).find('.far_display').text();
                master.push(element);
            });

            return master;
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
            $.error('Method ' +  method + ' does not exist on jQuery.adminGroupLists');
        }
    };

    $.fn.adminGroupLists.defaults = {
        'version': '1.0',
        'id_container': 'demo',
        'template': { // HTML segments
            'new_element': '<span class="far_display" contenteditable="true">Add new</span>',
            'edit_element': '<span class="fa fa-pencil far_display-edit"></span>',
            'close_element': '<span class="fa fa-times far_display-close close-element"></span>',
            'assign_element': '<span class="fa fa-tag far_display-tag"></span>'
        },
        'values': {
            "far_master_elements": [
                {"id": "1", "desc": "Alimentacion"},
                {"id": "4", "desc": "Servicios profesionales"},
                {"id": "5", "desc": "Salud"}
            ],
            "far_free_elements": [
                {"id": "7", "desc": "Farmacia"},
                {"id": "8", "desc": "Optica"},
                {"id": "9", "desc": "Parafarmacia"}
            ],
            "far_elements": [
                {"id": "1", "desc": "Ferreteria", "relId": "1"},
                {"id": "4", "desc": "Supermercado", "relId": "1"},
                {"id": "5", "desc": "Bar / Restaurante", "relId": "4"}
            ]
        }
    }

})(window, jQuery);
