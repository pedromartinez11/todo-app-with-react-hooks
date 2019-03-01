import React, { useReducer, useState, useContext } from "react";

const TodoContext = React.createContext();

const appReducer = (state, action) => {
  console.log("appReducer action:", action);
  switch (action.type) {
    case "add":
      return [
        ...state,
        {
          id: Date.now(),
          text: action.payload,
          completed: false
        }
      ];

    case "toggleTodo":
      return state.map(todo => {
        return todo.id !== action.payload
          ? todo
          : {
              ...todo,
              completed: !todo.completed
            };
      });
    default:
      return state;
  }
};

function TodosApp() {
  const [state, dispatch] = useReducer(appReducer, []);
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      <TodoList todos={state} />
      <TodoForm />
    </TodoContext.Provider>
  );
}

function TodoList({ todos }) {
  return (
    <div>
      <h2>Todos:</h2>
      {(todos || []).length === 0 && <span>no todos...</span>}
      <div>
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

function TodoItem({ todo }) {
  const { dispatch } = useContext(TodoContext);
  const style = {
    textDecoration: todo.completed ? "line-through" : "none"
  };

  const onClick = () => {
    dispatch({ type: "toggleTodo", payload: todo.id });
  };

  return (
    <div onClick={onClick} style={style}>
      <input type="checkbox" value={todo.completed} onClick={onClick} />
      {todo.text}
    </div>
  );
}

function TodoForm() {
  const [text, setText] = useState("");
  const context = useContext(TodoContext);
  const dispatch = context.dispatch;
  const onAddClick = () => {
    dispatch({ type: "add", payload: text });
    setText("");
  };
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={ev => setText(ev.target.value)}
      />
      <button onClick={onAddClick}>Add</button>
    </div>
  );
}

export default TodosApp;
