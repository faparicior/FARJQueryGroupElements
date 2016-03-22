# FARGroupElements [![Build Status](https://travis-ci.org/faparicior/FARJQueryGroupElements.svg?branch=master)](https://travis-ci.org/faparicior/FARJQueryGroupElements)

This JQuery plugin provides a functionality to manage a master 
list of elements with a child list of elements.

This plugin supports multiple instances in a same page.

Usage
-----

You can test the functionality in the demo folder.
Basically, you have to pass a JSON with the values, and use de 'id' 
and the 'relId' to maintain the relationship.

Data sent
---------
```javascript
    $.fn.adminGroupLists.defaults.values =  {
        "far_master_elements": [
            {"id": "1", "desc": "Markets 2"},
            {"id": "4", "desc": "Professional services 2"},
            {"id": "5", "desc": "Health 2"}
        ],
        "far_free_elements": [
            {"id": "7", "desc": "Pharmacy 2"},
            {"id": "8", "desc": "Optics 2"},
            {"id": "9", "desc": "Shoes 2"}
        ],
        "far_elements": [
            {"id": "1", "desc": "Supermarket 2", "relId": "1"},
            {"id": "4", "desc": "Fruit Store 2", "relId": "1"},
            {"id": "5", "desc": "Hardware 2", "relId": "4"}
        ]
    };
```

Data returned
-------------
```javascript
    $.fn.adminGroupLists.defaults.values =  {
        "far_master_elements": [
            {"id": "1", "desc": "Markets 2", "status": "normal"},
            {"id": "4", "desc": "Non-Professional services 2", "status": "updated"},
            {"id": "5", "desc": "Health 2", "status": "normal"}
        ],
        "far_free_elements": [
            {"id": "7", "desc": "Pharmacy 2", "status": "normal"},
            {"id": "8", "desc": "Optics 2", "status": "normal"},
            {"id": "9", "desc": "Shoes 2", "status": "normal"}
            {"id": "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx", "desc": "Beach", "status": "new"}
        ],
        "far_elements": [
            {"id": "1", "desc": "Supermarket 2", "relId": "1", "status": "updated"},
            {"id": "4", "desc": "Fruit Store 2", "relId": "1", "status": "normal"},
            {"id": "5", "desc": "Hardware 2", "relId": "4", "status": "normal"}
        ]
    };
```


Classes and texts
-----------------
Additionally, you can add classes to the elements, and the text that the plugin 
uses to display the "New element" option.

```javascript
    $.fn.adminGroupLists.defaults.classes= {
        'li_master': '',
        'li_element': '',
        'li_free_element': '',
        'li_new_element': '',
    };

    $.fn.adminGroupLists.defaults.text_new = {
        'li_master_text': 'New element',
        'li_element_text': 'New element',
        'li_free_element_text': 'New FREE element'
    };
```

```javascript
    $.fn.adminGroupLists.defaults.classes= {
        'li_master': 'hvr-fade',
        'li_element': 'hvr-fade',
        'li_free_element': 'hvr-fade',
        'li_new_element': 'hvr-fade',
    };
    
    $.fn.adminGroupLists.defaults.text_new = {
        'li_master_text': 'New element',
        'li_element_text': 'New element',
        'li_free_element_text': 'New FREE element'
    };
```

If you want to disable the "New element", you only have to pass the text without value. 

```javascript
    $.fn.adminGroupLists.defaults.text_new = {
        'li_master_text': '',
        'li_element_text': 'New element',
        'li_free_element_text': 'New FREE element'
    };
```

Create, edit or delete elements behaviour
-----------------------------------------

You can enable or disable with creation, edit or deletion with:

```javascript
    $.fn.adminGroupLists.defaults.behaviour = {
        'li_master_standalone': false,
        'li_master_editable': true,
        'li_master_removable': true,
        'li_element_editable': true,
        'li_element_removable': true,
        'li_free_element_editable': true,
        'li_free_element_removable': true
    };
```

li_master_standalone option
---------------------------

If 'li_master_standalone' is set to false, the plugin only use 'li_master' list. Omitting 'li_element' and 'li_free_element' lists.

Initialization
--------------
You only have to call the function like this...

```javascript
    $('#demo2').adminGroupLists('init');
```


Get Data
--------

You can get a JSON object with the data calling this function:

```javascript
var data = $('#demo').adminGroupLists('getAllElements');
```
