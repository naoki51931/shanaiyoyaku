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
    const [pasokon_id, setPasokon_id] = React.useState("");

    const openEditModal = (id, pasokon_name, pasokon_id) => {
        setId(id);
        setPasokon_name(pasokon_name);
        setPasokon_id(pasokon_id);
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
                    <TableCell align="left">{v.pasokon_id}</TableCell>
                    <TableCell align="left">{v.created_at}</TableCell>
                    <TableCell align="left">{v.updated_at}</TableCell>
                    <TableCell align="center">
                        <Button variant="outlined" 
                                onClick={() => {openEditModal(v.id, v.pasokon_name, v.pasokon_id)}}>
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
                        <TableCell align="left">パソコンid</TableCell>
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
                        id={id} pasokon_name={pasokon_name} setPasokon_name={setPasokon_name} pasokon_id={pasokon_id} setPasokon_id={setPasokon_id}
                    />
                </Modal>
            </div>
        </TableContainer>
    );
}
