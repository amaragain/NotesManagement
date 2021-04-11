require('dotenv').config()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const log = require('../../logger/winston');
const Users = require("./../models/Users")
const Tokens = require("./../models/Tokens")


const passwordOptions = {
    length: 12,
    symbols: false,
    uppercase: true,
    excludeSimilarCharacters: true,
    numbers: true,
    strict: true,
    exclude: ".,;<>"
}

const errHandler = (err, res) => {
    log.error(err)

    res.status(500).send('Server Error')
}

// JWT Verification
exports.authorize = function (req, res, next) {

    const accessToken = req.header('access-token')
    const refreshToken = req.header('refresh-token')

    if (!accessToken || !refreshToken) {
        log.error(`Access denied | Tokens Missing`)
        return res.status(401).send('Access Denied!')
    }

    verifyAccessToken({ accessToken, refreshToken })
        .then(data => {
            res.header('access-token', data)
            next()
        })
        .catch(err => {
            res.status(err).send('Access Denied!')
        })

}

// Token
exports.token = (req, res) => {

    const refreshToken = req.header('refresh-token')
    if (refreshToken == null) return res.sendStatus(401)
    
    Tokens.findOne({
        where: { refreshToken }
    })
        .then((data) => {
            if(!data) {
                res.sendStatus(403)
            }
            // const responseData = {accessToken: accessToken}
            updateToken(userId, refreshTkn)
            .then(() => {
                res.send(data)
            })
        })
        .catch((err) => {
            errHandler(err, res)
        })

}



// LOGIN
exports.login = async (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        res.status(400).send('Bad Request')
        return
    }

    log.info(`Login attempt foer user | Email: ${email}`)

    Users.findAll({
        where: { email }
    })
        .then((users) => {

            if (users.length > 0) {

                bcrypt.compare(password, users[0].password, function (err, result) {
                    if (result) {

                        log.info(`Successfull login | Email: ${email}`)

                        const userId = users[0]['id']
                        updateToken(userId)
                            .then((data) => {
                                res.status(200).send({ userId: users[0]['id'], accessToken: data.accessToken, refreshToken: data.refreshToken })
                            })
                            .catch(err => {
                                log.error(err)
                                res.status(500).send(err)
                            })
                    }
                    else {

                        log.info(`Failed login | Email: ${email}`)
                        res.status(401).send('Unauthorized')
                    }
                })


            }
            else {
                log.info(`Failed login | Email: ${email}`)
                res.status(401).send('Unauthorized')
            }
        })
        .catch((err) => {
            errHandler(err, res)
        })

}



// REGISTER
exports.register = async (req, res) => {

    if (!req.body.email || !req.body.password) {
        log.error(`Bad request | ${JSON.stringify(req)}`)
        res.status(400).send('Bad Request')
        return
    }

    bcrypt.hash(req.body.password, 10, function (err, passwordHash) {
        if (err) {
            log.error(err)
            res.status(500).send('Server error')
        } else {
            // return hash

            let user = {
                name: req.body.name,
                email: req.body.email,
                password: passwordHash
            }

            log.info(`Registering a new user | Email: ${req.body.email}`)
            console.log(user, passwordHash)
            Users.create(user)
                .then((users) => {
                    res.status(200).send(users)
                })
                .catch((err) => {
                    errHandler(err, res)
                })


        }
    })



}


// Logout
exports.logout = async (req, res) => {

    if (!req.body.userId) {
        res.status(400).send('Bad Request')
        return
    }

    deleteToken(req.body.userId)
        .then((data) => {
            res.status(200).send('Success')
        })
        .catch(err => {
            log.error(err)
            res.status(500).send(err)
        })
}


// Update the refresh token in database everytime an user logs in or logs out
function updateToken(userId, refreshTkn = '') {
    return new Promise((resolve, reject) => {

        const user = { userId }
        const accessToken = generateAccessToken(user)

        const refreshToken = !refreshTkn ? jwt.sign(user, process.env.REFRESH_TOKEN_SECRET) : refreshTkn

        Tokens.upsert({ accessToken, refreshToken, userId })
            .then((data) => {
                resolve({ userId, accessToken, refreshToken })
            })
            .catch((err) => {
                reject(err)
            })

    })
}

function deleteToken(userId) {
    return new Promise((resolve, reject) => {

        console.log('accessToken ===>> ', userId)
        const user = { userId }
        const accessToken = generateAccessToken(user)

        console.log('accessToken ===>> ', userId, accessToken)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

        Tokens.upsert({ accessToken, refreshToken, userId })
            .then((data) => {
                resolve({ userId, accessToken, refreshToken })
            })
            .catch((err) => {
                reject(err)
            })

    })
}


function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRY }) // Access Token expiry set to 15 mins
}




function verifyAccessToken(tokens) {
    return new Promise((resolve, reject) => {

        const { accessToken, refreshToken } = tokens

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, data) => {

            if (err) {

                log.error(`invalid AccessToken  | ${err}`)

                verifyRefreshToken(refreshToken)
                    .then(response => {
                        resolve(response)
                    })
                    .catch(errorCode => {
                        console.log('ERRR2 ', errorCode)
                        reject(errorCode)
                    })

            }
            else {
                console.log('ERRR3 ', accessToken)
                resolve(accessToken)
            }
            // const accessToken = generateAccessToken({ userId: data.userId })
            // res.json({ accessToken: accessToken })

        })
    })
}


function verifyRefreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
            if (err) {
                log.error(`invalid refreshToken  | ${err}`)
                reject(403)
            } else {
                const accessToken = generateAccessToken({ userId: data.userId })
                resolve(accessToken)
            }
        })
    })
}