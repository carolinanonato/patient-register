var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');


router.get('/', function (req, res, next) {

    dbConn.query('SELECT * FROM user ORDER BY id desc', function (err, rows) {

        if (err) {
            req.flash('error', err);

            res.render('patient', { data: '' });
        } else {

            res.render('patient', { data: rows });
        }
    });
});


router.get('/add', function (req, res, next) {
    // render to add.ejs
    res.render('patient/add', {
        firstname: '',
        lastname: ''
    })
})

router.post('/add', function (req, res, next) {

    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let errors = false;

    if (firstname.length === 0 || lastname.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('patient/add', {
            firstname: firstname,
            lastname: lastname
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            firstname: firstname,
            lastname: lastname
        }

        // insert query
        dbConn.query('INSERT INTO user SET ?', form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to add.ejs
                res.render('patient/add', {
                    firstname: form_data.firstname,
                    lastname: form_data.lastname
                })
            } else {
                req.flash('success', 'User successfully added');
                res.redirect('/patient');
            }
        })
    }
})


router.get('/edit/(:id)', function (req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT * FROM user WHERE id = ' + id, function (err, rows, fields) {
        if (err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + id)
            res.redirect('/patient')
        }

        else {
            // render to edit.ejs
            res.render('patient/edit', {
                title: 'Edit User',
                id: rows[0].id,
                firstname: rows[0].firstname,
                lastname: rows[0].lastname
            })
        }
    })
})


router.post('/update/:id', function (req, res, next) {

    let id = req.params.id;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let errors = false;

    if (firstname.length === 0 || lastname.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and lsatname");
        // render to add.ejs with flash message
        res.render('patient/edit', {
            id: req.params.id,
            firstname: firstname,
            lastname: lastname
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            firstname: firstname,
            lastname: lastname
        }
        // update query
        dbConn.query('UPDATE user SET ? WHERE id = ' + id, form_data, function (err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('patient/edit', {
                    id: req.params.id,
                    firstname: form_data.firstname,
                    lastname: form_data.lastname
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/patient');
            }
        })
    }
})


router.get('/delete/(:id)', function (req, res, next) {

    let id = req.params.id;

    dbConn.query('DELETE FROM user WHERE id = ' + id, function (err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)

            res.redirect('/patient')
        } else {
            // set flash message
            req.flash('success', 'User successfully deleted! ID = ' + id)

            res.redirect('/patient')
        }
    })
})

module.exports = router;