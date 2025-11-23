const Employee = require('../models/employee.model');


exports.getAllEmployees = async () => {
    const employees = await Employee.find({});
    return employees;

}

exports.isEmployeeExist = async (first_name, last_name, email, department) => {
    return isEmployeeExist(first_name, last_name, email, department);
}

exports.createEmployee = async (first_name, last_name, email, position, salary, date_of_joining, department, profile_picture) => {

    var employee = await isEmployeeExist(first_name, last_name, email, department);

    if (!employee) {

        var created_at = new Date(Date.now());
        var updated_at = null;

        var newEmployee = await Employee.create({
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "position": position,
            "salary": salary,
            "date_of_joining": date_of_joining,
            "department": department,
            "created_at": created_at,
            "updated_at": updated_at,
            "profile_picture": profile_picture
        })

        return newEmployee;
    } else {
        return {status: false, message: "Employee already exists"};
    }

}

exports.findEmployeeById = async (id) => {
    var employee = await findEmployeeById(id);
    return employee;
}

exports.updateEmployee = async (id, position, salary) => {
    var employee = await findEmployeeById(id);
    if (employee) {
        employee.position = position;
        employee.salary = salary;

        await employee.save();
        return {
            "status": true,
            "message": "Employee details updated successfully."
        }
    }
    return {
        status: false,
        message: "Employee not found."
    }

}

exports.deleteEmployee = async (id) => {
    var employee = await findEmployeeById(id);
    if (employee) {
        await Employee.deleteOne({_id: id});
        return {
            status: true,
            message: "Employee deleted successfully."
        }
    } else {
        return {
            status: false,
            message: "Employee not found."
        };
    }
}

exports.searchEmployee = async (searchKeyword) => {
    const res = await Employee.find({
        $or: [
            {department: {$regex: searchKeyword, $options: 'i'}},
            {position: {$regex: searchKeyword, $options: 'i'}}
        ]
    }).limit(50);

    if (res) {
        return res;
    } else {
        return {
            status: false,
            message: "Employee not found."
        };
    }
}


async function findEmployeeById(id) {
    var employee = await Employee.findById(id);
    return employee;
}

async function isEmployeeExist(first_name, last_name, email, department) {
    var employee = await Employee.findOne({
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "department": department,
    })

    return employee;
}