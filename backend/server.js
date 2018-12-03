let express = require('express')
let app = express()
let fs = require('fs')
let sha256 = require('sha256')
let bodyParser = require('body-parser')
app.use(bodyParser.raw({
    type: '*/*'
}))
let passwords = {}
let sessions = {}
let chatMessages = []
let activeUsers = {}

try {
    savedMessages = fs.readFileSync('./messages.txt')
    chatMessages = JSON.parse(savedMessages)
} catch (err) { }
try {
    savedPassword = fs.readFileSync('./password.txt')
    passwords = JSON.parse(savedPasswords)
} catch (err) { }
let generateSessionID = function () {
    return Math.floor(Math.random() * 10000000000)
}
app.get('/activeUsers', function (req, res){
    let users = Object.keys(activeUsers)
    let arr = []
    for( i = 0; i<users.length; i++) {
        let currentUser = users[i]
        let currentUserTime = activeUsers[currentUser]
        if(currentUserTime > Date.now () - 5 * 60 * 1000 ) {
            arr = arr.concat(currentUser)
        }
    }
    res.send(JSON.stringify(arr))
})
app.post('/message', function (req, res) {
    let sessionID = req.headers.cookie
    if(sessionID) {
    let parsed = JSON.parse(req.body)
    let sessionID = parsed.sessionID
    let message = parsed.msg
    let username = sessions[sessionID]
    if (username === undefined) {
        res.send(JSON.stringify({
            error: true
        }))
        return;
    }
    activeUsers[username] = Date.now()
    let newMessage = {
        username: username,
        message: message
    }
    chatMessages = chatMessages.concat(newMessage)
    fs.writeFileSync('./messages.txt', JSON.stringify(chatMessages))
    res.send(JSON.stringify({
        success: true
    }))
}
})
app.get('/getAllMessages', function (req, res) {
    chatMessages = chatMessages.slice(-10)
    res.send(JSON.stringify(chatMessages))
})
app.post('/signup', function (req, res) {
    let parsed = JSON.parse(req.body)
    let username = parsed.username
    activeUsers[username] = Date.now()
    let password = parsed.password
    if (passwords[username]) {
        res.send("username already taken!")
    } else {
        passwords[username] = sha256(password)
        let sessionID = generateSessionID()
        sessions[sessionID] = username
        fs.writeFileSync('./password.txt', JSON.stringify(passwords))
        res.send(JSON.stringify({
            id: sessionID
        }))
    }}
    
)
app.post('/login', function (req, res) {
    let parsed = JSON.parse(req.body)
    let username = parsed.username
    activeUsers[username] = Date.now()
    let password = parsed.password
    let actualPassword = passwords[username]
    if (actualPassword === password) {
        let sessionID = generateSessionID()
        sessions[sessionID] = username
        let adminMessage = {
            username: "",
            message: `${username} has logged in`
        }
        chatMessages = chatMessages.concat(adminMessage)
        res.set('Set-Cookie', sessionID)
        res.send(JSON.stringify({
            id: sessionID, 
            message: chatMessages,
        }))
    } else {
        res.send(JSON.stringify({
            success: true
        }))
    }
})
app.listen(4020, function () {
    console.log('Started on 4020')
})