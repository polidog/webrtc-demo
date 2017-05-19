const app = require('express')();
const http = require('http').Server(app);
const PORT = process.env.PORT || 8080;
const IO_PORT = process.env.IO_PORT || 9001
var ejs = require('ejs');

const io = require('socket.io').listen(IO_PORT);

const getSocketUrl = function(req, path = "") {
    const domain = req.headers.host.split(':')[0];
    return 'http://' + domain + ':' + IO_PORT + path;
}

app.engine('ejs', ejs.renderFile);

app.get(`/sdp`, (req, res) => {
    const io_script_path = getSocketUrl(req, '/socket.io/socket.io.js');
    const io_path = getSocketUrl(req);
    res.render('sdp.ejs',
        {
            io_script_path: io_script_path,
            io_path: io_path
        }
    );
});

app.get(`/ice`, (req, res) => {
    const io_script_path = getSocketUrl(req, '/socket.io/socket.io.js');
    const io_path = getSocketUrl(req);
    res.render('ice.ejs',{
        io_script_path: io_script_path,
        io_path: io_path,
    })
});

app.get(`/data`, (req, res) => {
    const io_script_path = getSocketUrl(req, '/socket.io/socket.io.js');
    const io_path = getSocketUrl(req);
    res.render('data.ejs',{
        io_script_path: io_script_path,
        io_path: io_path,
    })
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
