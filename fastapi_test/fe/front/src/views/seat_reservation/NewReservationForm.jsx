import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_BASE_URL;

function NewReservationForm({ closeModal }) {
    const [offices, setOffices] = useState([]);
    const [users, setUsers] = useState([]);
    const [seats, setSeats] = useState([]);
    const [pasokonOptions, setPasokonOptions] = useState([]);  // 座席に紐づくパソコン一覧

    const [reserveId, setReserveId] = useState('');
    const [todoContent, setTodoContent] = useState('');
    const [personId, setPersonId] = useState('');
    const [officeId, setOfficeId] = useState('');
    const [seatId, setSeatId] = useState('');
    const [pasokonId, setPasokonId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [finishTime, setFinishTime] = useState('');
    const [reserveDay, setReserveDay] = useState('');

    useEffect(() => {
        axios.get(`${API_URL}/office/all/`)
            .then(response => setOffices(response.data))
            .catch(error => console.error('オフィス情報の取得に失敗:', error));

        axios.get(`${API_URL}/user/all/`)
            .then(response => setUsers(response.data))
            .catch(error => console.error('予約者情報の取得に失敗:', error));

        axios.get(`${API_URL}/seat/all/`)
            .then(response => setSeats(response.data))
            .catch(error => console.error('座席情報の取得に失敗:', error));
    }, []);

    useEffect(() => {
        // 初期表示時に予約IDを3桁ランダム数字で自動入力
        const randomId = Math.floor(100 + Math.random() * 900).toString(); // 100〜999
        setReserveId(randomId);
    }, []);
    

    // 事務所変更時、座席・パソコンの選択をリセットする
    const handleOfficeChange = (event) => {
        const selectedOfficeId = event.target.value;
        setOfficeId(selectedOfficeId);
        setSeatId('');
        setPasokonOptions([]);
        setPasokonId('');
    };

    // 座席変更時、該当座席に紐づくパソコンを取得しセット
    const handleSeatChange = (event) => {
        const selectedSeatId = event.target.value;
        setSeatId(selectedSeatId);

        if (!selectedSeatId) {
            setPasokonOptions([]);
            setPasokonId('');
            return;
        }

        axios.get(`${API_URL}/pasokon/by-seat/${selectedSeatId}`)
            .then(response => {
                const pasokonsFromSeat = response.data; // [{id, pasokon_name}, ...]
                setPasokonOptions(pasokonsFromSeat);
                if (pasokonsFromSeat.length > 0) {
                    setPasokonId(pasokonsFromSeat[0].id); // 最初のパソコンを自動選択
                } else {
                    setPasokonId('');
                }
            })
            .catch(error => {
                console.error('パソコン情報取得エラー:', error);
                setPasokonOptions([]);
                setPasokonId('');
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!reserveId || !todoContent || !personId || !officeId || !seatId || !pasokonId || !startTime || !finishTime || !reserveDay) {
            alert('すべての項目を入力してください。');
            return;
        }

        if (new Date(finishTime) <= new Date(startTime)) {
            alert('終了時間は開始時間より後に設定してください。');
            return;
        }

        const startDateString = new Date(startTime).toISOString().split('T')[0];
        const reserveDateString = new Date(reserveDay).toISOString().split('T')[0];
        if (startDateString !== reserveDateString) {
            alert('開始時間と予約日は同じ日にしてください。');
            return;
        }

        const reservationData = {
            reserve_id: reserveId,
            todo_content: todoContent,
            person_id: personId,
            office_id: officeId,
            seat_id: seatId,
            pasokon_id: pasokonId,
            start_time: startTime,
            finish_time: finishTime,
            reserve_day: reserveDay,
        };

        axios.post(`${API_URL}/seat_reservation/new/`, reservationData)
            .then(response => {
                console.log('新規予約作成:', response.data);
                closeModal();
            })
            .catch(error => {
                console.error('予約作成に失敗:', error);
                alert(`予約作成に失敗しました: ${error.response?.data?.detail || error.message}`);
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
                    required
                />
                <TextField
                    label="概要"
                    fullWidth
                    margin="normal"
                    value={todoContent}
                    onChange={(e) => setTodoContent(e.target.value)}
                    required
                />

                {/* 事務所選択 */}
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="office-select-label">事業所名</InputLabel>
                    <Select
                        labelId="office-select-label"
                        value={officeId}
                        onChange={handleOfficeChange}
                        label="事業所名"
                    >
                        <MenuItem value="">事業所を選択してください</MenuItem>
                        {offices.map((office) => (
                            <MenuItem key={office.id} value={office.id}>
                                {office.office_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

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

                {/* 座席選択（事務所に対応した座席のみ表示） */}
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="seat-select-label">座席</InputLabel>
                    <Select
                        labelId="seat-select-label"
                        value={seatId}
                        onChange={handleSeatChange}
                        label="座席"
                    >
                        <MenuItem value="">座席を選択してください</MenuItem>
                        {seats
                            .filter(seat => seat.office_id === Number(officeId))
                            .map((seat) => (
                                <MenuItem key={seat.id} value={seat.id}>
                                    {seat.seat_name}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                {/* パソコン選択（座席に紐づくパソコンのみ表示） */}
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="pasokon-select-label">パソコン名</InputLabel>
                    <Select
                        labelId="pasokon-select-label"
                        value={pasokonId}
                        onChange={(e) => setPasokonId(e.target.value)}
                        label="パソコン名"
                        title="パソコン名が見つからない場合はパソコン修正画面で、使用するシートを選択してから選択してください"
                    >
                        <MenuItem value="">パソコン名を選択してください</MenuItem>
                        {pasokonOptions.map((pasokon) => (
                            <MenuItem key={pasokon.id} value={pasokon.id}>
                                {pasokon.pasokon_name}
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
