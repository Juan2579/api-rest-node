const fs = require('fs');
const {validateArticle} = require("../helpers/validate")
const Article = require("../models/ArticleModel")

const test = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una accion de prueba en mi controlador de articulos"
  })
}

const curso = (req, res) => {
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
}

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
  
    //Devolver respuesta
  
    return res.status(200).json({
      status: "success",
      mensaje: "Ruta de subir archivos",
      fileNameSplit,
      fileExtension,
      file: req.file
    })
  }

}

module.exports = {
  test, curso, create, getArticles, getOneArticle, deleteArticle, editArticle, uploadImage
}