const validator = require("validator")

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
  
  //Recgoer parametros por post a guardar
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

  //Asignar valores a objeto basado en el modelo (manual o automatico)

  //Guardar el articulo en la base de datos

  //Devolver resultado
  return res.status(200).json({
    mensaje: "Accion de crear",
    parameters
  })
}

module.exports = {
  test, curso, create
}