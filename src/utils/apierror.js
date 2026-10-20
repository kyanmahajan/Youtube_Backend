 class apierror extends Error {

     constructor(
        statusCode, 
        message = "something went wrong",
        error = [],
        stack = ""
     ){ 
        super(message)
        this.statusCode = statusCode
        this.data =  null
        this.message = message
        this.errors = error
        if (stack) this.stack = stack
     }

 
 }


 export {apierror}
