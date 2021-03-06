/**
 * All the templates and variables 
 */
const container = document.getElementById('container');
let commentTemplate = document.getElementById('comment').content
let yourCommentTemplate = document.getElementById('comment-you').content
let addCommentTemplate = document.getElementById('add-comment').content
let replyCommentTemplate = document.getElementById('reply-template').content
let youReplyCommentTemplate = document.getElementById('you-reply-template').content
let deletePopupTemplate = document.getElementById('delete-popup').content

const fragment = document.createDocumentFragment();

const data = {};
/**
 * This is the comment template
 */
const newCommentTemplate = {
    "id": 0,
    "content": "",
    "createdAt": "Today",
    "score": 0,
    "user": {
        "image": {
            "png": "",
            "webp": ""
        },
        "username": ""
    }
}

/**
 * 
 *async function to inicialize the page with the comments
 */
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

/**
 * 
 * @param {Object} comments with a array of comments
 */
function printComments(comments) {
    comments.map(element => {
        if (element.user.username === data.currentUser.username) {
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


/**
 * 
 * @param {Object} replies with a array of reply comments
 * @param {Number} fatherId with the id of the comment father  
 */
function printReplies(replies, fatherId) {
    replies.map(reply => {
        if (reply.user.username === data.currentUser.username) {
            fillTemplate(youReplyCommentTemplate, reply, [fatherId, reply.id].join('-'))
        } else {
            fillTemplate(replyCommentTemplate, reply, [fatherId, reply.id].join('-'))
        }
    })

}



/**
 * 
 * @param {nodeTempleate} template the template to fill
 * @param {Array} data the data to fill the template, if is an array it will fill the template with the array
 * @param {Number}  id the id of the comment 
 */
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
    addCommentTemplate.getElementById('profile-img-add').innerHTML = `<img src="${data.currentUser.image.png}" alt="">`;
    const clone = addCommentTemplate.cloneNode(true);
    fragment.appendChild(clone);
}



/**
 * 
 * @param {Event} count the event of the click
 */
function addCount(count) {
    let id = count.parentNode.parentNode.getAttribute('id')
    let actualNumber = document.getElementById(id).querySelector('#score').innerHTML
    actualNumber = Number(actualNumber) + 1
    document.getElementById(id).querySelector('#score').innerHTML = actualNumber
    id = id.split('-').map(element => Number(element))
    if (id.length > 1) {
        // let comment = data.comments.filter((el) => el.id === id[0])[0]
        let firstIndex = data.comments.findIndex(el => el.id === id[0])
        let secondIndex = data.comments[firstIndex].replies.findIndex(el => el.id === id[1])
        data.comments[firstIndex].replies[secondIndex].score += 1
            // console.log(data.comments[firstIndex].replies[secondIndex].score)
        localStorage.setItem('commentData', JSON.stringify(data))

    } else {
        let index = data.comments.findIndex(el => el.id === id[0])
        data.comments[index].score += 1
        localStorage.setItem('commentData', JSON.stringify(data))
    }
}

/**
 * 
 * @param {Event} count the event of the click
 */
function subCount(count) {
    let id = count.parentNode.parentNode.getAttribute('id')
    let actualNumber = document.getElementById(id).querySelector('#score').innerHTML
    actualNumber = Number(actualNumber) > 0 ? Number(actualNumber) - 1 : Number(actualNumber)
    document.getElementById(id).querySelector('#score').innerHTML = actualNumber
    id = id.split('-').map(element => Number(element))
    if (id.length > 1) {
        let firstIndex = data.comments.findIndex(el => el.id === id[0])
        let secondIndex = data.comments[firstIndex].replies.findIndex(el => el.id === id[1])
        if (data.comments[firstIndex].replies[secondIndex].score > 0) {
            data.comments[firstIndex].replies[secondIndex].score -= 1
            localStorage.setItem('commentData', JSON.stringify(data))
        }
    } else {
        let index = data.comments.findIndex(el => el.id === id[0])
        if (data.comments[index].score > 0) {
            data.comments[index].score -= 1
            localStorage.setItem('commentData', JSON.stringify(data))
        }
    }
}


/**
 * 
 * @param {Event} event the event of the click
 */
function replyComment(event) {
    if (event.parentNode.getAttribute('replying')) {} else {
        event.parentNode.setAttribute('replying', 'true')
        let id = event.parentNode.getAttribute('id')
        let elementSelected = document.getElementById(id)
        addCommentTemplate.querySelector('.add-comment').setAttribute('id', `-${id}`)
        addCommentTemplate.getElementById('profile-img-add').innerHTML = `<img src="${data.currentUser.image.png}" alt="">`;
        addCommentTemplate.querySelector('.comment-textarea').value = `@${data.currentUser.username}, `
        addCommentTemplate.getElementById('input-comment-submit').value = "reply"
        const clone = addCommentTemplate.cloneNode(true);
        elementSelected.after(clone)
    }
}

/**
 * 
 * @param {event} event this event 
 */
function addComment(event) {
    event.preventDefault()
    let type = event.target.button.value
    let comment = event.target.comment.value
    let newComment = {}
    let idNumber = 0
    let index = 0
    let idList = 0
    let id = event.target.parentElement.getAttribute('id')
    switch (type) {
        case 'reply':
            id = id.slice(1, id.length).split('-')
            let commentLength = comment.split(', ')[1].length
            if (commentLength > 0 && id.length === 1) {
                index = data.comments.findIndex(el => el.id === Number(id[0]))
                idList = data.comments[index].replies.map(el => el.id)
                idNumber = idList.length > 0 ? idList[idList.length - 1] += 1 : 1
            } else if (commentLength > 0 && id.length === 2) {
                let firstIndex = data.comments.findIndex(el => el.id === Number(id[0]))
                idList = data.comments[firstIndex].replies.map((el) => el.id)
                idNumber = idList.length > 0 ? idList[idList.length - 1] += 1 : 1
                index = firstIndex
            }
            newComment.id = idNumber
            newComment.content = comment
            newComment.createdAt = 'Today'
            newComment.score = 0
            newComment.user = {}
            newComment.user.username = data.currentUser.username
            newComment.user.image = {}
            newComment.user.image.png = data.currentUser.image.png
            newComment.user.image.webp = data.currentUser.image.webp
            data.comments[index].replies.push(newComment)
            newComment = ''
            localStorage.clear()
            localStorage.setItem('commentData', JSON.stringify(data))
            container.innerHTML = ''
            printComments(data.comments)
            break;
        case 'send':
            if (comment.length > 0) {
                idList = data.comments.map((el) => el.id)
                idNumber = Math.max(...idList) + 1
                newComment.id = idNumber
                newComment.content = comment
                newComment.createdAt = 'Today'
                newComment.score = 0
                newComment.user = {}
                newComment.user.username = data.currentUser.username
                newComment.user.image = {}
                newComment.user.image.png = data.currentUser.image.png
                newComment.user.image.webp = data.currentUser.image.webp
                newComment.replies = []
                data.comments.push(newComment)
                localStorage.setItem('commentData', JSON.stringify(data))
                container.innerHTML = ''
                printComments(data.comments)
            }
            break;
        case 'edit':
            if (comment.length > 0) {
                id = id.slice(1, id.length).split('-')
                if (id.length === 1) {
                    index = data.comments.findIndex(el => el.id === Number(id[0]))
                    data.comments[index].content = comment
                    localStorage.setItem('commentData', JSON.stringify(data))
                } else {
                    let firstIndex = data.comments.findIndex(el => el.id === Number(id[0]))
                    let secondIndex = data.comments[firstIndex].replies.findIndex(el => el.id === Number(id[1]))
                    data.comments[firstIndex].replies[secondIndex].content = comment
                    localStorage.setItem('commentData', JSON.stringify(data))
                }
                container.innerHTML = ''
                printComments(data.comments)
                break;
            }
        default:
            break;
    }
    document.querySelector('.add-comment').setAttribute('id', 0)
    document.querySelector('.comment-textarea').value = ''
    document.getElementById('input-comment-submit').value = "send"

}


function deletePopup(event) {
    event.preventDefault()
    let id = event.target.parentNode.parentNode.parentNode.getAttribute('id')
    deletePopupTemplate.querySelector('.delete-popup').style.display = 'flex'
    deletePopupTemplate.querySelector('.delete-card').setAttribute('id', `${id}`)
    const clone = deletePopupTemplate.cloneNode(true);
    container.appendChild(clone)
}

function deleteComment(event) {
    event.preventDefault()
    let id = event.target.parentNode.parentNode.getAttribute('id')
    let idList = id.split('-')
    if (idList.length === 1) {
        let index = data.comments.findIndex(el => el.id === Number(idList[0]))
        data.comments.splice(index, 1)
    } else {
        let firstIndex = data.comments.findIndex(el => el.id === Number(idList[0]))
        let secondIndex = data.comments[firstIndex].replies.findIndex(el => el.id === Number(idList[1]))
        data.comments[firstIndex].replies.splice(secondIndex, 1)
    }
    localStorage.setItem('commentData', JSON.stringify(data))
    container.innerHTML = ''
    printComments(data.comments)
}


function editComment(event) {
    let id = event.target.parentNode.parentNode.parentNode.getAttribute('id')
    let elementSelected = document.getElementById(id)
    elementSelected.style.display = 'none'
    let comment = event.target.parentNode.parentNode.parentElement.querySelector('#comment-text').textContent
    addCommentTemplate.querySelector('.add-comment').setAttribute('id', `+${id}`)
    addCommentTemplate.getElementById('profile-img-add').innerHTML = `<img src="${data.currentUser.image.png}" alt="">`;
    addCommentTemplate.querySelector('.comment-textarea').value = comment
    addCommentTemplate.getElementById('input-comment-submit').value = "edit"
    const clone = addCommentTemplate.cloneNode(true);
    elementSelected.after(clone)
}