const express = require("express");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const app = express();

app.use(express.json());

const port = 5000;

let todos = [];

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === req.params.id);
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).send('Todo item not found');
  }
});

app.post('/create', (req, res) => {
  const { title, content } = req.body;
  const newTodo = {
    id: uuidv4(),
    title,
    content
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const { title, content } = req.body;
  const todo = todos.find(t => t.id === req.params.id);
  if (todo) {
    todo.title = title !== undefined ? title : todo.title;
    todo.content = content !== undefined ? content : todo.content;
    res.json(todo);
  } else {
    res.status(404).send('Todo item not found');
  }
});

app.delete('/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex(t => t.id === req.params.id);
  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Todo item not found');
  }
});

app.get('/download', (req, res) => {
  const todosText = todos.map(todo => `ID: ${todo.id}\nTitle: ${todo.title}\nContent: ${todo.content}\n`).join('\n');
  
  fs.writeFileSync('todos.txt', todosText);
  res.download('todos.txt', (err) => {
    if (err) {
      res.status(500).send('Error downloading file');
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
