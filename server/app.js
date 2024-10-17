const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./src/routes/api');
require('dotenv').config(); 

const app = express();


app.use(cors());
app.use(express.json());
const dbURI = "mongodb+srv://vipransh:vipr123@cluster0.xlbuw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("My DB is Connected");
})
.catch((error) => {
  console.log("Some error occurred", error);
});;

// Routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
