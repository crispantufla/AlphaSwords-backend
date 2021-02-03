const express = require('express');
const { book } = require('../mongo');
const models = require('../mongo');

const bookDataRouter = () => {
    const router = express.Router()

    router.use('/getbook/:id', async (req, res) => {
        return models.book.findById(req.params.id).populate('category', 'name').populate('user', 'nickname')
            .then(book => {
                res.status(200).send(book);
            }).catch(err => {
                res.status(500).send({ error: err })
            })
    });

    router.use('/getcategories/:id/:page', async (req, res) => {
        if (req.params.page < 0) {
            return res.status(404).send({ menssage: "that page does not exist"})
        }
        let limit = 18;
        let skip = (req.params.page -1) * limit;
        return models.category.findById(req.params.id).populate({path: 'books', options: { skip: skip, limit: limit}})
            .then(category => {
                res.status(200).send({category, limit});
            }).catch(err => {
                res.status(500).send({ error: err })
            })
    });

    router.use('/getcomments/:bookId', async (req, res) => {
        const bookId = req.params.bookId
        return models.comments.find({ 'book': bookId }).populate('user', 'nickname')
            .then(comments => {
                res.status(200).send(comments);
            }).catch(err => {
                res.status(500).send({ error: err })
            })
    });

    router.use('/checkfavs/:bookId/', async (req, res) => {
        const bookId = req.params.bookId;
        return models.favorite.find({ 'book': bookId })
            .then(favorite => {
                res.status(200).send(favorite)
            })
    });
    
    router.use('/searchbook/:namesearch/', async (req, res) => {
        const namesearch = req.params.namesearch;
        return book.find({ $text: {$search: namesearch} })
            .then(book => {
                res.status(200).send(book)
            })
    });

    return router;
};

module.exports = {
    bookDataRouter,
}
