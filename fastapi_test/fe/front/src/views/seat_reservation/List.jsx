import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Edit from './edit/edit';
import Modal from "react-modal";
import axios from 'axios';

export default function List(props) {
    const [editModalIsOpen, setEditModalIsOpen] = React.useState(false);
    const [id, setId] = React.useState("");
    const [reserve_id, setReserve_id] = React.useState("");
    const [todo_content, setTodo_content] = React.useState("");
    const [person_id, setPerson_id] = React.useState("");
    const [seat_id, setSeat_id] = React.useState("");
    const [start_time, setStart_time] = React.useState("");
    const [finish_time, setFinish_time] = React.useState("");
    const [reserve_day, setReserve_day] = React.useState("");

    const openEditModal = (id, seat_name, office_id) => {
        setId(id);
        setReserve_id(reserve_id);
        setTodo_content(todo_content);
        setPerson_id(person_id);
        setSeat_id(seat_id);
        setStart_time(start_time);
        setFinish_time(finish_time);
        setReserve_day(reserve_day);
        setEditModalIsOpen(true);
    };

    function closeModal() {
        setEditModalIsOpen(false);
    }

    const tableBody = props !== undefined && props.displayFlag ? (
        <TableBody>
            {props.searchResult.map((v) => 
                <TableRow key={v.id}>
                    <TableCell align="left">{v.id}</TableCell>
                    <TableCell align="left">{v.reserve_id}</TableCell>
                    <TableCell align="left">{v.todo_content}</TableCell>
                    <TableCell align="left">{v.person_id}</TableCell>
                    <TableCell align="left">{v.seat_id}</TableCell>
                    <TableCell align="left">{v.start_time}</TableCell>
                    <TableCell align="left">{v.finish_time}</TableCell>
                    <TableCell align="left">{v.reserve_day}</TableCell>
                    <TableCell align="left">{v.created_at}</TableCell>
                    <TableCell align="left">{v.updated_at}</TableCell>
                    <TableCell align="center">
                        <Button variant="outlined" 
                                onClick={() => {openEditModal(v.id, v.seat_name, v.office_id)}}>
                            Edit
                        </Button>
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    ) : null;

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">id</TableCell>
                        <TableCell align="left">座席予約id</TableCell>
                        <TableCell align="left">概要</TableCell>
                        <TableCell align="left">予約者id</TableCell>
                        <TableCell align="left">予約座席id</TableCell>
                        <TableCell align="left">開始時間</TableCell>
                        <TableCell align="left">終了時間</TableCell>
                        <TableCell align="left">予約日</TableCell>
                        <TableCell align="left">作成日時</TableCell>
                        <TableCell align="left">更新日時</TableCell>
                    </TableRow>
                </TableHead>
                {tableBody}
            </Table>
            <div>
                <Modal
                    isOpen={editModalIsOpen}
                    onRequestClose={closeModal}
                    style={{
                        content: {
                            top: "20%",
                            left: "50%",
                            right: "auto",
                            bottom: "auto",
                            marginRight: "-50%",
                            transform: "translate(-50%, -50%)",
                            minWidth: "50%",
                            maxWidth: "50%",
                        },
                    }}
                    contentLabel="Example Modal"
                >
                    <Edit
                        setEditModalIsOpen={setEditModalIsOpen}
                        id={id} reserve_id={reserve_id} setReserve_id={setReserve_id}
                        todo_content={todo_content} setTodo_content={setTodo_content}
                        person_id={person_id} setPerson_id={setPerson_id}
                        seat_id={seat_id} setSeat_id={setSeat_id}
                        start_time={start_time} setStart_time={setStart_time}
                        finish_time={finish_time} setFinish_time={setFinish_time}
                        reserve_day={reserve_day} setReserve_day={setReserve_day}
                    />
                </Modal>
            </div>
        </TableContainer>
    );
}
