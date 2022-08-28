var APIValidationError = require('./APIValidationError.js');

function formatErrorOutput(error){
  var errObj = {
    name: error.name,
    message: error.message
  };
  
  return JSON.stringify(errObj);
}

function handleError(e,res){

  var statusCode, responseBody;

  if(e.name === "ValidationError"){
    statusCode=400;
    responseBody= e;
  }
  else if(e.name === "FacebookApiException"){
    statusCode=400;
    responseBody= {name: e.name, message: e.response.error.message};
  }
  else{
    statusCode=500;
    responseBody=formatErrorOutput(e);
  }
  
  res.status(statusCode).set('Content-Type','application/json').send(responseBody);
}

module.exports = {
    APIValidationError: APIValidationError.APIValidationError,
    handleError: handleError
  };