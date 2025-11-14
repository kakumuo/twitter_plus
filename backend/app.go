package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/rs/cors"
)

type DislikeRecord struct {
	OwnerId    string `json:"ownerId"`
	DislikedAt int    `json:"dislikeDate"`
}

type TweetRecord struct {
	OwnerId   string                   `json:"ownerId"`
	TweetId   string                   `json:"tweetId"`
	DislikeBy map[string]DislikeRecord `json:"dislikedBy"`
	CreatedAt int                      `json:"createdAt"`
	UpdatedAt int                      `json:"updatedAt"`
}

const HOST = "127.0.0.1"
const PORT = 8888
const FILE_PATH = "./data.json"

// TODO: move functionality to mongodb
func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /tweet/dislike", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		tweetId := r.URL.Query().Get("tweetId")
		outputObj := make(map[string]any)

		defer func() {
			outputData, _ := json.MarshalIndent(outputObj, "", " ")
			fmt.Fprintf(w, "%s", string(outputData))
		}()

		fileData, err := os.ReadFile(FILE_PATH)
		if err != nil {
			outputObj["error"] = fmt.Sprintf("%s %s <<%s>>", "Could not open file", FILE_PATH, err.Error())
			log.Fatal(outputObj)
		}

		fileDataObj := make(map[string]TweetRecord)
		err = json.Unmarshal(fileData, &fileDataObj)
		if err != nil {
			outputObj["error"] = fmt.Sprintf("%s %s <<%s>>", "Could not parse data file", FILE_PATH, err.Error())
			log.Fatal(outputObj)
		}

		outputObj["dislikeCount"] = len(fileDataObj[tweetId].DislikeBy)
		outputObj["tweetId"] = tweetId
	})

	// localhost:8888/tweet/dislike?ownerId=ThongWeeDaphne&tweetId=1988856015710834969&profileId=KevinAkmuo
	mux.HandleFunc("POST /tweet/dislike", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		ownerId, tweetId, profileId := r.URL.Query().Get("ownerId"), r.URL.Query().Get("tweetId"), r.URL.Query().Get("profileId")
		outputObj := make(map[string]any)
		log.Printf("Disliking tweet... {disliker: %s, tweetId: %s, tweetOwner: %s}\n", profileId, tweetId, ownerId)

		defer func() {
			outputData, _ := json.MarshalIndent(outputObj, "", " ")
			fmt.Fprintf(w, "%s", string(outputData))
		}()

		fileData, err := os.ReadFile(FILE_PATH)
		if err != nil {
			outputObj["error"] = fmt.Sprintf("%s %s <<%s>>", "Could not open file", FILE_PATH, err.Error())
			log.Fatal(outputObj)
		}

		fileDataObj := make(map[string]TweetRecord)
		err = json.Unmarshal(fileData, &fileDataObj)
		if err != nil {
			outputObj["error"] = fmt.Sprintf("%s %s <<%s>>", "Could not parse data file", FILE_PATH, err.Error())
			log.Fatal(outputObj)
		}

		timeStamp := int(time.Now().Unix())
		if _, ok := fileDataObj[tweetId]; !ok {
			fileDataObj[tweetId] = TweetRecord{OwnerId: ownerId, TweetId: tweetId, DislikeBy: make(map[string]DislikeRecord), CreatedAt: timeStamp, UpdatedAt: timeStamp}
		}

		tweetRecord := fileDataObj[tweetId]
		tweetRecord.UpdatedAt = timeStamp
		fileDataObj[tweetId] = tweetRecord
		dislikeByMap := tweetRecord.DislikeBy
		if _, ok := dislikeByMap[profileId]; !ok {
			dislikeByMap[profileId] = DislikeRecord{OwnerId: profileId, DislikedAt: timeStamp}
		} else {
			delete(dislikeByMap, profileId)
		}

		fileDataStr, _ := json.MarshalIndent(fileDataObj, "", " ")
		os.WriteFile(FILE_PATH, fileDataStr, os.ModeAppend|os.ModePerm)

		outputObj["dislikeCount"] = len(fileDataObj[tweetId].DislikeBy)
		outputObj["tweetId"] = tweetId
	})

	endpoint := fmt.Sprintf("%s:%d", HOST, PORT)
	corsHandler := cors.AllowAll().Handler(mux)
	log.Println("Starting server at:", endpoint)
	log.Fatal(http.ListenAndServe(endpoint, corsHandler))
}

/*
API SPEC
	/tweet/dislike
		GET(tweetId:string):int
		POST(ownerId:string, tweetId:string, profileId:string):int
*/
