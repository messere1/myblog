// mock/server.js  —  json-server v0.17 自定义启动脚本
import jsonServer from 'json-server'
import { createRequire } from 'module'
import { readFileSync } from 'fs'

const require = createRequire(import.meta.url)
const server = jsonServer.create()
const router = jsonServer.router('mock/db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// 模拟登录接口：POST /api/login
server.post('/api/login', (req, res) => {
  const { email, password } = req.body
  const db = JSON.parse(readFileSync('mock/db.json', 'utf-8'))
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

// 所有 /api/* 路由代理到 json-server
server.use('/api', router)

const PORT = 3001
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`)
})
