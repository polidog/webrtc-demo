const app = require('express')();
const http = require('http').Server(app);
const PORT = process.env.PORT || 8080;
const IO_PORT = process.env.IO_PORT || 9001

const io = require('socket.io').listen(IO_PORT);


app.get(`/sdp`, (req, res) => {
  res.sendFile(__dirname + '/sdp/index.html');
});


io.sockets.on('connection', (socket)=>{
  socket.on('offer', (offer) => {
    console.log('offer:' + offer.id)
    socket.broadcast.emit('offer', offer)
  })

  socket.on('answer', (answer) => {
    console.log('answer:' + answer.id)
    socket.broadcast.emit('answer', answer)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected');
  });
})

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
