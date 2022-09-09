const session = require('express-session')
const path = require('path')

function myDocuments (req, res, next) {
    // if(!req.session.userid || !req.session.token) {
        
    //     return res.sendFile('notauthorized.html', { root: path.join(__dirname, '../views/404')})
    // } else {
    //     return next()
    // }


    let token = req.body.token || req.session.token || req.session.userid

    if(!token){

        return res.sendFile('notloggedin.html', { root: path.join(__dirname, '../views/404')})
    } else {
        try{
            let decrypt = jwt.verify(token, 'helloworld')

        req.user = decrypt;
        }
        catch(e) {
            req.session.destroy()
            return res.status(400).send('session has expired <a href=/login>Login Again</a>')
        }
        
        return next();
    }
}

module.exports = myDocuments;