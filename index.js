const express = require('express');
const app = express();

const Joi = require('joi');

app.use(express.json());

const students = [
  {id: 1, name: 'fatir'},
  {id: 2, name: 'subhan'},
  {id: 3, name: 'resa'},
  {id: 4, name: 'ferdi'}
];

app.get('/', (req, res) => {
  res.send('Hi Express JS!');
});

// handling GET requests
app.get('/api/students', (req, res) => {
  res.send(students);
});

app.get('/api/students/:id', (req, res) => {
  const student = students.find(x => x.id === parseInt(req.params.id));
  if (!student) return res.status(404).send('student was not found');
  res.send(student);
});

// input validate function for PUT & POST methods use Joi
function validateStudent(student) {
  const schema = {
    name: Joi.string().min(3).required()
  };
  return Joi.validate(student, schema);
}

// handling POST requests
app.post('/api/students', (req, res) => {
  // call validate function
  const {error} = validateStudent(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // push object into array
  const student = {
    id: students.length + 1,
    name: req.body.name
  };
  students.push(student);
  res.send(student);
});

// handling PUT requests
app.put('/api/students/:id', (req, res) => {
  // check the students or GET list students
  const student = students.find(x => x.id === parseInt(req.params.id));
  if (!student) return res.status(404).send('student was not found');

  // call validate function
  const {error} = validateStudent(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // update student
  student.name = req.body.name;
  res.send(student);
});

// handling DELETE requests
app.delete('/api/students/:id', (req, res) => {
  // check the students or GET list students
  const student = students.find(x => x.id === parseInt(req.params.id));
  if (!student) return res.status(404).send('student was not found');

  // delete student
  const index = students.indexOf(student);
  students.splice(index, 1);
  res.send(student);
});

// 2 parameters
app.get('/api/time/:year/:month', (req, res) => {
  res.send(req.params);
});

// query (?sortBy=name)
app.get('/api/sorting', (req, res) => {
  res.send(req.query);
});

// dynamic PORT
const port = process.env.PORT || 4000
app.listen(port, () => console.log(`listening on port ${port}...`));
