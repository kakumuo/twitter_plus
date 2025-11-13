package main

import (
	"fmt"
	"html"
	"log"
	"net/http"
)

const HOST = "localhost"
const PORT = 8888

func main() {
	http.HandleFunc("GET /tweet/dislike", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "GET:  %q", html.EscapeString(r.URL.Path))
	})

	http.HandleFunc("POST /tweet/dislike", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "POST:  %q", html.EscapeString(r.URL.Path))
	})

	endpoint := fmt.Sprintf("%s:%d", HOST, PORT)
	log.Println("Starting server at:", endpoint)
	log.Fatal(http.ListenAndServe(endpoint, nil))
}

/*
API SPEC
	/tweet/dislike
		GET(tweetId:string):int
		POST(tweetId:string, userId:string):int
*/
