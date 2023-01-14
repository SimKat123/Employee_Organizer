// Packages
const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();

// Connect to database with dotenv
const db = mysql.createConnection({
  host: "localhost",
  dialect: "mysql",
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});
console.log(`Connected to the management_db database.`);

// prompts for the interminal
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
      } else if (answers.pathway == "Add Department") {
        addDepartment();
      } else {
        return;
      }
    });
};

// db.query to show all of the __ table when options to view are selected
const allEmp = () => {
  db.query(
    `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.department_name AS department, 
    role.salary, 
    CONCAT (manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id`,
    function (err, results) {
      if (err) throw err;
      console.table(results);
      choices();
    }
  );
};
const allRole = () => {
  db.query(
    `SELECT
    role.id,
    role.title,
    role.salary,
    department.department_name AS department FROM role
    JOIN department ON role.department_id = department.id`,
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
  //
  db.query("SELECT role.id, role.title FROM role", function (err, results) {
    if (err) throw err;
    const roleList = results.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });

    db.query(
      "SELECT employee.id, employee.first_name, employee.last_name FROM employee",
      function (err, results) {
        if (err) throw err;
        const employeeList = results.map((employee) => {
          return {
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          };
        });

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
              choices: employeeList,
            },
          ])
          .then((answers) => {
            const sql = `INSERT INTO employee SET ?`;
            db.query(sql, answers, function (err, results) {
              if (err) throw err;
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
    const roleList = results.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });

    db.query(
      "SELECT employee.id, employee.first_name, employee.last_name FROM employee",
      function (err, results) {
        if (err) throw err;
        const employeeList = results.map((employee) => {
          return {
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          };
        });
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
            let empName, role_id;
            for (let i = 0; i < employeeList.length; i++) {
              if (employeeList[i].value == answers.emp_name) {
                empName = employeeList[i].value;
              }
            }
            for (let i = 0; i < roleList.length; i++) {
              if (roleList[i].value == answers.role) {
                role_id = roleList[i].value;
              }
            }
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            db.query(sql, [role_id, empName], function (err, results) {
              if (err) throw err;
              console.log(`Employe's role has been changed`);
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
    const departmentList = results.map((department) => {
      return {
        name: department.department_name,
        value: department.id,
      };
    });

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
        const sql = `INSERT INTO role SET ?`;
        db.query(sql, answers, function (err, results) {
          if (err) throw err;
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
        name: "department_name",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      const sql = `INSERT INTO department SET ?`;
      db.query(sql, answers, function (err, results) {
        if (err) throw err;
        console.log(`Added ${answers} to database`);
        choices();
      });
    });
};

choices();
