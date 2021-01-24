const express = require('express');
const { book } = require('../mongo');
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

    router.use('/getcategorys/:id/:page', async (req, res) => {
        let skip = (req.params.page -1) * 5;
        return models.category.findById(req.params.id).populate({path: 'books', options: { skip: skip, limit: 5}})
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
    
    router.use('/searchbook/:namesearch/', async (req, res) => {
        const namesearch = req.params.namesearch;
        console.log(namesearch)
        return book.find({ 'title': namesearch })
            .then(result => {
                res.status(200).send(result)
            })
    });

    return router;
};

module.exports = {
    bookDataRouter,
}
