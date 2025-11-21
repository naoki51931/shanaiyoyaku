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
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

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

export default function SignUp(props) {

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const isLoggedIn = Boolean(localStorage.getItem('token'));
    const token = isLoggedIn ? localStorage.getItem('token') : null;
    const decodedToken = token ? jwtDecode(token) : null;
    const loginUserPosition = decodedToken?.position || 'C';

    let positionValue = data.get('position');
    let isApprovalValue = data.get('is_approval');

    const positionHierarchy = ['C', 'B', 'A'];

    if (positionHierarchy.indexOf(positionValue) > positionHierarchy.indexOf(loginUserPosition)) {
      isApprovalValue = '1';
      alert('選択した役職は変更できません。未承認ユーザーとして設定されました。');
    }

    if (!isLoggedIn) {
      isApprovalValue = '1';
    }

    const requiredFields = [
      ['user_name', 'ユーザーネーム'],
      ['kanji_name', '名前(漢字)'],
      ['kata_name', '名前(カタカナ)'],
      ['password', 'パスワード'],
      ['position', '役職'],
      ['is_approval', '承認ユーザー']
    ];

    for (const [field, label] of requiredFields) {
      if (!data.get(field)) {
        alert(`${label}を入力して下さい。`);
        return;
      }
    }

    const user = {
      user_name: data.get('user_name'),
      kanji_name: data.get('kanji_name'),
      kata_name: data.get('kata_name'),
      password: data.get('password'),
      position: positionValue,
      is_approval: isApprovalValue,
    };

    axios.post(`${API_URL}/user/new/`, user, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
      .then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log("error", error);
        alert(`エラーが発生しました: ${error.response?.data?.detail || '不明なエラー'}`);
      });
  };

  const handlePositionChange = (event) => {
    let positionValue = event.target.value;

    positionValue = positionValue
      .replace(/[ａ-ｚＡ-Ｚ]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0xfee0))
      .toUpperCase();

    props.setPosition && props.setPosition(positionValue);
  };

  const handleApprovalChange = (event) => {
    let approvalValue = event.target.value;

    approvalValue = approvalValue.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (m) =>
      String.fromCharCode(m.charCodeAt(0) - 0xfee0)
    );

    props.setIs_approval && props.setIs_approval(approvalValue);
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
                  autoComplete="username"
                  name="user_name"
                  required
                  fullWidth
                  id="user_name"
                  label="ユーザーネーム"
                  autoFocus
                  value={props.user_name ?? ''}
                  onChange={(e) => props.setUser_name && props.setUser_name(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="kanji_name"
                  required
                  fullWidth
                  id="kanji_name"
                  label="名前(漢字)"
                  value={props.kanji_name ?? ''}
                  onChange={(e) => props.setKanji_name && props.setKanji_name(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="kata_name"
                  required
                  fullWidth
                  id="kata_name"
                  label="名前(カタカナ)"
                  value={props.kata_name ?? ''}
                  onChange={(e) => props.setKata_name && props.setKata_name(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="パスワード"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={props.password ?? ''}
                  onChange={(e) => props.setPassword && props.setPassword(e.target.value)}
                />

                {/* 🔥 チェックボックス：大きめ */}
                <FormControlLabel
                  control={
                    <Checkbox
                      size="large"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                  }
                  label="パスワードを表示"
                />

              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  title="役職は「A」「B」「C」の三つです。"
                  id="position"
                  label="役職"
                  name="position"
                  value={props.position ?? ''}
                  onChange={handlePositionChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  title="承認ユーザーが2になることで全機能が使用できます。"
                  id="is_approval"
                  label="承認ユーザー"
                  name="is_approval"
                  value={props.is_approval ?? ''}
                  onChange={handleApprovalChange}
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

