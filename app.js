

const path = require('path')


const expresss = require('express')

const socket = require('socket.io')

const http = require('http')

//node.js 기본 내장 모듈 불러오기
const fs = require('fs')

//express 객체생성
const app = expresss()

// express http 서버 생성
const server = http.createServer(app)

// 생성된 서버를 socket.io에 바인딩
const io = socket(server)

app.use('/css', expresss.static('./static/css'))
app.use('/js', expresss.static('./static/js'))
app.use('/node_modules',expresss.static(path.join(__dirname,'/node_modules')))
//get 방식으로 / 경로에 접속하면 실행됨
app.get('/',function (request, response){
    fs.readFile('./static/index.html',function (err,data){
        if (err){
            response.send("에러")
        }else {
            response.writeHead(200,{'Content-Type':'text/html'})
            response.write(data)
            response.end()
        }
    })


})

io.sockets.on('connection',function (socket){


    //새로윤 유저가 접속했을 경우 다른 소켓에게도 알려줌
    socket.on('newUser',function (name){
        console.log(name,"님이 접속했습니다")

        //소켓에 이름저장하기
        socket.name = name


        //모든 소켓에 전송
        io.sockets.emit('update',{type:'connect', name:'SERVER', realname:name, message:name+' 님이 접속 했습니다.'})
    })

    //전송한 데이터 받기
    socket.on('message',function (data){

        data.name = socket.name
        data.id = socket.name
        console.log(data)

        //보낸사람 제외한 나머지 유저에게 메시지 전송
        socket.broadcast.emit('update',data)
    })

    //접속종료
    socket.on('disconnect',function (){
        console.log(socket.name+"님이 나갔습니다")

        socket.broadcast.emit('update',{type:'disconnect', name:'SERVER', message: socket.name+ ' 님이 나갔습니다.'});
    })

    socket.on('endbutton',function (data){
        console.log(socket.name+"님이 나갔습니다")


        socket.broadcast.emit('update',{type:'endd', id:socket.name ,name:'SERVER', message: socket.name+ ' 님이 나갔습니다.'});
    })
})

server.listen(8080, function (){
    console.log('서버 실행중')
})