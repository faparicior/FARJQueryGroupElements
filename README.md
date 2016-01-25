FARGroupElements
================

This JQuery plugin provides a functionality to administer a master 
list of elements with a child list of elements.

This plugin supports multiple instances in a same page.

Usage
-----

You can test the functionality in the demo folder.
Basically, you have to pass a JSON with the values, and use de 'id' 
and the 'relId' to maintain the relationship.

Data
----
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
        'li_master_text': 'New element',
        'li_element_text': 'New element',
        'li_free_element_text': 'New FREE element'
    };
```


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
