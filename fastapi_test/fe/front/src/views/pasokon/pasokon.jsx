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
  const [in_active, setIn_active] = React.useState("");
  const [office_id, setOffice_id] = React.useState("");
  const [office_name, setOffice_name] = React.useState("");
  const [seat_id, setSeat_id] = React.useState("");
  const [seat_name, setSeat_name] = React.useState("");

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
            in_active={in_active}
            setIn_active={setIn_active}
            office_id={office_id}
            setOffice_id={setOffice_id}
            office_name={office_name}
            setOffice_name={setOffice_name}
            seat_id={seat_id}
            setSeat_id={setSeat_id}
            seat_name={seat_name}
            setSeat_name={setSeat_name}
          />}
        />
    </Routes>
  );
}