const inquirer = require("inquirer");

const {
  ViewAllDepartmentPromise,
  ViewAllEmployeesPromise,
  ViewAllEmployeesbyDepartmentPromise,
  ViewAllManagerPromise,
  ViewAllEmployeesbyManagerPromise,
  ViewAllRolesPromise,
  GetRoleIdFromTitle,
  AddAnEmployeeSqlRequest,
  GetEmployeeIdFromName,
  RemoveAnEmployeeFromDatabase,
} = require("./orm");

// Helper functions that are NOT exported

const DisplayFirstAndLastName = (data) => {
  return new Promise((resolve, reject) => {
    data.forEach((element) =>
      console.log(`${element.first_name} ${element.last_name}`)
    );
    resolve();
  });
};

// Start of helper functions that ARE exported

const Introduction = () => {
  return new Promise(async (resolve, reject) => {
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What do you want to do?",
        choices: [
          "View all employees",
          "View all employees by department",
          "View all employees by manager",
          "Add an employee",
          "Remove an employee",
          "Update an employee role",
          "Update an employee manager",
        ],
      },
    ]);
    resolve(answer);
  });
};

const DisplayEmployees = () => {
  return new Promise(async (resolve, reject) => {
    const data = await ViewAllEmployeesPromise();
    DisplayFirstAndLastName(data);
    resolve();
  });
};

const DisplayEmployeesbyDepartment = () => {
  return new Promise(async (resolve, reject) => {
    const data = await ViewAllDepartmentPromise();
    const prompt_array = data.map((e) => e["s"]);
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Which department?",
        choices: prompt_array,
      },
    ]);
    const selectedData = await ViewAllEmployeesbyDepartmentPromise(
      answer.action
    );
    selectedData.forEach((e) => console.log(`${e.first_name} ${e.last_name}`));
    resolve();
  });
};

const DisplayEmployeebyManager = () => {
  return new Promise(async (resolve, reject) => {
    const data = await ViewAllManagerPromise();
    const promptArray = [];
    const MangerNameToId = {};
    data.forEach((e) => {
      promptArray.push(`${e.first_name} ${e.last_name}`);
      MangerNameToId[`${e.first_name} ${e.last_name}`] = e.id;
    });
    answers = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Which Manager?",
        choices: promptArray,
      },
    ]);
    const managerID = MangerNameToId[answers.action];
    const selectedData = await ViewAllEmployeesbyManagerPromise(managerID);
    DisplayFirstAndLastName(selectedData);
    resolve();
  });
};

const AddAnEmployee = () => {
  return new Promise(async (resolve, reject) => {
    const data = await ViewAllRolesPromise();
    const promptArray = data.map((e) => e.title);
    const answers = await inquirer.prompt([
      {
        name: "firstName",
        message: "First Name?",
      },
      {
        name: "lastName",
        message: "Last Name?",
      },
      {
        type: "list",
        name: "role",
        message: "Which Role?",
        choices: promptArray,
      },
    ]);
    const roleID = await GetRoleIdFromTitle(answers.role);
    const inputObject = {
      firstName: answers.firstName,
      lastName: answers.lastName,
      role_id: roleID[0].id,
    };
    AddAnEmployeeSqlRequest(inputObject);
    resolve();
  });
};

const RemoveAnEmployee = () => {
  return new Promise(async (resolve, reject) => {
    const data = await ViewAllEmployeesPromise();
    const promptArray = data.map((e) => `${e.first_name} ${e.last_name}`);
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Which Employee?",
        choices: promptArray,
      },
    ]);
    const name = answers.employee;
    const nameArray = name.split(" ");
    const employeeID = await GetEmployeeIdFromName(nameArray[0], nameArray[1]);
    RemoveAnEmployeeFromDatabase(employeeID[0].id);
    resolve();
  });
};
const UpdateAnEmployeeRole = () => {
  return new Promise((resolve, reject) => {});
};
const UpdateAnEmployeeManager = () => {
  return new Promise((resolve, reject) => {});
};

module.exports = {
  Introduction,
  DisplayEmployees,
  DisplayEmployeesbyDepartment,
  DisplayEmployeebyManager,
  AddAnEmployee,
  RemoveAnEmployee,
  UpdateAnEmployeeRole,
  UpdateAnEmployeeManager,
};
