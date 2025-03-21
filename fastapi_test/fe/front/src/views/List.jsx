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


export default function List(props) {

    const customStyles = {
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
      };


    const [editModalIsOpen, setEditModalIsOpen] = React.useState(false);
    const [id, setId] = React.useState("");
    const [user_name, setUser_name] = React.useState("");
    const [kanji_name, setKanji_name] = React.useState("");
    const [kata_name, setKata_name] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [position, setPosition] = React.useState("");
    const [is_approval, setIs_approval] = React.useState("");
    const openEditModal = (id, user_name, kanji_name, kata_name, password, position, is_approval) => {
        setId(id);
        setUser_name(user_name);
        setKanji_name(kanji_name);
        setKata_name(kata_name);
        setPassword(password);
        setPosition(position);
        setIs_approval(is_approval);
        setEditModalIsOpen(true);
    };
    
    function closeModal() {
        setEditModalIsOpen(false);
    }


    const tableBody = props !== undefined && props.displayFlag  ? (
            <TableBody>
                {props.searchResult.map((v) => 
                    <TableRow>
                    <TableCell align="left">{v.id}</TableCell>
                    <TableCell align="left">{v.user_name}</TableCell>
                    <TableCell align="left">{v.kanji_name}</TableCell>
                    <TableCell align="left">{v.kata_name}</TableCell>
                    <TableCell align="left">{v.password}</TableCell>
                    <TableCell align="left">{v.position}</TableCell>
                    <TableCell align="left">{v.is_superuser && <span>〇</span>}</TableCell>
                    <TableCell align="left">{v.is_approval}</TableCell>
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
                        <TableCell align="left">id</TableCell>
                        <TableCell align="left">ユーザーネーム</TableCell>
                        <TableCell align="left">名前(漢字)</TableCell>
                        <TableCell align="left">名前(カタカナ)</TableCell>
                        <TableCell align="left">パスワード</TableCell>
                        <TableCell align="left">役職</TableCell>
                        <TableCell align="left">管理者</TableCell>
                        <TableCell align="left">承認ユーザー</TableCell>
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
                style={customStyles}
                contentLabel="Example Modal"
                >
                <Edit  setEditModalIsOpen={setEditModalIsOpen} id={id} user_name={user_name} setUser_name={setUser_name} kanji_name={kanji_name} kata_name={kata_name} setKanji_name={setKanji_name} setKata_name={setKata_name} password={password} setPassword={setPassword} position={position} setPosition={setPosition} is_approval={is_approval} setIs_approval={setIs_approval}/>
                </Modal>
            </div>

        </TableContainer>
    );
}