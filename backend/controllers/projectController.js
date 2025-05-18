const { get } = require('mongoose');
const Project = require('../models/Project');
const user = require('../models/User');


const createProject = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients can create projects' });
        }

        const { title, description, budget, technologies, deadline } = req.body;

        const project = await Project.create({
            title,
            description,
            budget,
            technologies,
            deadline,
            client: req.user._id,
            status: 'Open'
        });

        res.status(201).json(project);
    } catch (err) {
        console.error('Create Project Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate('client', 'name email');
        return res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error Fetching Projects' });
    }
};

const getMyProjects = async (req, res) => {
    try {

        if (req.user.role !== 'client') {
            return res.status(403).json({ message: 'Only clients can access their projects' });
        }
        const clientId = req.user._id;

        //fetch all projects fetched by client
        const projects = await Project.find({ client: req.user._id }).sort({ createdAt: -1 });

        if (!projects) {
            return res.status(404).json({
                message: 'No Projects found!!'
            })
        }

        return res.json(projects);
    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only clients can update projects' });
        }

        const { title, description, budget, technologies, deadline } = req.body;

        project.title = title || project.title;
        project.description = description || project.description;
        project.budget = budget || project.budget;
        project.technologies = technologies || project.technologies;
        project.deadline = deadline || project.deadline;

        const updated = await project.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({
            message: 'Error updating project'
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only clients can delete projects' });
        }

        await project.deleteOne();
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting project'
        });
    }
}

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.client.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to access this project' });
        }

        res.json(project);
    } catch (err) {
        res.status(500).json({ message: 'Errorrrrrrrrrrrrr fetching project' });
    }
};

const getAvailableProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            status: 'Open' // wrap 'open' in quotes!
        }).populate('client', 'name');
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching available projects' });
    }
};


module.exports = {
    getMyProjects,
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    getProjectById,
    getAvailableProjects
};