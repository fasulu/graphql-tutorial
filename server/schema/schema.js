const graphql = require('graphql');
const lodash = require('lodash');       // uitility tool library

const { GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList } = graphql;

// dummy datas for books and authors

var books = [
    { name: 'Name of the wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'The Samurai', genre: 'Fantasy', id: '4', authorId: '2' },
    { name: 'The Hero of Ages', genre: 'Fantasy', id: '5', authorId: '3' },
    { name: 'The Colour of Magic', genre: 'Fantasy', id: '6', authorId: '1' },
    { name: 'The Light fantastic', genre: 'Fantasy', id: '7', authorId: '1' }

];

var authors = [
    { name: 'Patrick', age: 45, id: '1', bookId: '3' },
    { name: 'Brandon', age: 46, id: '2', bookId: '2' },
    { name: 'Terry', age: 47, id: '3', bookId: '1' }
];

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
                return lodash.find(authors, { id: parent.authorId });
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
                return lodash.filter(books, { authorId: parent.id });
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
                return lodash.find(books, { id: args.id });
            }
        },

        // query for one author
        
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {

                // code here to get data from db or other source
                return lodash.find(authors, { id: args.id });
            }
        },

        // query for multiple books
        
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                return books
            }
        },

        // query for multiple authors

        authors:{
            type:new GraphQLList(AuthorType),
            resolve(parent, args) {
                return authors
            }
        }
    }
});

// export the schema

module.exports = new GraphQLSchema({
    query: RootQuery
})



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