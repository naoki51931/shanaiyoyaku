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

const API_URL = "/api";

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

  useEffect(() => {
    axios.get(`${API_URL}/office/all/`) // ← オフィス一覧を取得するエンドポイント
      .then((res) => {
        setOffices(res.data);
      })
      .catch((error) => {
        console.error('オフィス情報の取得に失敗:', error);
      });
  }, []);


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
      alert("ユーザー作成には管理者及び上位ユーザーの承認が必要です。");
      return; // ユーザー作成をキャンセル
    }

    console.log({
      office_name: data.get('office_name'),
      office_id: data.get('office_id'),
    });
    console.log('props.setIsOpen:', props.setIsOpen);
    if (data.get('office_name') === ""){
      alert("事業所名を入力して下さい。")
      return
    }
    if (data.get('office_id') === ""){
      alert("事業所idを入力して下さい。")
      return
    }
    const office = {
      office_name: data.get('office_name'),
      office_id: data.get('office_id'),
    };
    axios.post(`${API_URL}/office/new/`, office, {
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
                  autoComplete="office_name"
                  name="office_name"
                  required
                  fullWidth
                  id="office_name"
                  label="事業所名"
                  autoFocus
                  value={props.office_name ?? ''}
                  onChange={(event) => props.setOffice_name && props.setOffice_name(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="office_id"
                  name="office_id"
                  required
                  fullWidth
                  id="office_id"
                  label="事業所id"
                  autoFocus
                  value={props.office_id ?? ''}
                  onChange={(event) => props.setOffice_id && props.setOffice_id(event.target.value)}
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