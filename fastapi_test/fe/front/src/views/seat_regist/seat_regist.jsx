import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
  const [office_name, setOffice_name] = React.useState("");
  
  return (
    <Routes>
      <Route 
            path="/seat_regist" 
            element={<PrivateRoute element={
                <>
                    <Form display={display} setDisplay={setDisplay} setFlag={setFlag} />
                    <List searchResult={display} displayFlag={flag} />
                </>
            } />}
        />
        <Route
          path="seat_regist/new"
          element={<New 
            seat_name={seat_name}
            setSeat_name={setSeat_name}
            office_name={office_name}
            setOffice_name={setOffice_name}
          />}
        />
    </Routes>
  );
}