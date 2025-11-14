
const BACKEND_HOST = '127.0.0.1'
const BACKEND_PORT = 8888
const BACKEND_PATH = "/tweet/dislike"
const BACKEND_ENDPOINT = `${BACKEND_HOST}:${BACKEND_PORT}${BACKEND_PATH}`

browser.runtime.onMessage.addListener(async (message) => {
    const query = Object.entries(message).map(([key, val]) => `${key}=${val}`).join("&")
    const path = `http://${BACKEND_ENDPOINT}?${query}`
    
    console.debug("Sending to:", path)

    const resp  = await fetch(path, {method: "POST"})	
    const respJson  = await resp.json()
    console.debug("API Response: ", respJson)   
    
    return respJson
});

