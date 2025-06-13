import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const db = getFirestore(initializeApp({
  apiKey: "AIzaSyAfASez0BnqEkEMxTLqJuE_bsmagV_IH_Y",
  authDomain: "helpdesk-smit.firebaseapp.com",
  projectId: "helpdesk-smit",
  storageBucket: "helpdesk-smit.appspot.com",
  messagingSenderId: "516701942489",
  appId: "1:516701942489:web:a8ae8e55eb4125571b84c8"
}));

export default function App() {
  const [msg, setMsg] = useState('');
  const [msgs, setMsgs] = useState([]);
  const [show, setShow] = useState(true);

  const send = async () => {
    if (!msg.trim()) return alert('Please enter a message');
    try {
      await addDoc(collection(db, "messages"), {
        text: msg,
        timestamp: new Date()
      });
      setMsg('');
      get();
    } catch {
      alert('Send failed');
    }
  };

  const get = async () => {
    const snap = await getDocs(collection(db, "messages"));
    setMsgs(snap.docs.map(doc => doc.data().text));
  };

  useEffect(() => {
    get();
  }, []);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Top Toggle Button */}
      <div style={{
        padding: '10px 20px',
        background: '#007bff',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Chat App</h2>
        <button
          onClick={() => setShow(!show)}
          style={{
            padding: '8px 16px',
            background: 'white',
            color: '#007bff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          {show ? 'Hide Messages' : 'Show Messages'}
        </button>
      </div>

      {/* Message Display Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: '#f4f4f4',
        padding: 20
      }}>
        {show && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
  {msgs.map((m, i) => (
    <li key={i} style={{
      background: 'white',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      color: 'black'  // <-- added this line
    }}>
      {m}
    </li>
  ))}
</ul>

        )}
      </div>

      {/* Message Input Section */}
      <div style={{
        padding: 10,
        display: 'flex',
        borderTop: '1px solid #ccc',
        background: '#fff'
      }}>
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: 10,
            border: '1px solid #ccc',
            borderRadius: 4,
            fontSize: 16
          }}
        />
        <button
          onClick={send}
          style={{
            marginLeft: 10,
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
