const express = require('express')
const app = express();
const session = require('express-session');
const http = require('http')
const server = http.createServer(app);
const { Server } = require('socket.io')
const io = new Server(server);
const path = require('path');
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const auth = require('./middleware/auth')
const userdb = require('./models/userdb');
const CloudConvert = require('cloudconvert')
const cloudConvert = new CloudConvert('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMWUwMzIyZTNjMWZlZGNjZWZlNzIzYzdmZTc0MmRmNWY4YzA3MzVkZThhOTMwNDJhZGMyODlmMTVkOWE5OGI4NzE1Y2VlYTlmYjcyYmE3NDYiLCJpYXQiOjE2NjE3MTIxMjAuMDY1MTM1LCJuYmYiOjE2NjE3MTIxMjAuMDY1MTM3LCJleHAiOjQ4MTczODU3MjAuMDYwODM5LCJzdWIiOiI1OTUxMzk1OCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.ACbVaCaVz4rFqCeAJLQvr4NzsExXt4CLHHYEEZ878_8u0OtR7HvTxq8g2j1TfdC5a2vu64l90wL0YRhk0C3B7zknXb5l36_nYcgEqBR-SkdDUqT4yALbMcEz83iHNZytlmsiRCVoR4oVkbqE4k6HVNRDQ3GtRQLmo4-wmMSoLtdJhjYMpOwZf0ebktqqihwLqqxZpyyzKEesX7O65HfEgzFYiGBwvVu4NP71VCSH9T2z8yFuiXAoXHRrQgenABdEXi1_ImmK1mIUd61a1_6V6BKXqsVuQ3ThiF3w1UnDfGJveKoalnI1lCMBX0-a99n1dzilsVMwvCtiNZasA2NJDU04_JAvIqN8uo5M743mEVRoS2OBBgvAmJmpezm_270KBp9GpKyUYGgSB9uTkwCXlkhO_vyYcUxy845QcTGYG9dKqrMh2I3ul4q-rK-xL3b3XrKwr-f6n_ZtN1YwKP-0nKSVuSr7oJO1AAygGOsTnpT9dgSkJfWLVrYlFeDFwh1CIOIYclasLXkPiET0_mTzNqs2tgTZ2Y8YDjK9-BDxh51QUKD0k84uGK7ePpa-wIjeAqrRLpYT8OBrAWmWmw7SuEF2QkJbN7LvOlbOHdGVwtrDd6qWyn3iVtrsXRtnaI0mFT8O9YNtNuEnfUnFJCTrXHrkfjjPDRnmIZRy-h2uN4E')
const Document = require('./models/document');
const SharedDocument = require('./models/shareddocuments');
const myDocuments = require('./middleware/mydocuments');
const bcrypt = require('bcryptjs')
const { v4: uuidV4 } = require('uuid');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("253747450477-kplgcppb6u51jtq0vfe06sbahmmveamq.apps.googleusercontent.com");
const  checkLogin  = require('./middleware/checklogin')
app.use(express.json())
app.set("view engine", "ejs");
//app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret:'helloworld',
    resave: false,
    saveUninitialized: true,
}))
const router = require('./public/routes/routes')


app.use(router)

app.get('/', (req, res) => {
    //res.sendFile('index.html', { root: path.join(__dirname, './views')})
    res.render('index')
})

app.get('/login', checkLogin,(req, res) => {
    //res.sendFile('login.html', { root: path.join(__dirname, './views')})
    res.render('login')
})
let finalUsername;

app.post('/login', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let checkUser = await userdb.findOne({ username: username }).distinct('password')

    bcrypt.compare(password, checkUser[0], function(err, result) {
        if(result == true){
            let token = jwt.sign(
                { user: username },
                'helloworld',
                {
                    expiresIn:"1h"
                }
            )
            req.session.token = token;
            req.session.userid = username;
            
            finalUsername = username;
            // session.token = token;
            // session.userid = username;

            if(req.session.redirectdocument){
                return res.redirect(req.session.redirectdocument);
            } else {
            return res.redirect('/')

            }
        }
    })
})

