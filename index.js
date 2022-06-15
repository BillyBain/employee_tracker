const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
const db = require("./assets/db");
const Employee = require("./assets/Employee");
const Role = require("./assets/Role");
const Department = require("./assets/Department");

let employ = new Employee(db);
let role = new Role(db);
let depart = new Department(db);

let main = function () {
  inquirer.prompt([
    {
      type: "list",
      name: "main",
      choices: ["View all Departments", "View all Roles", "View all Employees", "Add Department", "Add a Role", "Add an Employee", "Update an Employee"],
      message: "What would you like to do?",
    },
  ])
    .then((results => {
      const select = results.main;

      if (select === "View all Departments") {
        depart.showDepartments();
        main();
      } else if (select === "View all Roles") {
        role.showRoles();
        main();
      } else if (select === "View all Employees") {
        employ.showEmployees();
        main();
      } else if (select === "Add Department") {
        addDepartment();
      } else if (select === "Add a Role") {
        addRole();
      } else if (select === "Add an Employee") {
        addEmployee();
      } else {
        updateEmployee();
      }
    }))
};

const addDepartment = function () {
  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What department would you like to add?'
      }
    ])
    .then((departments => {
      depart.addDepartment(departments.name);
      main();
    }))
};

const addRole = function () {
  let departments = [];

  db.query("SELECT * FROM department",
    function (err, res) {
      for (let i = 0; i < res.length; i++) {
        if (res[i].name) {
          departments.push(res[i].name);
        }
      }
      return inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What would you like this role to be called?'
          },
          {
            type: 'number',
            name: 'salary',
            message: 'What is the salary for this role?'
          },
          {
            type: 'list',
            name: 'depart',
            message: 'What department does this role go under?',
            choices: departments
          }
        ])
        .then((roles => {
          let department_id = null;
          for (let i = 0; i < res.length; i++) {
            if (res[i].name === roles.depart) {
              department_id = res[i].id;
              break;
            }
          }
          role.addRole(roles.title, roles.salary, department_id);
          main();
        }))

    }
  )

};

const addEmployee = function () {
  let roles = [];
  let managers = [];

  db.query("SELECT * FROM role",
    function (err, rRes) {
      for (let i = 0; i < rRes.length; i++) {
        if (rRes[i].title) {
          roles.push(rRes[i].title);
        }
      }
      db.query("SELECT * FROM employee",
        function (err, eRes) {
          for (let i = 0; i < eRes.length; i++) {
            if (eRes[i].first_name) {
              managers.push(eRes[i].first_name + " " + eRes[i].last_name);
            }
          }
          return inquirer
            .prompt([
              {
                type: 'input',
                name: 'first',
                message: 'What is there first name?'
              },
              {
                type: 'input',
                name: 'last',
                message: 'What is there last name?'
              },
              {
                type: 'list',
                name: 'role',
                message: 'What is there role?',
                choices: roles
              },
              {
                type: 'list',
                name: 'manager',
                message: 'Who is there Manager?',
                choices: managers
              }
            ])
            .then((employeeResults => {
              let role_id;
              for (let i = 0; i < rRes.length; i++) {
                if (rRes[i].title === employeeResults.role) {
                  role_id = rRes[i].id;
                  break;
                }
                let manager_id;
                for (let i = 0; i < eRes.length; i++) {
                  if (eRes[i].first_name + " " + eRes[i].last_name === employeeResults.manager) {
                    manager_id = eRes[i].id;
                    break;
                  }
                }
                employ.addEmployee(employeeResults.first, employeeResults.last, role_id, manager_id);
                main();
              }
            }));
        }
      );
    }
  );



};

const updateEmployee = function () {
  let roles = [];
  let employees = [];

  db.query("SELECT * FROM role",
    function (err, rRes) {
      for (let i = 0; i < rRes.length; i++) {
        if (rRes[i].title) {
          roles.push(rRes[i].title);
        }
      }
      db.query(" SELECT * FROM employee",
        function (err, eRes) {
          for (let i = 0; i < eRes.length; i++) {
            if (eRes[i].first_name) {
              employees.push(eRes[i].first_name + " " + eRes[i].last_name);
            }
          }
          return inquirer
            .prompt([
              {
                type: 'list',
                name: 'employee',
                message: "Which employee would you like to update?",
                choices: employees
              },
              {
                type: 'list',
                name: 'role',
                message: 'What role would you like to change them to?',
                choices: roles
              }
            ])
            .then((employeeResults => {
              let role_id = null;
              for (let i = 0; i < rRes.length; i++) {
                if (rRes[i].title === employeeResults.role) {
                  role_id = rRes[i].id;
                  break;
                }
              }
              for (let i = 0; i < eRes.length; i++) {
                if (eRes[i].first_name + " " + eRes[i].last_name === employeeResults.employee) {
                  employ.change(eRes[i]);
                  employ.role_id = role_id;
                  employ.updateEmployee();
                  break;
                }
              }
              main();
            }))
        })
    })
};

main();