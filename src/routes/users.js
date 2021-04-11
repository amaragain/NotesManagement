const log = require('../../logger/winston');
const Users = require("./../models/Users")

const errHandler = (err, res) => {
    log.error(err)

    let errorMessage = (err['original']['code'] == 'ER_DUP_ENTRY') ? 'Email already exists. Try with another email.' : 'Server Error'
    let errorStatus = (err['original']['code'] == 'ER_DUP_ENTRY') ? 409 : 500

    res.status(errorStatus).send(errorMessage)
}



exports.getAllUsers = async (req, res) => {

    log.info(`API request to GET ALL users`)

    Users.findAll()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            errHandler(err, res)
        })

}

exports.getUser = async (req, res) => {

    let userId = req.params.userId;

    log.info(`API request to GET user | UserId: ${userId}`)

    Users.findAll({
        where: { id: userId }
    })
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            errHandler(err, res)
        })

}




exports.updateUser = async (req, res) => {

    let userId = req.params.userId

    if (!req.body) res.status(400).send('Bad Request')

    log.info(`API request to UPDATE user | UserId: ${userId}`)

    Users.update(req.body, {
        where: {
            id: userId
        }
    })
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            errHandler(err, res)
        })
}


exports.deleteUser = async (req, res) => {

    let userId = req.params.userId;

    if (!userId) res.status(400).send('Bad Request')

    log.info(`API request to DELETE user | UserId: ${userId}`)

    Users.destroy({
        where: { id: userId }
    })
        .then((result) => {
            if (result == 1) res.status(200).send('Success')
            else res.status(404).send('User does not exists')

        })
        .catch((err) => {
            console.log(err)
            errHandler(err, res)
        })

}



