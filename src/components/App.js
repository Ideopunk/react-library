import React, {useState} from 'react';
import '../style/App.scss';
import firebase from "../config/fbConfig"
import Form from "./Form";
import Table from "./Table";

function App() {
  const [books, setBooks] = useState([])

  const handleAdd = obj => {
    console.log(obj)
    setBooks([...books, obj])
  }

  return (
    <div className="App">
      <Form handleAdd={handleAdd}/>
      <Table books={books}/>
    </div>
  );
}

export default App;
