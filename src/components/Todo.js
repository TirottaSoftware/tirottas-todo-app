import firebase from 'firebase';
import React from 'react'

function Todo(props) {

    const db = firebase.firestore();
    const auth = firebase.auth();

    const completeTask = (id) => {
        db.collection("users")
            .doc(auth.currentUser.uid)
            .collection("todos").doc(id).set({ description: props.todo.description, completed: !props.todo.completed })
    }

    const removeTodo = (id) => {
        db.collection("users")
            .doc(auth.currentUser.uid)
            .collection("todos")
            .doc(id)
            .delete();
    };

    return (
        <div className="todo">
            <div className="todo-item" onClick={() => completeTask(props.todo.id)}>
                <li className={props.todo.completed ? "task-completed" : ""} key={props.todo.id}>
                    {props.todo.description}
                </li>
            </div>
            <button onClick={() => removeTodo(props.todo.id)}>X</button>
        </div>
    )
}

export default Todo
