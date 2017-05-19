const app = require('express')();
const http = require('http').Server(app);
const PORT = process.env.PORT || 8080;
const IO_PORT = process.env.IO_PORT || 9001
var ejs = require('ejs');

const io = require('socket.io').listen(IO_PORT);

app.engine('ejs', ejs.renderFile);

app.get(`/sdp`, (req, res) => {
    console.log();
    var domain = req.headers.host.split(':')[0];
    var io_script_path = "http://" + domain + ':' + IO_PORT + '/socket.io/socket.io.js';
    var io_path = 'http://' + domain + ':' + IO_PORT;
    res.render('sdp.ejs',
        {
            title : 'Express + EJS' ,
            content: '大分シンプルになった！',
            io_script_path: io_script_path,
            io_path: io_path
        }
    );

    // res.sendFile(__dirname + '/sdp/index.html');
});

app.get(`/ice`, (req, res) => {
    res.sendFile(__dirname + '/ice/index.html');
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
