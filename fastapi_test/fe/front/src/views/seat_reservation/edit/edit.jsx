import { useState, useEffect } from "react"
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
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';



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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();
const BASE_URL = "http://localhost:8000";


export default function SignUp(props) {
  const [offices, setOffices] = useState([]);
  const [users, setUsers] = useState([]);
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/office/all/`)
      .then((res) => {
        setOffices(res.data);
      })
      .catch((error) => {
        console.error("オフィス取得エラー:", error);
      });
  }, []);

  useEffect(() => {
      axios.get('http://localhost:8000/user/all/') // ← オフィス一覧を取得するエンドポイント
        .then((res) => {
          setUsers(res.data);
        })
        .catch((error) => {
          console.error('ユーザー情報の取得に失敗:', error);
        });
    }, []);
  
  useEffect(() => {
    axios.get('http://localhost:8000/seat/all/') // ← オフィス一覧を取得するエンドポイント
      .then((res) => {
        setSeats(res.data);
      })
      .catch((error) => {
        console.error('予約シート情報の取得に失敗:', error);
      });
  }, []);

  const handleSubmit = (event) => {

    event.preventDefault();
    const data = new FormData(event.currentTarget);
    

    const token = localStorage.getItem('token'); // ローカルストレージに保存されているトークン
    console.log(token);
    if (typeof token !== 'string') {
      console.error("Invalid token:", token); // トークンが文字列でない場合、エラーメッセージを表示
    }
    const decodedToken = jwtDecode(token);
    const loginUserIsApproval = decodedToken?.is_approval; // ログインユーザーの承認ステータス

    console.log(loginUserIsApproval);
    // ログインユーザーの is_approval が 2 でない場合はユーザー作成を許可しない
    if (loginUserIsApproval !== 2) {
      alert("ユーザー作成には管理者及び上位ユーザーの承認が必要です。");
      return; // ユーザー作成をキャンセル
    }


    console.log({
      reserve_id: data.get('reserve_id'),
      todo_content: data.get('todo_content'),
      person_id: data.get('person_id'),
      seat_id: data.get('seat_id'),
      start_time: data.get('start_time'),
      finish_time: data.get('finish_time'),
      reserve_day: data.get('reserve_day'),
    });
    if (data.get('reserve_id') === ""){
      alert("予約IDを入力して下さい。")
      return
    }
    if (data.get('todo_content') === ""){
      alert("タスク内容を入力して下さい。")
      return
    }
    if (data.get('person_id') === ""){
      alert("人物IDを選択して下さい。")
      return
    }
    if (data.get('seat_id') === ""){
      alert("座席IDを選択して下さい。")
      return
    }
    if (data.get('start_time') === ""){
      alert("開始時間を選択して下さい。")
      return
    }
    if (data.get('finish_time') === ""){
      alert("終了時間を選択して下さい。")
      return
    }
    if (data.get('reserve_day') === ""){
      alert("予約日を選択して下さい。")
      return
    }
    const seat_reservation = {
      reserve_id: data.get('reserve_id'),
      todo_content: data.get('todo_content'),
      person_id: data.get('person_id'),
      seat_id: data.get('seat_id'),
      start_time: data.get('start_time'),
      finish_time: data.get('finish_time'),
      reserve_day: data.get('reserve_day'),
    };   
  
    axios.put(BASE_URL + `/seat/${props.id}`, seat_reservation, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (res) {
            console.log(res)
            props.setEditModalIsOpen(false);
        })
        .catch(function (error) {
            console.log("error", error);
        });
  };
  const DeleteUser = () => {
    console.log({
      id: props.id
    });
    const params = new URLSearchParams();
    params.append('id', props.id);
    axios.delete(BASE_URL + `/seat/${props.id}`, params)
        .then(function (res) {
            console.log(res)
            props.setEditModalIsOpen(false);
        })
        .catch(function (error) {
            console.log("error", error);
        });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit
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
                  value={props.reserve_id || ""}
                  onChange={(event) => props.setReserve_id(event.target.value)}
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
                  autoFocus
                  value={props.todo_content || ""}
                  onChange={(event) => props.setTodo_content(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="person-select-label">予約者</InputLabel>
                  <Select
                    labelId="person-select-label"
                    id="person_id"
                    name="person_id"
                    value={props.person_id || ""}
                    label="予約者"
                    onChange={(event) => props.setPerson_id(event.target.value)}
                  >
                    {/* 空の状態の場合のデフォルト表示 */}
                    <MenuItem value="">予約者を選択してください</MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.kanji_name}
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
                    value={props.seat_id || ""}
                    label="予約シート"
                    onChange={(event) => props.setSeat_id(event.target.value)}
                  >
                    {/* 空の状態の場合のデフォルト表示 */}
                    <MenuItem value="">予約シートを選択してください</MenuItem>
                    {seats.map((seat) => (
                      <MenuItem key={seat.id} value={seat.id}>
                        {seat.seat_name}
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
                  value={props.start_time || ""}
                  onChange={(event) => props.setStart_time(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
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
                  value={props.finish_time || ""}
                  onChange={(event) => props.setFinish_time(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="予約日時"
                  type="datetime-local"
                  id="reserve_day"
                  name="reserve_day"
                  value={props.reserve_day || ""}
                  onChange={(event) => props.setReserve_day(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="error"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {DeleteUser()}}
            >
              Delete
            </Button>
            {/* <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}