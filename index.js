const Pusher = require('pusher')
const express = require('express')
const cors = require('cors')
const WebSocket = require('ws')
const mongoose = require('mongoose')
const app = express()

/* 
    modal
*/
const Forex = require('./models/forex')
/* 
    config
*/
const {
    app_id,
    key,
    secret,
    cluster,
    forex_api,
    db
} = require('./config/key');

// connecting to database
mongoose.connect(
        db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    // CONFORMING THE CONNECTIONS
    .then(() => {
        console.log('mongodb connected...');
        // THROW ERR
    }).catch(err => console.log(err));
mongoose.set('useCreateIndex', true);



const pusher = new Pusher({
    appId: app_id,
    key: key,
    secret: secret,
    cluster: cluster,
    encrypted: true
});

app.use(cors());
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.set('PORT', process.env.PORT || 5000);

/* 
    forex api
*/

const ws = new WebSocket('wss://socket.polygon.io/forex')

// Connection Opened:
ws.on('open', () => {
    console.log('Connected!')
    ws.send(`{"action":"auth","params":"${forex_api}"}`)
    ws.send(`{"action":"subscribe", "params":"CA.USD/EUR"}`)
})
// Per message packet:
// setInterval(() => {
ws.on('message', (data) => {
    data = JSON.parse(data)
    data.map((msg) => {
        if (msg.ev === 'status') {
            return console.log('Status Update:', msg.message)
        }
        if (msg.ev === 'CA') {
            const storedForex = new Forex({
                ev: msg.ev,
                pair: msg.pair,
                o: msg.o,
                c: msg.c,
                h: msg.h,
                l: msg.l,
                s: msg.v,
                e: msg.e,
            })
            storedForex.save().then((forex) => {
                console.log('Success')
                console.log(forex)
                pusher.trigger('forex', 'pair', forex)
            }).catch(err => {
                if (err) return console.error(err)
            })


        } else if (msg.ev == 'C') {
            pusher.trigger('ticker', 'tick', msg)
        }
    })
})

ws.on('error', console.log)
// }, 5000)

/* 
    request data
*/
app.get('/forex', (_, res) => {
    Forex.find({}, (err, forex) => {
        (err) ? console.error(err): res.json(forex)
    })
})
/* 
    websocket for chatroom
*/

// let rooms = {};
// let chatLogs = {};


// app.post('/rooms', (req, res, next) => {
//     const data = req.body;
//     const payload = JSON.parse(JSON.stringify(data))

//     rooms[payload.user_DMs_id] = payload;
//     chatLogs[payload.user_DMs_id] = []
// })
// app.get('/rooms/:id', (req, res, next) => {

//     res.json(rooms)
// })

// app.post('/message', (req, res) => {
//     const payload = req.body;
//     console.log(payload)
//     pusher.trigger('chat', 'message', payload);
//     res.send(payload)
// });

app.listen(app.get('PORT'), () =>
    console.log('Listening at ' + app.get('PORT')))