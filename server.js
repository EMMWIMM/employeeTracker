//const mysql = require('mysql2');
const mysql =require('mysql2/promise');
const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table');
const bluebird = require('bluebird');
var departments= [
  // {value: 1, name: 'DEFAULT dept'},
  // {value: 2, name: 'static Sales'},
  // {value: 3, name: 'static Operations'},
  // {value: 4, name: 'static Manufacturing'}
];
var roles = [
  // {value: 1, name: 'DEFAULT Manager', },
  // {value: 2, name: 'Engineer'},
  // {value: 3, name: 'customer service rep'},
  // {value: 4, name: 'analyst'},
  // {value: 5, name: 'tech support'}
];
var employees = [
  //{value: 1, name: 'DEFAULT employee'},
  // {value: 2, name: 'deb White'},
  // {value: 3, name: 'mars seebee'},
  // {value: 4, name: 'jay somner'}
];
var employeeChoices =[
  //{value: 1, name: 'DEFAULT employee'}
];

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'employeeTrackerUser',
  password: 'looksLikeAPassword+',
  database: 'tracker_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
async function load(){
  // get the promise implementation, we will use bluebird
  roles.length =0;
  departments.length=0;
  employees.length = 0;
  employeeChoices.length=0;
  const bluebird = require('bluebird');

  // create the connection, specify bluebird as Promise
  const connection = await mysql.createConnection({  host: '127.0.0.1',
    user: 'employeeTrackerUser',
    password: 'looksLikeAPassword+',
    database: 'tracker_db',
    Promise: bluebird});

  // query database for roles
  const [role_rows, role_fields] = await connection.execute('SELECT r.id AS value, title AS name, salary, d.dep_name from roles r join departments d on d.id = r.dep_id;');
  role_rows.forEach((element) => {
    roles.push(element);
  });
  //console.log(roles);

  // query database for dept
  const [dept_rows, dept_fields] = await connection.execute('SELECT id AS value, dep_name as name FROM departments');
  dept_rows.forEach((element) => {
    departments.push(element);
  });
  // console.log(departments);

  // query database for employees
  var queryEmp =
    'SELECT e.id AS value, e.first_name, e.last_name, title, dep_name AS department, r.salary, concat(m.first_name, " ", m.last_name) as manager  '+
    'FROM employees e '+
    'join roles r on e.role_id = r.id '+
    'join departments d on r.dep_id = d.id '+
    'left outer join employees m on e.manager_id = m.id '
    ;
  const [emp_rows, emp_fields] = await connection.execute(queryEmp);
  emp_rows.forEach((element) => {
    employees.push(element);
    employeeChoices.push({value: element.value, name: element.first_name+" "+element.last_name});
  });
  //console.log(employees);
}

const questions = [{
  type:'list',
  message: ' What would you like to do?',
  choices: ['View all employees', 'Add employee', 'Update employee role', 'View all roles', 'Add role', 'View all departments', 'Add department', 'Update employee department', 'Quit'],
  name: 'doWhat'
},
{
  type:'input',
  message: ' What is the first name of this employee?',
  name: 'first_name',
  when: function(answers){
    return answers.doWhat === 'Add employee';
  }
},
{
  type:'input',
  message:' What is the last name of this employee?',
  name: 'last_name',
  when: function (answers){
    //console.log("first name",answers.first_name);
    return answers.doWhat === 'Add employee'
      &&  answers.first_name !== undefined;
  }

},
{
  type:'list',
  message:'choose a department',
  name: 'chooseDept',
  //choices: module.exports.getDepts()
  choices : departments,
  when: function(answers){
    return (answers.doWhat === 'Add role')
    ;
  }
},

{
  type:'list',
  message: ' Which employee would you like?',
  name: 'chooseEmployee',
  choices: employeeChoices,
  when: function(answers){
    return answers.doWhat == 'Update employee role'
      || answers.doWhat == 'Update employee department';
  }
},
{
  type:'list',
  message: ' Choose a role',
  name: 'chooseRole',
  choices: roles,
  when: function (answers){
    return (answers.doWhat === 'Add employee' &&answers.first_name !== undefined && answers.last_name !== undefined)
    || (answers.doWhat === 'Update employee role' && answers.chooseEmployee !== undefined);
  }
},
{
  type:'list',
  message:'who is their manager?',
  name: 'chooseManager',
  //choices: module.exports.getDepts()
  choices : employeeChoices,
  when: function(answers){
    return (answers.doWhat === 'Add employee' && answers.first_name !== undefined && answers.last_name !== undefined && answers.chooseRole !== undefined)

    ;
  }
},
  {
    type: 'input',
    message: ' what is the name of this role',
    name: 'addRole',
    when: function (answers){
      return answers.doWhat == 'Add role' && answers.chooseDept !== undefined;
    }
  },
  {
    type: 'input',
    message: ' what is the base salary for this role?',
    name: 'salary',
    when: function (answers){
      return answers.doWhat == 'Add role' && answers.chooseDept !== undefined && answers.addRole !== undefined;
    }
  },
  {
    type: 'input',
    message: 'What is the name of this department?',
    name: 'addDept',
    when: function (answers){
      return answers.doWhat == 'Add department'
    }
  },

]


