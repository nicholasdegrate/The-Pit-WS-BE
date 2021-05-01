const Pusher = require('pusher')
const express = require('express')
const cors = require('cors')
const WebSocket = require('ws')

const app = express()

const { app_id, key, secret, cluster , forex_api} = require('./config/key');

app.use(cors());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.set('PORT', process.env.PORT || 5000);

const ws = new WebSocket('wss://socket.polygon.io/forex')

// Connection Opened:
ws.on('open', () => {
	console.log('Connected!')
	ws.send(`{"action":"auth","params":"${forex_api}"}`)
	ws.send(`{"action":"subscribe","params":"C.AUD/USD,C.USD/EUR,C.USD/JPY"}`)
})

// Per message packet:
ws.on('message', ( data ) => {
	data = JSON.parse( data )
	data.map(( msg ) => {
		if( msg.ev === 'status' ){
			return console.log('Status Update:', msg.message)
		}
		console.log('Tick:', msg)
	})
})

ws.on('error', console.log)

/* 
    websocket for chatroom
*/

const pusher = new Pusher({
    appId: app_id,
    key: key,
    secret: secret,
    cluster: cluster,
    encrypted: true
});

app.post('/message', (req, res) => {
    const payload = req.body;
    console.log('hello')
    pusher.trigger('chat', 'message', payload);
    res.send(payload)
});

app.listen(app.get('PORT'), () => 
  console.log('Listening at ' + app.get('PORT')))