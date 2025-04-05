import validator from 'validator'
import bcrypt from 'bcrypt'
import { userModel } from '../models/userModel.js'
import jwt from 'jsonwebtoken'

export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            return res.json({ success: false, message: "Something went wrong" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be atleast 8 character long" });
        }

        const emailExist = await userModel.findOne({ email });

        if (emailExist) {
            return res.json({ success: false, message: "Email already exist" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData);
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SERCET)

        res.json({ success: true, token: token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid email or password" })
        }

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.json({ success: false, message: "Invalid email or password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SERCET);
        res.json({ success: true, token: token })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId).select("-password");
        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
