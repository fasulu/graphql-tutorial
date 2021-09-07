const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/author');

const { GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQL } = graphql;

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
        
        return Author.findById(parent.authorId);
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
        
        return Book.find({authorId:parent.id})
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

        return Book.findById(args.id);
      }
    },

    // query for one author

    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        
        return Author.findById(args.id);
      }
    },

    // query for multiple books

    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return books
        return Book.find({});
      }
    },

    // query for multiple authors

    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors
        return Author.find({})
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
        name: { type: new GraphQLNonNull(GraphQLString)},
        age: { type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args) {
        let author = new Author({     //  "Author" is Author model which is imported above
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString)},
        genre: { type: new GraphQLNonNull(GraphQLString)},
        authorId:{type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args) {
        let book = new Book({         //  "Book" is Book model which is imported above
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
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
  book(id: 1) {
    name
    author {
      name
      books{
        name
      }
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