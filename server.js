const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {path: '/socket.io'});


const port = 80;
let currentValue = 0;

app.use(express.static(path.join(__dirname, '/build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/build/index.html'));
});

io.on('connection', (socket) => {
    let clientName;
    io.emit('serverswitch',currentValue);
    socket.on('init',(data)=>{
        clientName = data;
    })
    socket.on('clientswitch', (data) => {
        currentValue = data;
        io.emit('serverswitch', currentValue);
        io.emit('switchdata', {clientName,currentValue});
    })
})


http.listen(port, () => {
    console.log(`express app started at ${port}`);
})