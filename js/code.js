/**
 * All the templates and variables 
 */
const container = document.getElementById('container');
let commentTemplate = document.getElementById('comment').content
let yourCommentTemplate = document.getElementById('comment-you').content
let addCommentTemplate = document.getElementById('add-comment').content
let replyCommentTemplate = document.getElementById('reply-template').content
let youReplyCommentTemplate = document.getElementById('you-reply-template').content

const fragment = document.createDocumentFragment();

let currentUser = {};

/**
 * 
 *async function to inicialize the page with the comments
 */
onload = async() => {
    let localData = localStorage.getItem('commentData')
    if (localData) {
        const data = JSON.parse(localData)
        currentUser = data.currentUser;
        printComments(data.comments);
    } else {
        const response = await fetch('../data.json');
        const data = await response.json();
        localStorage.setItem('commentData', JSON.stringify(data))
        location.reload();
    }
}

/**
 * 
 * @param {Object} comments 
 * @param {Object} currentUser 
 */
function printComments(comments) {
    comments.map(element => {
        if (element.user.username === currentUser.username) {
            fillTemplate(yourCommentTemplate, element, element.id)
        } else {
            fillTemplate(commentTemplate, element, element.id)
            if (element.replies.length > 0) {
                printReplies(element.replies, element.id)
            }
        }
    });
    printAddComent()
    container.appendChild(fragment);
}

function printReplies(replies, fatherId) {
    replies.map(reply => {
        if (reply.user.username === currentUser.username) {
            fillTemplate(youReplyCommentTemplate, reply, [fatherId, reply.id].join('-'))
        } else {
            fillTemplate(replyCommentTemplate, reply, [fatherId, reply.id].join('-'))
        }
    })

}


function fillTemplate(template, data, id) {
    template.querySelector('.comment').setAttribute('id', id)
    template.querySelector('.comment').setAttribute('name', data.user.username)
    template.getElementById('comment-profile-img').innerHTML = `<img src="${data.user.image.png}" alt="">`;
    template.getElementById('name').innerHTML = data.user.username;
    template.getElementById('date').innerHTML = data.createdAt;
    template.getElementById('comment-text').textContent = data.content
    template.getElementById('score').innerHTML = data.score;
    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
}


/**
 * 
 * @param {Object} userInfo 
 */
function printAddComent() {
    addCommentTemplate.getElementById('profile-img-add').innerHTML = `<img src="${currentUser.image.png}" alt="">`;
    const clone = addCommentTemplate.cloneNode(true);
    fragment.appendChild(clone);
    // console.log(fragment.childElementCount)
}



function addComment(event) {
    event.preventDefault()
    console.log(event.target.comment.value)
}

function addCount(count) {
    console.log(count.parentNode.parentNode.getAttribute('id'))
}

function subCount(count) {
    console.log(count.parentNode.parentNode.getAttribute('id'))
}

function replyComment(event) {
    if (event.parentNode.getAttribute('replying')) {} else {
        event.parentNode.setAttribute('replying', 'true')
        let id = event.parentNode.getAttribute('id')
        let username = event.parentNode.getAttribute('name')
        username = '@'.concat(username).concat(', ')
        let elementSelected = document.getElementById(id)
        addCommentTemplate.getElementById('profile-img-add').innerHTML = `<img src="${currentUser.image.png}" alt="">`;
        addCommentTemplate.querySelector('.comment-textarea').value = username
        addCommentTemplate.getElementById('input-comment-submit').value = "Reply"
        const clone = addCommentTemplate.cloneNode(true);
        elementSelected.after(clone)
    }
}