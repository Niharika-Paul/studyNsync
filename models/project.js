const { Schema, model } = require('mongoose');

const projectSchema = new Schema({
    projectTitle: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        required: true,
        enum: ['hackathon', 'project', 'workshop', 'ideathon']
    },
    projectDescription: {
        type: String,
        required: true
    },
    skillsRequired: {
        type: String,
        required: true
    },
    dateFrom: {
        type: Date,
        required: true
    },
    dateTo: {
        type: Date,
        required: true
    },
    peopleRequired: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    contactDetails: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    createdBy: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Project', projectSchema);
