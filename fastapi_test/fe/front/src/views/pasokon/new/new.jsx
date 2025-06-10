import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useEffect, useState } from 'react';
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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp(props) {
  const [offices, setOffices] = useState([]);
  const [seats, setSeats] = useState([]);
  const [filteredSeats, setFilteredSeats] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/office/all/') // ← オフィス一覧を取得するエンドポイント
      .then((res) => {
        setOffices(res.data);
      })
      .catch((error) => {
        console.error('オフィス情報の取得に失敗:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('http://localhost:8000/seat/all/') // ← 座席一覧を取得するエンドポイント
      .then((res) => {
        setSeats(res.data);
      })
      .catch((error) => {
        console.error('シート情報の取得に失敗:', error);
      });
  }, []);

  useEffect(() => {
    if (props.office_id) {
      const filtered = seats.filter(seat => seat.office_id === props.office_id);
      setFilteredSeats(filtered);
    } else {
      setFilteredSeats([]);
    }
  }, [props.office_id, seats]);


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    
    const isLoggedIn = Boolean(localStorage.getItem('token'));
    const token = isLoggedIn ? localStorage.getItem('token') : null;
    const decodedToken = token ? jwtDecode(token) : null;
    const loginUserPosition = decodedToken?.position || 'C'; // ログインユーザーの役職を取得


    const loginUserIsApproval = decodedToken?.is_approval; // ログインユーザーの承認ステータス

    console.log(loginUserIsApproval);
    const Approval_level = 2;
    // ログインユーザーの is_approval が 2 でない場合はユーザー作成を許可しない
    if (loginUserIsApproval !== Approval_level) {
      alert("パソコン登録には管理者及び上位ユーザーの承認が必要です。");
      return; // パソコン登録をキャンセル
    }

    console.log({
      pasokon_name: data.get('pasokon_name'),
      office_id: data.get('office_id'),
      seat_id: data.get('seat_id'),
    });
    console.log('props.setIsOpen:', props.setIsOpen);
    if (data.get('pasokon_name') === ""){
      alert("パソコン名を入力して下さい。")
      return
    }
    if (data.get('office_name') === ""){
      alert("事務所名を選択して下さい。")
      return
    }
    if (data.get('seat_name') === ""){
      alert("座席名を選択して下さい。")
      return
    }
    const pasokon = {
      pasokon_name: data.get('pasokon_name'),
      office_id: data.get('office_id'),
      seat_id: data.get('seat_id'),
    };
    axios.post('http://localhost:8000/pasokon/new/', pasokon, {
      headers: {
          'Content-Type': 'application/json'
      },
      withCredentials: true  // 追加（必要なら）
    })
        .then(function (res) {
            console.log(res)
        })
        .catch(function (error) {
            console.log("error", error);
            alert(`エラーが発生しました: ${error.response?.data?.detail || '不明なエラー'}`);
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
            New
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="pasokon_name"
                  name="pasokon_name"
                  required
                  fullWidth
                  id="pasokon_name"
                  label="パソコン名"
                  autoFocus
                  value={props.pasokon_name ?? ''}
                  onChange={(event) => props.setPasokon_name && props.setPasokon_name(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="office-select-label">事務所</InputLabel>
                  <Select
                    labelId="office-select-label"
                    id="office_id"
                    name="office_id"
                    value={props.office_id ?? ''}
                    label="事務所"
                    onChange={(event) => props.setOffice_id && props.setOffice_id(event.target.value)}
                  >
                    {/* 空の状態の場合のデフォルト表示 */}
                    <MenuItem value="">オフィスを選択してください</MenuItem>
                    {offices.map((office) => (
                      <MenuItem key={office.id} value={office.id}>
                        {office.office_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="seat-select-label">座席</InputLabel>
                  <Select
                    labelId="seat-select-label"
                    id="seat_id"
                    name="seat_id"
                    value={props.seat_id ?? ''}
                    label="座席"
                    onChange={(event) => props.setSeat_id && props.setSeat_id(event.target.value)}
                  >
                    <MenuItem value="">座席を選択してください</MenuItem>
                    {filteredSeats.map((seat) => (
                      <MenuItem key={seat.id} value={seat.id}>
                        {seat.seat_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
              Create
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