import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import Form from './Form'
import List from './List';
import New from './new/new';


// 🔹 認証状態を確認するカスタムコンポーネント
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

export default function Pasokon() {
  const [display, setDisplay] = useState([]);
  const [flag, setFlag] = useState(false);
  const [pasokon_name, setPasokon_name] = React.useState("");
  const [pasokon_id, setPasokon_id] = React.useState("");
  
  return (
    <Routes>
      <Route 
            path="" 
            element={<PrivateRoute element={
                <>
                    <Form display={display} setDisplay={setDisplay} setFlag={setFlag} />
                    <List searchResult={display} displayFlag={flag} />
                </>
            } />}
        />
        <Route
          path="new"
          element={<New 
            pasokon_name={pasokon_name}
            setPasokon_name={setPasokon_name}
            pasokon_id={pasokon_id}
            setPasokon_id={setPasokon_id}
          />}
        />
    </Routes>
  );
}