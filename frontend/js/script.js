//Login

const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

//Chat
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const user = { id: "", name: "", color: "" }

const colors = [
    "#FF6B6B",  
    "#F4A261",  
    "#2A9D8F",  
    "#E9C46A",  
    "#ffffff",  
    "#9C89B8",  
    "#E76F51"
]

let websocket

const creatMessageSelfElement = (content) => {
    const div = document.createElement("div")

    div.classList.add("message--self")
    div.innerHTML = content
    return div
}

const creatMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span  = document.createElement("span")

    div.classList.add("message--other")
    div.classList.add("message--self")
    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)
    span.innerHTML = sender
    div.innerHTML += content

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    
    return colors[randomIndex]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}


const processMessage = ({data}) => {
    const { userId, userName, userColor , content } = (JSON.parse(data))

    const message = 
        userId == user.id 
        ? creatMessageSelfElement(content) 
        : creatMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen()
}


const handleLogin = (event) => {
    event.preventDefault()
    
    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display= "none"
    chat.style.display= "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage

}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
    chatInput.focus()
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)
