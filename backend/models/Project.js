const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Open',
        enum: ['Open', 'Applied', 'In Progress', 'Completed']
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    technologies: [{
        type: String
    }],
    deadline: {
        type: Date,
        required: true
    },
    appliedFreelancers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
