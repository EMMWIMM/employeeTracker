const mysql = require('mysql2');
const mysqlPromise =require('mysql2/promise')
const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table');
var departments = [
{ value: 1, name: 'IT'},
{value: 2, name: 'Marketing'},
{value: 3, name: 'sales'},
{value: 4, name: 'Customer Service'}]
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


const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    // MySQL username,
    user: 'employeeTrackerUser',
    // MySQL password
    password: 'looksLikeAPassword+',
    //socketPath: '/tmp/mysql.sock',
    database: 'tracker_db'
  },
  console.log(`Connecting config created`)
)

db.connect(function(error){
//connect to db
  if(error){
    console.log("there was a problem connecting", error);
    throw error;
  } else {
    console.log("Connected to the tracker_db database. For REAL this time! ;)");
  }


});

function viewDepts(){
//let departments = db.connect(function(){
  var result = db.query("SELECT id as value, dep_name as name FROM departments", function (error, result, fields){
    if(error) throw error;
    console.log("query result: ",result);
    return result;
  });
   console.log("connect result: ",result);
  return result;
// });

};
console.log("viewDepts() returns: ", viewDepts());

// module.exports = {
//   getDepts: async (req, res) => {
//   let query = "SELECT id as value, dep_name as name FROM departments";
//   const [dept] = await db.query(query).catch(error => { throw error});
//   console.log("dept=", dept);
//   return dept;
// }};

viewDepts();



const questions = [{
  type:'list',
  message: ' What would you like to do?',
  choices: ['View all employees', 'Add employee', 'Update employee role', 'View all roles', 'Add role', 'View all departments', 'Add department'],
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
    return answers.first_name !== '';
  }

},
{
  type:'list',
  message:'what department does this employee work in?',
  name: 'department',
  //choices: module.exports.getDepts()
  choices :
   [
      {value : '1', name: 'Marketing'},
      {value: '2', name: 'Sales'},
      {value: '3', name:'Customer Support'}
    ]
},
{
  type:'list',
  message: ' What is the job title of this employee?',
  name: 'role',
  choices: []
},
{
  type:'list',
  message: ' which employee would you like to update?',
  name: 'chooseEmployee',
  choices: [],
  when: function(answers){
    return answers.doWhat == 'Update employee role';
  }
},
{
  type: 'list',
  message: 'what should the new role of this employee be?',
  name: 'updateRole',
  choices:[],
  when: function(answers){
    return answers.chooseEmployee!== ' ';
  }
},
{
  type: 'list',
  message: ' which department does this role fit under?',
  name: 'chooseDept',
  choices:[],
  when: function (answers){
    return answers.doWhat == ' Add role';
  },
  {
    type: 'input',
    message: ' what is the name of this role',
    name: 'addRole',
    choices: [],
    when: function (answers){
      return answers.chooseDept !== ' ';
    }
  },
  {
    type: 'input',
    message: 'What is the name of this department?',
    name: 'addDept',
    when: function (answers){
      return answers.doWhat == 'Add department'
    }
  }

}
]


// [
//   { id: 1, dep_name: 'Marketing' },
//   { id: 2, dep_name: 'Sales' },
//   { id: 3, dep_name: 'Customer support' },
//   { id: 4, dep_name: 'IT' },
//   { id: 5, dep_name: 'accounting' }
// ]

// inquirer
// .prompt(questions)
// .then((response) => {
//   console.log(response);
// });
