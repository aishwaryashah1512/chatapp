const users=[]

const adduser=({id,username,room})=>{
if(!username || !room){
    return{
        error:'Username and room both required'
    }
}
else{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    const existinguser=users.find((user)=>{
       return user.room===room && user.username===username
    })
    if(existinguser){
        return  {error:'username in use'}
        
    }
    else{
        const user={id,username,room}
        users.push(user)
        return {user}
    
    }
}
}

const removeuser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!==-1){
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    const index=users.findIndex((user)=>user.id===id)
    if(index!==-1){
        return users[index]
    }
}


const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports={
    adduser,
    removeuser,
    getUser,
    getUsersInRoom
}