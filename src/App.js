import React, {useState, useRef} from 'react'
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBmFmbAZluhXjRD4FI-ggF0KYXxsPKOIrA",
  authDomain: "chat-app-1fd2e.firebaseapp.com",
  projectId: "chat-app-1fd2e",
  storageBucket: "chat-app-1fd2e.appspot.com",
  messagingSenderId: "637674040580",
  appId: "1:637674040580:web:8ab97f1fce1304a8fa3451"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function SignIn() {
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}></button>
  )
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id' });
  const [formValue, setFormValue] = useState('')
  const scrollDiv = useRef(null)

  async function sendMessage(e) {
    e.preventDefault()
    const {uid} = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    })
    setFormValue('')
    scrollDiv.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <>
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
      <div ref={scrollDiv}></div>
    </div>
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e)=> setFormValue(e.target.value)}/>
      <button type='submit'>Submit</button>
    </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  return (
    <div className={`message ${messageClass}`}>
      <p>{text}</p>
    </div>
  )
}





function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      {/* <header className="App-header">
        
      </header> */}
      <section>
        {user ? <ChatRoom /> : <SignIn></SignIn>}
      </section>
    </div>
  );
}



export default App;
