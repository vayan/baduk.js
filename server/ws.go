package main

import (
	"code.google.com/p/go.net/websocket"
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
)

//var clients = list.New()

var clients = make(map[int]*Client)

type Client struct {
	ws   *websocket.Conn
	data string
	id   string
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
	clients[len(clients)+1] = &Client{ws, "", "", nil, nil}
	for {
		if buff, err := ws_recv(ws); err != 1 {
			var msg Message
			json.Unmarshal([]byte(buff), &msg)
			log.Println("Message decode ", msg)

			for _, cl := range clients {
				// if ws != cl.ws {

				// 	ws_send(msg.Data, cl.ws)
				// }
				if ws == cl.ws {
					switch msg.Key {
					case "SETKEY":
						cl.id = msg.Uri
						newk := true
						for _, cli := range clients {
							if cli.ws != cl.ws && cli.id == cl.id {
								newk = false
							}
						}
						if newk {
							ws_send("{\"Key\": \"NEW\", \"Uri\": \"\", \"Data\": \"\"}", cl.ws)
						} else {
							for _, cli := range clients {
							log.Println("OFFER TAG", cli.ws, cli.id, cli.offer)
							if cli.ws != ws && cli.id == msg.Uri && cli.offer != nil {
								log.Println("SENDDDDD")
								jsonstr, _ := json.Marshal(cli.offer)
								ws_send(string(jsonstr), cl.ws)
							}
						}
						}
						break
					case "OFFER":
						cl.offer = &msg
						for _, cli := range clients {
							log.Println("OFFER TAG", cli.ws, cli.id, cli.offer)
							if cli.ws != ws && cli.id == msg.Uri && cli.offer != nil {
								log.Println("SENDDDDD")
								jsonstr, _ := json.Marshal(cli.offer)
								ws_send(string(jsonstr), cl.ws)
							}
						}
						break
					case "ANSWER":
						cl.answer = &msg
						for _, cli := range clients {
							log.Println("OFFER ANSWER", cli.ws, cli.id, cli.answer)
							if cli.ws != ws && cli.id == msg.Uri {
								log.Println("SENDDDDD ANSWER")
								jsonstr,_ := json.Marshal(cl.answer)
								ws_send(string(jsonstr), cli.ws)
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
