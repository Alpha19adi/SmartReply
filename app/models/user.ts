import mongoose from "mongoose";
import crypto from "crypto"

interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    verifyToken?: string;
    verifyTokenExpire?: Date;
}

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    verifyToken:{
        type:String
    },
    verifyTokenExpire:{
        type:Date
    },
});

export function generateVerificationToken() {
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    
    return {
        verificationToken,
        hashedToken,
        tokenExpiry
    };
}

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;