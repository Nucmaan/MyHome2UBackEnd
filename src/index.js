require("dotenv").config();
const app = require("./app.js");  
const connectDb = require("./DbConfig/DbConfig.js");


const PORT = process.env.PORT || 5001;

// Connect to the database and start the server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Connected to the database");
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  });
