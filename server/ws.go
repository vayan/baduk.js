package main

import (
	"code.google.com/p/go.net/websocket"
	"container/list"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
)

var clients = list.New()

type Client struct {
	ws   *websocket.Conn
	data string
	id   string
	msg  *Message
}

type Message struct {
	Key  string
	Uri  string
	Data string
}

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
		erri = 1
	}
	log.Printf("recv: '%s'", buf)
	return buf, erri
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("index.html")

	t.Execute(w, nil)
}

//change list to array
func WsHandle(ws *websocket.Conn) {
	log.Println("New client")
	clients.PushBack(Client{ws, "", "", nil})
	for {
		if buff, err := ws_recv(ws); err != 1 {
			var msg Message
			json.Unmarshal([]byte(buff), &msg)
			log.Println("Message decode ", msg)

			for e := clients.Front(); e != nil; e = e.Next() {
				cl := e.Value.(Client)
				if ws == cl.ws {
					switch msg.Key {
					case "SETKEY":
						cl.id = msg.Uri
						for e := clients.Front(); e != nil; e = e.Next() {
							cli := e.Value.(Client)
							if cli.ws != ws && cli.id == msg.Uri && cli.msg != nil {
								log.Panicln("HEREEEEEEE")
								ws_send(msg.Data, cli.ws)
							}
						}
						break
					case "OFFER":
						cl.msg = &msg
						for e := clients.Front(); e != nil; e = e.Next() {
							cli := e.Value.(Client)
							log.Panicln(cli.ws, cli.id, cli.msg)
							if cli.ws != ws && cli.id == msg.Uri && cli.msg != nil {

								ws_send(msg.Data, cli.ws)
							}
						}
						break
					}
				}
			}

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
