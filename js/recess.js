(function () {
    var postUuid = ''

    function timeAgo(date) {
        const now = new Date()
        const givenDate = new Date(date)
        const secondsAgo = Math.round((now.getTime() - givenDate.getTime()) / 1000)
        const minutesAgo = Math.round(secondsAgo / 60)
        const hoursAgo = Math.round(minutesAgo / 60)
        const daysAgo = Math.round(hoursAgo / 24)

        // Within the hour
        if (minutesAgo < 60) {
            return `${minutesAgo} minutes ago`
        }

        // Within the day
        if (hoursAgo < 24) {
            return `${hoursAgo} hours ago`
        }

        // Yesterday
        if (daysAgo === 1) {
            return 'yesterday'
        }

        // Within a week
        if (daysAgo < 7) {
            return `${daysAgo} days ago`
        }

        // Otherwise, return the date in dd/mm/yyyy format
        const day = givenDate.getDate().toString().padStart(2, '0')
        const month = (givenDate.getMonth() + 1).toString().padStart(2, '0') // Months are 0-indexed
        const year = givenDate.getFullYear()
        return `${day}/${month}/${year}`
    }

    // Dynamically inject CSS styles
    var css = `
        .recess-comment-container {
            display: flex !important;
            gap: 16px !important;
            padding: 8px !important;
            border-bottom: 1px solid #eaeaea !important;
            background: white !important;
            border-radius: 8px !important;
            margin-bottom: 12px !important;

        }

        .recess-comment-avatar img {
            width: 50px !important;
            height: 50px !important;
            border-radius: 25px !important;
        }

        .recess-comment-body {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
        }

        .recess-comment-header {
            display: flex !important;
            justify-content: space-between !important;
            margin-bottom: 8px !important;
        }

        .recess-comment-author, .recess-comment-date {
            cursor: pointer !important;
        }

        .recess-comment-date {
            color: #999 !important;
            font-size: 12px !important;
        }

        .recess-comment-content {
            font-size: 14px !important;
        }

        .recess-main-text {
            font-size: 16px !important;
            margin: auto !important;
            text-align: center !important;
            margin-bottom: 8px !important;
        }

        .recess-comment-input-container {
            margin-top: 20px !important;
            background-color: #ffffff !important;
            padding: 16px !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
            border: 1px solid #eaeaea !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 10px !important;
            margin-bottom: 12px !important;
        }

        .recess-comment-textarea {
            width: 100% !important;
            padding: 8px !important;
            border-radius: 8px !important;
            border: 1px solid #eaeaea !important;
            resize: vertical !important;
            box-sizing: border-box !important;
            background-color: #efefef !important;
            font-family: inherit !important;
        }

        .recess-comment-textarea:focus {
            border: 1px solid gray !important;
        }

        .submit-recess-comment-button {
            align-self: flex-end !important;
            padding: 8px 16px !important;
            border-radius: 8px !important;
            border: none !important;
            color: white !important;
            background-color: #1890ff !important;
            cursor: pointer !important;
        }

        .submit-recess-comment-button:disabled {
            background-color: #a0a0a0 !important;
            cursor: not-allowed !important;
        }
    `;
    var style = document.createElement('style')
    if (style.styleSheet) {
        style.styleSheet.cssText = css
    } else {
        style.appendChild(document.createTextNode(css))
    }
    document.getElementsByTagName('head')[0].appendChild(style)

    // Function to create and append comment elements
    function displayComments(comments) {
        const recessDiv = document.getElementById('recess')
        if (!recessDiv) {
            console.error('"recess" div not found. Please ensure your page includes a div with id="recess".')
            return
        }

        recessDiv.innerHTML = '' // Clear existing comments


        // Check if the user is present (adjust this logic to your actual user check)
        var user = true // Example condition, adjust based on actual user state

        // Comment box container
        var commentBoxContainer = document.createElement('div')

        // Comment box markup
        var commentBoxHtml = `
            <div class="recess-comment-input-container">
                <textarea rows="4" class="recess-comment-textarea" id="post-recess-comment-textarea" placeholder="Write a comment..." ${!user ? 'disabled' : ''} maxLength="1000"></textarea>
                <button onclick="handleSubmitComment()" class="submit-recess-comment-button" ${!user ? 'disabled' : ''}>Add Comment</button>
            </div>
        `

        commentBoxContainer.innerHTML = commentBoxHtml


        window.handleSubmitComment = function () {
            const commentText = document.getElementById('post-recess-comment-textarea').value

            window.location = `https://app.recessfeed.com/post/${postUuid}?comment_text=${encodeURIComponent(commentText)}`
        }

        recessDiv.appendChild(commentBoxContainer)



        comments.forEach(comment => {
            const commentContainer = document.createElement('div')
            commentContainer.className = 'recess-comment-container'

            const avatarDiv = document.createElement('div')
            avatarDiv.className = 'recess-comment-avatar'
            avatarDiv.style.cursor = 'pointer'
            // Omitting navigate action for simplicity
            const img = document.createElement('img')
            img.src = `https://www.gravatar.com/avatar/${comment.comment_user_email_hash}?s=64&d=mp`
            img.alt = comment.comment_username
            avatarDiv.appendChild(img)

            const bodyDiv = document.createElement('div')
            bodyDiv.className = 'recess-comment-body'

            const headerDiv = document.createElement('div')
            headerDiv.className = 'recess-comment-header'

            const authorSpan = document.createElement('span')
            authorSpan.className = 'recess-comment-author'
            authorSpan.style.cursor = 'pointer'
            authorSpan.textContent = comment.comment_username
            // Omitting navigate action for simplicity

            const dateSpan = document.createElement('span')
            dateSpan.className = 'recess-comment-date'
            dateSpan.textContent = timeAgo(new Date(comment.comment_timestamp))

            headerDiv.appendChild(authorSpan)
            headerDiv.appendChild(dateSpan)

            const contentDiv = document.createElement('div')
            contentDiv.className = 'recess-comment-content'
            contentDiv.textContent = comment.comment_content

            bodyDiv.appendChild(headerDiv)
            bodyDiv.appendChild(contentDiv)

            commentContainer.appendChild(avatarDiv)
            commentContainer.appendChild(bodyDiv)

            recessDiv.appendChild(commentContainer)
        })

        const recessAnnouncementDiv = document.createElement('div')
        const recessAnnouncementText = document.createElement('p')
        recessAnnouncementText.className = 'recess-main-text'
        recessAnnouncementText.innerHTML = 'Comments powered by <a href="https://app.recessfeed.com" target="_blank">Recess</a>.'
        recessAnnouncementDiv.appendChild(recessAnnouncementText)
        recessDiv.appendChild(recessAnnouncementDiv)
    }




    fetch(`https://us.recessfeed.com/api/post_comments?post_url=${encodeURIComponent(window.location.href)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                postUuid = data[0].post
                displayComments(data)
            }
        })
        .catch(error => console.error('Error fetching comments:', error))
})();