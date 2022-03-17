const container = document.getElementById('container');
let commentTemplate = document.getElementById('comment').content
let yourCommentTemplate = document.getElementById('comment-you').content
let addCommentTemplate = document.getElementById('add-comment').content
let replyCommentTemplate = document.getElementById('reply-template').content
let youReplyCommentTemplate = document.getElementById('you-reply-template').content

const fragment = document.createDocumentFragment();

let currentUser = {}


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

        } else {
            commentTemplate.querySelector('.comment').setAttribute('id', element.id)
            commentTemplate.getElementById('comment-profile-img').innerHTML = `<img src="${element.user.image.png}" alt="">`;
            commentTemplate.getElementById('name').innerHTML = element.user.username;
            commentTemplate.getElementById('date').innerHTML = element.createdAt;
            commentTemplate.getElementById('comment-text').textContent = element.content
            commentTemplate.getElementById('score').innerHTML = element.score;
            const clone = commentTemplate.cloneNode(true);
            fragment.appendChild(clone);
            if (element.replies.length > 0) {
                printReplies(element.replies, element.id)
            }
        }
    });

    printAddComent(currentUser)
    container.appendChild(fragment);
}

function printReplies(replies, fatherId) {
    replies.map(reply => {
        if (reply.user.username === currentUser.username) {
            youReplyCommentTemplate.querySelector('.comment').setAttribute('id', [fatherId, reply.id].join('-'))
            youReplyCommentTemplate.getElementById('comment-profile-img').innerHTML = `<img src="${reply.user.image.png}" alt="">`;
            youReplyCommentTemplate.getElementById('name').innerHTML = reply.user.username;
            youReplyCommentTemplate.getElementById('date').innerHTML = reply.createdAt;
            youReplyCommentTemplate.getElementById('comment-text').textContent = reply.content
            youReplyCommentTemplate.getElementById('score').innerHTML = reply.score;
            const clone = youReplyCommentTemplate.cloneNode(true);
            fragment.appendChild(clone);
        } else {
            replyCommentTemplate.querySelector('.comment').setAttribute('id', [fatherId, reply.id].join('-'))
            replyCommentTemplate.getElementById('comment-profile-img').innerHTML = `<img src="${reply.user.image.png}" alt="">`;
            replyCommentTemplate.getElementById('name').innerHTML = reply.user.username;
            replyCommentTemplate.getElementById('date').innerHTML = reply.createdAt;
            replyCommentTemplate.getElementById('comment-text').textContent = reply.content
            replyCommentTemplate.getElementById('score').innerHTML = reply.score;
            const clone = replyCommentTemplate.cloneNode(true);
            fragment.appendChild(clone);
        }
    })

}


/**
 * 
 * @param {Object} userInfo 
 */
function printAddComent(userInfo) {
    console.log(userInfo)
    addCommentTemplate.getElementById('profile-img-add').innerHTML = `<img src="${userInfo.image.png}" alt="">`;
    const clone = addCommentTemplate.cloneNode(true);
    fragment.appendChild(clone);
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