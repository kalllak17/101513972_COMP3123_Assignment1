var express = require('express');
var router = express.Router();
var employeeController = require('../controllers/employee.controller');


router.get('/emp/employees', async function (req, res) {

    var emplArr = await employeeController.getAllEmployees();

    return res
        .status(200)
        .json(emplArr);

})

router.post('/emp/employees', async function (req, res) {

    var {first_name, last_name, email, position, salary, date_of_joining, department, profile_picture} = req.body;

    var exists = await employeeController.isEmployeeExist(first_name, last_name, email, department);
    console.log(exists);
    if (exists) {
        return res.status(400).json({error: 'Employee already exists'});
    }

    var newEmployee = await employeeController.createEmployee(first_name, last_name, email, position, salary, date_of_joining, department, profile_picture);

    return res
        .status(201)
        .json({
            "message": "Employee created successfully.",
            "employee_id": `${newEmployee._id}`
        });

})


router.get('/emp/employees/:eid', async function (req, res) {
    var eid = req.params.eid;
    console.log(eid);
    if (!eid) {
        return res.status(400).json({error: 'Employee not found'});
    }

    var employee = await employeeController.findEmployeeById(eid);

    return res
        .status(200)
        .json(employee)

})

router.put('/emp/employees/:eid', async function (req, res) {
    var eid = req.params.eid;
    // var {position, salary} = req.body;
    var {first_name, last_name, email, position, salary, date_of_joining, department, profile_picture} = req.body;
    if (!eid) {
        return res.status(400).json({error: 'Employee not found'});
    }

    var result = await employeeController.updateEmployee(eid, first_name, last_name, email, position, salary, date_of_joining, department, profile_picture);

    if (result.status) {
        return res.status(200).json(result)
    } else {
        return res.status(400).json(result);
    }


})

router.delete('/emp/employees', async function (req, res) {
    var eid = req.query.eid;

    if (!eid) {
        return res.status(400).json({error: 'Employee not found'});
    }

    var result = await employeeController.deleteEmployee(eid);

    if (result.status) {
        return res.status(204).json(result);
    } else {
        return res.status(400).json(result);
    }


})


router.get('/emp/search', async function (req, res) {
    try {
        const keyword = req.query.keyword || "";
        const result = await employeeController.searchEmployee(keyword);

        if (result && result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ error: 'Employee not found' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});





module.exports = router;