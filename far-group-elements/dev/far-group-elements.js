/*
 * jQuery Group Elements Admin plugin
 * http://www.fernandoaparicio.net
 * Copyright 2016, faparicior
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

;(function(window, jQuery, undefined) {
    'use strict';

    var methods = {
        init : function (opts) {
            return this.each(function () {

                //if ($.isEmptyObject(settings)) {
                var settings = $.extend(true, $.fn.adminGroupLists.defaults, opts);
                //}
                settings.$content_el = $(this);
                settings.id_container = $(this).attr('id');

                $(this).data('settings', $.extend(true, {} , settings));

                methods.clearElements(settings, 'far_master_elements');
                methods.clearElements(settings, 'far_elements');
                methods.clearElements(settings, 'far_free_elements');

                methods.createElements(settings, 'far_master_elements', 1);
                methods.createElements(settings, 'far_elements', 2);
                methods.createElements(settings, 'far_free_elements', 3);

                var ulWatcher = settings.$content_el.find('ul');
                var masterWatcher = ulWatcher.filter('.far_master_elements');
                var elementsWatcher = ulWatcher.filter('.far_elements');
                var freeElementsWatcher = ulWatcher.filter('.far_free_elements');

                // Disable event watcher to reengage.
                masterWatcher.off('click', '.newElementMaster');
                elementsWatcher.off('click', '.newElement');
                freeElementsWatcher.off('click', '.newElementFree');

                //
                // Event methods
                //
                // Enter Key disable edit
                ulWatcher.on('keypress', '.far_display', methods.interceptKeys);
                ulWatcher.on('keyup', '.far_display', methods.interceptEscKeys);
                // Selected element
                masterWatcher.on('click', 'li' , methods.masterSelected);
                elementsWatcher.on('click', 'li' , methods.elementsSelected);
                freeElementsWatcher.on('click', 'li' , methods.freeElementsSelected);
                // Select child categories from master
                masterWatcher.on('click focus', 'li', methods.selectChildCategories);
                // Edit element
                ulWatcher.on('click', '.far_display-edit', methods.editElement);
                ulWatcher.on('focusout', '.far_display', methods.uneditElement);
                // New element Master
                masterWatcher.on('click', '.newElementMaster', methods.newElementMaster);
                // New element
                elementsWatcher.on('click', '.newElement', methods.newElement);
                // New free element
                freeElementsWatcher.on('click', '.newElementFree', methods.newFreeElement);
                // Tagged free element
                freeElementsWatcher.on('click', '.far_display-tag', methods.assignElement);
                // Remove group categories
                masterWatcher.on('click', '.close-element', methods.removeMasterElement);
                // Remove element
                elementsWatcher.on('click', '.close-element', methods.removeElement);
                // Remove free categories
                freeElementsWatcher.on('click', '.close-element', methods.removeFreeElement);
            });
        },
        masterSelected: function () {
            var li = $(this);
            var div = li.closest('.far-admin-groups');
            var ul = li.closest('ul');
            var id = li.data('uid');
            var li_child_newelement = div.find('.far_elements').find('li').filter('.newElement');
            var li_child = div.find('.far_elements').find('li');

            ul.attr('data-id-selected', id);
            ul.find('.elementSelected').removeClass('elementSelected');
            li_child.filter('.elementSelected').removeClass('elementSelected');
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
            var div = li.closest('.far-admin-groups');
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
            var div = li.closest('.far-admin-groups');
            var idMaster = div.find('.far_master_elements').attr('data-id-selected');

            if(idMaster) {
                var element = li.detach();

                element.find('.far_display-tag').remove();
                element.attr('data-relid', idMaster);
                div.find('.far_elements').find('.newElement').closest('li').before(element);
            }
        },
        newElementMaster: function (element) {
            var classes_extra = methods.getClassesExtra(element.target);
            var templates = methods.getTemplates(element.target);

            var newElement = methods.template_li_new_item(1, templates, classes_extra, false);
            var newEdit = $(templates.edit_element);
            var newClose = $(templates.close_element);
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
        newElement: function (element) {
            var classes_extra = methods.getClassesExtra(element.target);
            var templates = methods.getTemplates(element.target);

            var newElement = methods.template_li_new_item(2, templates, classes_extra, false);
            var newEdit = $(templates.edit_element);
            var newClose = $(templates.close_element);
            var uid_data = methods.generateUUID();

            var li = $(this).closest('li');
            var div = li.closest('.far-admin-groups');
            var ul_master = div.find('ul').filter('.far_master_elements');
            var span = $(this).find('.far_display');

            li.removeClass('newElement');
            $(this).attr('data-uid',uid_data);

            var idMaster = ul_master.attr('data-id-selected');
            li.attr('data-relid', idMaster);

            span.after(newClose);
            span.after(newEdit);
            methods.selectText(span);
            span.closest('li').after(newElement);
        },
        newFreeElement: function (element) {
            var classes_extra = methods.getClassesExtra(element.target);
            var templates = methods.getTemplates(element.target);

            var newElement = methods.template_li_new_item(3, templates, classes_extra, false);
            var newEdit = $(templates.edit_element);
            var newClose = $(templates.close_element);
            var newAssign = $(templates.assign_element);
            var uid_data = methods.generateUUID();

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
        getClassesExtra: function (element) {
            var setting = $(element).closest('.far-admin-groups').data('settings');
            return setting.classes;
        },
        getTemplates: function (element) {
            var setting = $(element).closest('.far-admin-groups').data('settings');
            return setting.template;
        },
        removeElement: function (element) {
            var templates = methods.getTemplates(element.target);

            var li = $(this).closest('li');
            var div = li.closest('.far-admin-groups');
            var li_element = li.detach();
            var newAssign = $(templates.assign_element);

            li_element.find('.far_display').removeAttr('data-relid');
            li_element.find('.far_display').before(newAssign);
            div.find('.far_free_elements').find('.newElementFree').closest('li').before(li_element);
        },
        removeFreeElement: function () {
            $(this).closest('li').remove();
        },
        removeMasterElement: function (element) {
            var templates = methods.getTemplates(element.target);

            var li_master = $(this).closest('li');
            var id = li_master.attr('data-uid');
            var div = li_master.closest('.far-admin-groups');
            var ul = li_master.closest('ul');
            var id_master_selected = ul.attr('data-id-selected');


            var li_child = div.find('.far_elements').find('li');
            var li_child_elements = li_child.filter('[data-relid = "' + id + '"]');
            var li_child_newelement = li_child.filter('.newElement');
            var ul_free_elements = div.find('.far_free_elements');

            li_child_elements.prepend($(templates.assign_element));
            li_child_elements.show();
            li_child_elements.detach();

            if(id == id_master_selected){
                ul.removeAttr('data-id-selected');
                li_child_newelement.hide();
            }

            ul_free_elements.find('li').filter('.newElementFree').before(li_child_elements);
            // Controls event that shows 'Add new' in element
            //li_child_newelement.attr('data-eventhide', 'true');
            li_master.remove();
        },
        template_li_master: function (values, templates, classes) {
            return $(
                '<li data-uid="' + values.id + '">' +
                    '<span class="far_display" " contenteditable="false">' + values.desc + '</span>' +
                    templates.edit_element +
                    templates.close_element +
                '</li>'
            ).addClass(classes.li_master);
        },
        template_li: function (values, templates, classes) {
            return $(
                '<li data-uid="' + values.id + '" data-relid="' + values.relId + '" style="display: none;">' +
                '<span class="far_display" contenteditable="false">' + values.desc + '</span>' +
                templates.edit_element +
                templates.close_element +
                '</li>'
            ).addClass(classes.li_element);
        },
        template_li_free: function (values, templates, classes) {
            return $(
                '<li data-uid="' + values.id + '">' +
                    templates.assign_element +
                    '<span class="far_display" contenteditable="false">' + values.desc + '</span>' +
                    templates.edit_element +
                    templates.close_element +
                '</li>'
            ).addClass(classes.li_free_element);
        },
        template_li_new_item: function (elementType, template, classes, hidden) {
            if(elementType == 1) {
                return $(
                    '<li class="newElementMaster">' +
                        methods.getNewElementText(elementType, template)+
                    '</li>'
                ).addClass(classes.li_master)
            } else if(elementType == 2) {
                if (hidden){
                    return $(
                        '<li class="newElement" style="display: none;">' +
                            methods.getNewElementText(elementType, template)+
                        '</li>'
                    ).addClass(classes.li_new_element)
                } else {
                    return $(
                        '<li class="newElement">' +
                            methods.getNewElementText(elementType, template)+
                        '</li>'
                    ).addClass(classes.li_new_element)
                }
            } else {
                return $(
                    '<li class="newElementFree">' +
                        methods.getNewElementText(elementType, template)+
                    '</li>'
                ).addClass(classes.li_free_element)
            }
        },
        template_ul: function (idUl) {
            return $(
                '<ul class="' + idUl + '">' +
                '</<ul>'
            );
        },
        getNewElementText: function (elementType, template){
            var element = $(template.new_element);

            switch (elementType) {
                case 1:
                    element.text(template.li_master_text);
                    break;
                case 2:
                    element.text(template.li_element_text);
                    break;
                case 3:
                    element.text(template.li_free_element_text);
                    break;
            }
            return element.wrap('<p/>').parent().html();
        },
        createElements: function (settings, ulClass, listType) {
            var classes_extra = settings.classes;
            var templates = settings.template;
            var obj = settings.values[ulClass];

            var ulElement = settings.$content_el.find('.' + ulClass);

            if(!ulElement.length) {
                ulElement = methods.template_ul(ulClass);
                ulElement.appendTo('#' + settings.id_container);
            }

            $.each(obj, function (i, val) {
                if(listType == 1) {
                    methods.template_li_master(val, templates, classes_extra).appendTo(ulElement);
                } else if(listType == 2) {
                    methods.template_li(val, templates, classes_extra).appendTo(ulElement);
                } else {
                    methods.template_li_free(val, templates, classes_extra).appendTo(ulElement);
                }
            });
            if(listType == 2) {
                methods.template_li_new_item(listType, templates, classes_extra, true).appendTo(ulElement);
            } else {
                methods.template_li_new_item(listType, templates, classes_extra, false).appendTo(ulElement);
            }
        },
        clearElements: function (settings, ulClass) {
            var liElements = settings.$content_el.find('.' + ulClass).find('li');

            liElements.remove();
        },
        getAllElements: function () {
            var settings = $(this).data('settings');
            var container_el = $('#' + settings.id_container);
            var json_send = {};

            json_send['far_master_elements'] = methods.getElements(container_el, '.far_master_elements', '.newElementMaster');
            json_send['far_free_elements'] = methods.getElements(container_el, '.far_free_elements', '.newElementFree');
            json_send['far_elements'] = methods.getElements(container_el, '.far_elements', '.newElement');
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
        },
        deselectText: function (){
            if ( document.selection ) {
                document.selection.empty();
            } else if ( window.getSelection ) {
                window.getSelection().removeAllRanges();
            }
        },
        interceptKeys: function (e) {
            // Intercepts 'Enter' behaviour
            if (e.keyCode == 13) {
                $(e.target).removeAttr('contenteditable');
            }
            return e.which != 13;
        },
        interceptEscKeys: function (e) {
            // Replaces 'Esc' behaviour with 'Ctrl+Z'
            if(e.keyCode == 27) {
                document.execCommand('Undo',false,0);
                methods.deselectText();
                $(e.target).removeAttr('contenteditable');
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
            'new_element': '<span class="far_display" contenteditable="true"></span>',
            'edit_element': '<span class="fa fa-pencil far_display-edit"></span>',
            'close_element': '<span class="fa fa-times far_display-close close-element"></span>',
            'assign_element': '<span class="fa fa-tag far_display-tag"></span>',
            'li_master_text': 'New element',
            'li_element_text': 'New element',
            'li_free_element_text': 'New FREE element'
        },
        'classes': { // LI custom classes
            'li_master': '',
            'li_element': '',
            'li_free_element': '',
            'li_new_element': ''
        },
        'values': {
            "far_master_elements": [
                {"id": "1", "desc": "Markets"},
                {"id": "4", "desc": "Professional services"},
                {"id": "5", "desc": "Health"}
            ],
            "far_free_elements": [
                {"id": "7", "desc": "Pharmacy"},
                {"id": "8", "desc": "Optics"},
                {"id": "9", "desc": "Shoes"}
            ],
            "far_elements": [
                {"id": "1", "desc": "Supermarket", "relId": "1"},
                {"id": "4", "desc": "Fruit Store", "relId": "1"},
                {"id": "5", "desc": "Hardware", "relId": "4"}
            ]
        }
    }

})(window, jQuery);
