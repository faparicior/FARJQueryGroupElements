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

                methods.createElements(settings, 'far_master_elements', 'master');

                if (settings.behaviour['li_master_standalone'] == false) {
                    methods.createElements(settings, 'far_elements', 'element');
                    methods.createElements(settings, 'far_free_elements', 'free_element');
                }

                var ulWatcher = settings.$content_el.find('ul');
                var masterWatcher = ulWatcher.filter('.far_master_elements');
                if (settings.behaviour['li_master_standalone'] == false) {
                    var elementsWatcher = ulWatcher.filter('.far_elements');
                    var freeElementsWatcher = ulWatcher.filter('.far_free_elements');
                }
                // Status elements ('normal', 'new', 'updated')
                ulWatcher.find('li').attr('data-status','normal');

                // Disable event watcher to reengage.
                masterWatcher.off('click', '.newElementMaster');
                if (settings.behaviour['li_master_standalone'] == false) {
                    elementsWatcher.off('click', '.newElement');
                    freeElementsWatcher.off('click', '.newElementFree');
                }

                //
                // Event methods
                //
                // Enter Key disable edit
                ulWatcher.on('keypress', '.far_display', methods.interceptKeys);
                ulWatcher.on('keyup', '.far_display', methods.interceptEscKeys);
                // Selected element
                masterWatcher.on('click', 'li' , methods.masterSelected);
                // Select child categories from master
                masterWatcher.on('click focus', 'li', methods.selectChildCategories);
                // Edit element
                ulWatcher.on('click', '.far_display-edit', methods.editElement);
                ulWatcher.on('focusout', '.far_display', methods.uneditElement);
                // New element Master
                masterWatcher.on('click', '.newElementMaster', methods.newElementMaster);
                // Remove group categories
                masterWatcher.on('click', '.close-element', methods.removeMasterElement);
                if (settings.behaviour['li_master_standalone'] == false) {
                    elementsWatcher.on('click', 'li', methods.elementsSelected);
                    freeElementsWatcher.on('click', 'li', methods.freeElementsSelected);
                    // New element
                    elementsWatcher.on('click', '.newElement', methods.newElement);
                    // New free element
                    freeElementsWatcher.on('click', '.newElementFree', methods.newFreeElement);
                    // Tagged free element
                    freeElementsWatcher.on('click', '.far_display-tag', methods.assignElement);
                    // Remove element
                    elementsWatcher.on('click', '.close-element', methods.removeElement);
                    // Remove free categories
                    freeElementsWatcher.on('click', '.close-element', methods.removeFreeElement);
                }
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
            if (li_child_newelement.text() != '') {
                li_child_newelement.show();
            }
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
            var li = $(this).closest('li');
            var element = li.find('.far_display');

            element.attr('contenteditable', 'true');
            if (li.attr('data-status') != 'new') {
                li.attr('data-status','updated');
            }

            element.focusin();
            methods.selectText(element);
        },
        uneditElement: function () {
            $(this).attr('contenteditable', 'false');
        },
        assignElement: function (element) {
            var settings = methods.getSettings(element.target);

            var li = $(this).closest('li');
            methods.clearBehaviour(li);
            methods.addBehaviour('element', li, settings);

            var div = li.closest('.far-admin-groups');
            var idMaster = div.find('.far_master_elements').attr('data-id-selected');

            if(idMaster) {
                var element_li = li.detach();

                element_li.find('.far_display-tag').remove();
                element_li.attr('data-relid', idMaster);
                div.find('.far_elements').find('.newElement').closest('li').before(element_li);
            }
        },
        newElementMaster: function (element) {
            var settings = methods.getSettings(element.target);

            var newElement = methods.template_li_new_item('master', settings, false);
            var newBehaviour = $(methods.getBehaviourTemplate('master', settings));

            var uid_data = methods.generateUUID();

            var li = $(this).closest('li');
            var ul = $(this).closest('ul');
            var span = $(this).find('.far_display');

            li.removeClass('newElementMaster');
            li.attr('data-uid',uid_data);
            li.attr('data-status','new');
            ul.attr('data-id-selected', uid_data);

            span.after(newBehaviour);
            methods.selectText(span);
            li.after(newElement);
        },
        newElement: function (element) {
            var settings = methods.getSettings(element.target);

            var newElement = methods.template_li_new_item('element', settings, false);
            var newBehaviour = $(methods.getBehaviourTemplate('element', settings));
            var uid_data = methods.generateUUID();

            var li = $(this).closest('li');
            var div = li.closest('.far-admin-groups');
            var ul_master = div.find('ul').filter('.far_master_elements');
            var span = $(this).find('.far_display');

            li.removeClass('newElement');
            $(this).attr('data-uid',uid_data);
            $(this).attr('data-status','new');

            var idMaster = ul_master.attr('data-id-selected');
            li.attr('data-relid', idMaster);

            span.after(newBehaviour);
            methods.selectText(span);
            span.closest('li').after(newElement);
        },
        newFreeElement: function (element) {
            var settings = methods.getSettings(element.target);
            var templates = settings.template;

            var newElement = methods.template_li_new_item('free_element', settings, false);
            var newBehaviour = $(methods.getBehaviourTemplate('free_element', settings));
            var newAssign = $(templates.assign_element);
            var uid_data = methods.generateUUID();

            var li = $(this).closest('li');
            var span = $(this).find('.far_display');

            li.removeClass('newElementFree');
            $(this).attr('data-uid',uid_data);
            $(this).attr('data-status','new');

            span.before(newAssign);
            span.after(newBehaviour);
            methods.selectText(span);
            li.after(newElement);
        },
        getTemplates: function (element) {
            return methods.getSettings(element).template;
        },
        getSettings: function (element) {
            return $(element).closest('.far-admin-groups').data('settings');
        },
        removeElement: function (element) {
            var settings = methods.getSettings(element.target);
            var templates = settings.template;

            var li = $(this).closest('li');
            var div = li.closest('.far-admin-groups');
            var li_element = li.detach();
            var newAssign = $(templates.assign_element);

            methods.clearBehaviour(li);
            methods.addBehaviour('free_element', li, settings);

            li_element.find('.far_display').removeAttr('data-relid');
            li_element.find('.far_display').before(newAssign);
            div.find('.far_free_elements').find('.newElementFree').closest('li').before(li_element);
        },
        removeFreeElement: function () {
            $(this).closest('li').remove();
        },
        removeMasterElement: function (element) {
            var settings = methods.getSettings(element.target);
            var templates = settings.template;

            var li_master = $(this).closest('li');
            var id = li_master.attr('data-uid');
            var div = li_master.closest('.far-admin-groups');
            var ul = li_master.closest('ul');
            var id_master_selected = ul.attr('data-id-selected');


            var li_child = div.find('.far_elements').find('li');
            var li_child_elements = li_child.filter('[data-relid = "' + id + '"]');
            var li_child_newelement = li_child.filter('.newElement');
            var ul_free_elements = div.find('.far_free_elements');

            methods.clearBehaviour(li_child_elements);
            methods.addBehaviour('free_element', li_child_elements, settings);

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
        clearBehaviour: function (li_elements) {
            li_elements.find('span').filter('.far_display-edit').detach();
            li_elements.find('span').filter('.far_display-close').detach();
            li_elements.find('span').filter('.far_display-tag').detach();
        },
        addBehaviour: function (type, li_elements, settings) {
            var elements = $(methods.getBehaviourTemplate(type, settings));

            li_elements.find('span').after(elements);
        },
        template_li_master: function (values, settings) {
            return $(
                '<li data-uid="' + values.id + '">' +
                    '<span class="far_display" " contenteditable="false">' + values.desc + '</span>' +
                    methods.getBehaviourTemplate('master', settings) +
                '</li>'
            ).addClass(settings.classes.li_master);
        },
        template_li: function (values, settings) {
            return $(
                '<li data-uid="' + values.id + '" data-relid="' + values.relId + '" style="display: none;">' +
                    '<span class="far_display" contenteditable="false">' + values.desc + '</span>' +
                    methods.getBehaviourTemplate('element', settings) +
                '</li>'
            ).addClass(settings.classes.li_element);
        },
        template_li_free: function (values, settings) {
            return $(
                '<li data-uid="' + values.id + '">' +
                    settings.template.assign_element +
                    '<span class="far_display" contenteditable="false">' + values.desc + '</span>' +
                    methods.getBehaviourTemplate('free_element', settings) +
                '</li>'
            ).addClass(settings.classes.li_free_element);
        },
        template_li_new_item: function (elementType, settings, hidden) {
            var element = '';

            if(elementType == 'master') {
                element = $(
                    '<li class="newElementMaster">' +
                        methods.getNewElementEntity(elementType, settings)+
                    '</li>'
                ).addClass(settings.classes.li_master);
            } else if(elementType == 'element') {
                element = $(
                        '<li class="newElement">' +
                            methods.getNewElementEntity(elementType, settings)+
                        '</li>'
                    ).addClass(settings.classes.li_new_element);
            } else {
                element = $(
                    '<li class="newElementFree">' +
                        methods.getNewElementEntity(elementType, settings)+
                    '</li>'
                ).addClass(settings.classes.li_free_element);
            }
            if(hidden) {
                element.hide();
            }

            return element;
        },
        template_ul: function (idUl) {
            return $(
                '<ul class="' + idUl + '">' +
                '</<ul>'
            );
        },
        getBehaviourTemplate: function (type, settings){
            var editable = false;
            var removable = false;

            switch (type)
            {
                case 'master':
                    editable = settings.behaviour.li_master_editable;
                    removable = settings.behaviour.li_master_removable;
                    break;
                case 'element':
                    editable = settings.behaviour.li_element_editable;
                    removable = settings.behaviour.li_element_removable;
                    break;
                case 'free_element':
                    editable = settings.behaviour.li_free_element_editable;
                    removable = settings.behaviour.li_free_element_removable;
                    break;
            }

            return methods.getBehaviour(editable, removable, settings.template);
        },
        getBehaviour: function (editable, removable, template){
            var objects = '';

            if(editable) {
                objects += template.edit_element;
            }
            if(removable) {
                objects += template.close_element;
            }

            return objects;
        },
        getNewElementText: function (elementType, settings){
            var text = '';

            switch (elementType) {
                case 'master':
                    text = settings.text_new.li_master_text;
                    break;
                case 'element':
                    text = settings.text_new.li_element_text;
                    break;
                case 'free_element':
                    text = settings.text_new.li_free_element_text;
                    break;
            }
            return text;
        },
        getNewElementEntity: function (elementType, settings){
            var element = $(settings.template.new_element);

            element.text(methods.getNewElementText(elementType, settings));

            return element.wrap('<p/>').parent().html();
        },
        createElements: function (settings, ulClass, listType) {
            var obj = settings.values[ulClass];

            var ulElement = settings.$content_el.find('.' + ulClass);

            if(!ulElement.length) {
                ulElement = methods.template_ul(ulClass);
                ulElement.appendTo('#' + settings.id_container);
            }

            $.each(obj, function (i, val) {
                if(listType == 'master') {
                    methods.template_li_master(val, settings).appendTo(ulElement);
                } else if(listType == 'element') {
                    methods.template_li(val, settings).appendTo(ulElement);
                } else {
                    methods.template_li_free(val, settings).appendTo(ulElement);
                }
            });

            var newItem = methods.getBehaviourNewItem(listType, settings);
            if(listType == 'element') {
                newItem.hide();
            }
            newItem.appendTo(ulElement);
        },
        getBehaviourNewItem: function (listType, settings) {
            var evalNewItem = (methods.getNewElementText(listType, settings) == '');

            return methods.template_li_new_item(listType, settings, evalNewItem);
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
                element.status = $(this).attr('data-status');
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
        },
        'classes': { // LI custom classes
            'li_master': '',
            'li_element': '',
            'li_free_element': '',
            'li_new_element': ''
        },
        'text_new': { // Text New Elements
            'li_master_text': 'New element',
            'li_element_text': 'New element',
            'li_free_element_text': 'New FREE element'
        },
        'behaviour': {
            'li_master_standalone': false,
            'li_master_editable': true,
            'li_master_removable': true,
            'li_element_editable': true,
            'li_element_removable': true,
            'li_free_element_editable': true,
            'li_free_element_removable': true
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
