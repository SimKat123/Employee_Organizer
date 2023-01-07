// Packages
const inquirer = require("inquirer");
// Packages correct?
    // do I need fs?
    // Do I need these?
        // "express": "^4.17.1",
        // "nodemon": "^2.0.20",
// What is "ON DELETE CASCADE" and how is it different from "ON DELETE SET NULL"? Better to use one or the other?
inquirer.prompt([
    {
      type: "list",
      name: "pathway",
      message: "What would you like to do?",
      choices: ["View all Employees", "Add Employee", "Update Employee Role", "View all Roles",
       "Add Role", "View all Departments", "Add Department", "Quit"],
    }])

.then((answers) => {
    if (answers.pathway == "View all Employees") {
        allEmp();
    } else if (answers.pathway == "Add Employee" ) {
        addEmp();
    } else if (answers.pathway == "Update Employee Role") {
        updateEmpRole();
    } else if (answers.pathway == "View all Roles" ) {
        allRole();
    } else if (answers.pathway == "Add Role") {
        addRole();
    } else if (answers.pathway == "View all Departments" ) {
        allDepartment();
    } else if (answers.pathway == "Add Deparment") {
        addDepartment();
    } else {
        return
    };
});

// db.query to show all of the __ table when options to view are selected
const allEmp = () => {db.query("SELECT * FROM employee", function (err, results) {console.log(results)})};
const allRole = () => {db.query("SELECT * FROM role", function (err, results) {console.log(results)})};
const allDepartment = () => {db.query("SELECT * FROM department", function (err, results) {console.log(results)})};

// Adding Employee
const addEmp = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
        },
        {
            type: "list",
            name: "role_id",
            message: "What is the employee's role?",
            // How to list all roles as choices?
            choices: [""],
        },
        {
            type: "list",
            name: "manager_id",
            message: "Who is the employee's manager?",
            // How to list all managers as choices along with none as an option?
            choices: [""],
        }])
    .then((answers) => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)`;
        // Are the params correct??
        const params = [answers.first_name, answers.last_name, answers.role_id, answers.manager_id];

        db.query(sql, params, function(err, result) {
            console.log(result);
        });
        // Which is better?
        console.log(`Added ${answers.first_name} ${answers.last_name} to database`);
        // or
        db.query("SELECT * FROM employee", function (err, results) {
            console.log(results);
        });
    });
};

// Updating Employee Role
const updateEmpRole = () => {
    inquirer.prompt([
        {
          type: "list",
          name: "emp_name",
          message: "Which employee's role do you want to update?",
          // How to list all deparments as choices?
          choices: [""],
        },
        {
          type: "list",
          name: "role",
          message: "Which role do you want to assign the selected employee?",
          // How to list all deparments as choices?
          choices: [""],
        }])
    .then((answers) => {
        const sql = `UPDATE employee SET title = ? WHERE id = ?`;
        // Are the params correct? Does answers.emp_name, update where it is supposed to? the first and last name spot?
        const params = [answers.role, answers.emp_name];

        db.query(sql, params, function (err, result) {
            console.log(result);
        });
        // Better to display table or have a console.log(Added __ to the database)
        console.log(`Added ${answers.department_name} to database`);
        // or
        db.query("SELECT * FROM role", function (err, results) {
          console.log(results);
        });
    });
};

// Adding Role
const addRole = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of the role?",
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary of the role?",
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            // How to list all deparments as choices?
            choices: [""],
        },
    ])
    .then((answers) => {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?)`;
        // Are the params correct?
        const params = [answers.title, answers.salary, answers.department_id];

        db.query(sql, params, function (err, result) {
            console.log(result);
        });
        // Better to display table or have a console.log(Added __ to the database)
        console.log(`Added ${answers.title} to database`);
        // or
        db.query("SELECT * FROM role", function (err, results) {
            console.log(results);
        });
    });
};

// Adding Department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the name of the department?",
        },
    ])
    .then((answers) => {
        const sql = `INSERT INTO department (department_name) VALUES (?)`;
        // Are the params correct?
        const params = [answers.department_name];

        db.query(sql, params, function (err, result) {
            console.log(result);
        });
        // Better to display table or have a console.log(Added __ to the database)
        console.log(`Added ${answers.department_name} to database`);
        // or
        db.query("SELECT * FROM role", function (err, results) {
            console.log(results);
        });
    });
};