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

export default function Office() {
  const [display, setDisplay] = useState([]);
  const [flag, setFlag] = useState(false);
  const [office_name, setOffice_name] = React.useState("");
  const [office_id, setOffice_id] = React.useState("");
  
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
            office_name={office_name}
            setOffice_name={setOffice_name}
            office_id={office_id}
            setOffice_id={setOffice_id}
          />}
        />
    </Routes>
  );
}