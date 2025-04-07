import './App.css';
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './views/Header'
import Form from './views/Form'
import List from './views/List';
import New from './views/new/new';
import LoginForm from './views/LoginForm';
import SeatRegist from './views/seat_regist/seat_regist';
import Office from './views/office/office';


// 🔹 認証状態を確認するカスタムコンポーネント
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

export default function App() {
  const [display, setDisplay] = useState([]);
  const [flag, setFlag] = useState(false);
  const [user_name, setUser_name] = React.useState('');
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
              element={<PrivateRoute element={
                  <>
                      <Form display={display} setDisplay={setDisplay} setFlag={setFlag} />
                      <List searchResult={display} displayFlag={flag} />
                  </>
              } />}
          />
          <Route
            path="/new"
            element={<New 
              user_name={user_name}
              setUser_name={setUser_name}
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
          <Route path="/login" element={<LoginForm />} />
          <Route path="/seat_regist/*" element={<SeatRegist />} />
          <Route path="/office/*" element={<Office />} />
        </Routes>
      </>
    </Router>
  );
}