function APIValidationError(message){
    this.name = 'ValidationError';
    this.message = message; 
  }
  
  module.exports = {
      APIValidationError: APIValidationError
  };