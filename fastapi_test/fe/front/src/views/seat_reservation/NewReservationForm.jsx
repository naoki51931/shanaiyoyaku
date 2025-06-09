import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

function NewReservationForm({ closeModal }) {
    const [users, setUsers] = useState([]);
    const [seats, setSeats] = useState([]);
    const [reserveId, setReserveId] = useState('');
    const [todoContent, setTodoContent] = useState('');
    const [personId, setPersonId] = useState('');
    const [seatId, setSeatId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [finishTime, setFinishTime] = useState('');
    const [reserveDay, setReserveDay] = useState('');

    useEffect(() => {
        // 予約者（ユーザー）のデータを取得
        axios.get('http://localhost:8000/user/all/')
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error('予約者情報の取得に失敗:', error);
            });

        // 座席データを取得
        axios.get('http://localhost:8000/seat_regist/all/')
            .then((response) => {
                setSeats(response.data);
            })
            .catch((error) => {
                console.error('座席情報の取得に失敗:', error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const reservationData = {
            reserve_id: reserveId,
            todo_content: todoContent,
            person_id: personId,
            seat_id: seatId,
            start_time: startTime,
            finish_time: finishTime,
            reserve_day: reserveDay,
        };

        axios.post('http://localhost:8000/seat_reservation/new/', reservationData)
            .then(response => {
                console.log('新規予約作成:', response.data);
                closeModal();  // モーダルを閉じる
            })
            .catch(error => {
                console.error('予約作成に失敗:', error);
            });
    };

    return (
        <div>
            <h2>新規予約作成</h2>
            <form onSubmit={handleSubmit}>
                <TextField 
                    label="予約ID" 
                    fullWidth 
                    margin="normal" 
                    value={reserveId} 
                    onChange={(e) => setReserveId(e.target.value)} 
                />
                <TextField 
                    label="概要" 
                    fullWidth 
                    margin="normal" 
                    value={todoContent} 
                    onChange={(e) => setTodoContent(e.target.value)} 
                />
                
                {/* 予約者選択 */}
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="person-select-label">予約者</InputLabel>
                    <Select
                        labelId="person-select-label"
                        value={personId}
                        onChange={(e) => setPersonId(e.target.value)}
                        label="予約者"
                    >
                        <MenuItem value="">予約者を選択してください</MenuItem>
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.kanji_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* 座席選択 */}
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="seat-select-label">座席</InputLabel>
                    <Select
                        labelId="seat-select-label"
                        value={seatId}
                        onChange={(e) => setSeatId(e.target.value)}
                        label="座席"
                    >
                        <MenuItem value="">座席を選択してください</MenuItem>
                        {seats.map((seat) => (
                            <MenuItem key={seat.id} value={seat.id}>
                                {seat.seat_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="開始時間"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    label="終了時間"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    value={finishTime}
                    onChange={(e) => setFinishTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                />
                <TextField
                    label="予約日"
                    type="datetime-local"
                    fullWidth
                    margin="normal"
                    value={reserveDay}
                    onChange={(e) => setReserveDay(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                />

                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                    予約作成
                </Button>
            </form>
        </div>
    );
}

export default NewReservationForm;
