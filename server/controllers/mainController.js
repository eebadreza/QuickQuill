exports.getHomePage = (req, res) => {
    const locals = {
        title: 'QuckQuill | Make Quick Notes',
        description: 'Notes App using Node.JS',
    };
    res.render('index',{
        locals,
        layout: '../views/layouts/front-page'
      });
};

exports.getAboutPage = (req, res) => {
    const locals = {
        title: 'QuckQuill | About Us',
        description: 'About QuickQuill App using Node.JS',
    };
    res.render('about', locals);
};
