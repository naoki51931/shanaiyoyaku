import './App.css';
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './views/Header'
import Form from './views/Form'
import List from './views/List';
import New from './views/new/new';

export default function App() {
  const [display, setDisplay] = useState([]);
  const [flag, setFlag] = useState(false);
  const [kanji_name, setKanji_name] = React.useState('');
  const [kata_name, setKata_name] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [position, setPosition] = React.useState('');
  const [is_approval, setIs_approval] = React.useState('');
  
  return (
    <Router>
      <>
        {/* ヘッダー */}
        <Header />
        {/* ルーティング設定 */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Form display={display} setDisplay={setDisplay} setFlag={setFlag} />
                <List searchResult={display} displayFlag={flag} />
              </>
            }
          />
          <Route
            path="/new"
            element={<New 
              kanji_name={kanji_name}
              setKanji_name={setKanji_name}
              kata_name={kata_name}
              setKata_name={setKata_name}
              password={password}
              setPassword={setPassword}
              position={position}
              setPosition={setPosition}
              is_approval={is_approval}
              setIs_approval={setIs_approval}
            />}
          />
        </Routes>
      </>
    </Router>
  );
}