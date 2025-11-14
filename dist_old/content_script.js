const SELECT_TIMELINE_PARENT = 'css-175oi2r'
const CLASS_MORE_OPTIONS_GROUP = "css-175oi2r r-1awozwy r-18u37iz r-1cmwbt1 r-1wtj0ep"
const CLASS_MORE_OPTIONS_ITEM = "css-175oi2r r-18u37iz"

const timelineParent = document.querySelector(`div[class*="${SELECT_TIMELINE_PARENT}"`)
const dislikeButtonMap = {} //tweetId => dislike button

const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
		if(node.classList.contains("css-175oi2r") && node.classList.length == 1) {
			addDislikeButton(node)
		}
    });
  });
});

observer.observe(timelineParent, { attributes: true, childList: true, subtree: true })

function getTweetInfo(parentTweetDiv) {
    const anchorElement = parentTweetDiv.querySelector("a[href*='/status/']")
    const hrefElements = anchorElement.getAttribute('href').split("/")	
	return {
		ownerId: hrefElements[1],
		tweetId: hrefElements[3] 
	}
}

function getUserId(){
	const profileAnchor = document.querySelector("a[aria-label='Profile'][role='link']") 
	return profileAnchor.getAttribute('href').replace('/', '')
}

function addDislikeButton(parentTweetDiv) {
    const {ownerId, tweetId} = getTweetInfo(parentTweetDiv)
    const profileId = getUserId(); 
	  dislikeMap[tweetId] = new Counter()

    const CLASS_FOOTER= "css-175oi2r r-18u37iz r-1h0z5md r-13awgt0"
    const CLASS_BUTTON = "css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l"
    const CLASS_BUTTON_DIV = "css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q"
    const CLASS_ICON_DIV = "css-175oi2r r-xoduu5"
    const CLASS_LABEL_DIV = "css-175oi2r r-xoduu5 r-1udh08x"

    console.debug("parent tweet", parentTweetDiv)
    const dislikes = 0

    const footer = parentTweetDiv.querySelector("div[aria-label*='likes']")
    const container = document.createElement('div'); 
    const button = document.createElement('button'); 
    
    const button_div = document.createElement('div');
    button_div.dir = "ltr"
    button_div.style = "color: rgb(113, 118, 123);"

    const label_div = document.createElement('div'); 
    label_div.className = CLASS_LABEL_DIV
    label_div.innerHTML = `
        <span data-testid="app-text-transition-container" style="transform: translate3d(0px, 0px, 0px); transition-property: transform; transition-duration: 0.3s;">
            <span class="css-1jxf684 r-1ttztb7 r-qvutc0 r-poiln3 r-n6v787 r-1cwl3u0 r-1k6nrdp r-n7gxbd">
                <span class="css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3">${dislikes}</span>
            </span>
        </span>
    `

    const icon_div = document.createElement('div'); 
    icon_div.className = CLASS_ICON_DIV
    icon_div.innerHTML = `<svg viewBox="0 0 24 24" transform="scale(1 -1)" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>`

    container.className = CLASS_FOOTER
    button.className = CLASS_BUTTON
    button_div.className = CLASS_BUTTON_DIV

    button_div.appendChild(icon_div)
    button_div.appendChild(label_div) 
    button.appendChild(button_div)
    container.appendChild(button)

    const handleButtonClick = async () => {
		const resp = await browser.runtime.sendMessage({ownerId, tweetId, profileId})
		if(resp.error) {
			console.error("Fatal: ", resp.error)
		}else {
			const {dislikeCount, tweetId} = resp
			dislikeMap[tweetId] = dislikeCount
		}
    } 
	

    button.addEventListener('click', handleButtonClick)

    const likesButton = footer.querySelector("div:nth-child(3)")
    likesButton.insertAdjacentElement('afterend', container)
}


// function addBlockButton(parentTweetDiv) {
// 	// const MORE_OPTIONS_GROUP_PATH = `div.r-f8sm7e:nth-child(5) > section:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > article:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)`
// 	const MORE_OPTIONS_GROUP_PATH = `div > div > article > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div`
// 	const CLASS_BLOCK_BTN = 'btn_block'

// 	console.debug("checking element", parentTweetDiv)
// 	const moreOptionsGroup = parentTweetDiv.querySelector(MORE_OPTIONS_GROUP_PATH)
// 	console.debug("more options", moreOptionsGroup)
// 	console.debug("target button", moreOptionsGroup.querySelector(":scope > button"))
// 	if(!moreOptionsGroup.querySelector(":scope > div[class*='btn_block']")) {
// 		console.debug("adding block button")
// 		const blockButtonParent = document.createElement('div')
// 		blockButtonParent.classList = `${CLASS_MORE_OPTIONS_ITEM} btn_block`

// 		const blockButton = document.createElement('button')
// 		blockButton.innerHTML = "Block!"
// 		blockButton.classList = "css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l"

// 		// // using code from twitter site to display block button: Jr()
// 		// blockButton.onclick = Jr()

// 		blockButtonParent.appendChild(blockButton)
// 		moreOptionsGroup.appendChild(blockButtonParent)
// 	}else {
// 		consol.debug("already has block button")
// 	}
// }
