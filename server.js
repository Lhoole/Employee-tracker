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
              "Update Employee role",
              "Update Employee Manager",
              "View Roles",
              "Add Role",
              "View Departements",
              "Total Salary of Department",
              "Add Department",
              "Delete Employee/Department/Role",
              "Quit"
            ],
          name: "mainMenu",
          loop: false
          }
  ]).then((data) => {
      switch (data.mainMenu){
          case "View Employees": {
              whichEmployees()
              break
              }
          case "Add Employee": {
              addEmployee()
              break
          } 
          case "Update Employee role": {
              updateEmployeeRole()
              break
          } 
          case "Update Employee Manager": {
              updateEmployeeManager()
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
          case "Total Salary of Department": {
              depSalary()
              break
          }
          case "Add Department": {
              addDepartment()
              break
          } 
          case "Delete Employee/Department/Role": {
              deleteThings()
              break
          } 
          case "Quit": {
            process.exit()
          }  
      }
  })
}

function whichEmployees(){
  inquirer.prompt([
    {
     type: 'list',
     message: 'Which employees would you like to view?',
     choices: [
      "All Employees",
      "By Manager",
      "By Department"
    ],
     name: 'empFilter',
    },
  ]).then((data) => {
    switch (data.empFilter){
      case "All Employees": {
          viewAllEmployees()
          break
          }
      case "By Manager": {
          empByManager()
          break
      } 
      case "By Department": {
          empByDep()
          break
      }  
  }
 })
}

function viewAllEmployees() {
  db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.depName AS department, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id ORDER BY employee.id', function (err, results) {
    console.table(results);
    startup()
  });
}
function empByManager(){
  db.query('SELECT concat(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee WHERE EXISTS (SELECT 1 FROM employee AS managers WHERE manager_id = employee.id)', function (err, results) {
    inquirer.prompt([
      {
       type: 'list',
       message: 'Which managers subordinates would you like to view?',
       choices: results,
       name: 'empFilter',
      },
    ]).then((data) => {
      db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.depName AS department, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id WHERE employee.manager_id=${data.empFilter} ORDER BY employee.id`, function (err, results) {
        console.table(results);
        startup()
      })
   })
  });
}

function empByDep(){
  db.query('SELECT department.depName AS name, department.id AS value FROM department', function (err, results) {
    inquirer.prompt([
      {
       type: 'list',
       message: 'Which department employees would you like to view?',
       choices: results,
       name: 'empFilter',
      },
    ]).then((data) => {
      db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.depName AS department, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id WHERE role.department_id=${data.empFilter} ORDER BY employee.id`, function (err, results) {
        console.table(results);
        startup()
      })
   })
  });
}

function depSalary(){
  db.query('SELECT department.depName AS name, department.id AS value FROM department', function (err, results) {
    inquirer.prompt([
      {
       type: 'list',
       message: 'Which department salary would you like to view?',
       choices: results,
       name: 'empFilter',
      },
    ]).then((data) => {
      db.query(`SELECT SUM(salary) AS "Salary total" FROM employee JOIN role ON employee.role_id=role.id JOIN department ON role.department_id=department.id WHERE role.department_id=${data.empFilter}`, function (err, results) {
        console.table(results);
        startup()
      })
   })
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
      choices: [{name:"none", value:null},...results],
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

function updateEmployeeRole() {
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


function updateEmployeeManager() {
  db.query('SELECT concat(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee', function (err, results) {
      inquirer.prompt([
       {
        type: 'list',
        message: 'Which employee would you like to update?',
        choices: results,
        name: 'updateEmp',
       },
       {
        type: 'list',
        message: 'Who is their new manager',
        choices: [{name:"none", value:null},...results],
        name: 'empNewBoss',
       },
     ]).then((data) => {
      db.query(`UPDATE employee SET manager_id = ${data.empNewBoss} WHERE id = ${data.updateEmp}`, function (err, results) {
        console.log(`Employee manager assigned`);
        startup()   
     });
    })
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

function deleteThings() {
    inquirer.prompt([
      {
       type: 'list',
       message: 'What would you like to delete?',
       choices: [
        "Employee",
        "Role",
        "Departement"
        ],
       name: 'choice',
      },
    ]).then((data) => {
      switch (data.choice){
        case "Employee": {
            delEmployee()
            break
            }
        case "Role": {
            delRole()
            break
        } 
        case "Departement": {
            delDep()
            break
        }  
    }
   })
}
function delEmployee(){
  db.query('SELECT concat(employee.first_name, " ", employee.last_name) AS name, employee.id AS value FROM employee', function (err, results) {
  inquirer.prompt([
    {
     type: 'list',
     message: 'Which employee would you like to delete?',
     choices: results,
     name: 'choice',
    },
  ]).then((data) => {
    db.query(`DELETE FROM employee WHERE employee.id=${data.choice};`, function (err, results) {
      console.log(`Employee deleted`);
      startup()
    });
 })
})
}

function delRole (){
  db.query('SELECT role.title AS name, role.id AS value FROM role', function (err, results) {
    inquirer.prompt([
      {
       type: 'list',
       message: 'Which role would you like to delete?',
       choices: results,
       name: 'choice',
      },
    ]).then((data) => {
      db.query(`DELETE FROM role WHERE role.id=${data.choice};`, function (err, results) {
        console.log(`role deleted`);
        startup()
      });
   })
  })
}

function delDep (){
  db.query('SELECT department.depName AS name, department.id AS value FROM department', function (err, results) {
    inquirer.prompt([
      {
       type: 'list',
       message: 'Which department would you like to delete?',
       choices: results,
       name: 'choice',
      },
    ]).then((data) => {
      db.query(`DELETE FROM department WHERE department.id=${data.choice};`, function (err, results) {
        console.log(`Department deleted`);
        startup()
      });
   })
  })
}


startup()
