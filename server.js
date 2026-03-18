require('dotenv').config();
const config = require('./src/config/env.config.js'); 
const connectDB = require('./src/config/connectDB.js');
const app = require('./src/app.js');



const PORT = config.PORT;
app.listen(PORT, async ()=>{
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});