const Notes = require('../models/Notes');
const mongoose = require('mongoose');

exports.getDashboard = async (req, res) => {
    let perPage = 12;
    let page = req.query.page || 1;

    const locals = {
        title: 'Dashboard | Review notes',
        description: 'NodeJS Notes App.',
    };

    try {
        const notes = await Notes.aggregate([
            { $sort: { updatedAt: -1 } },
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $substr: ['$body', 0, 120] },
                },
            },
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Notes.countDocuments();

        res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            notes,
            layout: '../views/layouts/dashboard',
            current: page,
            pages: Math.ceil(count / perPage),
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getDashboardViewNote = async (req, res) => {
    try {
        const note = await Notes.findById({ _id: req.params.id })
            .where({
                user: req.user.id,
            })
            .lean();

        if (note) {
            res.render('dashboard/view-note', {
                noteID: req.params.id,
                note,
                layout: '../views/layouts/dashboard',
            });
        } else {
            res.render('404', {
                errHeading: 'Something went Wrong',
                linkText: 'Back to Dashboard',
                linkUrl: `${req.protocol}://${req.get('host')}/dashboard`,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.getDashboardUpdateNote = async (req, res) => {
    try {
        await Notes.findByIdAndUpdate(
            { _id: req.params.id },
            {
                title: req.body.title,
                body: req.body.body,
                updatedAt: Date.now(),
            }
        ).where({ user: req.user.id });

        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
    }
};

exports.getDashboardDeleteNote = async (req, res) => {
    try {
        await Notes.deleteOne({ _id: req.params.id }).where({
            user: req.user.id,
        });
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
    }
};

exports.addNewNotePage = (req, res) => {
    res.render('dashboard/add', {
        layout: '../views/layouts/dashboard',
    });
};

exports.addNewNote = async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Notes.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
    }
};

exports.searchResultSubmit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

        const searchResults = await Notes.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChars, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChars, 'i') } },
            ],
        }).where({ user: req.user.id });

        res.render('dashboard/search', {
            searchResults,
            layout: '../views/layouts/dashboard',
        });
    } catch (err) {
        console.log(err);
    }
};
exports.searchResultView = async (req, res) => {
    try {
        res.render('dashboard/search', {
            searchResults: '',
            layout: '../views/layouts/dashboard',
        });
    } catch (err) {
        console.log(err);
    }
};
