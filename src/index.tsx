import React from "react";
import { createRoot } from "react-dom/client";
import {DislikeButton} from "./components/ComponentMain";


const SELECT_TIMELINE_PARENT = 'css-175oi2r'
// const CLASS_MORE_OPTIONS_GROUP = "css-175oi2r r-1awozwy r-18u37iz r-1cmwbt1 r-1wtj0ep"
// const CLASS_MORE_OPTIONS_ITEM = "css-175oi2r r-18u37iz"

const timelineParent = document.querySelector<HTMLDivElement>(`div[class*="${SELECT_TIMELINE_PARENT}"`)
const timelineButtonMap:WeakMap<HTMLDivElement, HTMLDivElement> = new WeakMap()

const observer = new MutationObserver((mutationsList) => {
  mutationsList.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
		const element:HTMLDivElement = node as HTMLDivElement
        if(element.classList.contains("css-175oi2r") && element.classList.length == 1) {
			const buttonElement = addDislikeButton(element)
            timelineButtonMap.set(element, buttonElement)
		}
    });

    // TODO: find way to safely destroy object to prevent polling when out of screen
    mutation.removedNodes.forEach((node) => {
        const element:HTMLDivElement = node as HTMLDivElement
        if(element.classList.contains("css-175oi2r") && element.classList.length == 1) {
            const targetButtonElement = timelineButtonMap.get(element)
            if(targetButtonElement) {
                targetButtonElement.remove()                
            }
		}
    })
  });
});

if(timelineParent) {
    observer.observe(timelineParent, { attributes: true, childList: true, subtree: true })
}

function addDislikeButton(parentTweetDiv:HTMLDivElement) {
    const tweetInfo = getTweetInfo(parentTweetDiv)
    const elementId = `__${tweetInfo.tweetId}`

    const footer = parentTweetDiv.querySelector<HTMLDivElement>("div[aria-label*='likes']")
    if(!footer) {
        throw new Error("Cannot find tweet footer")
    }

    const container = document.createElement('div'); 
    container.id = elementId
    container.className = "css-175oi2r r-18u37iz r-1h0z5md r-13awgt0"

    const likesButton = footer.querySelector<HTMLDivElement>("div:nth-child(3)")
    if(!likesButton) {
        throw new Error("Cannot find likes button")
    }

    likesButton.insertAdjacentElement('afterend', container)

    const rootContainer = document.querySelector(`#${elementId}`)
    if(!rootContainer) {
        throw new Error("Cannot find elment container w/ id: " + elementId)
    }

    const root = createRoot(rootContainer)
    root.render(<DislikeButton tweetInfo={tweetInfo} />)

    return container
}

function getTweetInfo(parentTweetDiv:HTMLDivElement) {
    const info:TweetInfo = {
        ownerId: "", 
        profileId: "", 
        tweetId: ""
    }

    const profileId = getProfileId()

    const anchorElement = parentTweetDiv.querySelector<HTMLAnchorElement>("a[href*='/status/']")
    if (anchorElement) {
        const hrefElements = anchorElement.href.split("/")
        info.ownerId = hrefElements[3]
        info.tweetId = hrefElements[5]
        info.profileId = profileId
        console.debug("href", hrefElements)
    } 

    return info
}

function getProfileId(){
	const profileAnchor = document.querySelector<HTMLAnchorElement>("a[aria-label='Profile'][role='link']") 
    if(profileAnchor) {
        const arr = profileAnchor.href.split('/')
        return arr[arr.length - 1]
    }
	
    return ""
}

