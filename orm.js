const connection = require("./connection");

const ViewAllEmployeesbyDepartmentPromise = (department_name) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
    SELECT first_name, last_name 
    FROM employee, role, department
    WHERE employee.role_id = role.id AND
    role.department_id = department.id AND
    department.s = ?`,
      [department_name],
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const ViewAllDepartmentPromise = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
    SELECT s FROM department`,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const ViewAllManagerPromise = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
    SELECT * 
    FROM employee
    WHERE isManger = true`,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const ViewAllEmployeesPromise = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
    SELECT * FROM employee`,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const ViewAllEmployeesbyManagerPromise = (managerID) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT first_name, last_name 
      FROM employee
      WHERE employee.manager_id = ?`,
      [managerID],
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const ViewAllRolesPromise = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
        SELECT title FROM role`,
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const GetRoleIdFromTitle = (title) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT id 
      FROM role 
      WHERE title = ?`,
      [title],
      (err, data) => {
        err ? reject(err) : resolve(data[0].id);
      }
    );
  });
};

const AddAnEmployeeSqlRequest = (inputObj) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      INSERT INTO employee(first_name, last_name, role_id, manager_id)
      VALUES (?, ?, ?, 1);
      `,
      [inputObj.firstName, inputObj.lastName, inputObj.role_id],
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const GetEmployeeIdFromName = (firstName, lastName) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      SELECT id 
      FROM employee 
      WHERE first_name = ? AND last_name = ?;`,
      [firstName, lastName],
      (err, data) => {
        err ? reject(err) : resolve(data);
      }
    );
  });
};

const RemoveAnEmployeeFromDatabase = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      DELETE FROM employee 
      WHERE id = ?;`,
      [id],
      (err) => {
        err ? reject(err) : resolve();
      }
    );
  });
};

const UpdateEmployeeRoleSQLRequest = (id, role_id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      UPDATE employee
      SET role_id = ?
      WHERE id = ?;`,
      [role_id, id],
      (err) => {
        err ? reject(err) : resolve();
      }
    );
  });
};
const UpdateEmployeeManagerSQLRequest = (id, manager_id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `
      UPDATE employee
      SET manager_id = ?
      WHERE id = ?;`,
      [manager_id, id],
      (err) => {
        err ? reject(err) : resolve();
      }
    );
  });
};
module.exports = {
  ViewAllDepartmentPromise,
  ViewAllEmployeesbyDepartmentPromise,
  ViewAllEmployeesPromise,
  ViewAllManagerPromise,
  ViewAllEmployeesbyManagerPromise,
  ViewAllRolesPromise,
  GetRoleIdFromTitle,
  AddAnEmployeeSqlRequest,
  GetEmployeeIdFromName,
  RemoveAnEmployeeFromDatabase,
  UpdateEmployeeRoleSQLRequest,
  UpdateEmployeeManagerSQLRequest,
};
