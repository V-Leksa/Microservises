import mongoose, { Document } from 'mongoose';

interface IUser extends Document {
    userId: number;
    jwToken: string;
    
}

const UserSchema = new mongoose.Schema<IUser>({
    userId: { type: Number, required: true },
    jwToken: { type: String, required: false }
});

export default mongoose.model<IUser>('User', UserSchema);
