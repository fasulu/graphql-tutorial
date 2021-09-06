const graphql = require('graphql');
const lodash = require('lodash');       // uitility tool library

const Book = require('../models/book');
const Author = require('../models/author');

const { GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList } = graphql;

  // https://www.youtube.com/watch?v=H8oRezNak2s&list=PL4cUxeGkcC9iK6Qhn-QLcXCXPQUov1U7f&index=19

// declare schema type for books

const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },

    // create a relationship with author for each book

    author: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        // return lodash.find(authors, { id: parent.authorId });
      }
    }
  })
});

// declare schema type for authors

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },

    // create a relationship with book for each author

    book: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        console.log(parent);
        // return lodash.filter(books, { authorId: parent.id });
      }
    }
  })
});

// create root query for graphql

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {

    // query for one book

    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {

        // code here to get data from db or other source
        // return lodash.find(books, { id: args.id });
      }
    },

    // query for one author

    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {

        // code here to get data from db or other source
        // return lodash.find(authors, { id: args.id });
      }
    },

    // query for multiple books

    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books
      }
    },

    // query for multiple authors

    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors
      }
    }
  }
});

// Mutation (add new data into the collection)

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre
        });
        return book.save();
      }
    }
  },
})

// export the schema

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})



{/*

How to add new data through browser

mutation{
  addAuthor(name:"Sandilyan", age:80){
    name
    age
  }
}

*********

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