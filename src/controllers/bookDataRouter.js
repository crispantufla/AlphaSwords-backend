const express = require('express');
const { book, score } = require('../mongo');
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

    //FAVS

    router.use('/checkfavs/:bookId/', async (req, res) => {
        const bookId = req.params.bookId;
        return models.favorite.find({ 'book': bookId })
            .then(favorite => {
                res.status(200).send(favorite)
            })
    });

    //Search
    
    router.use('/searchbook/:namesearch/', async (req, res) => {
        const namesearch = req.params.namesearch;
        return book.find({ $text: {$search: namesearch} })
            .then(books => {
                if (books.length > 0) {
                    res.status(200).send({books: books});
                } else {
                    res.status(200).send({menssage: "no result data"});
                }
            }).catch((err) => {
                res.status(500).send({error: err})
            })
    });

    //Score

    router.use('/checkuserscore/:bookId', async (req, res) => {
        const userScore = await models.score.findOne({ 'user': req.user.id, 'book': req.params.bookId });
        
        if (userScore) { 
            return res.status(200).send({ userScore: userScore.userScore });
        }

        return res.status(200).send({ userScore: 3 });
    });

    router.use('/savescore2', async (req, res) => {
        return models.score.find({ user: req.body.user, book: req.body.book }).then(scores => {
        
        if (scores.length == 0) {
            const score = new models.score(req.body);
            return score.save().then(() => {
                res.status(200);
            }).catch(err => {
                res.status(500).send({ error: err });
            })
        }

        return score.update(
            { user: req.body.user, book: req.body.book },
            { $set: { userScore: req.body.userScore } },
            { 'new': true }
            ).then(newScore => {
                res.status(200).send({userScore: newScore.userScore});
            }).catch(err => {
                res.status(500).send({ error: err });
            })
        })
    });

    router.use('/savescore', async (req, res) => {
        const scores = await models.score.find({ user: req.body.user, book: req.body.book });
        
        if (scores.length == 0) {
            const score = new models.score(req.body);
            return score.save().then(() => {
                res.status(200);
            }).catch(err => {
                res.status(500).send({ error: err });
            })
        }

        return score.update(
            { user: req.body.user, book: req.body.book },
            { $set: { userScore: req.body.userScore } },
            { 'new': true }
            ).then(newScore => {
                res.status(200).send({userScore: newScore.userScore});
            }).catch(err => {
                res.status(500).send({ error: err });
            })
    });

    return router;
};

module.exports = {
    bookDataRouter,
}
