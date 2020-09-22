global.__basedir = __dirname

const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000
app.set('port', port)

require(__basedir + '/db')

const server = http.createServer(app)

const io = require('socket.io')(server)
io.on('connection', client => {
  client.on('event', (data) => {
    
  })
  client.on('disconnect', () => {

  })
})
app.set('socketio', io)

server.listen(port)
console.log({ msg: `Started on port ${port}` }, 'info')