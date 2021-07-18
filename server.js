var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');

var Chat = require('./models/chatmodel');
var User = require('./models/usermodel');

  


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

mongoose.connect('mongodb://localhost:27017/chatdatabase',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("You are connected to the chat application DB") })
    .catch((error) => { console.log("The error encountered is " + error) })


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
    });

});

app.get('/chats/:chatRoom', (req, res) => {
    console.log('Requested');
    var chatRoom = req.params.chatRoom;
    var arrayMessages = [];
    Chat.find((err, chats) => {
        if (err) throw err;
        res.send(chats);
        Object.keys(chats).forEach((key) => {
            var row = chats[key];
            if (row.chatRoom == chatRoom) {
                arrayMessages.push(row)
                console.log("message Found");
            }
        })
        res.send(arrayMessages);
        console.log("they are" + arrayMessages);
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
                console.log("found");
                res.status(200).json({ "LoggedIn": "Yes" , "chatroom":row.chatRoom});
                io.on('connection', function (socket) {
                    socket.join(row.chatRoom);
                    socket.emit('message', "Welcome to the FacultyChatter");
                    socket.emit('login', row.chatRoom);
                  // io.broadcast.emit('message', 'A user has joined the chat');
                    socket.on('disconnect', () => {
                        io.to(row.chatRoom).emit('message', 'A user has left the chat')
                    })
                });
            }
        });
    });
});

http.listen(3000, () => {

    console.log("Server running on port 3000");
})