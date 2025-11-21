import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";  // デフォルトインポートに戻す


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();
const API_URL = "/api";


export default function New(props) {
  const [offices, setOffices] = useState([]);
  const [users, setUsers] = useState([]);
  const [seats, setSeats] = useState([]);
  const [pasokons, setPasokons] = useState([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState(null);
  const [pasokonOptions, setPasokonOptions] = useState([]); // 座席に紐づくパソコンリスト

  // オフィス取得
  useEffect(() => {
    axios.get(`${API_URL}/office/all/`)
      .then(res => setOffices(res.data))
      .catch(error => console.error('オフィス情報の取得に失敗:', error));
  }, []);

  // ユーザー取得
  useEffect(() => {
    axios.get(`${API_URL}/user/all/`)
      .then(res => setUsers(res.data))
      .catch(error => console.error('ユーザー情報の取得に失敗:', error));
  }, []);

  // 予約シート取得
  useEffect(() => {
    axios.get(`${API_URL}/seat/all/`)
      .then(res => setSeats(res.data))
      .catch(error => console.error('予約シート情報の取得に失敗:', error));
  }, []);

  // パソコン一覧取得（全体）
  useEffect(() => {
    axios.get(`${API_URL}/pasokon/all/`)
      .then(res => setPasokons(res.data))
      .catch(error => console.error('パソコン予約シート情報の取得に失敗:', error));
  }, []);

  // ランダムな3桁の予約IDを初期設定
  useEffect(() => {
    if (props.setReserve_id && !props.reserve_id) {
      const randomId = Math.floor(100 + Math.random() * 900).toString(); // 100〜999
      props.setReserve_id(randomId);
    }
  }, []);

  // 座席が選択されたら、その座席に紐づくパソコンを取得してセット
  const handleSeatChange = (event) => {
    const selectedSeatId = event.target.value;
    props.setSeat_id && props.setSeat_id(selectedSeatId);

    if (selectedSeatId) {
      axios.get(`${API_URL}/pasokon/by-seat/${selectedSeatId}`)
        .then(res => {
          const pasokonsFromSeat = res.data; // 例: [{id, pasokon_name}, ...]
          setPasokonOptions(pasokonsFromSeat);

          if (pasokonsFromSeat.length > 0) {
            // 最初のパソコンを自動選択
            props.setPasokon_id && props.setPasokon_id(pasokonsFromSeat[0].id);
          } else {
            // なしの場合は空に
            props.setPasokon_id && props.setPasokon_id('');
          }
        })
        .catch(err => {
          console.error('パソコン取得エラー', err);
          setPasokonOptions([]);
          props.setPasokon_id && props.setPasokon_id('');
        });
    } else {
      setPasokonOptions([]);
      props.setPasokon_id && props.setPasokon_id('');
    }
  };

  // 事務所選択時の処理
  const handleOfficeChange = (event) => {
    const selectedId = event.target.value;
    setSelectedOfficeId(selectedId);
    props.setOffice_id && props.setOffice_id(selectedId);
    // 事務所変更時は座席とパソコンをリセットするのが望ましい
    props.setSeat_id && props.setSeat_id('');
    props.setPasokon_id && props.setPasokon_id('');
    setPasokonOptions([]);
  };

  // 送信処理
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const isLoggedIn = Boolean(localStorage.getItem('token'));
    const token = isLoggedIn ? localStorage.getItem('token') : null;
    const decodedToken = token ? jwtDecode(token) : null;
    const loginUserIsApproval = decodedToken?.is_approval;

    const startTime = new Date(data.get('start_time'));
    const finishTime = new Date(data.get('finish_time'));
    const reserveDay = new Date(data.get('reserve_day'));

    const Approval_level = 2;
    if (loginUserIsApproval !== Approval_level) {
      alert("ユーザー作成には管理者及び上位ユーザーの承認が必要です。");
      return;
    }

    if (data.get('reserve_id') === "") {
      alert("予約IDを入力して下さい。");
      return;
    }
    if (data.get('todo_content') === "") {
      alert("タスク内容を入力して下さい。");
      return;
    }
    if (data.get('person_id') === "") {
      alert("人物IDを選択して下さい。");
      return;
    }
    if (data.get('office_id') === "") {
      alert("事務所IDを選択して下さい。");
      return;
    }
    if (data.get('seat_id') === "") {
      alert("座席IDを選択して下さい。");
      return;
    }
    if (data.get('pasokon_id') === "") {
      alert("パソコンIDを選択して下さい。");
      return;
    }
    if (data.get('start_time') === "") {
      alert("開始時間を選択して下さい。");
      return;
    }
    if (data.get('finish_time') === "") {
      alert("終了時間を選択して下さい。");
      return;
    }
    if (finishTime <= startTime) {
      alert("終了時間は開始時間より後に設定してください。");
      return;
    }
    const startDateString = startTime.toISOString().split('T')[0];
    const reserveDateString = reserveDay.toISOString().split('T')[0];
    if (startDateString !== reserveDateString) {
      alert("開始時間と予約日は同じ日付にしてください。");
      return;
    }
    if (data.get('reserve_day') === "") {
      alert("予約日を選択して下さい。");
      return;
    }

    const seat_reservation = {
      reserve_id: data.get('reserve_id'),
      todo_content: data.get('todo_content'),
      person_id: data.get('person_id'),
      office_id: data.get('office_id'),
      seat_id: data.get('seat_id'),
      pasokon_id: data.get('pasokon_id'),
      start_time: data.get('start_time'),
      finish_time: data.get('finish_time'),
      reserve_day: data.get('reserve_day'),
    };

    axios.post(`${API_URL}/seat_reservation/new/`, seat_reservation, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    })
      .then(res => {
        console.log(res);
        alert('予約が作成されました。');
        if (props.setIsOpen) {
          props.setIsOpen(false); // モーダル閉じる等の処理があれば
        }
      })
      .catch(error => {
        console.error('エラー:', error);
        alert(`エラーが発生しました: ${error.response?.data?.detail || '不明なエラー'}`);
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            New Reservation
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  autoComplete="reserve_id"
                  name="reserve_id"
                  required
                  fullWidth
                  id="reserve_id"
                  label="予約ID"
                  autoFocus
                  value={props.reserve_id ?? ''}
                  onChange={e => props.setReserve_id && props.setReserve_id(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoComplete="todo_content"
                  name="todo_content"
                  required
                  fullWidth
                  id="todo_content"
                  label="タスク内容"
                  value={props.todo_content ?? ''}
                  onChange={e => props.setTodo_content && props.setTodo_content(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="person-select-label">予約者</InputLabel>
                  <Select
                    labelId="person-select-label"
                    id="person_id"
                    name="person_id"
                    value={props.person_id ?? ''}
                    label="予約者"
                    onChange={e => props.setPerson_id && props.setPerson_id(e.target.value)}
                  >
                    <MenuItem value="">予約者を選択してください</MenuItem>
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.kanji_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="office-select-label">事務所</InputLabel>
                  <Select
                    labelId="office-select-label"
                    id="office_id"
                    name="office_id"
                    value={props.office_id !== undefined ? String(props.office_id) : ''}
                    label="事務所"
                    onChange={handleOfficeChange}
                  >
                    <MenuItem value="">事務所を選択してください</MenuItem>
                    {offices.map(office => (
                      <MenuItem key={office.id} value={String(office.id)}>
                        {office.office_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="seat-select-label">予約シート</InputLabel>
                  <Select
                    labelId="seat-select-label"
                    id="seat_id"
                    name="seat_id"
                    value={props.seat_id ?? ''}
                    label="予約シート"
                    onChange={handleSeatChange}
                  >
                    <MenuItem value="">予約シートを選択してください</MenuItem>
                    {seats
                      .filter(seat => seat.office_id === parseInt(selectedOfficeId))
                      .map(seat => (
                        <MenuItem key={seat.id} value={seat.id}>
                          {seat.seat_name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="pasokon-select-label">パソコン名</InputLabel>
                  <Select
                    labelId="pasokon-select-label"
                    id="pasokon_id"
                    name="pasokon_id"
                    value={props.pasokon_id ?? ''}
                    label="パソコン名"
                    title="パソコン名が見つからない場合はパソコン修正画面で、使用するシートを選択してから選択してください"
                    onChange={e => props.setPasokon_id && props.setPasokon_id(e.target.value)}
                  >
                    <MenuItem value="">パソコン名を選択してください</MenuItem>
                    {pasokonOptions.map(pasokon => (
                      <MenuItem key={pasokon.id} value={pasokon.id}>
                        {pasokon.pasokon_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="開始時間"
                  type="datetime-local"
                  id="start_time"
                  name="start_time"
                  value={props.start_time ?? ''}
                  onChange={e => props.setStart_time && props.setStart_time(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="終了時間"
                  type="datetime-local"
                  id="finish_time"
                  name="finish_time"
                  value={props.finish_time ?? ''}
                  onChange={e => props.setFinish_time && props.setFinish_time(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  title="予約日は開始時間と同じ日にしてください"
                  label="予約日時"
                  type="datetime-local"
                  id="reserve_day"
                  name="reserve_day"
                  value={props.reserve_day ?? ''}
                  onChange={e => props.setReserve_day && props.setReserve_day(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
