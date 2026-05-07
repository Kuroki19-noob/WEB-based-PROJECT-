const bcrypt = require('bcrypt')
const db = require("../config/db")



const getAccounts = async(req,res) => {
    try {
        const data = await db.query('SELECT * FROM accounttbl')
        if(!data){
            return res.status(404).send({
                   success:false,
                   message:'no Records Found'
            })
        }
        res.status(200).send({
            success:true,
            message:'All Accounts Records',
            totalAccounts: data[0].length,
            data:data[0],
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Get All Accounts API',
            error
        })
    }
}
const loginAccount = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Please provide email and password'
            });
        }

    
        const [rows] = await db.query('SELECT * FROM accounttbl WHERE email = ?', [email]);

       
        if (rows.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        const userAccount = rows[0]; 

        
        const isMatch = await bcrypt.compare(password, userAccount.password);

        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // 4. Success Response
        res.status(200).send({
            success: true,
            message: 'Login successful!',
            user: {
                id: userAccount.id,
                username: userAccount.username,
                email: userAccount.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login API',
            error: error.message
        });
    }
}


const getAccountByID =async (req,res) => {
    try {
        const accountID = req.params.id
        if(!accountID){
            return res.status(404).send({
                success:false,
                message:'Inavalid or Provide Account ID'
            })
        }
       
       const data = await db.query(`SELECT * FROM accounttbl WHERE accountID=?`, [accountID])
       if(!data){
        return res.status(404).send({
             success:false,
             message:'No Records Found'
          })
       }
       res.status(200).send({
            success:true,
            accountDetails: data[0],
       })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Get Account By ID API',
            error
        })
    }
}
const logoutAccount = async (req, res) => {
    try {
        if (req.session) {
            req.session.destroy();
        }

        // Respond to confirm logout success
        return res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        // Handle errors
        return res.status(500).json({
            success: false,
            message: 'Logout failed',
        });
    }
};
const createAccount = async(req,res) => {
    

    try {
        const {username,password,email,repeatpassword} = req.body
        if(!username || !password || !email || !repeatpassword){
            return res.status(500).send({
                success:false,
                message:'Please Provide All fields'
            })
        }
        if (password !== repeatpassword) {
            return res.status(400).send({ success: false, message: "Passwords do not match" });
        }
        if (username.length === 0 || password.length === 0 || email.length === 0 || repeatpassword.length === 0){
            return res.status(400).send({success:false, message:'Fields cannot be empty'})
        }
        if (password.length < 8) {
            return res.status(400).send({ success: false, message:'Password must contain at least 8 characters'})
        }
        if (!email.includes('@') || !email.includes('.')){
            return res.status(400).send({success:false, message:'Invalid email format'})
        }
        if (username.length < 3 || username.length > 20) {
            return res.status(400).send({ success: false, message: 'Username must be between 3 and 20 characters' });
        }
        if(email.length > 30 ){
            return res.status(400).send({success:false, message:'Email cannot exceed 30 characters'})
        }
        const saltRounds = 10;
        const hashpass = await bcrypt.hash(password, saltRounds);


        const data = await db.query(`INSERT INTO accounttbl (username, password, email, repeatpassword)VALUES (?,?,?,?)`,[username, hashpass, email,repeatpassword])
        if (!data){
            return res.status(500).send({
                success:false,
                message:'Error in Creating Account'
            })
        }
        res.status(201).send({
            success:true,
            message:'New Account Record Created',
            id: data.insertId
        })
    } catch (error) {
        console.log(error)


        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({ success: false, message: 'Username or Email already exists' });
        }



        res.status(500).send({
            success:false,
            message:'Error in Create Account API',
            error:error.message
        })
    }
}






const updateAccount = async (req, res) => {
    try {
        const accID = req.params.id
        console.log('Received accID:', accID)  
        console.log('Received body:', req.body)  

        if (!accID) {
            return res.status(404).send({
                success: false,
                message: 'Invalid ID or Provide Account ID'
            })
        }
        const { username, password, email,repeatpassword } = req.body
        console.log('Extracted values:', { username, password, email,repeatpassword })  

        const data = await db.query(`UPDATE accounttbl SET username=?, password=?, email=?, repeatpassword=?  WHERE accountID = ?`, [username, password, email, repeatpassword ,accID])
        console.log('Query result:', data)  

        if (!data) {
            return res.status(500).send({
                success: false,
                message: 'Error in Updating Data'
            })
        }
        res.status(200).send({
            success: true,
            message: 'Account Record Updated'
        })
    } catch (error) {
        console.log('ERROR CAUGHT:', error)  
        res.status(500).send({
            success: false,
            message: 'error in Update Account API',
            error: error.message  
        })
    }
}

const deleteAccount = async (req, res)=> {
    try {
        const accountID = req.params.id
        if(!accountID){
            return res.status(404).send({
                success:false,
                message:'Provide Valid Account ID or Valid Account ID'
            })
        }
        await db.query(`DELETE FROM accounttbl WHERE accountID = ?`, [accountID])
        res.status(200).send({
            success:true,
            message:'Account Record Deleted'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error In Delete Account API',
            error
        })
        
    }
}
module.exports = {getAccounts, getAccountByID , createAccount, updateAccount, deleteAccount, loginAccount,logoutAccount}