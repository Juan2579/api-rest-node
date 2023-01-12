const fs = require('fs');
const path = require("path")
const {validateArticle} = require("../helpers/validate")
const Article = require("../models/ArticleModel")

const create = (req, res) => {
  
  //Recoger parametros por post a guardar
  const parameters = req.body

  //Validar datos
  try {
    validateArticle(parameters)
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      mensaje: "Faltan datos por enviar"
    })
  }

  //Crear el objeto a guardar
  const article = new Article(parameters)//pasar parametros automaticamente

  //Asignar valores a objeto basado en el modelo (manual o automatico)
  //article.title = parameters.title forma manual
  
  //Guardar el articulo en la base de datos
  article.save((error, articleSaved) => {

    if(error || !articleSaved){
      return res.status(400).json({
        status: "error",
        mensaje: "No se ha guardado el articulo"
      })
    }

    //Devolver resultado
    return res.status(200).json({
      status: "success",
      mensaje: "Se ha guardado el articulo",
      article: articleSaved
    })
  })
}

const getArticles = (req, res) => {

  const consult = Article.find({});

  if(req.params.latest === "latest"){
    consult.limit(2)
  }else if(req.params.latest && req.params.latest !== "latest"){
    return res.status(404).json({
      status: "error",
      mensaje: "Parametro ingresado incorrecto"
    })
  }
  
  consult.sort({date: -1})
         .exec((error, filteredArticles) => {

    if(error || !filteredArticles){
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado articulos"
      })
    }

    return res.status(200).json({
      status: "success",
      totalArticles: filteredArticles.length,
      articles: filteredArticles
    })

  })

}

const getOneArticle = (req, res) => {
  //Recoger un id por la url
  const id = req.params.id

  //Buscar el articulo
  Article.findById(id, (error, article) => {
    //Si no existe devolver error
    if(error || !article){
      return res.status(404).json({
        status: "error",
        mensaje: "No se ha encontrado el articulo"
      })
    }

    //Devolver resultado
    return res.status(200).json({
      status: "success",
      article
    })

  })
}

const deleteArticle = (req, res) => {
  
  const idArticle = req.params.id

  Article.findOneAndDelete({_id: idArticle}, (error, articleDeleted) => {
    if(error || !articleDeleted){
      return res.status(400).json({
        status: "error",
        mensaje: "Error al borrar"
      })
    }

    //Devolver resultado
    return res.status(200).json({
      status: "success",
      mensaje: "Se ha borrado el articulo",
      article: articleDeleted
    })
  })
}

const editArticle = (req, res) => {

  //Recoger id articulo a editar
  const idArticle = req.params.id

  //Recoger datos del body
  const parameters = req.body

  //Validar datos
  try{
    validateArticle(parameters)
  } catch (error) {
    return res.status(400).json({
      status: "Error",
      mensaje: "Faltan datos por enviar"
    })
  }

  //Buscar y actualizar articulo
  Article.findOneAndUpdate({_id: idArticle}, parameters, {new: true}, (error, articleUpdated) => {

    if(error || !articleUpdated){
      return res.status(400).json({
        status: "error",
        mensaje: "Error al editar"
      })
    }
    
    //Devolver respuesta
    return res.status(200).json({
      status: "success",
      mensaje: "El articulo ha sido editado",
      articulo: articleUpdated
    })
  })
}

const uploadImage = (req, res) => {

  //Configurar multer

  //Validar que si se envió un archivo
  if(!req.file && !req.files){
    return res.status(400).json({
      status: "error",
      mensaje: "Peticion incompleta"
    })
  }

  //Nombre del archivo
  const fileName = req.file.originalname

  //Extension del archivo
  const fileNameSplit = fileName.split(".")
  const fileExtension = fileNameSplit[1]

  //Comprobar extension correcta
  if(fileExtension !== "png" 
      && fileExtension !== "jpg" 
      && fileExtension !== "jpeg" 
      && fileExtension !== "gif"){
    //Borrar archivo y dar respuesta
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Imagen invalida"
      })
    })
  }else{
    // SI todo va bien, actualizar el articulo

    //Recoger id articulo a editar
    const idArticle = req.params.id

    //Buscar y actualizar articulo
    Article.findOneAndUpdate({_id: idArticle}, {image: req.file.filename}, {new: true}, (error, articleUpdated) => {

      if(error || !articleUpdated){
        return res.status(400).json({
          status: "error",
          mensaje: "Error al editar"
        })
      }
      
      //Devolver respuesta
      return res.status(200).json({
        status: "success",
        mensaje: "El articulo ha sido editado",
        articulo: articleUpdated,
        file: req.file
      })
    })
  }
}

const getImage = (req,res) => {
  const file = req.params.file
  const routeFile = `./images/articles/${file}`

  fs.stat(routeFile, (error, exist) => {
    if(exist){
      return res.sendFile(path.resolve(routeFile))
    }else{
      return res.status(404).json({
        status: "error",
        mensaje: "La imagen no existe",
        file,
        routeFile
      })
    }
  })
}

const getQuerySearch = (req, res) => {
  //Sacar el string de busqueda
  const query = req.params.query
  //Find OR
  Article.find({
    "$or": [
      {"title": {"$regex": query, "$options": "i"}},
      {"content": {"$regex": query, "$options": "i"}},
    ]
    //Orden
  }).sort({date: -1})
  //Ejecutar consulta
    .exec((error, articlesFound) => {
      if(error || !articlesFound || articlesFound.length === 0){
        return res.status(404).json({
          status: "error",
          mensaje: "No se han encontrado articulos"
        })
      }

      //Devolver resultado
      return res.status(200).json({
        status: "success",
        articlesFound
      })
    })


}

module.exports = {
  create, getArticles, getOneArticle, deleteArticle, editArticle, uploadImage, getImage, getQuerySearch
}