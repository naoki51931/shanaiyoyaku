import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';

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
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const isLoggedIn = Boolean(localStorage.getItem('token'));
    const positionValue = isLoggedIn ? data.get('position') : 'C';
    const isApprovalValue = isLoggedIn ? data.get('is_approval') : '1'; // 未ログインの場合は is_approval を「1」に強制

    console.log({
      user_name: data.get('user_name'),
      kanji_name: data.get('kanji_name'),
      kata_name: data.get('kata_name'),
      password: data.get('password'),
      position: positionValue,
      is_approval: isApprovalValue,
    });
    console.log('props.setIsOpen:', props.setIsOpen);
    if (data.get('user_name') == ""){
      alert("ユーザーネームを入力して下さい。")
      return
    }
    if (data.get('kanji_name') == ""){
      alert("名前(漢字)を入力して下さい。")
      return
    }
    if (data.get('kata_name') == ""){
      alert("名前(カタカナ)を入力して下さい。")
      return
    }
    if (data.get('password') == ""){
      alert("パスワードを入力して下さい。")
      return
    }
    if (data.get('position') == ""){
      alert("役職を入力して下さい。")
      return
    }
    if (data.get('is_approval') == ""){
      alert("承認ユーザーを入力して下さい。")
      return
    }
    const user = {
      user_name: data.get('user_name'),
      kanji_name: data.get('kanji_name'),
      kata_name: data.get('kata_name'),
      password: data.get('password'),
      position: data.get('position'),
      is_approval: data.get('is_approval'),
    };
    axios.post('http://localhost:8000/user/new/', user, {
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
                  autoComplete="username"
                  name="user_name"
                  required
                  fullWidth
                  id="user_name"
                  label="ユーザーネーム"
                  autoFocus
                  value={props.user_name ?? ''}
                  onChange={(event) => props.setUser_name && props.setUser_name(event.target.value)}
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
                  autoFocus
                  value={props.kanji_name ?? ''}
                  onChange={(event) => props.setKanji_name && props.setKanji_name(event.target.value)}
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
                  autoFocus
                  value={props.kata_name ?? ''}
                  onChange={(event) => props.setKata_name && props.setKata_name(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="パスワード"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={props.password ?? ''}
                  onChange={(event) => props.setPassword && props.setPassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="position"
                  label="役職"
                  name="position"
                  autoComplete="position"
                  value={props.position ?? ''}
                  onChange={(event) => props.setPosition && props.setPosition(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="is_approval"
                  label="承認ユーザー"
                  name="is_approval"
                  autoComplete="is_approval"
                  value={props.is_approval ?? ''}
                  onChange={(event) => props.setIs_approval && props.setIs_approval(event.target.value)}
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