var http = require('http')
var path = require('path')
var express = require('express')
var socketio = require('socket.io')
var Filter = require('bad-words')
var { addUser, removeUser,getUser, getUserInRoom} = require('./models/users')
var {generateMessage, generateLocationMessage}=require('./src/messages')


var app = express()
var server = http.createServer(app)
var io = socketio(server)

var port = process.env.PORT || 3000
var publicDirectoryPath = path.join(__dirname, 'public')
app.set('view engine', 'ejs')
app.use(express.static(publicDirectoryPath))
 
app.get('/', function(req, res){
  res.render('home')
})
app.get('/home', function(req, res){
  res.render('chat')
})


io.on('connection', function(socket  ){
  console.log('New WebSocket connection')

 


 socket.on('join', ({username, room}, callback)=>{
     var {error, user}  =  addUser({ id: socket.id, username, room })

     if(error){
     return  callback(error)
     }

   socket.join(user.room)

   socket.emit('message',  generateMessage('Admin','welcome') )
   socket.broadcast.to(user.room).emit('message', generateMessage('Admin', user.username +' has joined the chat room  ') )
   io.to(user.room).emit('roomData', {
     room: user.room,
     users: getUserInRoom(user.room)
   })

   callback()
 })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    var filter = new Filter()

    if(filter.isProfane(message)){
      return callback('Pofanity is not allowed')
    }
    io.to(user.room).emit('message', generateMessage(user.username , message) )
    callback()
  })

  socket.on('sendLocation',(coords, callback)=>{
    var user = getUser(socket.id)
     io.to(user.room).emit('locationMessage',generateLocationMessage( user.username, `http://google.com/maps?q=${coords.latitude},${coords.longitude}`) )
     callback('Location Successsfully Delivered')
  })
  socket.on('disconnect', ()=>{
   var user= removeUser(socket.id)

     if(user){
           io.to(user.room).emit('message', generateMessage('Admin',user.username + '  has left') ) 
           io.to(user.room).emit('roomData', {
             room : user.room,
             users : getUserInRoom(user.room)
           })
     }
  })
})

server.listen(port, function(){
  console.log('connected to server')
})