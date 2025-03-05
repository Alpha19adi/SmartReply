import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    type:{
        type: String,
        enum: ['user', 'bot'],
        required:true,
    },
    timestamp: {
        type: Date,
        default: Date.now 
    }

});

export const chatSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    id:{
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages:{
        type: [messageSchema],
        default: []
    },
    data: {
        relation: { type: String },
        mood: { type: String },
      }
      
});

export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);