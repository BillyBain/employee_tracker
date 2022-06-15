const Department = require("./Department");
const role = require("./Role");
const cTable = require('console.table');

class Employee {
    constructor(db, id, first_name, last_name, role_id, manager_id) {
        this.db = db;
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }
}

Employee.prototype.showEmployees = function() {
    this.db.query(
        "SELECT * FROM employee",
        function (err, res) {
            if (err) console.log(err);
            console.log("\n");
            console.table(res);
        }
    )
};

Employee.prototype.addEmployee = function(first_name, last_name, role_id, manager_id) {
    this.db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [ first_name, last_name, role_id, manager_id],
        function (err, res) {
            if (err) console.log(err);
        }
    );
}

Employee.prototype.updateEmployee = function(id, first_name, last_name, role_id, manager_id) {
    this.db.query("UPDATE employee SET ? WHERE ?", [{ first_name: first_name, last_name: last_name, role_id: role_id, manager_id: manager_id }, { id: id }],
        function (err, res) {
            if (err) console.log(err);
        }
    );
}

Employee.prototype.change = function(data) {
    Object.getOwnPropertyNames(this).forEach((property) => {
        if (property !== "db") {
            this[property] = data[property];
        }
    });
}

module.exports = Employee;