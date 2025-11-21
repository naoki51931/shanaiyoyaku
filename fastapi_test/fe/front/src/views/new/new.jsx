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

  const storedToken = localStorage.getItem('token');
  const isLoggedIn = Boolean(storedToken);

  let decodedToken = null;
  let loginUserPosition = 'C';

  if (storedToken) {
    try {
      decodedToken = jwtDecode(storedToken);
      loginUserPosition = decodedToken?.position || 'C';
    } catch (err) {
      console.warn("token decode failed", err);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // === 未ログイン時：author 登録専用 ===
    let positionValue = isLoggedIn ? data.get('position') : 'C';
    let isApprovalValue = isLoggedIn ? data.get('is_approval') : '1';

    const requiredFields = [
      ['user_name', 'ユーザーネーム'],
      ['kanji_name', '名前(漢字)'],
      ['kata_name', '名前(カタカナ)'],
      ['password', 'パスワード'],
    ];

    if (isLoggedIn) {
      requiredFields.push(
        ['position', '役職'],
        ['is_approval', '承認ユーザー']
      );
    }

    for (const [field, label] of requiredFields) {
      if (!data.get(field)) {
        alert(`${label}を入力して下さい。`);
        return;
      }
    }

    // === author を自動セット（未ログイン時限定） ===
    const authorUser = isLoggedIn ? decodedToken?.user_name : "author";

    const user = {
      user_name: data.get('user_name'),
      kanji_name: data.get('kanji_name'),
      kata_name: data.get('kata_name'),
      password: data.get('password'),
      position: positionValue,    // A/B/C
      is_approval: isApprovalValue, 
      author: authorUser          // ← 追加
    };

    axios.post(`${API_URL}/user/new/`, user, {
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => {
        console.log(res);
        alert("登録が完了しました。ログインしてください。");
      })
      .catch((error) => {
        console.log("error", error);
        alert(`エラー: ${error.response?.data?.detail || '不明なエラー'}`);
      });
  };

  const handlePositionChange = (e) => {
    let v = e.target.value
      .replace(/[ａ-ｚＡ-Ｚ]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0xfee0))
      .toUpperCase();

    props.setPosition && props.setPosition(v);
  };

  const handleApprovalChange = (e) => {
    let v = e.target.value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (m) =>
      String.fromCharCode(m.charCodeAt(0) - 0xfee0)
    );

    props.setIs_approval && props.setIs_approval(v);
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
            New
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  name="user_name"
                  required
                  fullWidth
                  label="ユーザーネーム"
                  autoFocus
                  value={props.user_name ?? ''}
                  onChange={(e) => props.setUser_name && props.setUser_name(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="kanji_name"
                  required
                  fullWidth
                  label="名前（漢字）"
                  value={props.kanji_name ?? ''}
                  onChange={(e) => props.setKanji_name && props.setKanji_name(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="kata_name"
                  required
                  fullWidth
                  label="名前（カタカナ）"
                  value={props.kata_name ?? ''}
                  onChange={(e) => props.setKata_name && props.setKata_name(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="password"
                  required
                  fullWidth
                  label="パスワード"
                  type={showPassword ? "text" : "password"}
                  value={props.password ?? ''}
                  onChange={(e) => props.setPassword && props.setPassword(e.target.value)}
                />
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

              {/* 🔹 ログイン時のみ position と is_approval を表示 */}
              {isLoggedIn && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      name="position"
                      required
                      fullWidth
                      label="役職 (A/B/C)"
                      value={props.position ?? ''}
                      onChange={handlePositionChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      name="is_approval"
                      required
                      fullWidth
                      label="承認ユーザー"
                      value={props.is_approval ?? ''}
                      onChange={handleApprovalChange}
                    />
                  </Grid>
                </>
              )}

            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Create
            </Button>

          </Box>

        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

