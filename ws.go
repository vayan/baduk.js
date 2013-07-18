package main

import (
	"code.google.com/p/go.net/websocket"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
)

var clients = make(map[int]*Client)

type Client struct {
	ws     *websocket.Conn
	data   string
	id     string
	offer  *Message
	answer *Message
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
}

func ws_recv(ws *websocket.Conn) (string, int) {
	var buf string
	erri := 0

	if err := websocket.Message.Receive(ws, &buf); err != nil {
		fmt.Println(err)
		erri = 1
	}
	return buf, erri
}

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	t, _ := template.ParseFiles("index.html")

	t.Execute(w, nil)
}

//TODO : CHECK KEY USED
func WsHandle(ws *websocket.Conn) {
	clients[len(clients)+1] = &Client{ws, "", "", nil, nil}
	for {
		if buff, err := ws_recv(ws); err != 1 {
			var msg Message
			json.Unmarshal([]byte(buff), &msg)
			for _, cl := range clients {
				if ws == cl.ws {
					switch msg.Key {
					case "SETKEY":
						cl.id = msg.Uri
						newk := true
						for _, cli := range clients {
							if cli.ws != cl.ws && cli.id == cl.id {
								newk = false
								jsonstr, _ := json.Marshal(cli.offer)
								ws_send(string(jsonstr), cl.ws)
							}
						}
						if newk {
							ws_send("{\"Key\": \"NEW\", \"Uri\": \"\", \"Data\": \"\"}", cl.ws)
						}
						break
					case "OFFER":
						cl.offer = &msg
						break
					case "ANSWER":
						cl.answer = &msg
						for _, cli := range clients {
							if cli.ws != ws && cli.id == msg.Uri {
								jsonstr, _ := json.Marshal(cl.answer)
								ws_send(string(jsonstr), cli.ws)
							}
						}
						break
					}
				}

			}

		} else {
			for key, cli := range clients {
				if cli.ws == ws {
					delete(clients, key)
				}
			}
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
