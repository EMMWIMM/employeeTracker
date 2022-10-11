const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table');


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
  console.log(`Connected to the tracker_db database.`)
);

db.connect(function(error){
  if(error){
    console.log("there was a problem connecting", error);
    throw error;
  } else {
    console.log("Connected to the tracker_db database. For REAL this time! ;)");
  }

})

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
  choices: []
}
]

inquirer
.prompt(questions)
.then((response) => {
  console.log(response);
});