app.get('/signup', (req, res) => {
    //res.sendFile('signup.html', { root: path.join(__dirname, './views')})
    res.render('signup')
})

app.post('/signup', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let testUser = await userdb.findOne({ username: username })

    if(testUser){
        return res.status(400).send("Already a user with this username. <a href=/signup>Go Back</a>")
    } else {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(password, salt, async function(err, hash) {
                await userdb.create({
                    username: username,
                    password: hash
                })
                    
                return res.send("successfully signed up. <a href=/>Go Home</a>")
            })
        })
    }

})

app.get('/document', auth,  (req, res) => {

    res.redirect(`/document/${uuidV4()}`) //issue is causing this redirect!
})

    // app.get('/randomid', (req, res) => {
    //     res.send({ id: uuidV4()})
    // })

app.get('/document/:docs',  async(req, res) => {
    //res.sendFile('room.html', { root: path.join(__dirname, './views')})
        
        res.render('room', { roomId: req.params.docs })

    
})

app.get('/logout', auth, (req, res) => {
   req.session.destroy()

    res.send('<a href=/>Successfully logged out</a>')
})

app.get('/test',  (req, res) => {
    if(!req.session.userid){
        res.json("not logged in")
    } else {
        res.json(req.session.userid)
    }
})

io.on('connection', (socket) => {
    let identification;
    socket.on('connected-document', async(id, userId) => {
        let findDocument = await Document.findOne({ documentId: id })
        if(!findDocument){
            Document.create({
                documentId: id,
                owner: userId
            })
            identification = id;
            socket.join(identification)
        } else {
            socket.join(id)
            let newDocument = await Document.findOne({ documentId: id }).select('documentdata')
            identification = id
            //console.log(newDocument)
            
                socket.emit('new-document', newDocument, userId)
            let emptyArrayUsers = []
            let findOwnerDoc = await Document.findOne({ documentId: id }).distinct('owner');
            let findSharedUsers = await SharedDocument.findOne({ shareduser: userId, documentId: id })
            let findDocTitle = await Document.findOne({ documentId: id }).distinct('title');
            if(findSharedUsers)
            {
                return
            
            }
            if(findOwnerDoc[0] === userId){
                return
            } 
            else {
                    await SharedDocument.create({ shareduser: userId, documentId: id, owner: findOwnerDoc[0], title: findDocTitle[0]})
             }
            
                // let filteringUsers = await Document.findOne({ documentId: id }).distinct('sharedusers');

                // console.log(filteringUsers)

                // if(filteringUsers.length == 0){
                //     await Document.findOneAndUpdate({ documentId: id }, { sharedusers: filteringUsers.concat([finalUsername])})
                // }

                // filteringUsers.map(async(elm ,i )=> {
                //     if(elm === finalUsername){
                //         return;
                //     } else {
                //         await Document.findOneAndUpdate({ documentId: id }, {sharedusers: filteringUsers.concat([finalUsername])})
                //     }
                // })
            }
    })
    socket.on('send-changes', (data) => {
        //console.log(data.documentId, data.text.ops)
        let id = data.documentId;
        let delta = data.delta;
        let documentData = data.text.ops;
       
        //     await Document.findOneAndUpdate({ documentId: id }, { documentdata: documentData })
        socket.broadcast.to(id).emit('receive-changes', delta)
           
        
    })

    socket.on('save-document', async(data) => {
        await Document.findOneAndUpdate({ documentId: data.documentId }, { documentdata: data.text })
    })
    
    

    socket.on('selection-change', (data) => {
        let id = data.documentId;
        let range = data.range;
        let userId = data.user

        socket.broadcast.to(id).emit('send-selection-changes', { documentId: id, range: range, user: userId })
    })

    // socket.on('disconnect', () => {
    //     console.log('a socket disconnected')
    //     socket.emit('disconnected')
    // })
  })


  app.get('/public/script.js', (req, res) => {
    res.sendFile('script.js', { root: path.join(__dirname, './views')})
  })

  app.post('/redirectdocument', (req, res) => {
    const route = req.body.route
    req.session.redirectdocument = route;
    console.log(req.session.redirectdocument)
    res.json( route )
  })

