const cTable = require('console.table');

class Role {
    constructor(db, id, title, salary, department_id) {
        this.db = db;
        this.id = id;
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }
}


Role.prototype.addRole = function(title, salary, department_id) {
    this.db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [ title, salary, department_id],
        function (err, res) {
            if (err) console.log(err);
        }
    );
};

Role.prototype.showRoles = function() {
    this.db.query(
        "SELECT * FROM role JOIN department ON role.department_id = department.id",
        function (err, res) {
            if (err) console.log(err);
            console.log("\n");
            console.table(res);
        }
    )
};

module.exports = Role;