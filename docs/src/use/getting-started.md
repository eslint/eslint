const mongoose = require('mongoose');
require('dotenv').config();

const DB =
'mongodb+srv://Kamran:kamran1122@cluster0.49bhjhk.mongodb.net/HarvestMate?retryWrites=true&w=majority';

mongoose
.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connection successful');
   
  })
  .catch((err) => {
    console.log('Connection failed', err);
  });

