const express = require('express')
const nunjucks = require('nunjucks')
const dotenv = require('dotenv')
const Pool = require('pg').Pool

dotenv.config()

const {password, host, PORT} = process.env

const db = new Pool({
  user: 'postgres',
  password: process.env.password,
  port: 5432,
  host: 'localhost',
  database: 'donations'
})

const server = express()
nunjucks.configure('./', {
  express: server,
  noCache: true
})

server.use(express.static('public'))
server.use(express.urlencoded({
  extended: true
}))

server.get('/', (req, res) => {
  const query_string = 'SELECT * FROM "donors"'

  db.query(query_string, (err, result) => {
    if (err) return res.send(err)

    const donors = result.rows

    return res.render("index.html", { donors })
  })

})


server.post('/', (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood
  if (name === '' || email === '' || blood === '')
    return res.send('Todos os campos sao obrigatórios')

  const query_string = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`

  db.query(query_string, [name, email, blood], err => {
    if (err) return res.send(err)

    return res.redirect('/')

  })

})

server.listen(PORT, () => {
  console.log(`Live on PORT ${PORT}`)
})