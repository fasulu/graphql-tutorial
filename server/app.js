const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

// const portNum = 3501;
const portNum = config.port
const mongoUrl = config.mongoURL

mongoose.connect(mongoUrl, { useNewUrlParser: true})
.then(() =>  console.log('Connected with mLab server database'))
.catch(err => console.log(err))

// mongoose.connect('mongodb+srv://graphql-tutorial:<password>@cluster0.uvdug.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
// mongoose.connection.once('open', () =>{
//   console.log("connected to database");
// });

app.use('/myquery', graphqlHTTP({
    schema,
    graphiql: true      // this will activate graphical interface in browser to do queries
}));

app.listen(portNum, () => {
    console.log(`Listening for request in port ${portNum}`);
});

{/*

How to use query format in the browser

{
    book(id:1) {
      name

    }
}

*******

{
    author(id:1) {
      name

    }
}

*******

{
  author(id: 1) {
    name
    book {
      name
    }
  }
}

*******

{
  book(id: 1) {
    name
    author {
      name
    }
  }
}

*******

{
  books {
    name
    author {
      name
    }
  }
}

*******

{
  authors {
    name
    book {
      name
    }
  }
}

*/}