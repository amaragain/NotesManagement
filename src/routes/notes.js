const log = require('../../logger/winston');
const Notes = require("./../models/Notes")

const errHandler = (err, res) => {
    log.error(err)
    // Basic error handling for duplicate entries
    let errorMessage = (err['original']['code'] && err['original']['code'] == 'ER_DUP_ENTRY') ? 'Email already exists. Try with another email.' : 'Server Error'
    let errorStatus = (err['original']['code'] && err['original']['code'] == 'ER_DUP_ENTRY') ? 409 : 500

    res.status(errorStatus).send(errorMessage)
}



exports.getAllNotes = async (req, res) => {

    log.info(`API request to GET ALL notes`)

    Notes.findAll()
        .then((notes) => {
            res.send(notes)
        })
        .catch((err) => {
            errHandler(err, res)
        })

}

exports.getNote = async (req, res) => {

    let noteId = req.params.noteId;

    log.info(`API request to GET note | NoteId: ${noteId}`)

    Notes.findAll({
        where: { id: noteId }
    })
        .then((notes) => {
            res.send(notes)
        })
        .catch((err) => {
            errHandler(err, res)
        })

}



exports.createNote = async (req, res) => {

    if (!req.body.note || !req.body.userId) {
        log.error(`Bad Request | Note: ${JSON.stringify(req.body)}`)
        res.status(400).send('Bad Request')
    }

    let note = {
        note: req.body.note,
        userId: req.body.userId,
    }

    log.info(`API request to CREATE note | Note: ${JSON.stringify(req.body)}`)

    Notes.create(note)
        .then((notes) => {
            res.send(notes)
        })
        .catch((err) => {
            errHandler(err, res)
        })
}




exports.updateNote = async (req, res) => {

    let noteId = req.params.noteId

    if (!req.body) res.status(400).send('Bad Request')

    log.info(`API request to UPDATE note | NoteId: ${noteId}`)

    Notes.update(req.body, {
        where: {
            id: noteId
        }
    })
        .then((notes) => {
            res.send(notes)
        })
        .catch((err) => {
            errHandler(err, res)
        })
}


exports.deleteNote = async (req, res) => {

    let noteId = req.params.noteId;

    if (!noteId) res.status(400).send('Bad Request')

    log.info(`API request to DELETE note | NoteId: ${noteId}`)

    Notes.destroy({
        where: { id: noteId }
    })
        .then((result) => {
            if (result == 1) res.status(200).send('Success')
            else res.status(404).send('Note does not exists')

        })
        .catch((err) => {
            console.log(err)
            errHandler(err, res)
        })

}



exports.getNoteByUser = async (req, res) => {

    let userId = req.params.userId;
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    console.log(limit, offset)

    log.info(`API request to GET notes by user | UserId: ${userId}`)

    Notes.findAndCountAll({
        where: { userId: userId }, 
        limit, 
        offset
    })
        .then((notes) => {
            // console.log(notes)
            const data = getPagingData(notes, page, limit);
            res.send(data)
        })
        .catch((err) => {
            errHandler(err, res)
        })

}


// Set limit and offset before fetching table data
const getPagination = (page, size) => {
    const limit = size ? +size : 5;
    const offset = page ? page * limit : 0;
    return { limit, offset };
};

// Get data with Pagination details 
const getPagingData = (data, page, limit) => {
    console.log(data)
    const { count: totalItems, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, items, totalPages, currentPage };
};

