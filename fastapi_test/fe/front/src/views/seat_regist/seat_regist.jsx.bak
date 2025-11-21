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

export default function SeatRegist() {
  const [display, setDisplay] = useState([]);
  const [flag, setFlag] = useState(false);
  const [seat_name, setSeat_name] = React.useState("");
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
            seat_name={seat_name}
            setSeat_name={setSeat_name}
            office_id={office_id}
            setOffice_id={setOffice_id}
          />}
        />
    </Routes>
  );
}