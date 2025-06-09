import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Modal from "react-modal";
import Edit from './edit/edit';
import { useNavigate } from 'react-router-dom'; // useNavigate をインポート
import NewReservationForm from './NewReservationForm'; // 新規予約追加フォームをインポート

export default function List(props) {
    const [editModalIsOpen, setEditModalIsOpen] = React.useState(false);
    const [newReservationModalIsOpen, setNewReservationModalIsOpen] = React.useState(false); // 新規予約フォーム用モーダル
    const [viewMode, setViewMode] = React.useState('list');  // 'list' または 'calendar' の状態を管理
    const [id, setId] = React.useState("");
    const [reserve_id, setReserve_id] = React.useState("");
    const [todo_content, setTodo_content] = React.useState("");
    const [person_id, setPerson_id] = React.useState("");
    const [person_name, setPerson_name] = React.useState("");
    const [seat_id, setSeat_id] = React.useState("");
    const [seat_name, setSeat_name] = React.useState("");
    const [start_time, setStart_time] = React.useState("");
    const [finish_time, setFinish_time] = React.useState("");
    const [reserve_day, setReserve_day] = React.useState("");

    const navigate = useNavigate(); // useNavigateでリダイレクト

    const openEditModal = (id, reserve_id, todo_content, person_id, seat_id, start_time, finish_time, reserve_day) => {
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

    function closeEditModal() {
        setEditModalIsOpen(false);
    }

    function closeNewReservationModal() {
        setNewReservationModalIsOpen(false);
    }

    // 時間のみを取り出す関数
    const formatTime = (date) => {
        const hours = new Date(date).getHours();
        const minutes = new Date(date).getMinutes();
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }

    // 日付をまたぐ場合に日付も表示する
    const formatDate = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const startDateString = start.toLocaleDateString();
        const endDateString = end.toLocaleDateString();

        if (startDateString !== endDateString) {
            return `${startDateString} - ${endDateString}`;
        }
        return startDateString;
    }

    // リストビュー
    const tableBody = props !== undefined && props.displayFlag ? (
        <TableBody>
            {props.searchResult.map((v) => 
                <TableRow key={v.id}>
                    <TableCell align="left">{v.id}</TableCell>
                    <TableCell align="left">{v.reserve_id}</TableCell>
                    <TableCell align="left">{v.todo_content}</TableCell>
                    <TableCell align="left">{v.person_id}</TableCell>
                    <TableCell align="left">{v.person_name}</TableCell>
                    <TableCell align="left">{v.seat_id}</TableCell>
                    <TableCell align="left">{v.seat_name}</TableCell>
                    <TableCell align="left">{formatTime(v.start_time)}</TableCell> {/* 時間のみ表示 */}
                    <TableCell align="left">{formatTime(v.finish_time)}</TableCell> {/* 時間のみ表示 */}
                    <TableCell align="left">{formatDate(v.start_time, v.finish_time)}</TableCell> {/* 日付が異なれば表示 */}
                    <TableCell align="left">{v.created_at}</TableCell>
                    <TableCell align="left">{v.updated_at}</TableCell>
                    <TableCell align="center">
                        <Button variant="outlined" 
                                onClick={() => {openEditModal(v.id, v.reserve_id, v.todo_content, v.person_id, v.seat_id, v.start_time, v.finish_time, v.reserve_day)}}>
                            Edit
                        </Button>
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    ) : null;

    // カレンダービュー (デモ的な実装)
    const calendarView = (
        <div>
            <h3>カレンダー表示</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                {props.searchResult.map((v) => (
                    <div 
                        key={v.id} 
                        style={{ border: '1px solid gray', padding: '10px', textAlign: 'center', cursor: 'pointer' }} 
                        onClick={() => openEditModal(v.id, v.reserve_id, v.todo_content, v.person_id, v.seat_id, v.start_time, v.finish_time, v.reserve_day)}
                    >
                        <h4>{new Date(v.reserve_day).toLocaleDateString()}</h4>
                        <p>{v.reserve_id}</p>
                        <p>{v.person_name}</p>
                        <p>{v.seat_name}</p>
                        <p>{v.todo_content}</p>
                        <p>{formatDate(v.start_time, v.finish_time)}</p> {/* 日付が異なれば表示 */}
                        <p>{formatTime(v.start_time)} - {formatTime(v.finish_time)}</p> {/* 時間のみ表示 */}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            {/* ボタンで表示モードを切り替え */}
            <Button
                variant="contained"
                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                sx={{ mb: 2 }}
            >
                {viewMode === 'list' ? 'カレンダー表示' : 'リスト表示'}
            </Button>

            {/* 新規追加ボタン */}
            <Button 
                variant="contained" 
                sx={{ mb: 2 }} 
                onClick={() => setNewReservationModalIsOpen(true)} // 新規予約フォームを開く
            >
                + 新規予約追加
            </Button>

            {viewMode === 'list' ? (
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">id</TableCell>
                                <TableCell align="left">座席予約id</TableCell>
                                <TableCell align="left">概要</TableCell>
                                <TableCell align="left">予約者id</TableCell>
                                <TableCell align="left">予約者名</TableCell>
                                <TableCell align="left">予約座席id</TableCell>
                                <TableCell align="left">予約座席名</TableCell>
                                <TableCell align="left">開始時間</TableCell>
                                <TableCell align="left">終了時間</TableCell>
                                <TableCell align="left">予約日</TableCell>
                                <TableCell align="left">作成日時</TableCell>
                                <TableCell align="left">更新日時</TableCell>
                            </TableRow>
                        </TableHead>
                        {tableBody}
                    </Table>
                </TableContainer>
            ) : (
                calendarView
            )}

            {/* 編集モーダル */}
            <div>
                <Modal
                    isOpen={editModalIsOpen}
                    onRequestClose={closeEditModal}
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

            {/* 新規予約フォームモーダル */}
            <Modal
                isOpen={newReservationModalIsOpen}
                onRequestClose={closeNewReservationModal}
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
                contentLabel="新規予約フォーム"
            >
                <NewReservationForm closeModal={closeNewReservationModal} />
            </Modal>
        </div>
    );
}
