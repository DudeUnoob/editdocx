const session = require('express-session')
const path = require('path')

function myDocuments (req, res, next) {
    if(!req.session.userid || !req.session.token) {
        
        return res.sendFile('notauthorized.html', { root: path.join(__dirname, '../views/404')})
    } else {
        return next()
    }


    
}

module.exports = myDocuments;