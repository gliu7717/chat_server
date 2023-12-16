const bcryptjs = require("bcryptjs")
const User = require ("./user");

function register(app)
{
    app.post('/registration', async function(req, res) {
        console.log(req.body);
        const name = req.body.name
        const email = req.body.email
        const password = req.body.password
        const password1= req.body.password1
        const createdAt = new Date().getTime()
    
        if (!name || !email || !password) {
            res.json({
                status: "error",
                message: "Please enter all values."
            })
            return
        }

        if(password!=password1){
           // res.status(404).render('404', { title: 'password not match', message:"password not match" });
            res.json({
                status: "error",
                message: "password not match."
            })
            return
        }
        else{
            // check if phone already exists
            const user =  await User.findOne({
                email: email
            })        
            if (user != null) {
                res.json({
                    status: "error",
                    message: "email already exists."
                })
                console.log(user)
                return
            }
            const salt = bcryptjs.genSaltSync(10)
            const hash =  bcryptjs.hashSync(password, salt)
            const minimum = 0
            const maximum = 999999
            const verificationToken = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
            // insert in database
            const newuser = new User({
                name: name,
                email: email,
                password: hash,
                accessToken: "",
                createdAt: createdAt
            })
            newuser.save()
            .then(result => {
              //res.redirect('/users');
              res.json({
                status: "success",
                message: "Account has been created."
              })
            })
            .catch(err => {
              console.log(err);
            });
        }
    });
}

module.exports = {register}