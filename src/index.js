const path = require('path')
const express = require('express')
const http=require('http')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generatemessage}=require('./utils/messages')
const {adduser,removeuser,getUser,getUsersInRoom}=require('./utils/users')

const app = express()
const server=http.createServer(app)
const io=socketio(server)

const port = process.env.PORT || 3001
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count=0 

app.get('/',(req,res)=>{
    res.send('Hello')
})

io.on('connection',(socket)=>{
    console.log('user')
    socket.on('join',({username,room},callback)=>{
        const {error,user}=adduser({id:socket.id,username:username,room:room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('message',generatemessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message',generatemessage('Admin',`${user.username} has joined`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(room)
        }),
            callback()
        


    socket.on('sendmessage',(inputvalue,callback)=>{
        const filter=new Filter()
        if(filter.isProfane(inputvalue)){
           return callback('Profanity not allowed')
        }
        const user=getUser(socket.id)
        io.to(user.room).emit('message',generatemessage(user.username,inputvalue))
        callback('deleivered')
    })
 
    socket.on('disconnect',()=>{
       const removeduser= removeuser(socket.id)
       if(removeduser){
        io.to(removeduser.room).emit('message',generatemessage('Admin',`${removeduser.username} has left`))
       
       io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)
    })
}
    })

    socket.on('sharelocation',(coords,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationmessage',
        generatemessage(user.username,`https://www.google.com/maps/?q=${coords.longitude},${coords.longitude}`))
        callback()
    })
})
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})