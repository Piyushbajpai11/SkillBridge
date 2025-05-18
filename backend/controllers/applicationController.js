import express from 'express';
import asyncHandler from 'express-async-handler';
import Application from '../models/Application.js';
import Project from '../models/Project.js';

// @desc    Apply to a project
// @route   POST /applications/:projectId
// // @access  Private (Freelancer)
// import User from '../models/User.js'; // Make sure you import User
// import sendEmail from '../utils/sendEmail.js'; // Assuming you're using this

export const applyToProject = async (req, res) => {
    if (req.user.role !== 'developer') {
        return res.status(403).json({ message: 'Only developers can apply to projects' });
    }

    const { coverLetter } = req.body;
    const projectId = req.params.projectId;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.status !== 'Open') {
            return res.status(400).json({ message: 'This project is no longer accepting applications' });
        }

        const alreadyApplied = await Application.findOne({
            project: projectId,
            freelancer: req.user._id
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied to this project' });
        }

        const application = await Application.create({
            project: projectId,
            freelancer: req.user._id,
            coverLetter: coverLetter || '',
            status: 'Pending'
        });

        // Update project
        if (!project.appliedFreelancers.includes(req.user._id)) {
            project.appliedFreelancers.push(req.user._id);
        }

        // Only update status if first applicant
        if (project.appliedFreelancers.length === 1) {
            project.status = 'Applied';
        }

        await project.save();

        // Notify client
        const client = await User.findById(project.client);
        if (client && client.email) {
            try {
                await sendEmail({
                    to: client.email,
                    subject: 'A Developer Applied to Your Project',
                    html: `<p>Your project <strong>${project.title}</strong> has received a new application.</p>`,
                });
            } catch (emailError) {
                console.error('Failed to send email:', emailError);
                // Don't throw — we already handled main logic
            }
        }

        // ✅ Safe single response
        return res.status(201).json({
            message: 'Application submitted successfully',
            application
        });

    } catch (err) {
        console.error('Error in applyToProject:', err);
        return res.status(500).json({ message: 'Server error while applying to project' });
    }
};




// @desc    Get all applications for a Freelancer
// @route   GET /applications/my
// @access  Private (Freelancer)
export const getMyApplications = asyncHandler(async (req, res) => {
    try {
        const applications = await Application.find({ freelancer: req.user._id })
            .populate('project')
            .sort({ createdAt: -1 });
        res.json(applications);
    } catch (err) {
        console.error('Error in getMyApplications:', err);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});