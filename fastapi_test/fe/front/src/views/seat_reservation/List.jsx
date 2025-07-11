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
import { useNavigate } from 'react-router-dom';
import NewReservationForm from './NewReservationForm';

export default function List(props) {
    const [editModalIsOpen, setEditModalIsOpen] = React.useState(false);
    const [newReservationModalIsOpen, setNewReservationModalIsOpen] = React.useState(false);
    const [viewMode, setViewMode] = React.useState('calendar');
    const [id, setId] = React.useState("");
    const [reserve_id, setReserve_id] = React.useState("");
    const [todo_content, setTodo_content] = React.useState("");
    const [person_id, setPerson_id] = React.useState("");
    const [person_name, setPerson_name] = React.useState("");
    const [office_id, setOffice_id] = React.useState("");
    const [office_name, setOffice_name] = React.useState("");
    const [seat_id, setSeat_id] = React.useState("");
    const [seat_name, setSeat_name] = React.useState("");
    const [pasokon_id, setPasokon_id] = React.useState("");
    const [pasokon_name, setPasokon_name] = React.useState("");
    const [start_time, setStart_time] = React.useState("");
    const [finish_time, setFinish_time] = React.useState("");
    const [reserve_day, setReserve_day] = React.useState("");
    const [weekOffset, setWeekOffset] = React.useState(0);

    const navigate = useNavigate();

    const openEditModal = (id, reserve_id, todo_content, person_id, office_id, seat_id, pasokon_id, start_time, finish_time, reserve_day) => {
        setId(id);
        setReserve_id(reserve_id);
        setTodo_content(todo_content);
        setPerson_id(person_id);
        setOffice_id(office_id);
        setSeat_id(seat_id);
        setPasokon_id(pasokon_id);
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

    const formatTimeRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startDateString = start.toLocaleDateString();
        const endDateString = end.toLocaleDateString();
        const startTime = `${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')}`;
        const endTime = `${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`;

        if (startDateString !== endDateString) {
            return `${startDateString} ${startTime} - ${endDateString} ${endTime}`;
        }
        return `${startTime} - ${endTime}`;
    };

    const formatDate = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const startDateString = start.toLocaleDateString();
        const endDateString = end.toLocaleDateString();
        return startDateString !== endDateString ? `${startDateString} - ${endDateString}` : startDateString;
    };

    const getWeekDates = (offset = 0) => {
        const today = new Date();
        today.setDate(today.getDate() + offset * 7);
        const monday = new Date(today);
        monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7)); // 月曜日に調整
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return d;
        });
    };

    const tableBody = props !== undefined && props.displayFlag ? (
        <TableBody>
            {props.searchResult.map((v) => 
                <TableRow key={v.id}>
                    <TableCell align="left">{v.id}</TableCell>
                    <TableCell align="left">{v.reserve_id}</TableCell>
                    <TableCell align="left">{v.todo_content}</TableCell>
                    <TableCell align="left">{v.person_name}</TableCell>
                    <TableCell align="left">{v.office_name}</TableCell>
                    <TableCell align="left">{v.seat_name}</TableCell>
                    <TableCell align="left">{v.pasokon_name}</TableCell>
                    <TableCell align="left">{formatTimeRange(v.start_time, v.finish_time)}</TableCell>
                    <TableCell align="left">{formatDate(v.start_time, v.finish_time)}</TableCell>
                    <TableCell align="left">{v.created_at}</TableCell>
                    <TableCell align="left">{v.updated_at}</TableCell>
                    <TableCell align="center">
                        <Button variant="outlined" 
                                onClick={() => {openEditModal(v.id, v.reserve_id, v.todo_content, v.person_id, v.office_id, v.seat_id, v.pasokon_id, v.start_time, v.finish_time, v.reserve_day)}}>
                            Edit
                        </Button>
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    ) : null;

    const calendarView = (
        <div>
            <h3>カレンダー表示（週単位）</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Button variant="outlined" onClick={() => setWeekOffset(weekOffset - 1)}>前の週</Button>
                <Button variant="outlined" onClick={() => setWeekOffset(0)}>今週</Button>
                <Button variant="outlined" onClick={() => setWeekOffset(weekOffset + 1)}>次の週</Button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                {getWeekDates(weekOffset).map((date, index) => {
                    const dailyItems = props.searchResult.filter(v => new Date(v.reserve_day).toDateString() === date.toDateString());
                    return (
                        <div key={index} style={{ border: '1px solid gray', padding: '8px', minHeight: '100px' }}>
                            <h4 style={{ marginBottom: '6px' }}>
                                {date.toLocaleDateString('ja-JP', { weekday: 'short', month: 'numeric', day: 'numeric' })}
                            </h4>
                            {dailyItems.map((v) => (
                                <div
                                    key={v.id}
                                    style={{
                                        borderTop: '1px solid #ccc',
                                        marginTop: '6px',
                                        paddingTop: '4px',
                                        cursor: 'pointer',
                                        backgroundColor: '#f9f9f9',
                                        borderRadius: '4px',
                                        padding: '8px',
                                        marginBottom: '6px',
                                    }}
                                    onClick={() => openEditModal(
                                        v.id, v.reserve_id, v.todo_content, v.person_id,
                                        v.office_id, v.seat_id, v.pasokon_id,
                                        v.start_time, v.finish_time, v.reserve_day
                                    )}
                                >
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{v.todo_content}</div>
                                    <div style={{ fontSize: '12px', marginBottom: '2px' }}>
                                        <span>予約者: {v.person_name}</span> / <span>事務所: {v.office_name}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', marginBottom: '2px' }}>
                                        <span>座席: {v.seat_name}</span> / <span>パソコン: {v.pasokon_name}</span>
                                    </div>
                                    <div style={{ fontSize: '12px' }}>{formatTimeRange(v.start_time, v.finish_time)}</div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div>
            {/* 表示モード切り替えボタン */}
            <Button
                variant="contained"
                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                sx={{ mb: 2 }}
            >
                {viewMode === 'list' ? 'カレンダー表示' : 'リスト表示'}
            </Button>

            {/* 新規予約追加ボタン */}
            <Button 
                variant="contained" 
                sx={{ mb: 2 }} 
                onClick={() => setNewReservationModalIsOpen(true)}
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
                                <TableCell align="left">予約者名</TableCell>
                                <TableCell align="left">事務所名</TableCell>
                                <TableCell align="left">予約座席名</TableCell>
                                <TableCell align="left">パソコン名</TableCell>
                                <TableCell align="left">時間範囲</TableCell>
                                <TableCell align="left">予約日</TableCell>
                                <TableCell align="left">作成日時</TableCell>
                                <TableCell align="left">更新日時</TableCell>
                                <TableCell align="center">操作</TableCell>
                            </TableRow>
                        </TableHead>
                        {tableBody}
                    </Table>
                </TableContainer>
            ) : (
                calendarView
            )}

            {/* 編集モーダル */}
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
                contentLabel="編集モーダル"
            >
                <Edit
                    setEditModalIsOpen={setEditModalIsOpen}
                    id={id} reserve_id={reserve_id} setReserve_id={setReserve_id}
                    todo_content={todo_content} setTodo_content={setTodo_content}
                    person_id={person_id} setPerson_id={setPerson_id}
                    office_id={office_id} setOffice_id={setOffice_id}
                    seat_id={seat_id} setSeat_id={setSeat_id}
                    pasokon_id={pasokon_id} setPasokon_id={setPasokon_id}
                    start_time={start_time} setStart_time={setStart_time}
                    finish_time={finish_time} setFinish_time={setFinish_time}
                    reserve_day={reserve_day} setReserve_day={setReserve_day}
                />
            </Modal>

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
