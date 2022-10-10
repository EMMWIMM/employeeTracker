const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');


const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: '',
    database: 'tracker_db'
  },
  console.log(`Connected to the tracker_db database.`)
);

db.connect(function(error){
  if(error) throw error;
  console.log("there was a problem connecting");
})

const quesrtions = [{
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
  message:'what is the role of this employee?',
  name: 'job',
  choices: []
}
]
