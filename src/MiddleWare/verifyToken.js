const jwt = require("jsonwebtoken");
const ErrorHandler = require("../Utils/error.js");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; 

  if (!token) {
    return next(ErrorHandler(401, 'You need to provide credentials before accessing this page.'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.id = decoded.id; 
    next(); 
  } catch (err) {
    return next(ErrorHandler(403, 'Invalid token')); 
  }
};

module.exports = verifyToken;




