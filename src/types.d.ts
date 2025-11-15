type TweetInfo = {
    ownerId: string
    tweetId: string
    profileId: string
}

type APIMessage = {
    action: 'get' | 'upsert', 
    data:TweetInfo, 
}

type APIValidResponse = {
    dislikeCount: int, 
    tweetId: string, 
    userDislike:bool
}

type APIErrorResponse = {
    error: string
}

type APIResponse = APIValidResponse | APIErrorResponse