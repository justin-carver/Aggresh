const init = async () => {
    let genCount = 98; // TODO: Find out why resolving an object adds an extra 2 items. Need to subract 2.
    let gradientTargets = ['#E2F4F3', '#B9E7E6', '#6FD4E1']; // Can expand this into an object later to serve themes.

    const getSubreddit = async (url) => {
        return await fetch(url).then(data => {
            return data.json();
        }).catch((error, url) => {
            console.log(`${error}: could not open URL [${url}]`);
        });
    }

    const generateGrid = (subreddit, filter) => {
        let genObject = {};

        // Return various subreddit filters.
        // @returns {[number, number], ...} First index = ObjectID, Second index = upvotes.
        const sortHighestVoted = () => {
            let highestVoted = [];
            for (let post in subreddit['data']['children']) {
                highestVoted.push([post, subreddit['data']['children'][post]['data']['ups']]);
            }
            highestVoted.sort((a, b) => {
                return b[1] - a[1];
            });
            return highestVoted;
        }

        console.log(sortHighestVoted());

        for (let x = 0; x < subreddit['data']['children'].length; x++) {
            let postData = {};
            if (filter === 'highestVoted') {
                postData = subreddit['data']['children'][sortHighestVoted()[x][0]]['data'];  
            } else {
                // Default state: unchanged root element
                postData = subreddit['data']['children'][x]['data'];  
            }
            let postDOM = document.createElement('div');
            let postTitle = document.createElement('p');
            let postAuthor = document.createElement('p');
            let postSub = document.createElement('p');
            // Generate 'post' component
            postDOM.className = 'post';
            postSub.innerHTML = postData['subreddit_name_prefixed'];
            // Grab HD thumbnail as background-image.
            if (postData['preview'] !== undefined) {
                postDOM.style.backgroundImage = `linear-gradient(210deg, 
                    rgba(0, 0, 0, 0.20), 
                    ${gradientTargets[Math.floor(Math.random() * gradientTargets.length)]}), 
                    url(${postData['preview']['images'][0]['source']['url'].replaceAll('&amp;', '&')})`; // Fixes encoding issues
            }
            // Get comment count to assign correct attributes.
            // We are always sorting by highest voted to determine post size.
            if (postData['ups'] < (sortHighestVoted()[x][0] * .33)) {
                postDOM.className += " small-post";
                postTitle.style.fontSize = '1rem';
            }
            postTitle.className = 'post-title';
            postSub.className = 'post-item post-flow-right';
            postAuthor.className = 'post-item';
            postAuthor.innerHTML = `${postData['author']} / ${(postData['upvote_ratio'] * 100)}% / ${postData['ups']} upvotes`;
            if (postData['title'].length > 100) {
                postTitle.innerHTML = `${postData['title'].substring(0, 100)}...`;
            }  else {
                postTitle.innerHTML = postData['title'];
            }
            // Append components
            postDOM.appendChild(postTitle);
            postDOM.appendChild(postAuthor);
            postDOM.appendChild(postSub);
            document.querySelector('.main').appendChild(postDOM);
        }        
    }
    
    // TODO: Onsubmit currently broken, .search only works on page reload.
    document.querySelector('.search').onsubmit = generateGrid(await getSubreddit(`https://cors-anywhere.herokuapp.com/https://reddit.com/r/${document.querySelector('.search')[0].value}.json?limit=${genCount}`), 'highestVoted');
}

init();