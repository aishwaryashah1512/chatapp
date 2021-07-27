
const $messageform=document.querySelector('#msgform')
const $msgbutton=document.querySelector('#send')
const $msginput=$messageform.querySelector('input')
const $locationbutton=document.querySelector('#location')
const $messages=document.querySelector('#messages')
const $messagetemplates=document.querySelector('#message-template').innerHTML
const $locationmessagetemplate=document.querySelector('#location-message-template').innerHTML

const $navtemplate=document.querySelector('#nav-template').innerHTML

const $sidebartemplate=document.querySelector("#sidebar-template").innerHTML

console.log($msgbutton)

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.emit('join',{username,room},(error)=>{
    if(error){
    console.log(error)
    alert(error)
    location.href='/'
    }
})

socket.on('message',(msg)=>{
    console.log(msg.text)
    const html=Mustache.to_html($messagetemplates,{username:msg.username,message:msg.text,createdAt:moment(msg.createdAt).format('hh:mm a')})
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationmessage',(url)=>{
    const html=Mustache.render($locationmessagetemplate,{username:url.username,url:url.text,createdAt:moment(url.createdAt).format('hh:mm a')})
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
 const userlist=Mustache.render($sidebartemplate,{users}) 
 const rooom =Mustache.render($navtemplate,{roomno:room})

 document.querySelector("#sidebar").innerHTML=userlist
 document.querySelector('#noofroom').innerHTML=rooom
})

document.querySelector('#location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        alert("This Browser doesn't support geolocation")
    }
    else{
        navigator.geolocation.getCurrentPosition((position)=>{
            $locationbutton.setAttribute('disabled','disabled')
           socket.emit('sharelocation',{latitude:position.coords.latitude,
           longitude:position.coords.longitude},()=>{
            $locationbutton.removeAttribute('disabled')
               console.log("location shared")
           })
        })
    }
})

$msgbutton.addEventListener('click',(event)=>{
    event.preventDefault()
    const inputvalue=$msginput.value 
      //tareget here means the form and message is the name prop of input
    $msgbutton.setAttribute('disabled','disabled')                                                          //const inputvalue=document.querySelector('input').value
    socket.emit('sendmessage',inputvalue,(error)=>{
        $msgbutton.removeAttribute('disabled')
        console.log( $msginput.value)
        $msginput.value=''
        
        $msginput.focus()
        if(error){
            console.log(error)
        }
        else{
        console.log(done)
        }
    })
    
})





