import { useState, useEffect } from "react";
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
import { jwtDecode } from "jwt-decode";
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const defaultTheme = createTheme();
const API_URL = "/api";

export default function SignUp(props) {
  const [offices, setOffices] = useState([]);
  const [users, setUsers] = useState([]);
  const [seats, setSeats] = useState([]);
  const [pasokonOptions, setPasokonOptions] = useState([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState(props.office_id ?? '');
  const [selectedSeatId, setSelectedSeatId] = useState(props.seat_id || '');

  // 初期データ取得
  useEffect(() => {
    axios.get(`${API_URL}/office/all/`).then(res => setOffices(res.data)).catch(console.error);
    axios.get(`${API_URL}/user/all/`).then(res => setUsers(res.data)).catch(console.error);
    axios.get(`${API_URL}/seat/all/`).then(res => setSeats(res.data)).catch(console.error);
  }, []);

  // 座席に紐づくパソコン一覧を取得
  useEffect(() => {
    if (selectedSeatId) {
      axios.get(`${API_URL}/pasokon/by-seat/${selectedSeatId}`)
        .then(res => {
          const pasokons = res.data;
          setPasokonOptions(pasokons);
          if (pasokons.length > 0) {
            props.setPasokon_id && props.setPasokon_id(pasokons[0].id); // 自動選択
          } else {
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
  }, [selectedSeatId]);

  // 提出処理
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const loginUserIsApproval = decodedToken?.is_approval;

    if (loginUserIsApproval !== 2) {
      alert("ユーザー作成には管理者及び上位ユーザーの承認が必要です。");
      return;
    }

    const startTime = new Date(data.get('start_time'));
    const finishTime = new Date(data.get('finish_time'));
    const reserveDay = new Date(data.get('reserve_day'));

    if (finishTime <= startTime || startTime.toISOString().split('T')[0] !== reserveDay.toISOString().split('T')[0]) {
      alert("時間または日付の整合性エラー");
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
      reserve_day: data.get('reserve_day')
    };

    axios.put(`${API_URL}/seat_reservation/${props.id}`, seat_reservation)
      .then(() => {
        alert("更新が完了しました");
        props.setEditModalIsOpen(false);
      })
      .catch(error => {
        console.error("更新エラー", error);
        alert(`エラーが発生しました: ${error.response?.data?.detail || '不明なエラー'}`);
      });
  };

  const handleDelete = () => {
    axios.delete(`${API_URL}/seat_reservation/${props.id}`)
      .then(() => {
        alert("削除が完了しました");
        props.setEditModalIsOpen(false);
      })
      .catch(error => {
        console.error("削除エラー", error);
        alert(`削除に失敗しました: ${error.response?.data?.detail || '不明なエラー'}`);
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
          <Typography component="h1" variant="h5">Edit Reservation</Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField name="reserve_id" required fullWidth label="予約ID" value={props.reserve_id || ""} onChange={(e) => props.setReserve_id(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField name="todo_content" required fullWidth label="タスク内容" value={props.todo_content || ""} onChange={(e) => props.setTodo_content(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="person-select-label">予約者</InputLabel>
                  <Select labelId="person-select-label" name="person_id" value={props.person_id || ""} onChange={(e) => props.setPerson_id(e.target.value)}>
                    <MenuItem value="">予約者を選択してください</MenuItem>
                    {users.map(user => (
                      <MenuItem key={user.id} value={user.id}>{user.kanji_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="office-select-label">事務所</InputLabel>
                  <Select
                    labelId="office-select-label"
                    name="office_id"
                    value={props.office_id ?? ''}
                    onChange={(e) => {
                      setSelectedOfficeId(e.target.value);
                      props.setOffice_id(e.target.value);
                      props.setSeat_id('');
                      setSelectedSeatId('');
                    }}
                  >
                    <MenuItem value="">事務所を選択してください</MenuItem>
                    {offices.map(office => (
                      <MenuItem key={office.id} value={String(office.id)}>{office.office_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="seat-select-label">予約シート</InputLabel>
                  <Select
                    labelId="seat-select-label"
                    name="seat_id"
                    value={props.seat_id || ''}
                    onChange={(e) => {
                      const newSeatId = e.target.value;
                      props.setSeat_id(newSeatId);
                      setSelectedSeatId(newSeatId); // パソコン一覧更新
                    }}
                  >
                    <MenuItem value="">予約シートを選択してください</MenuItem>
                    {seats
                      .filter(seat => seat.office_id === parseInt(selectedOfficeId))
                      .map(seat => (
                        <MenuItem key={seat.id} value={seat.id}>{seat.seat_name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="pasokon-select-label">パソコンID / 名</InputLabel>
                  <Select
                    labelId="pasokon-select-label"
                    name="pasokon_id"
                    value={props.pasokon_id || ''}
                    onChange={(e) => props.setPasokon_id(e.target.value)}
                  >
                    <MenuItem value="">パソコンID / 名を選択してください</MenuItem>
                    {pasokonOptions.map(pasokon => (
                      <MenuItem key={pasokon.id} value={pasokon.id}>
                        {`${pasokon.pasokon_id ?? 'ID未設定'} / ${pasokon.pasokon_name}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="開始時間" type="datetime-local" name="start_time" value={props.start_time || ''} onChange={(e) => props.setStart_time(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="終了時間" type="datetime-local" name="finish_time" value={props.finish_time || ''} onChange={(e) => props.setFinish_time(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="予約日時" type="datetime-local" name="reserve_day" value={props.reserve_day || ''} onChange={(e) => props.setReserve_day(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Update</Button>
            <Button type="button" fullWidth variant="contained" color="error" sx={{ mt: 1, mb: 2 }} onClick={handleDelete}>Delete</Button>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
          Copyright © Your Website {new Date().getFullYear()}.
        </Typography>
      </Container>
    </ThemeProvider>
  );
}
