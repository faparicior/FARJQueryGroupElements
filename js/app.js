$(function() {

    // Initial values
    var values = '{ "categories" : [' +
        '{ "id":"1" , "desc":"Alimentacion" },' +
        '{ "id":"4" , "desc":"Servicios profesionales" },' +
        '{ "id":"5" , "desc":"Salud" } ]}';

    var obj = JSON.parse(values);

    //
    // Event handlers
    //

    // Enter Key disabled editting
    $('ul').on('keypress', '.display', function (e) {
        return e.which != 13;
    });

    // New element
    $('ul').on('focus', '#newElement', function () {
        var newElement = constructLiNewItemElement();
        var uid_data = generateUUID();

        $(this).parent().find('.display-close ').addClass('close-element');
        $(this).removeAttr('id');
        $(this).attr('data-uid',uid_data);
        $(this).parent().after(newElement);
    });

    // Remove element
    $('ul').on('click', '.close-element', function () {
        $(this).parent().remove();
    });

    //
    // Constructor
    //
    function createElements(obj) {
        $.each(obj, function (i, val) {
            constructLiElement(val).appendTo('ul');
        });
        constructLiNewItemElement().appendTo('ul');
    }

    function constructLiElement(values) {
        return $(
            '<li>' +
            '<span class="display"  data-id="' + values.id + '" contenteditable="true">' + values.desc + ' </span>' +
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

    function constructLiNewItemElement() {
        return $(
                '<li>' +
                '<span class="display" id="newElement" contenteditable="true">Add new </span>' +
                '<span class="fa fa-times display-close "></span>' +
                '</li>'
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


    createElements(obj['categories']);
    obj.categories = getLiElements();
//    alert(obj.categories[0].desc);
});
