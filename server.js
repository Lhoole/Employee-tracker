const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Webdevsql24camp!',
    database: 'employee_tracker_db'
  },
);


function startup(){
  inquirer.prompt([
      {
          type: 'list',
          message: 'What would you like to do?',
          choices: [
              "View Employees",
              "Add Employee",
              "Update Employee",
              "View Roles",
              "Add Role",
              "View Departements",
              "Add Department",
              "Quit"
            ],
          name: "mainMenu",
          loop: false
          }
  ]).then((data) => {
      switch (data.mainMenu){
          case "View Employees": {
              viewEmployees()
              break
              }
          case "Add Employee": {
              addEmployee()
              break
          } 
          case "Update Employee": {
              updateEmployee()
              break
          } 
          case "View Roles": {
              viewRoles()
              break
          }
          case "Add Role": {
              addRole()
              break
          }
          case "View Departements": {
              viewDepartements()
              break
          } 
          case "Add Department": {
              addDepartment()
              break
          } 
          case "Quit": {
            process.exit()
          }  
      }
  })
}



function viewEmployees() {
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.depName AS department, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id ORDER BY employee.id', function (err, results) {
    console.table(results);
    startup()
  });
}

function addEmployee() {
 db.query('SELECT concat(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee', function (err, results) {
  db.query('SELECT role.title AS name, role.id AS value FROM role', function (err, results1) {
    inquirer.prompt([
      {
       type: 'input',
       message: 'Employee first name',
       name: 'newEmpFirst',
     },
     {
      type: 'input',
      message: 'Employee last name',
      name: 'newEmpLast',
     },
     {
      type: 'list',
      message: 'Select employee role',
      choices: results1,
      name: 'newEmpRole',
     },
     {
      type: 'list',
      message: 'Employee manager',
      choices: ["None", results],
      name: 'newEmpManager',
     },
   ]).then((data) => {
    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.newEmpFirst}", "${data.newEmpLast}", ${data.newEmpRole}, ${data.newEmpManager});`, function (err, results) {
      console.log(`${data.newEmpFirst} ${data.newEmpLast} added to db`);
      console.log(data)
      startup()   
   });
  })
 });
});
}

function updateEmployee() {
  db.query('SELECT concat(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee', function (err, results) {
    db.query('SELECT role.title AS name, role.id AS value FROM role', function (err, results1) {
      inquirer.prompt([
       {
        type: 'list',
        message: 'Which employee would you like to update?',
        choices: results,
        name: 'updateEmp',
       },
       {
        type: 'list',
        message: 'What is their new role',
        choices: results1,
        name: 'empNewRole',
       },
     ]).then((data) => {
      db.query(`UPDATE employee SET role_id = ${data.empNewRole} WHERE id = ${data.updateEmp}`, function (err, results) {
        console.log(`Employee role changed`);
        console.log(data)
        startup()   
     });
    })
   });
  });
}

function viewRoles() {
  db.query('SELECT role.id, role.title , role.salary, (department.depName) AS department FROM role JOIN department ON role.department_id=department.id;', function (err, results) {
    console.table(results);
    startup()
  });
}

function addRole() {
  db.query('SELECT department.depName AS name, department.id AS value FROM department', function (err, results) {
    inquirer.prompt([
      {
       type: 'input',
       message: 'Role title',
       name: 'newRoleTitle',
     },
     {
       type: 'input',
       message: 'Role salary',
       name: 'newRoleSalary',
     },
     {
      type: 'list',
      message: "Which department does this role belong to?",
      choices: results,
      name: 'newRoleDep'
     }
   ]).then((data) => {
    db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${data.newRoleTitle}", ${data.newRoleSalary}, ${data.newRoleDep});`, function (err, results) {
      console.log(`${data.newRoleTitle} added to db`);
      startup()
    });      
   });
  });
  
}

function viewDepartements() {
  db.query('SELECT department.id, department.depName AS Department FROM department', function (err, results) {
    console.table(results);
    startup()
  });
}

function addDepartment() {
  inquirer.prompt([
    {
     type: 'input',
     message: 'Name of department',
     name: 'newDepName',
   },
 ]).then((data) => {
  db.query(`INSERT INTO department (depName) VALUES ("${data.newDepName}");`, function (err, results) {
    console.log(`${data.newDepName} added to db`);
    startup()
  });      
 });
}

startup()
