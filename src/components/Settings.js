import React, { useState } from 'react'
import { Link, useHistory, Redirect } from 'react-router-dom'
import Modal from 'react-modal';
import "./home.css";
import firebase from 'firebase';

function Settings() {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const history = useHistory();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [photoURL, setphotoURL] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [sidebarTranslate, setSidebarTranslate] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [usernameConfirmation, setUsernameConfirmation] = useState("");

    const signUserOut = () => {
        auth.signOut();
        history.push("/");
    };

    const saveChanges = (event) => {
        event.preventDefault();
        try {
            if (password === passwordConfirm) {
                if (password != "") {
                    auth.currentUser.updatePassword(password);
                }
                if (photoURL != "") {
                    auth.currentUser.updateProfile({
                        displayName: auth.currentUser.displayName,
                        photoURL: photoURL
                    })
                }
                if (username != "") {
                    auth.currentUser.updateProfile({
                        displayName: username,
                        photoURL: auth.currentUser.photoURL
                    })
                }
                if (email != "") {
                    auth.currentUser.updateEmail(email)
                    history.push("/");
                }
            }
            else {
                return setErrorMessage("Passwords do not match");
            }
        } catch (error) {
            return setErrorMessage(error);
        }
    }

    return (
        <>
            {auth.currentUser === null ? (
                <Redirect to="/" />
            ) : (
                    <div>
                        <div className="burger" onClick={() => setSidebarTranslate(!sidebarTranslate)}>
                            <div className="burger-line"></div>
                            <div className="burger-line"></div>
                            <div className="burger-line"></div>
                        </div>
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
                        <div className="settings-container">
                            <h1>Account Settings</h1>

                            <h6>Change Username</h6>

                            <input type="text" placeholder="new username" value={username} onChange={(e) => setUsername(e.target.value)} />

                            <h6>Change Password</h6>
                            <input type="password" placeholder="new password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <input id="confirm-password" type="password" placeholder="confirm new password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />

                            <h6>Change E-mail</h6>
                            <input type="text" placeholder="new e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />

                            <h6>Profile picture</h6>
                            <input type="text" placeholder="profile picture URL" value={photoURL} onChange={(e) => setphotoURL(e.target.value)} />

                            <h6>Danger zone</h6>
                            <div className="danger-zone">
                                <p>Delete your account</p>
                                <button onClick={() => setModalOpen(true)}>Delete</button>
                            </div>
                            <Modal
                                className="modal"
                                isOpen={modalOpen}
                                onRequestClose={() => setModalOpen(false)}
                            >
                                <div className="modal-delete">
                                    <h2>delete account</h2>
                                    <p><strong>Warning!</strong>This action is irreversible. </p>
                                    <p>Please write down your username in order to proceed</p>
                                    <input value={usernameConfirmation} onChange={(e) => setUsernameConfirmation(e.target.value)} type="text" />
                                    <div className="confirm-delete">
                                        <button onClick={() => setModalOpen(false)}>Back</button>
                                        <button onClick={() => {
                                            auth.currentUser.delete();
                                            history.push("/")
                                        }} disabled={usernameConfirmation != auth.currentUser.displayName} id="btn-delete">Delete</button>
                                    </div>
                                </div>
                            </Modal>
                            {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
                            <button id="btn-save" onClick={saveChanges}>Apply</button>
                            <div className="note">
                                <p><strong>Note: </strong>Only one change may be applied at a time</p>
                            </div>
                        </div>


                    </div>
                )}
        </>
    )
}

export default Settings
