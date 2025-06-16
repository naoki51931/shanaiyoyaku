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
    const [pasokon_name, setPasokon_name] = React.useState("");
    const [in_active, setIn_active] = React.useState("");
    const [soft_id, setSoft_id] = React.useState("");
    const [soft_name, setSoft_name] = React.useState("");
    const [office_id, setOffice_id] = React.useState("");
    const [office_name, setOffice_name] = React.useState("");
    const [seat_id, setSeat_id] = React.useState("");
    const [seat_name, setSeat_name] = React.useState("");

    const openEditModal = (id, pasokon_name, in_active, soft_id, soft_name, office_id, office_name, seat_id, seat_name) => {
        setId(id);
        setPasokon_name(pasokon_name);
        setIn_active(in_active);
        setSoft_id(soft_id);
        setSoft_name(soft_name);
        setOffice_id(office_id);
        setOffice_name(office_name);
        setSeat_id(seat_id);
        setSeat_name(seat_name);
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
                    <TableCell align="left">{v.pasokon_name}</TableCell>
                    <TableCell align="left">
                    {v.in_active === null || v.in_active === 0
                        ? "不可"
                        : v.in_active === 1
                        ? "予約中"
                        : v.in_active === 2
                        ? "使用可"
                        : v.in_active === 3
                        ? "破損"
                        : "不明"}
                    </TableCell>
                    <TableCell align="left">{v.soft_id}</TableCell>
                    <TableCell align="left">{v.office_name}</TableCell>
                    <TableCell align="left">{v.seat_name}</TableCell>
                    <TableCell align="left">{v.created_at}</TableCell>
                    <TableCell align="left">{v.updated_at}</TableCell>
                    <TableCell align="center">
                        <Button variant="outlined" 
                                onClick={() => {openEditModal(v.id, v.pasokon_name, v.in_active, v.soft_id, v.soft_name, v.office_id, v.office_name, v.seat_id, v.seat_name)}}>
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
                        <TableCell align="left">パソコン名</TableCell>
                        <TableCell align="left">使用可不可</TableCell>
                        <TableCell align="left">導入ソフト</TableCell>
                        <TableCell align="left">事業所名</TableCell>
                        <TableCell align="left">座席名</TableCell>
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
                        id={id} pasokon_name={pasokon_name} setPasokon_name={setPasokon_name} in_active={in_active} setIn_active={setIn_active} soft_id={soft_id} setSoft_id={setSoft_id} soft_name={soft_name} setSoft_name={setSoft_name} office_id={office_id} setOffice_id={setOffice_id} office_name={office_name} setOffice_name={setOffice_name} seat_id={seat_id} setSeat_id={setSeat_id} seat_name={seat_name} setSeat_name={setSeat_name}
                    />
                </Modal>
            </div>
        </TableContainer>
    );
}
