const express = require('express')
const models = require('../mongo');

const bookDataRouter = () => {
    const router = express.Router()

    router.use('/getbook/:id', async (req, res) => {
        return models.book.findById(req.params.id).populate('category', 'name').populate('user', 'nickname')
            .then(result => {
                res.status(200).send(result);
            }).catch(err => {
                res.status(500).send({ error: err })
            })
    });

    router.use('/getcategorys', async (req, res) => {
        return models.category.find(req.query).populate('books')
            .then(result => {
                res.status(200).send(result);
            }).catch(err => {
                res.status(500).send({ error: err })
            })
    });

    router.use('/getcomments/:bookId', async (req, res) => {
        const bookId = req.params.bookId
        return models.comments.find({ 'book': bookId }).populate('user', 'nickname')
            .then(result => {
                res.status(200).send(result);
            }).catch(err => {
                res.status(500).send({ error: err })
            })
    });

    router.use('/checkfavs/:bookId/', async (req, res) => {
        const bookId = req.params.bookId;
        return models.favorite.find({ 'book': bookId })
            .then(result => {
                res.status(200).send(result)
            })
    });
    
    return router;
};

module.exports = {
    bookDataRouter,
}
