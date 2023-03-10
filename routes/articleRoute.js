const express = require("express")
const multer = require("multer")

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/articles")
  },
  filename: (req, file, cb) => {
    cb(null, "article" + Date.now() + file.originalname)
  }
})

const uploads = multer({storage: storage})

const ArticuloController = require("../controllers/articleController")

//Rutas
router.get("/articles/:latest?", ArticuloController.getArticles)
router.get("/article/:id", ArticuloController.getOneArticle)
router.get("/search/:query", ArticuloController.getQuerySearch)
router.get("/image/:file", ArticuloController.getImage)
router.post("/create", ArticuloController.create)
router.post("/upload-image/:id", [uploads.single("file0")], ArticuloController.uploadImage)
router.delete("/article/:id", ArticuloController.deleteArticle)
router.put("/article/:id", ArticuloController.editArticle)

module.exports = router