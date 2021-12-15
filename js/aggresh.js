const init = async () => {
    let genCount = 100;

    const getSubreddit = async (url) => {
        return await fetch(url).then(data => {
            return data.json();
        }).catch((error, url) => {
            console.log(`${error}: could not open URL [${url}]`);
        });
    }

    const generateGrid = (subreddit) => {
        for (let x = 0; x < genCount; x++) {
            let postData = subreddit['data']['children'][x]['data'];
            let postDOM = document.createElement('div');
            let postTitle = document.createElement('p');
            let postAuthor = document.createElement('p');
            // Generate 'post' component
            postDOM.className = 'post';
            postTitle.id = 'post-title';
            postAuthor.id = 'post-author';
            postAuthor.innerHTML = postData['author'];
            if (postData['title'].length > 100) {
                postTitle.innerHTML = `<ul>${postData['title'].substring(0, 100)}...</ul>`;
            }  else {
                postTitle.innerHTML = postData['title'];
            }
            postDOM.appendChild(postTitle);
            postDOM.appendChild(postAuthor);
            document.querySelector('.main').appendChild(postDOM);
        }        
    }
    
    document.querySelector('.search').onsubmit = generateGrid(await getSubreddit(`https://cors-anywhere.herokuapp.com/https://reddit.com/r/${document.querySelector('.search')[0].value}.json?limit=${genCount}`));
    //     // Init Entry -----
    //     // Remeber to remove 'cors-anywhere' before final release.
    //     let sub = document.querySelector('#site-search').value;
    //     console.log(sub);
    //     let url = `https://cors-anywhere.herokuapp.com/https://reddit.com/r/${sub}.json?limit=${genCount}`;
    //     return 
    // };
}

init();