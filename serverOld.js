//const mysql = require('mysql2');
const mysql =require('mysql2/promise')
const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table');
var returnToQuestionOne = true;
var departments= []; //= [
// { value: 1, name: 'TESTDATA'},
// {value: 2, name: 'MORE TEST DATA'},
// {value: 3, name: 'just more test data'},
// {value: 4, name: 'last test dept'}]
var roles = [
  {value: 1, name: 'Manager'},
  {value: 2, name: 'Engineer'},
  {value: 3, name: 'customer service rep'},
  {value: 4, name: 'analyst'},
  {value: 5, name: 'tech support'}
]
var employees = [
  {value: 1, name: 'same hill'},
  {value: 2, name: 'deb White'},
  {value: 3, name: 'mars seebee'},
  {value: 4, name: 'jay somner'}
]


mysql.createConnection({
  host: '127.0.0.1',
  // MySQL username,
  user: 'employeeTrackerUser',
  // MySQL password
  password: 'looksLikeAPassword+',
  //socketPath: '/tmp/mysql.sock',
  database: 'tracker_db'
}).then(conn => conn.query('SELECT id as value, dep_name as name FROM departments'))
  .then(([rows, fields]) => {
    console.log(rows[0].value);

  rows.forEach( element => {
    departments.push( element)

  });

  })
console.log("departments:", departments);


const questions = [{
  type:'list',
  message: ' What would you like to do?',
  choices: ['View all employees', 'Add employee', 'Update employee role', 'View all roles', 'Add role', 'View all departments', 'Add department', 'Update employee department'],
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
    return (answers.doWhat === 'Add employee' && answers.first_name !== undefined && answers.last_name !== undefined)
        || (answers.doWhat === 'Add role')
        || (answers.doWhat === 'Update employee department' && answers.chooseEmployee !== undefined)
    ;
  }
},
{
  type:'list',
  message: ' Choose a role',
  name: 'chooseRole',
  choices: roles,
  when: function (answers){
    return (answers.doWhat === 'Add employee' &&answers.first_name !== undefined && answers.last_name !== undefined && answers.chooseDept !==undefined)
    || (answers.doWhat === 'Update employee role'&& answers.chooseEmployee !== undefined);
  }
},
{
  type:'list',
  message: ' Which employee would you like?',
  name: 'chooseEmployee',
  choices: employees,
  when: function(answers){
    return answers.doWhat == 'Update employee role'
      || answers.doWhat == 'Update employee department';
  }
},
  {
    type: 'input',
    message: ' what is the name of this role',
    name: 'addRole',
    when: function (answers){
      return answers.doWhat == ' Add role' && answers.chooseDept !== undefined;
    }
  },
  {
    type: 'input',
    message: ' what is the base salary for this role?',
    name: 'salary',
    when: function (answers){
      return answers.doWhat == ' Add role' && answers.chooseDept !== undefined && answers.addRole !== undefined;
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

function init() {
  inquirer
  .prompt(questions)
  .then((response) => {
    console.log(response);
  })then(async (answer) => {
    console.log("answer:", answer);
  });
}

const exit = () => {
  inquirer.prompt([
    {
      name: "continue",
      type: "confirm",
      message: "Would you like to perform another action?",
    }
  ]).then((answer) => {
    if(answer.continue) return init();
  });
}
