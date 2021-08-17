import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io.connect('http://localhost:8000', {
      transports: ['websocket'],
    });
    this.socket.on('addTask', task => this.addTask(task));
    this.socket.on('removeTask', taskIndex => this.removeTask(taskIndex));
    this.socket.on('updateData', tasks => this.updateTasks(tasks));
  }

  updateTasks = newTasks => {
    this.setState({ tasks: newTasks });
  }

  addTask = task => {
    //this.setState({ tasks: this.state.tasks.concat(task) });
    this.setState({ tasks: [...this.state.tasks, task] });
  }

  submitForm = e => {
    e.preventDefault();
    this.addTask(this.state.taskName);
    this.socket.emit('addTask', this.state.taskName);
    this.setState({ taskName: '' });
  }

  removeTask = (id, local) => {
    this.setState({ tasks: this.state.tasks.filter((item => this.state.tasks.indexOf(item) !== id)) });
    if(local) {this.socket.emit('removeTask', id)};
  }

  render() {
    const { tasks, taskName } = this.state;
    return (
      <div className="App">
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(item => (
              <li key={tasks.indexOf(item)} className="task">{item}
                <button onClick={() => this.removeTask(tasks.indexOf(item), true)} className="btn btn--red">Remove</button>
              </li>
            ))}
          </ul>

          <form
            id="add-task-form"
            onSubmit={e => this.submitForm(e)}
          >
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={taskName}
              onChange={e => this.setState({ taskName: e.target.value })}
            />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };
};

export default App;
