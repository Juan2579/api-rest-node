const validator = require("validator")

const validateArticle = (parameters) => {
  const validateTitle = !validator.isEmpty(parameters.title) && validator.isLength(parameters.title, {min: 5, max: undefined})
  const validateContent = !validator.isEmpty(parameters.content)

  if(!validateTitle || !validateContent){
    throw new Error("No se ha validado la informacion !!")
  }
}

module.exports = {
  validateArticle
}