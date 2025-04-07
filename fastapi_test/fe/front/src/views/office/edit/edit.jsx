import * as React from 'react';
import { useState, useEffect } from "react"
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

  useEffect(() => {
    axios.get(`${BASE_URL}/office/all/`)
      .then((res) => {
        setOffices(res.data);
      })
      .catch((error) => {
        console.error("オフィス取得エラー:", error);
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
      office_name: data.get('office_name'),
      office_id: data.get('office_id'),
      id: props.id
    });
    if (data.get('office_name') == ""){
      alert("事業所名を入力して下さい。")
      return
    }
    if (data.get('office_id') == ""){
      alert("事業所idを入力して下さい。")
      return
    }
    const user = {
      office_name: data.get('office_name'),
      office_id: data.get('office_id'),
    };    
  
    axios.put(BASE_URL + `/office/${props.id}`, user, {
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
    axios.delete(BASE_URL + `/office/${props.id}`, params)
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
                  autoComplete="office_name"
                  name="office_name"
                  required
                  fullWidth
                  id="office_name"
                  label="事業所名"
                  autoFocus
                  value={props.office_name || ""}
                  onChange={(event) => props.setOffice_name(event.target.value)}
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
                  value={props.office_id || ""}
                  onChange={(event) => props.setOffice_id(event.target.value)}
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