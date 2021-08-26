var users = []

var addUser = ({ id, username, room})=>{
    username= username.trim().toLowerCase()
    room = room.trim(). toLowerCase()

    //validate the data
    if(!username){
      return {
        error: ' username and room are required',
      }
    }

    //check for exusting user
    var existingUser = users.find((user)=>{
        return user.room == room && user.username == username
    })
    //validate username
    if(existingUser){
      return {
        error : 'username is in use!'
      }
    }
    //store user
    var user = {id, username, room}
    users.push(user)
    return {user}
}

var removeUser = function(id){
  var index = users.findIndex((user)=>{
    return user.id === id
  })
  if(index !==-1){
    return users.splice(index, 1)[0]
  }
}

const getUser = function(id){
  return users.find((user)=> user.id === id)
}
var getUserInRoom = (room)=>{
  return users.filter((user)=> user.room === room)
}


module.exports = {
  addUser,
  removeUser,
  getUserInRoom,
  getUser
}
