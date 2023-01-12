// Packages
const inquirer = require("inquirer");
const mysql = require("mysql2");
// require("dotenv").config();

const db = mysql.createConnection(
  // process.env.database,
  // process.env.user,
  // process.env.password,
  {
    host: "localhost",
    dialect: "mysql",
    user: "root",
    password: "",
    database: "management_db",
    // port: 3306,
  }
);
console.log(`Connected to the management_db database.`);

const choices = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "pathway",
        message: "What would you like to do?",
        choices: [
          "View all Employees",
          "Add Employee",
          "Update Employee Role",
          "View all Roles",
          "Add Role",
          "View all Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])

    .then((answers) => {
      if (answers.pathway == "View all Employees") {
        allEmp();
      } else if (answers.pathway == "Add Employee") {
        addEmp();
      } else if (answers.pathway == "Update Employee Role") {
        updateEmpRole();
      } else if (answers.pathway == "View all Roles") {
        allRole();
      } else if (answers.pathway == "Add Role") {
        addRole();
      } else if (answers.pathway == "View all Departments") {
        allDepartment();
      } else if (answers.pathway == "Add Deparment") {
        addDepartment();
      } else {
        return;
      }
    });
};

// db.query to show all of the __ table when options to view are selected
const allEmp = () => {
  db.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department_id JOIN employee manager ON manager.id = employee.manager_id",
    function (err, results) {
      if (err) throw err;
      console.table(results);
      choices();
    }
  );
};
const allRole = () => {
  db.query(
    "SELECT role.id, role.title, role.salary, department.department_name AS department FROM role JOIN department ON role.department_id",
    function (err, results) {
      if (err) throw err;
      console.table(results);
      choices();
    }
  );
};
const allDepartment = () => {
  db.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    choices();
  });
};

// Adding Employee
const addEmp = () => {
  db.query("SELECT role.id, role.title FROM role", function (err, results) {
    if (err) throw err;
    const roleList = results.map((role) => role.id + ". " + role.title);

    db.query(
      "SELECT employee.id, employee.first_name, employee.last_name FROM employee",
      function (err, results) {
        if (err) throw err;
        const employeeList = results.map(
          (employee) =>
            employee.id + ". " + employee.first_name + " " + employee.last_name
        );
        inquirer
          .prompt([
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
              choices: roleList,
            },
            {
              type: "list",
              name: "manager_id",
              message: "Who is the employee's manager?",
              // How to list all managers and add none as an option?
              choices: employeeList
            },
          ])
          .then((answers) => {
            const sql = `INSERT INTO employee VALUES (?)`;
            // Are the params correct??
            const params = [
              answers.first_name,
              answers.last_name,
              answers.role_id,
              answers.manager_id,
            ];

            db.query(sql, params, function (err, results) {
              if (err) throw err;
              console.table(results);
              console.log(
                `Added ${answers.first_name} ${answers.last_name} to database`
              );
              choices();
            });
          });
      }
    );
  });
};

// Updating Employee Role
const updateEmpRole = () => {
  db.query("SELECT role.id, role.title FROM role", function (err, results) {
    if (err) throw err;
    const roleList = results.map((role) => role.id + ". " + role.title);

    db.query(
      "SELECT employee.id, employee.first_name, employee.last_name FROM employee",
      function (err, results) {
        if (err) throw err;
        const employeeList = results.map(
          (employee) =>
            employee.id + ". " + employee.first_name + " " + employee.last_name
        );

        inquirer
          .prompt([
            {
              type: "list",
              name: "emp_name",
              message: "Which employee's role do you want to update?",
              choices: employeeList,
            },
            {
              type: "list",
              name: "role",
              message:
                "Which role do you want to assign the selected employee?",
              choices: roleList,
            },
          ])
          .then((answers) => {
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            // Are the params correct? Does answers.emp_name, update where it is supposed to? the first and last name spot?
            const params = [answers.role, answers.emp_name];

            db.query(sql, params, function (err, results) {
              if (err) throw err;
              console.table(results);
              console.log(`Added ${answers.department_name} to database`);
              choices();
            });
          });
      }
    );
  });
};

// Adding Role
const addRole = () => {
  db.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    const departmentList = results.map((department) => department.id + ". " + department.department_name);
    inquirer
      .prompt([
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
          choices: departmentList,
        },
      ])
      .then((answers) => {
        const sql = `INSERT INTO role (title, salary, department_id) VALUES (?)`;
        const params = [answers.title, answers.salary, answers.department_id];

        db.query(sql, params, function (err, results) {
          if (err) throw err;
          console.table(results);
          console.log(`Added ${answers.title} to database`);
          choices();
        });
      });
  });
};

// Adding Department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      const sql = `INSERT INTO department (department_name) VALUES (?)`;
      const params = answers;

      db.query(sql, params, function (err, results) {
        if (err) throw err;
        console.table(results);
        console.log(`Added ${answers.department_name} to database`);
        choices();
      });
    });
};

choices();
