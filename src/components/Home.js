import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { Link, useHistory, Redirect } from "react-router-dom";
import Todo from './Todo'
import './home.css';

export default function HomePage() {
  const auth = firebase.auth();
  const db = firebase.firestore();
  const history = useHistory();
  const [todoItem, setTodoItem] = useState("");
  const [userTodos, setUserTodos] = useState([]);
  const [sidebarTranslate, setSidebarTranslate] = useState(false);

  const userTodosRef = [];
  useEffect(() => {
    async function setTodos() {
      const snapshot = await db
        .collection("users")
        .doc(auth.currentUser.uid)
        .collection("todos")
        .get();
      snapshot.forEach((doc) =>
        userTodosRef.push({ id: doc.id, description: doc.data().description, completed: doc.data().completed })
      );
      setUserTodos(userTodosRef);
    }
    return setTodos();
  }, [userTodos]);

  const handleInputChange = (e) => {
    e.preventDefault();
    setTodoItem(e.target.value);
  };

  const addTodo = (e) => {
    e.preventDefault();
    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("todos")
      .add({ description: todoItem });

    setTodoItem("");
  };

  const signUserOut = () => {
    auth.signOut();
    history.push("/");
  };

  async function removeTodos() {
    const snapshot = await db.collection("users").doc(auth.currentUser.uid)
      .collection("todos").get();
    snapshot.forEach(doc => {
      db.collection("users").doc(auth.currentUser.uid)
        .collection("todos").doc(doc.id).delete()
    })
  };

  async function completeTodos() {
    const snapshot = await db.collection("users").doc(auth.currentUser.uid)
      .collection("todos").get();
    snapshot.forEach(doc => {
      db.collection("users").doc(auth.currentUser.uid)
        .collection("todos").doc(doc.id).update({
          description: doc.data().description,
          completed: true
        })
    })
  };

  async function removeCompleted() {
    const snapshot = await db.collection("users").doc(auth.currentUser.uid)
      .collection("todos").get();
    snapshot.forEach(doc => {
      if (doc.data().completed) {
        db.collection("users").doc(auth.currentUser.uid)
          .collection("todos").doc(doc.id).delete()
      }
    })
  };


  return (
    <>
      {auth.currentUser === null ? (
        <Redirect to="/" />
      ) : (
          <div className="home">

            <div className={sidebarTranslate ? "sidebar sidebar-translated" : "sidebar"}>
              <div className="profile-pic">
                <img src={auth.currentUser.photoURL} alt="profile pic" />
              </div>
              <h2>Welcome back,</h2>
              <h4>{auth.currentUser.displayName}</h4>
              <div className="nav-links">
                <li>
                  <Link to="/home">
                    Todo List
                  </Link></li>
                <li>
                  <Link to="/home/settings">
                    Settings
                  </Link>
                </li>
                <button id="btn-logout" onClick={() => signUserOut()}>logout</button>
              </div>
            </div>

            <div className="todo-list">
              <div className="burger" onClick={() => setSidebarTranslate(!sidebarTranslate)}>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
                <div className="burger-line"></div>
              </div>
              <h1>{auth.currentUser.displayName}'s todo list</h1>
              <form>
                <input type="text" onChange={handleInputChange} value={todoItem} />
                <input id="btn-add" type="submit" onClick={addTodo} disabled={!todoItem} value="Add todo" />
              </form>
              <div className="todos-container">
                <div className="todos">
                  {userTodos &&
                    userTodos.map((todo) => (
                      <Todo todo={todo} />
                    ))}
                </div>
                <div className="todo-buttons">
                  <button onClick={() => completeTodos()} className="btn-todo">Complete All</button>
                  <button onClick={() => removeTodos()} className="btn-todo">Remove All</button>
                  <button onClick={() => removeCompleted()} className="btn-todo">Remove Completed</button>
                </div>
              </div>
            </div>
            {/* <h1>Hello from Home component</h1>
          <p>Logged in as: {auth.currentUser.email}</p>
          <form>
            <input type="text" onChange={handleInputChange} value={todoItem} />
            <input type="submit" onClick={addTodo} value="Add todo" />
          </form>
          <button onClick={() => console.log(userTodos)}>log user todos</button>
          <div className="todos">
            {userTodos &&
              userTodos.map((todo) => (
                <li key={Math.random() * 100}>
                  {todo}
                  <button onClick={() => removeTodo(todo)}>R</button>
                </li>
              ))}
          </div>
          <button onClick={() => signUserOut()}>Sign Out</button> */}
          </div>
        )}
    </>
  );
}
