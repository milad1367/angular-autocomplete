# angular-autocomplete

This is a fork of Daryl Rowland's angucomplete (https://github.com/darylrowland/angucomplete) with a bit of tweaks such as:

* add onblur method
* coding similar to angular standard
* add templateUrl
* add bindToController

###Key Features
* Show just a title, a title and a description or a title, description and image in your autocomplete list
* Deliberately minimally styled so you can customise it to your heart's content!
* Reads JSON data and allows you to specify which fields to use for display
* Simple setup - e.g. to pull data from a server, just set the url parameter

To see a demo go here: http://miladasghari.com/projects/angular-autocomplete/



### Getting Started
Download the code, and add the autocomplete.js and autocomplete.html to a file in your page. Then add this directive to your index or module.
you can follow at this project.


### Local Usage Example

```html
            <autocomplete id="users"
            placeholder="users"
            pause="100"
            selectedobject="appVM.input"
            localdata="appVM.users"
            searchfields="username"
            titlefield="username"
            minlength="1"
            imagefield="img"
            inputclass="form-control form-control-small"
            on-blur = "appVM.addItem(user)"></autocomplete> 

```
### Remote Usage Example


```html
<autocomplete id="users"
            placeholder="users"
            pause="100"
            selectedobject="appVM.input"
            localdata="appVM.users"
            url="http://myserver.com/api/user/find?s="
            searchfields="username"
            titlefield="username"
            minlength="1"
            imagefield="img"
            inputclass="form-control form-control-small"
            on-blur = "appVM.addItem(user)"></autocomplete> 
```
### Description of attributes
| Attribute        | Description           | Required | Example  |
| :------------- |:-------------| :-----:| :-----|
| id | A unique ID for the field | Yes | members |
| placeholder | Placeholder text for the search field | No | Search members |
| pause | The time to wait (in milliseconds) before searching when the user enters new characters | No | 400 |
| selectedObject | Where to store the selected object in your model/controller (like ng-model) | Yes | myObject |
| url | The remote URL to hit to query for results in JSON. angucomplete will automatically append the search string on the end of this, so it must be a GET request | No | http://myserver.com/api/users/find?searchstr= |
| datafield | The name of the field in the JSON object returned back that holds the Array of objects to be used for the autocomplete list. | No | results |
| titlefield | The name of the field in the JSON objects returned back that should be used for displaying the title in the autocomplete list. Note, if you want to combine fields together, you can comma separate them here (e.g. for a first and last name combined) | Yes | firstName,lastName |
| descriptionfield | The name of the field in the JSON objects returned back that should be used for displaying the description in the autocomplete list | No | twitterUsername |
| imageuri | A http location or directory where images reside | No | http://localhost/images/ |
| imagefield | The name of the field in the JSON objects returned back that should be used for displaying an image in the autocomplete list | No | pic |
| minlength | The minimum length of string required before searching | No | 3 |
| inputclass | The classes to use for styling the input box | No | form-control |
| localdata | The local data variable to use from your controller. Should be an array of objects | No | countriesList |
| searchfields | The fields from your local data to search on (comma separate them) | No | title,description |


### Running test suite

* clone this project
* npm install -g http-server
* cd into project folder and run http-server -o
