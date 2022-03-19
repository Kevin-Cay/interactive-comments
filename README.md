# Frontend Mentor - Interactive comments section solution

This is a solution to the [Interactive comments section challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/interactive-comments-section-iG1RugEG9). Frontend Mentor challenges help me improve my coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

**Note: Delete this note and update the table of contents based on what sections you keep.**

## Overview

This is a comment interactive secction built with JavaScrip, CSS and HTML. In this web page you can reply comment, add new comments, edit your comments and delete it too. This web works with you local storage. 

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Create, Read, Update, and Delete comments and replies
- **Bonus**: If you're building a purely front-end project, use `localStorage` to save the current state in the browser that persists when the browser is refreshed.

### Screenshot

![](./screenshot.png)


### Links

- Solution URL: [Git Proyect](https://github.com/Kevin-Cay/interactive-comments.git)
- Live Site URL: [Live Site](https://mystifying-wescoff-d706ea.netlify.app/)

## My process
First I created the entire structure with HTML,  using HTML Templates for each element to use it in the code, then I added all the styles with CSS with, then and the most important part of this proyect is the code with JavaScript (map, filter, fetch, async/await, etc...)

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
### What I learned

This is some of the code that I learned about local storage, also how i can create HTML templates and then how to use it eith javascript code. I imrpoved my JavaScript skills with objects, how to update data in it and how to delete comments of this data. 

```html
 <template id="delete-popup">
        <div class="delete-popup">
            <div class="delete-card">
                <h1>Delete comment</h1>
                <p>
                    Are you sure you want to delete this comment? This will remove the comment and cant't be undone.
                </p>
                <div class="delete-options">
                    <button id="button-cancel">
                        no, cancel
                    </button>
                    <button id="button-delete" onclick="deleteComment(event)" >
                        yes, delete
                    </button>
                </div>
            </div>
            </div>
    </template>
```
```js
onload = async() => {
    let localData = localStorage.getItem('commentData')
    if (localData) {
        const responseData = JSON.parse(localData)
        data.comments = responseData.comments
        data.currentUser = responseData.currentUser
        currentUser = data.currentUser;
        printComments(data.comments);
    } else {
        const response = await fetch('../data.json');
        const data = await response.json();
        localStorage.setItem('commentData', JSON.stringify(data))
        location.reload();
    }
}
```



## Author

- Website - [Kevin Cay](https://portfolio-kevin-cay.vercel.app/)
- Frontend Mentor - [@kevincay](https://www.frontendmentor.io/profile/Kevin-Cay)
- Github - [@Kevin-Cay](https://github.com/Kevin-Cay/)

**Note: Delete this note and add/remove/edit lines above based on what links you'd like to share.**

## Acknowledgments

A tip that i can wive you is lear the most as you can about localstorage, how to save data, to delete data and to update the data. 
