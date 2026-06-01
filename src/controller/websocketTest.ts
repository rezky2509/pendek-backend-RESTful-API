import { Hono } from "hono";
import { upgradeWebSocket } from "hono/bun";

import type {ServerWebSocket} from 'bun'


export const WebsocketTest = new Hono()

let counter: number = 0

WebsocketTest.get('/hono-ws',
    upgradeWebSocket((c)=>{
        console.log('Connected')
        return {
            // When connected for the first time
            // This is what we will send something
            onOpen(event, ws){
                console.log('Connected')
                console.log(event.timeStamp)
                ws.send('Hi there')
                // This part is first handshake 

                // This is where we can listen or subscribe 
                const rawSocket = ws.raw as ServerWebSocket
                rawSocket.subscribe('URL-CLICK')

                ws.send('Listening to URL CLICK ')
            },
            // This is when the front end send something
            onMessage(event, ws){
                ws.send('This is from Bun')
            },
            onClose(event, ws){
                console.log('Disconnected socket')
            }
        }
    })
)