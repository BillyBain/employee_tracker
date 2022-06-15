const cTable = require('console.table');

class Department {
    constructor(db, id, name) {
        this.db = db;
        this.id = id;
        this.name = name;
    }
}

Department.prototype.showDepartments = function() {
    this.db.query(
        "SELECT department.id, department.name FROM department",
        function (err, res) {
            console.log("\n");
            console.table(res);
        }
    )
};

Department.prototype.addDepartment = function(name) {
    this.db.query("INSERT INTO department (name) VALUES (?)", [name],
        function (err, res) {
            if (err) console.log(err);
        }
    );
};

module.exports = Department;