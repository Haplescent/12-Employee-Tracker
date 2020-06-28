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
} = require("./orm");

const Introduction = () => {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
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
      ])
      .then((answer) => {
        resolve(answer);
      });
  });
};

const DisplayEmployees = () => {
  return new Promise((resolve, reject) => {
    ViewAllEmployeesPromise().then((data) => {
      console.log(data);
      resolve();
    });
  });
};

const DisplayEmployeesbyDepartment = () => {
  return new Promise((resolve, reject) => {
    ViewAllDepartmentPromise().then((data) => {
      prompt_array = [];
      data.forEach((element) => {
        prompt_array.push(element.s);
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "action",
            message: "Which department?",
            choices: prompt_array,
          },
        ])
        .then(async (answer) => {
          department_choice = answer.action;
          data = await ViewAllEmployeesbyDepartmentPromise(department_choice);
          console.log(data);
          resolve();
        });
    });
  });
};

const DisplayEmployeebyManager = () => {
  return new Promise((resolve, reject) => {
    ViewAllManagerPromise().then((data) => {
      promptArray = [];
      MangerNameToId = {};
      data.forEach((element) => {
        promptArray.push(`${element.first_name} ${element.last_name}`);
        MangerNameToId[`${element.first_name} ${element.last_name}`] =
          element.id;
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "action",
            message: "Which Manager?",
            choices: promptArray,
          },
        ])
        .then(async (answer) => {
          managerID = MangerNameToId[answer.action];
          names = await ViewAllEmployeesbyManagerPromise(managerID);
          console.log(names);
          resolve();
        });
    });
  });
};
const AddAnEmployee = () => {
  return new Promise(async (resolve, reject) => {
    data = await ViewAllRolesPromise();
    promptArray = [];
    data.forEach((element) => {
      promptArray.push(element.title);
    });
    inquirer
      .prompt([
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
      ])
      .then(async (answers) => {
        console.log(answers);
        roleID = await GetRoleIdFromTitle(answers.role);
        console.log(roleID);
        inputObject = {
          firstName: answers.firstName,
          lastName: answers.lastName,
          role_id: roleID[0].id,
        };
        console.log(inputObject);
        await AddAnEmployeeSqlRequest(inputObject);
        resolve();
      });
  });
};

const RemoveAnEmployee = () => {
  return new Promise((resolve, reject) => {});
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
