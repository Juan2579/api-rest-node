const validator = require("validator")
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
    const validateTitle = !validator.isEmpty(parameters.title) && validator.isLength(parameters.title, {min: 5, max: undefined})
    const validateContent = !validator.isEmpty(parameters.content)

    if(!validateTitle || !validateContent){
      throw new Error("No se ha validado la informacion !!")
    }
    
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

module.exports = {
  test, curso, create, getArticles, getOneArticle
}