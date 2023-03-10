import React, { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { store } from './app/store';
import { Todo } from './todosApi';
import { selectTodos, getTodosAsync, updateTodoAsync, deleteTodoAsync, createTodoAsync } from './todosSlice'

function TodoApp() {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);
  const todoStatus = useAppSelector(state => state.todos.status);
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoStatus === 'idle') {
      dispatch(getTodosAsync())
    }
  }, []);

  const updateTodo = (todo: Todo) => {
    dispatch(updateTodoAsync(todo))
      .then(() => dispatch(getTodosAsync()));
  };

  const deleteTodo = (todo: Todo) => {
    dispatch(deleteTodoAsync(todo))
      .then(() => dispatch(getTodosAsync()));
  };

  const createTodo = (text: string) => {
    dispatch(createTodoAsync(text))
      .then(() => dispatch(getTodosAsync()));
  };

  return (
    <div className="App">
      <div className='todos'>
        {todos?.map((todo) => (
          <React.Fragment key={todo.id}>
            <div>
              <input 
                type="checkbox" 
                checked={todo.done} 
                onChange={() => { updateTodo({ ...todo, done: !todo.done }) }} 
              />
              <span>{todo.text}</span>
            </div>
            <button onClick={() => { deleteTodo(todo) }}>Delete</button>
          </React.Fragment>
        ))}
      </div>
      <div className='add'>
        <input type='text' ref={textRef} />
        <button 
          onClick={() => { 
            createTodo(textRef.current!.value ?? '');
            textRef.current!.value = '';
          }}
         >Add</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  )
}

export default App;
