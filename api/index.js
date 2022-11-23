import express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'

// express 초기화
const app = express()
// socket.io 지원을 위해 http 모듈에서 제공하는 메서드로 서버를 초기화한다.
const http = createServer(app)
// 웹 소켓 서버를 초기화한다. 두번째로 서버를 초기화할 때 여러 옵션을 줄 수 있다.
const io = new Server(http, {
  cors: {
    origin: ['http://localhost:5005']
  }
})

const messsags = []

// 앞단에서 요청이 오고 소켓이 생성되면 이벤트를 발생시킨다.
// 두번째 인자인 콜백함수에 생성된 소켓이 담겨져온다.
// 소켓에는 해당 소켓에 연결된 모든 클라이언트들에게 broadcast를 하거나,
// 이벤트를 발생 혹은 수신할 수 있는 메서드가 있다.
io.on('connection', socket => {
  socket.on('toclient', message => {
    //messages.push(message)
    io.emit('toclient', message)
  })
})

// app.listen이 아닌 http.listen를 사용한다.
http.listen(5003, () => {
  console.log('started server')
})

app.set('socketio',io);

module.exports = {
  path: '/api',
  handler: app
}