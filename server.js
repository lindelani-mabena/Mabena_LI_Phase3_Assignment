var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');

var Chat = require('./models/chatmodel');
var User = require('./models/usermodel');

  


app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));

mongoose.connect('mongodb://localhost:27017/chatapp',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("You are connected to the chat application DB") })
    .catch((error) => { console.log("The error encountered is " + error) })

app.use(express.static(__dirname));

app.post('/chats', (req, res) => {
    console.log(req.body);
    Chat.create(req.body, (err) => {
        if (err) throw err;
        io.emit('chat', req.body)
        console.log("Chat saved successfully");
    });
});
app.post('/register', (req, res) => {
    User.create(req.body, (err) => {
        if (err) throw err;
        console.log("User successfully registered!")
        res.status(200).json({ "Registered": "Yes"});
    });

});

app.get('/chats/', (req, res) => {
    console.log('Requested');
    Chat.find((err, chats) => {
        if (err) throw err;
        res.json(chats);
    })

})
app.post('/login', (req, res) => {

    var username = req.body.username;
    var password = req.body.password;
    User.find((err, data) => {
        if (err) throw err;
        Object.keys(data).forEach((key) => {
            var row = data[key];
            if ((row.username == username) && (row.password == password)) {
                io.on('connection', function (socket) {
                    console.log('A user is connected');
                    socket.emit('Username', row.username); 
                    io.sockets.emit('broadcast',  row.usename + " has joined the chat!" );

                    socket.on('disconnect', () => {
                        io.sockets.emit('broadcast',  row.usename + " has left the chat!" );
                    })
                });
                res.status(200).json({ "LoggedIn": "Yes"});

            }
        });

    });
    io.emit('Username', username);

});

http.listen(3000, () => {

    console.log("Server running on port 3000");
})