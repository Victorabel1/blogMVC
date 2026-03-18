require('dotenv').config();
const connectDB = require('./src/config/connectDB.js');
const app = require('./src/app.js');



const PORT = process.env.PORT;
app.listen(PORT, async ()=>{
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});