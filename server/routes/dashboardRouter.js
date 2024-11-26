const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { isLoggedIn } = require('../middleware/checkAuth');
const router = express.Router();

/**
 * Dashboard Routes
 */
router.get('/dashboard', isLoggedIn, dashboardController.getDashboard);
router.get(
    '/dashboard/item/:id',
    isLoggedIn,
    dashboardController.getDashboardViewNote
);

router.put(
    '/dashboard/item/:id',
    isLoggedIn,
    dashboardController.getDashboardUpdateNote
);

router.delete(
    '/dashboard/item-delete/:id',
    isLoggedIn,
    dashboardController.getDashboardDeleteNote
);

router.get('/dashboard/add', isLoggedIn, dashboardController.addNewNotePage);
router.post('/dashboard/add', isLoggedIn, dashboardController.addNewNote);
router.get(
    '/dashboard/search',
    isLoggedIn,
    dashboardController.searchResultView
);
router.post(
    '/dashboard/search',
    isLoggedIn,
    dashboardController.searchResultSubmit
);

module.exports = router;
