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
  UpdateEmployeeRoleSQLRequest,
  UpdateEmployeeManagerSQLRequest,
  AddADepartmentSqlRequest,
  AddARoleSqlRequest,
} = require("./orm");

// SELECT functions take no parameters and return the ID of whatever the user choses

const SelectADepartment = () => {
  return new Promise(async (resolve, reject) => {
    const data = await ViewAllDepartmentPromise();
    const promptArray = [];
    const DepartmentNameToId = {};
    data.forEach((e) => {
      promptArray.push(e["s"]);
      DepartmentNameToId[e["s"]] = e["id"];
    });
    answers = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Which Department?",
        choices: promptArray,
      },
    ]);
    const DepartmentID = DepartmentNameToId[answers.action];
    resolve(DepartmentID);
  });
};

const SelectAnEmployee = () => {
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
    resolve(employeeID[0].id);
  });
};

const SelectAManager = () => {
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
    resolve(managerID);
  });
};

// Display functions use the Select functions from above to display employee information

const DisplayFirstAndLastName = (data) => {
  return new Promise((resolve, reject) => {
    data.forEach((element) =>
      console.log(`${element.first_name} ${element.last_name}`)
    );
    resolve();
  });
};

const DisplayEmployees = () => {
  return new Promise(async (resolve, reject) => {
    const data = await ViewAllEmployeesPromise();
    DisplayFirstAndLastName(data);
    resolve();
  });
};

const DisplayDepartment = () => {
  return new Promise(async (resolve, reject) => {
    const data = await ViewAllDepartmentPromise();
    data.forEach((e) => {
      console.log(e["s"]);
    });
    resolve();
  });
};

const DisplayRoles = () => {
  return new Promise(async (resolve, reject) => {
    const data = await ViewAllRolesPromise();
    data.forEach((e) => {
      console.log(e["title"]);
    });
    resolve();
  });
};

const DisplayEmployeesbyDepartment = () => {
  return new Promise(async (resolve, reject) => {
    departmentID = await SelectADepartment();
    const selectedData = await ViewAllEmployeesbyDepartmentPromise(
      departmentID
    );
    selectedData.forEach((e) => console.log(`${e.first_name} ${e.last_name}`));
    resolve();
  });
};

const DisplayEmployeebyManager = () => {
  return new Promise(async (resolve, reject) => {
    const managerID = await SelectAManager();
    const selectedData = await ViewAllEmployeesbyManagerPromise(managerID);
    DisplayFirstAndLastName(selectedData);
    resolve();
  });
};

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
          "Add a Department",
          "Add a role",
          "View all departments",
          "View all roles",
        ],
      },
    ]);
    resolve(answer);
  });
};

// Add and Remove functions use Select and Display functions to add/remove employee information

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

const AddADepartment = () => {
  return new Promise(async (resolve, reject) => {
    const answers = await inquirer.prompt([
      {
        name: "department",
        message: "Name of Department",
      },
    ]);
    AddADepartmentSqlRequest(answers.department);
    resolve();
  });
};

const AddARole = () => {
  return new Promise(async (resolve, reject) => {
    departmentID = await SelectADepartment();
    const answers = await inquirer.prompt([
      {
        name: "title",
        message: "title?",
      },
      {
        name: "salary",
        message: "salary?",
      },
    ]);
    salary = parseInt(answers.salary);
    AddARoleSqlRequest(departmentID, answers.title, salary);
    resolve();
  });
};

const RemoveAnEmployee = () => {
  return new Promise(async (resolve, reject) => {
    const employeeID = await SelectAnEmployee();
    RemoveAnEmployeeFromDatabase(employeeID);
    resolve();
  });
};

const UpdateAnEmployeeRole = () => {
  return new Promise(async (resolve, reject) => {
    const employeeID = await SelectAnEmployee();
    const data = await ViewAllRolesPromise();
    const promptArray = data.map((e) => e.title);
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "title",
        message: "Which Role?",
        choices: promptArray,
      },
    ]);
    const title = answer.title;
    const roleID = await GetRoleIdFromTitle(title);
    UpdateEmployeeRoleSQLRequest(employeeID, roleID);
    resolve();
  });
};

const UpdateAnEmployeeManager = () => {
  return new Promise(async (resolve, reject) => {
    const employeeID = await SelectAnEmployee();
    const managerID = await SelectAManager();
    UpdateEmployeeManagerSQLRequest(employeeID, managerID);
    resolve();
  });
};

module.exports = {
  Introduction,
  DisplayEmployees,
  DisplayEmployeesbyDepartment,
  DisplayEmployeebyManager,
  DisplayDepartment,
  DisplayRoles,
  AddAnEmployee,
  RemoveAnEmployee,
  UpdateAnEmployeeRole,
  UpdateAnEmployeeManager,
  AddADepartment,
  AddARole,
};
