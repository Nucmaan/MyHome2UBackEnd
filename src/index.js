require('dotenv').config()
const app = require('./app.js');
const connectDb = require('./DbConfig/DbConfig.js');

app.get('/', (req, res) => {
  res.send('Hello World!');
});


const PORT = process.env.PORT || 5001;

connectDb()
.then(()=>{
    app.listen(PORT,()=>{
        console.log('Connected to the database');
        console.log(`Server is running on port ${PORT}`); 
    })
})
.catch((err)=>{
    console.error('Error connecting to the database:', err);
    process.exit(1); 
  });


// Optionally, add error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
