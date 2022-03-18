const express = require('express');
const bodyParser = require('body-parser');

//Database
const database = require('./database')

//Initialize Express
const booky = express();

booky.use(bodyParser.urlencoded({ extended: true }));
booky.use(bodyParser.json());

/*******GET*******/
/*
Route               /
Description         Get all the books
Access              PUBLIC
Parameter           NONE
Methods             GET
*/

booky.get('/', (req, res) => res.json({ books: database.books }));

/*
Route               /is
Description         Get specific book on ISBN
Access              PUBLIC
Parameter           isbn
Methods             GET
*/

booky.get('/is/:isbn', (req, res) => {
    const getSpecificBook = database.books.filter(book => book.ISBN == req.params.isbn);
    if (getSpecificBook.length === 0) {
        return res.json({ error: `No book found for ISBN of ${req.params.isbn}` });
    }

    return res.json({ book: getSpecificBook });
});

/*
Route               /l
Description         Get specific book based on language
Access              PUBLIC
Parameter           language
Methods             GET
*/

booky.get('/l/:language', (req, res) => {
    const getSpecificBook = database.books.filter(book => book.language.includes(req.params.language));
    if (getSpecificBook.length === 0) {
        return res.json({ error: `No book found for the language ${req.params.language}` });
    }

    return res.json({ book: getSpecificBook });
});

/*
Route               /all
Description         Get all the books based on category
Access              PUBLIC
Parameter           category
Methods             GET
*/

booky.get('/all/:category', (req, res) => {
    const getSpecificBook = database.books.filter(book => book.category.includes(req.params.category));
    if (getSpecificBook.length === 0) {
        return res.json({ error: `No book found for the category of ${req.params.category}` });
    }

    return res.json({ book: getSpecificBook });
});

/*
Route               /author
Description         Get all authors
Access              PUBLIC
Parameter           NONE
Methods             GET
*/

booky.get('/author', (req, res) => res.json({ authors: database.author }));

/*
Route               /author/id
Description         Get a specific author based on id
Access              PUBLIC
Parameter           id
Methods             GET
*/

booky.get('/author/id/:id', (req, res) => {
    const getSpecificAuthor = database.author.filter(author => author.id === parseInt(req.params.id));
    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `No author found for the id ${req.params.ids}` });
    }
    return res.json({ author: getSpecificAuthor });
});

/*
Route               /author/book
Description         Get all authors based on a book
Access              PUBLIC
Parameter           isbn
Methods             GET
*/

booky.get('/author/book/:isbn', (req, res) => {
    const getSpecificAuthor = database.author.filter(author => author.books.includes(req.params.isbn));
    if (getSpecificAuthor.length === 0) {
        return res.json({ error: `No author found for the book of ${req.params.isbn}` })
    }
    res.json({ authors: getSpecificAuthor });
});

/*
Route               /publications
Description         Get all publications
Access              PUBLIC
Parameter           NONE
Methods             GET
*/

booky.get('/publications', (req, res) => res.json({ publications: database.publications }));

/*
Route               /publications/id
Description         Get a specific publication based on id
Access              PUBLIC
Parameter           id
Methods             GET
*/

booky.get('/publications/id/:id', (req, res) => {
    const getSpecificPublication = database.publications.filter(publication => publication.id === parseInt(req.params.id));
    if (getSpecificPublication.length === 0) {
        return res.json({ error: `No publication found for the id ${req.params.ids}` });
    }
    return res.json({ author: getSpecificPublication });
});

/*
Route               /publications/book
Description         Get a specific publication based on a book
Access              PUBLIC
Parameter           isbn
Methods             GET
*/

booky.get('/publications/book/:isbn', (req, res) => {
    const getSpecificPublication = database.publications.filter(publication => publication.books.includes(req.params.isbn));
    if (getSpecificPublication.length === 0) {
        return res.json({ error: `No publication found for the book ${req.params.isbn}` });
    }
    return res.json({ author: getSpecificPublication });
});

/*******POST*******/

/*
Route               /book/new
Description         Add new books
Access              PUBLIC
Parameter           NONE
Methods             POST
*/

booky.post('/book/new', (req, res) => {
    const newBook = req.body;
    database.books.push(newBook);
    return res.json({ updatedBooks: database.books })
});

/*
Route               /author/new
Description         Add new authors
Access              PUBLIC
Parameter           NONE
Methods             POST
*/

booky.post('/author/new', (req, res) => {
    const newAuthor = req.body;
    database.author.push(newAuthor);
    return res.json({ updatedAuthor: database.author })
});

/*
Route               /publication/new
Description         Add new publications
Access              PUBLIC
Parameter           NONE
Methods             POST
*/

booky.post('/publication/new', (req, res) => {
    const newPublication = req.body;
    database.publications.push(newPublication);
    return res.json(database.publications);
})

/*******PUT*******/

/*
Route               /publication/update/book
Description         Update / Add new publications
Access              PUBLIC
Parameter           isbn
Methods             PUT
*/

booky.put('/publication/update/book/:isbn', (req, res) => {
    //Update the publications database
    database.publications.forEach((pub) => {
        if (pub.id === req.body.pubId) {
            return pub.books.push(req.params.isbn);
        }
    });
    //Update the books database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });
    return res.json(
        {
            books: database.books,
            publications: database.publications,
            message: 'Successfully updated publications'
        }
    );
});

/*******DELETE*******/

/*
Route               /book/delete
Description         Delete a book
Access              PUBLIC
Parameter           isbn
Methods             DELETE
*/

booky.delete('/book/delete/:isbn', (req, res) => {
    //whichever book doesn't match with isbn just send it to updated database and rest will be filtered out...
    const updatedBookDatabase = database.books.filter(book => book.ISBN !== req.params.isbn);
    database.books = updatedBookDatabase;

    return res.json({ books: database.books });
});

/*
Route               /author/delete
Description         Delete an author
Access              PUBLIC
Parameter           id
Methods             DELETE
*/

booky.delete('/author/delete/:id', (req, res) => {
    const updatedAuthorDatabase = database.author.filter(author => author.id !== parseInt(req.params.id));
    database.author = updatedAuthorDatabase;
    return res.json({ authors: database.author });
});

/*
Route               /book/delete/author
Description         Delete an author
Access              PUBLIC
Parameter           isbn, authorId
Methods             DELETE
*/

booky.delete('/book/delete/author/:isbn/:authorId', (req, res) => {
    //update the books database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(eachAuthor => eachAuthor !== parseInt(req.params.authorId));
            book.author = newAuthorList;
            return;
        }
    });

    //update the author database
    database.author.forEach(eachAuthor => {
        if (eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.books.filter(book => book !== req.params.isbn);
            eachAuthor.books = newBookList;
            return;
        }
    });

    return res.json(
        {
            book: database.books,
            author: database.author,
            message: 'Author was Deleted!!!'
        }
    );

});

booky.listen(3000, () => {
    console.log('Server is up and running on port 3000...');
});