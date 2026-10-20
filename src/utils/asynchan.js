  
const asynca = (fn) => async (req, res, next) => {
  try{
    await fn(req, res, next);
  }
  catch(error) {
    const statusCode =
  error.statusCode >= 400 && error.statusCode <= 599
    ? error.statusCode
    : 500;

res.status(statusCode).json({
  success: false,
  message: error.message || "Internal server error",
});
  };
  
}

export {asynca}
