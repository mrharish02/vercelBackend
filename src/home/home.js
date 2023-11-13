import React, { useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom'
import './home.css'


const Home = () => {
  const [todos, setTodos] = useState([]);
  const [title,setTitle] = useState('')
  const [ desc,setDesc] = useState('')
  const navigate = useNavigate()

  async function logout() {
    try {
      const response = await fetch('http://localhost:3001/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials to send cookies along with the request
      });

      const data = await response.json();
      console.log(data); // Handle the response as needed, e.g., show a success message to the user

      // Redirect to the login page after successful logout
      navigate('/')
    } catch (error) {
      console.error('Logout Error:', error);
    }
  }


  async function fetchTodos() {
    try {
      const response = await fetch('http://localhost:3001/todos', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401) {
        // Redirect to the login page if the token has expired
        console.log('Token expired. Redirecting to login page.');
        window.alert('You are not authorized')
        navigate('/'); // Assuming you're using React Router
        return;
      }

      const data = await response.json();
      console.log('Fetched todos:', data);
      setTodos(data.todos);
    } catch (error) {
      console.error('API Request Error:', error);
    }
  }

  useEffect(() => {
    // Fetch user's todos when the component mounts
    fetchTodos();
  }, []); // Empty dependency array ensures the effect runs once after the initial render


  async function submit(event) {
    event.preventDefault();

    if (!title && !desc) {
      console.log('Title and description cannot be empty.');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/home', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          desc,
        }),
        credentials: 'include',
      });
      if (response.status === 401) {
        // Redirect to the login page if the token has expired
        console.log('Token expired. Redirecting to login page.');
        window.alert('You are not authorized')
        navigate('/'); // Assuming you're using React Router
        return;
      }
      console.log('login request sent');
      const data = await response.json();
      console.log(data);
      setTitle('');
      setDesc('');
      fetchTodos();
    } catch (error) {
      console.error('API Request Error:', error);
    }
  }

  async function deleteTodo(title) {
    try {
      const response = await fetch(`http://localhost:3001/todos/${title}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.status === 401) {
        // Redirect to the login page if the token has expired
        console.log('Token expired. Redirecting to login page.');
        window.alert('You are not authorized')
        navigate('/'); // Assuming you're using React Router
        return;
      }
      console.log('Todo deleted:', title);

      // Refresh the todos list after deletion
      const updatedTodos = todos.filter(todo => todo.title !== title);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('API Request Error:', error);
    }
  }

  return (
    <>
      <div className="container todos-container d-flex flex-column align-items-center">
            <div className='d-flex flex-row'><h3>Add a Todo</h3>
              <button className="btn btn-sm btn-danger" onClick={logout}>
                Logout
              </button>
            </div>
            
            <form onSubmit={submit}>
                <div className="">
                    <label htmlFor="title" className="form-label">Todo Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="form-control" id="title" aria-describedby="emailHelp" />

                </div>
                <div className="mb-3">
                    <label htmlFor="desc" className="form-label">Todo Description</label>
                    <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="form-control" id="desc" />
                </div>
                <button type="submit" className="btn btn-sm btn-success">Add Todo</button>
            </form>
            <div className="mt-3">
          <h3>Todos:</h3>
          <ul className="list-group">
            {/* Conditionally render todos only if it's not undefined */}
            {todos &&
              todos.map((todo) => (
                <li key={todo._id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{todo.title}</h5>
                      <p className="mb-0">{todo.desc}</p>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.title)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
        </div>
       
    </>
  )
}

export default Home