//   app.get('/createdocument', myDocuments, (req, res) => {
//     res.render('createdocument')
//   })
  app.get('/mydocuments/:user', myDocuments, async(req, res) => {
    const user = req.params.user;
    let docs;
    if(user !== req.session.userid){
        return res.status(400).send("You are not authorized to view someone else's documents, return <a href=/>Home</a>")
    }
    let myDocuments = await Document.find({ owner: user })
    let myProfilePicture = await userdb.findOne({ username: user }).distinct('picture')
    let sharedDocs = await SharedDocument.find({ shareduser: user })
    let fullName = await userdb.findOne({ username: user }).distinct('name')
    
        
    
    //  myDocuments.forEach(async(doc) => {

    //     return docs += 
    //      `<a href=/document/${doc}>${doc}</a>
    //      <br />`

       
    // })
    // try {
    //     res.send(docs.slice(9))
    // } catch (e) {
    //     res.send(docs)
    // }
    return res.render('mydocuments', { documents: myDocuments, user: user, picture: myProfilePicture, sharedDocs: sharedDocs, name: fullName[0] })
    
  })

  app.post('/documenttitles', async(req, res) => {
    const id = req.body.id;
    const user = req.body.user;
    const title = req.body.title;

    await Document.findOneAndUpdate({ documentId: id }, { title: title })

    res.send(`Updated Title of ${id}`)
    
  })

  app.post('/documenttitler', async(req, res) => {
    const id = req.body.id;

    let documentTitle = await Document.findOne({ documentId: id }).select('title')

    if(!documentTitle){
        res.send(null)
    } else {
    res.json({ title: documentTitle.title})

    }
  })

//   app.get('/documenttitle', async(req, res) => {

//   })

  app.get('/mydocuments', auth, (req, res) => {
    res.redirect(`/mydocuments/${req.session.userid}`)
  })

  app.post('/sharedocument', async(req, res) => {
    const owner = req.body.owner;
    const id = req.body.documentId;
    const title = req.body.title
    const user = req.body.user
    let findDoc = await SharedDocument.findOne({ owner: owner, documentId: id, shareduser: user })

    if(!findDoc){
        await SharedDocument.create({ shareduser: user, documentId: id, owner: owner, title: title})

        return res.send("Added")
    } else {
        return;
    }
  })

  app.post('/getshareddocument',async (req, res) => {
    const id = req.body.id

   let ah = await SharedDocument.find({ documentId: id })

    res.send(ah)
  })

  app.post('/deletedocument', async(req, res) => {

    const user = req.body.user.trim();
    const document = req.body.document.trim();


    await Document.findOneAndDelete({ owner: user, documentId: document })
    await SharedDocument.findOneAndDelete({ documentId: document })
    res.send("deleted document")
  })

  app.get('/login_google', (req, res) => {
    res.render('google')
  })

  app.post('/login_google', async(req, res) => {
    const token = req.body.g_csrf_token
    const test = req.body.credential

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: test,
            audience: "253747450477-kplgcppb6u51jtq0vfe06sbahmmveamq.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];
        const email = payload.email;
        const fullName = payload.name;
        let findUser = await userdb.findOne({ username: email })

        if(findUser){
            let token = jwt.sign(
                { user: email },
                'helloworld',
                { 
                    expiresIn:"2h"
                }
            )
            req.session.token = token;
            req.session.userid = email

            finalUsername = email;
            if(req.session.redirectdocument){
                return res.redirect(req.session.redirectdocument)
            } else {
                return res.redirect('/')
            }
        }
        else {
            await userdb.create({
                username: email,
                picture: payload.picture,
                name: fullName
            })

            let token = jwt.sign(
                { user: email },
                'helloworld',
                { 
                    expiresIn:"2h"
                }
            )
            req.session.token = token;
            req.session.userid = email

            finalUsername = email;
            if(req.session.redirectdocument){
                return res.redirect(req.session.redirectdocument)
            } else {
                return res.redirect('/')
            }
        }
       // res.send(payload)
      }
      verify().catch(console.error);
      
  })

server.listen(process.env.PORT || 3000, () => {
    console.log('connected to server port http://localhost:3000')
})