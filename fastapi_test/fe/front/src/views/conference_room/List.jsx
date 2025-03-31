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
    const [confe_room_name, setConfe_room_name] = React.useState("");
    const [office_name, setOffice_name] = React.useState("");

    // ログインユーザーの情報を取得
    React.useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await axios.get("http://localhost:8000/auth/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setIs_superUser(response.data.is_superuser); // 管理者かどうかを取得
            } catch (error) {
                console.error("ユーザー情報の取得に失敗しました", error);
            }
        };

        fetchUserInfo();
    }, []);

    const openEditModal = (id, confe_room_name, office_name) => {
        setId(id);
        setConfe_room_name(confe_room_name);
        setOffice_name(office_name);
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
                    <TableCell align="left">{v.confe_room_name}</TableCell>
                    <TableCell align="left">{v.office_name}</TableCell>
                    <TableCell align="left">{v.created_at}</TableCell>
                    <TableCell align="left">{v.updated_at}</TableCell>
                    <TableCell align="center">
                        <Button variant="outlined" 
                                onClick={() => {openEditModal(v.id, v.user_name, v.kanji_name, v.kata_name, v.password, v.position, v.is_approval)}}>
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
                        <TableCell align="left">会議室id</TableCell>
                        <TableCell align="left">会議室ネーム</TableCell>
                        <TableCell align="left">事務所名</TableCell>
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
                        id={id} confe_room_name={confe_room_name} setConfe_room_name={setConfe_room_name}
                        office_name={office_name} setOffice_name={setOffice_name}
                    />
                </Modal>
            </div>
        </TableContainer>
    );
}
