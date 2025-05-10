const User = require('../models/User');

//@desc Get logged in user profile

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user)
        return res.status(404).json({
            message: 'User not found'
        })
    res.json(user);
}

//@desc Update User Profile


exports.updateProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user)
        return res.status(404).json({
            message: 'User not found'
        });

    const {
        name,
        bio,
        skills,
        github,
        linkedin,
        portfolio,
        company,
        companyLogo,
        contact
    } = req.body;

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (github) user.github = github;
    if (linkedin) user.linkedin = linkedin;
    if (portfolio) user.portfolio = portfolio;
    if (company) user.company = company;
    if (companyLogo) user.companyLogo = companyLogo;
    if (contact) user.contact = contact;

    const updatedUser = await user.save();

    res.json(updatedUser);
}
