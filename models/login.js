const bcryptjs = require("bcryptjs")
const User = require ("./user");

// JWT used for authentication
const jwt = require("jsonwebtoken")

// secret JWT key
global.jwtSecret = "jwtSecret1234567890"

function login(app)
{
    app.post('/login', async function(request, result) {
        console.log(request.body);
        const email = request.body.email
        const password = request.body.password
    
        if (!email || !password) {
            result.json({
                status: "error",
                message: "Please enter all values."
            })
            return
        }

        // check if email already exists        
        const user =  await User.findOne({
            email: email
        })
    
        if (user == null) {
            result.json({
                    status: "error",
                message: "Email does not exist."
            })
            return
        }
        console.log(user)
        const id = user._id.toString()
        console.log(user._id.toString())

        // check if password is correct
        const isVerify = await bcryptjs.compareSync(password, user.password)
        if (isVerify) {
            // generate JWT of user
            const accessToken = jwt.sign({
                userId: id
            }, jwtSecret)
        
            // update JWT of user in database
            const user =  await User.findOneAndUpdate({
                email: email
            }, 
            {
                $set: { accessToken: accessToken }
            })
        
            result.json({
                        status: "success",
                        message: "Login successfully.",
                        accessToken: accessToken,
                        user: {
                                _id: user._id,
                                name: user.name,
                                email: user.email
                        }
                        })        
            return
        }
        
        result.json({
            status: "error",
            message: "Password is not correct."
        })        
    });
}

module.exports = {login}