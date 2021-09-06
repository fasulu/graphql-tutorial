const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

const portNum = 3500;

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