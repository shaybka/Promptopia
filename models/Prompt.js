import mongoose from "mongoose";

const promptSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    prompt: {
        type: String,
        required: [true, 'Prompt is required'],
    },
    tag: {
        type: String,
        required: [true, 'Tag is required'],
    },
}, { timestamps: true });

const Prompt = mongoose.models.Prompt || mongoose.model('Prompt', promptSchema);

export default Prompt;