// [
//   { id: 1, dep_name: 'Marketing' },
//   { id: 2, dep_name: 'Sales' },
//   { id: 3, dep_name: 'Customer support' },
//   { id: 4, dep_name: 'IT' },
//   { id: 5, dep_name: 'accounting' }
// ]
function saveToDB(saveType, ...args){
  console.log('saveToDB('+saveType+', '+args+')');;
  // console.log('args00: '+args[0][0]);
  switch(saveType) {
    case 'emp':
      pool.execute("insert into employees (first_name, last_name, role_id, manager_id) values ('"+args[0][0]+"', '"+args[0][1]+"', "+args[0][2]+", null)");
      break;
    case 'role':
      pool.execute("insert into roles (dep_id, title, salary) values ('"+args[0][0]+"', '"+args[0][1]+"', "+args[0][2]+")");
      break;
    case 'dept':
      pool.execute("insert into departments (dep_name) values ('"+args[0][0]+"')");
      break;
    case 'updateEmp':
      const empID = args[0][0];
      const roleID = args[0][1];
      var query = "update employees set role_id = "+roleID+" where id = "+empID;
      console.log("query:"+query);
      pool.execute(query);
      break;

    console.log('ERROR with saveType:'+saveType);
  }
}
function addDept(dept_name){
  saveToDB('dept', [dept_name]);
  departments.push({value: departments.length, name: dept_name});
}
function addRole(dept_id, roleName, salary){
  console.log('ROLE'+roleName);
  saveToDB('role', [dept_id, roleName, salary]);
}
function addEmp(firstName, lastName, departmentID, roleID){
  console.log('addEmp('+firstName+', '+lastName+', '+departmentID+', '+roleID+')');
  saveToDB('emp', [firstName, lastName, departmentID, roleID]);
  // employees.push({value: employees.length, first_name: firstName, last_name:lastName, de});
  load();
  console.table(employees);
}
function updateEmpRole(empID, roleID){
  saveToDB('updateEmp',[empID, roleID]);
  var thisRole = '';
  roles.forEach((item, i) => {
    if(item.value == roleID){
      thisRole = item.name;
    }
  });
  var thisEmpIndex = null;
  employees.forEach((item, i) => {
    if(item.value == empID){
      thisEmpIndex = i;
    }
  });

  employees[thisEmpIndex].title=thisRole;
}



var i = 0;

function mainInquirerLoop() {
  i++;
  inquirer
  .prompt(questions)
  .then((response) => {
    console.log(response);

    switch(response.doWhat) {
      case 'View all employees':
        console.log('here;'+employees);
        console.table(employees);
        break;
      case 'View all roles':
        console.table(roles);
        break;
      case 'View all departments':
        console.table(departments);
        // console.log('view departments DONE');
        break;

      case 'Add employee':
        addEmp(response.first_name, response.last_name, response.chooseRole, response. chooseManager);
        break;
      case 'Add role':
        addRole(response.chooseDept, response.addRole, response.salary)
        break;
      case 'Add department':
        addDept(response.addDept);
        break;

      case 'Update employee role':
        console.log('role respone obj;'+response);
        console.log(''+response.chooseEmployee);
        updateEmpRole(response.chooseEmployee, response.chooseRole);
        break;
      case 'Update employee department':
        updateEmpDept('???');
        break;
      case 'Quit':
        process.exit(0);
        break;
      console.log('run the mainInquirerLoop again!'+i);
    };
    mainInquirerLoop();
  });

};

load();
mainInquirerLoop();
