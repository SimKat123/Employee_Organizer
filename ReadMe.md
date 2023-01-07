What would you like to do?
    - View all Employees (shows all employee's table)
        id fn ln title department salary manager
        int var var var var int var
    - Add Employee
        What is the employee's first name? What is the employee's last name? What is the employee's role? (list roles) Who is the employee's manager? (list managers along with none) => Added __ to the database
    - Update Employee Role
        Which employee's role do you want to update? (list employee's) Which role do you want to assign the selected employee? (list roles)
    - View all Roles
        id title department salary
        int var(30) var(30) int
    - Add Role
        What is the name of the role? What is the salary of the role? Which department does the role belong to? (list departments) => Added __ to the database
    - View all Departments
        id name
        int role
    - Add Department
        What is the name of the department? => Added ___ to the database
    - Quit


WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database