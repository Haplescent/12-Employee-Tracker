require("dotenv").config();

const {
  Introduction,
  DisplayEmployees,
  DisplayEmployeesbyDepartment,
  DisplayEmployeebyManager,
  AddAnEmployee,
  RemoveAnEmployee,
  UpdateAnEmployeeRole,
  UpdateAnEmployeeManager,
} = require("./employee-inquire");

const connection = require("./connection");

connection.connect((err) => {
  if (err) throw err;
  console.log("connected");
});

const mainMenu = () => {
  Introduction()
    .then(async (answers) => {
      if (answers.action === "View all employees") {
        await DisplayEmployees();
      } else if (answers.action === "View all employees by department") {
        await DisplayEmployeesbyDepartment();
      } else if (answers.action === "View all employees by manager") {
        await DisplayEmployeebyManager();
      } else if (answers.action === "Add an employee") {
        await AddAnEmployee();
      } else if (answers.action === "Remove an employee") {
        await RemoveAnEmployee();
      } else if (answers.action === "Update an employee role") {
        await UpdateAnEmployeeRole();
      } else if (answers.action === "Update an employee manager") {
        await UpdateAnEmployeeManager();
      } else {
        console.log("not a valid choice please try again");
        mainMenu();
      }
      mainMenu();
    })
    .catch((error) => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    });
};

mainMenu();
