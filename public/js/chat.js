var socket = io()

var input = document.querySelector('input')
var messageForm = document.querySelector('#form')
var messageFormInput = messageForm.querySelector('input')
var messageFormButton = messageForm.querySelector('button')
var sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

var locationButton = document.querySelector('#send-location')
var messages = document.querySelector('#messages')
var messageTemplate = document.querySelector('#message-template').innerHTML
var locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
 var { username, room }=Qs.parse(location.search, { ignoreQueryPrefix: true})

socket.on('message', (message) =>{
  console.log(message)
  var html = Mustache.render(messageTemplate, {
    username: message.username,
    message : message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })

  messages.insertAdjacentHTML('beforeend', html)
  
})




 socket.on('roomData', ({room , users})=>{
   const html = Mustache.render(sidebarTemplate, {
     room,
     users
   
   })
   document.querySelector('#sidebar').innerHTML= html
 })




socket.on('locationMessage', (url)=>{
  console.log(message)
  var html = Mustache.render(locationMessageTemplate, {
    username : message.username,
    url : message.url,
    createdAt :moment(message.createdAt).format('h:mm a')
  })
  messages.insertAdjacentHTML('beforeend', html)
  
})
// document.getElementById("searchTxt").value;
messageForm.addEventListener('submit', (e)=>{
  e.preventDefault()

  messageFormButton.setAttribute('disabled', 'disabled ')
  var message = e.target.elements.message.value

  socket.emit('sendMessage', message, function(error){
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()
    if(error){
      return console.log(error)
    }
    console.log('The message was delivered Successfully')
  })
})

document.querySelector('#send-location').addEventListener('click', function(){
  if(!navigator.geolocation){
       return  alert('Geolocation not supported by your browser')
  }
 locationButton.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition(function(position){
     
       socket.emit('sendLocation', {
         latitude : position.coords.latitude,
         longitude: position.coords.longitude
       }, function(callback){
         console.log(callback)
         locationButton.removeAttribute('disabled')
       })
  })
})

socket.emit('join', {username , room}, (error)=>{
    if(error){
      alert(error)
      location.href= '/'
    }
})