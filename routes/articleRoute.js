const express = require("express")
const router = express.Router()

const ArticuloController = require("../controllers/articleController")

//Rutas de prueba
router.get("/ruta-de-prueba", ArticuloController.test)
router.get("/curso", ArticuloController.curso)

//Ruta util
router.post("/create", ArticuloController.create)







module.exports = router