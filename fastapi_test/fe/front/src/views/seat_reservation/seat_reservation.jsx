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
  const [reserve_id, setReserve_id] = React.useState("");
  const [todo_content, setTodo_content] = React.useState("");
  const [person_id, setPerson_id] = React.useState("");
  const [office_id, setOffice_id] = React.useState("");
  const [seat_id, setSeat_id] = React.useState("");
  const [pasokon_id, setPasokon_id] = React.useState("");
  const [start_time, setStart_time] = React.useState("");
  const [finish_time, setFinish_time] = React.useState("");
  const [reserve_day, setReserve_day] = React.useState("");
  
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
            reserve_id={reserve_id}
            setReserve_id={setReserve_id}
            todo_content={todo_content}
            setTodo_content={setTodo_content}
            person_id={person_id}
            setPerson_id={setPerson_id}
            office_id={office_id}
            setOffice_id={setOffice_id}
            seat_id={seat_id}
            setSeat_id={setSeat_id}
            pasokon_id={pasokon_id}
            setPasokon_id={setPasokon_id}
            start_time={start_time}
            setStart_time={setStart_time}
            finish_time={finish_time}
            setFinish_time={setFinish_time}
            reserve_day={reserve_day}
            setReserve_day={setReserve_day}
          />}
        />
    </Routes>
  );
}