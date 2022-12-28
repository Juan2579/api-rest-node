const { connection } = require("./database/connection")
const express = require("express")
const cors = require("cors")

//inicializar App
console.log("App de node arrancada")

//Conectar a la base de datos
connection()

//Crear servidor Node
const app = express()
const port = 3900

//Configurar CORS
app.use(cors())

//Convertir body a objeto js
app.use(express.json())

//RUTAS
const routesArticle = require("./routes/articleRoute")
//Cargo las rutas
app.use("/api", routesArticle)


//Rutas prueba hardcodeadas
app.get("/probando",(req, res) => {
  console.log("Se ha ejecutado el endpoint probando")
  return res.status(200).json([
    {
      curso: "Master en react",
      autor: "Victor Robles WEB"
    },
    {
      curso: "Master en react",
      autor: "Victor Robles WEB"
    }
  ])
})

app.get("/", (req, res) => {
  return res.status(200).send(
    "<h1>Empezando a crear un api rest con node</h1>"
  )
})

//Crear servidor y escuchar peticiones http
app.listen(port, () => {
  console.log("Servidor corriendo en el puerto "+ port)
})