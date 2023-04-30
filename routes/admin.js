const express = require('express')
const { dbConnect } = require("../data/database");
const router = express.Router()

router.get('/', (req, res) => {

    res.render('admin.ejs')

})

router.post('/', (req, res) => {

    res.render('admin.ejs')

})

// Car
// can have new route for sorting the data

router.get('/view_car', async (req, res) => {

    q = `select * from car natural join car_category natural join location`
    var data = null

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(q, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
            );
        });
        data = result.rows
    } catch (err) {
        next(err);
    }

    console.log(data)

    res.render('view_car.ejs', { data: data })

})

router.get('/view_members', async (req, res) => {
    q = 'select user_name,start_date,expiry_date from membership natural join customer_info'
    var data = null
    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(q, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
        data = result.rows;
    } catch (err) {
        next(err);
    }
    res.render('view_members.ejs', { data: data })
})

router.post('/view_car', async (req, res, next) => {

    const form = req.body

    console.log(form)

    q = `select category_id from car_category where category_name = '${form["Car Category"]}'`
    var categoryID = null

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(q, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
            );
        });
        categoryID = result.rows[0].category_id
    } catch (err) {
        next(err);
    }

    console.log(form)

    q = `select location_id from location where location_name = '${form["Location"]}'`
    var locationID = null

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(q, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
            );
        });
        locationID = result.rows[0].location_id
    } catch (err) {
        next(err);
    }

    var status = null

    if (form['Availability'] == 'Yes') {
        status = 1
    }
    else {
        status = 0
    }

    q = `insert into car(model_name , registration_no , capacity , mileage , availability , category_id , location_id) values 
    (
        '${form['Model Name']}','${form['Registration Number']}', '${form['Capacity']}','${form['Mileage']}', ${status} , ${categoryID} , ${locationID}
    )`

    dbConnect.query(q, (err, result) => {
        if (err) throw err;
        else {
            res.redirect('/admin/view_car');
        }
    });

})


router.get('/add_car', async (req, res) => {


    q = `select category_name from car_category`
    var category_name = null

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(q, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
            );
        });
        category_name = result.rows
    } catch (err) {
        next(err);
    }

    q = `select location_name from location`
    var location_name = null

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(q, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
            );
        });
        location_name = result.rows
    } catch (err) {
        next(err);
    }

    console.log(category_name)
    console.log(location_name)

    res.render('add_car.ejs', {
        category_name: category_name,
        location_name: location_name
    })

})


// car category

router.get('/view_car_category', async (req, res, next) => {

    q = `select * from car_category`
    var data = null

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(q, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
            );
        });
        data = result.rows
    } catch (err) {
        next(err);
    }

    console.log(data)

    res.render('view_car_category.ejs', { data: data })


})
router.post('/view_car_category', (req, res) => {

    const form = req.body
    console.log("here");
    console.log(form)
    q = `insert into car_category(category_name,cost_perday,latefee_perday,bootspace) values 
    (
        '${form['Category Name']}',${form['Cost Per Day']}, ${form['Late fee Per Day']},${form['Bootspace']} 
    )`

    dbConnect.query(q, (err, result) => {
        if (err) throw err;
        else {
            res.redirect('/admin/view_car_category');
        }
    });

})


router.get('/add_car_category', (req, res) => {

    res.render('add_car_category.ejs')

})


// location

router.get('/view_location', async (req, res, next) => {

    q = `select * from location`
    var data = null

    try {
        const result = await new Promise((resolve, reject) => {
            dbConnect.query(q, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
            );
        });
        data = result.rows
    } catch (err) {
        next(err);
    }

    console.log(data)

    res.render('view_location.ejs', { data: data })

})

router.post('/view_location', (req, res) => {

    const form = req.body

    q = `insert into location(location_name,city,state,street,pincode) values 
    (
        '${form['Location Name']}','${form['City']}', '${form['State']}','${form['Street']}', ${form['Pincode']} 
    )`

    dbConnect.query(q, (err, result) => {
        if (err) throw err;
        else {
            res.redirect('/admin/view_location');
        }
    });
})

router.get('/add_location', (req, res) => {

    res.render('add_location.ejs')

})


// maintainace

router.get('/view_maintainance', (req, res) => {


    q = `select * from maintenance`

    dbConnect.query(q, (err, result) => {
        if (err) throw err;
        else {
            console.log(result.rows)
            res.render('view_car_maintainance.ejs', {
                data: result.rows
            })
        }
    });

})


router.post('/view_maintainance', (req, res) => {


    const form = req.body

    q = `
    update maintenance set 
    total_distance_travelled = ${form['Total Distance Travelled']},
    last_service_date = '${form['Last Service Date']}',
    under_maintenance = ${form['Availability']}
    where registration_no = '${form['Registration No']}';
    `

    dbConnect.query(q, (err, result) => {
        if (err) throw err;
        else {
            res.redirect('/admin/view_maintainance')
        }
    });
})

router.get('/edit_maintainance/:registration_number', (req, res) => {

    q = `select * from maintenance where registration_no = '${req.params.registration_number}'`

    dbConnect.query(q, (err, result) => {
        if (err) throw err;
        else {
            res.render('edit_car_maintainace.ejs', {
                data: result.rows[0]
            })
        }
    });

})



module.exports = router
