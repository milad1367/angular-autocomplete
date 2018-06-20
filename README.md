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


### Getting Started
Download the code, and add the autocomplete.js and autocomplete.html to a file in your page. Then add this directive to your index or module.
you can follow at this project.


### Local Usage

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
