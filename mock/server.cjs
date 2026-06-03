// mock/server.cjs  —  json-server v0.17 自定义启动脚本（CommonJS）
const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')

const server = jsonServer.create()
const dbPath = path.join(__dirname, 'db.json')
const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// 模拟登录接口：POST /login
server.post('/login', (req, res) => {
  const { email, password } = req.body
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
  const user = db.users && db.users.find(u => u.email === email)

  // 默认账号 admin@blog.com / 123456（演示用明文比对）
  const VALID_PASSWORD = '123456'
  if (user && password === VALID_PASSWORD) {
    const payload = { id: user.id, email: user.email, exp: Date.now() + 86400000 }
    const token = Buffer.from(JSON.stringify(payload)).toString('base64')
    res.json({ accessToken: token })
  } else {
    res.status(401).json('Invalid credentials')
  }
})

// 所有资源路由直接挂载到根路径
server.use(router)

const PORT = 3001
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
})
