package main

import (
	"code.google.com/p/go.net/websocket"
	"fmt"
	"html/template"
	"log"
	"net/http"
)

func ws_send(buf string, ws *websocket.Conn) {
	if ws == nil || len(buf) == 0 {
		return
	}
	if err := websocket.Message.Send(ws, string(buf)); err != nil {
		log.Println(err)
	}
	log.Printf("send : '%s'", buf)
}

func ws_recv(ws *websocket.Conn) (string, int) {
	var buf string
	erri := 0

	if err := websocket.Message.Receive(ws, &buf); err != nil {
		fmt.Println(err)
	}
	log.Printf("recv: '%s'", buf)
	return buf, erri
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("index.html")
	t.Execute(w, nil)
}

func WsHandle(ws *websocket.Conn) {
	log.Println("new client")
	for {
		if buff, err := ws_recv(ws); err != 1 {
			_ = buff
		} else {
			return
		}
	}
}

func main() {
	http.HandleFunc("/", IndexHandler)
	http.Handle("/ws", websocket.Handler(WsHandle))
	http.Handle("/static/", http.FileServer(http.Dir(".")))
	http.ListenAndServe(":8080", nil)
}
