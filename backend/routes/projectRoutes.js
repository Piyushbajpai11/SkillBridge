const express = require('express');
const {
    getMyProjects,
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    getAvailableProjects,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

//create a new Project......
router.post('/', protect, createProject);

//get all Projects......
router.get('/', getAllProjects);

//Route for fetching client's projects......
router.get('/my-projects', protect, getMyProjects);

//Update a Project by ID......
router.put('/:id', protect, updateProject);

//Delete a Project by ID......  
router.delete('/:id', protect, deleteProject);

// Get all projects with open status
router.get('/browse-projects', protect, getAvailableProjects);

// Get a single project by ID
router.get('/:id', protect, getProjectById);

module.exports = router;