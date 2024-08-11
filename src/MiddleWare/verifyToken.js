const jwt = require("jsonwebtoken");
const ErrorHandler = require("../Utils/error.js");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Access the token from cookies
  console.log(token);

  if (!token) {
    return next(ErrorHandler(401, 'You need to provide credentials before accessing this page.'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.id = decoded.id; // Attach the decoded user info to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    return next(ErrorHandler(403, 'Invalid token')); // Handle token verification errors
  }
};

module.exports = verifyToken;




