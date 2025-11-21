import React, { useState } from 'react';
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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";  // デフォルトインポートに戻す

// Copyright コンポーネントはそのまま
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
    
    const token = localStorage.getItem('token'); // ローカルストレージに保存されているトークン
    console.log(token);
    if (typeof token !== 'string') {
      console.error("Invalid token:", token); // トークンが文字列でない場合、エラーメッセージを表示
    }
    const decodedToken = jwtDecode(token);
    const loginUserIsApproval = decodedToken?.is_approval; // ログインユーザーの承認ステータス

    const Approval_level = 2;
    // ログインユーザーの is_approval が 2 でない場合はユーザー作成を許可しない
    if (loginUserIsApproval !== Approval_level) {
      alert("ユーザー作成には管理者及び上位ユーザーの承認が必要です。");
      return; // ユーザー作成をキャンセル
    }

    const isLoggedIn = Boolean(localStorage.getItem('token'));
    const loginUserPosition = decodedToken?.position; // ログインユーザーの役職
    const loginUserIsSuperuser = decodedToken?.is_superuser; // ログインユーザーが管理者かどうか

    const targetUserPosition = data.get('position'); // 変更対象の役職
    let isApprovalValue = data.get('is_approval');

    // 役職制御ロジック
    const positionHierarchy = ['C', 'B', 'A'];

    if (loginUserIsSuperuser) {
      // 管理者は役職変更をABCすべてに対して設定でき、承認フラグを2に設定
      data.set('is_approval', '2');
    } else if (positionHierarchy.indexOf(targetUserPosition) > positionHierarchy.indexOf(loginUserPosition)) {
      // 権限が不足している場合は承認フラグを1に設定
      data.set('is_approval', '1');
    }

    // ログインしていない場合、is_approval を 1 に設定
    if (!isLoggedIn) {
      isApprovalValue = '1'; // 未ログインの場合は承認ユーザーを1に設定
    }

    console.log({
      user_name: data.get('user_name'),
      kanji_name: data.get('kanji_name'),
      kata_name: data.get('kata_name'),
      password: data.get('password'),
      position: targetUserPosition,
      is_approval: data.get('is_approval'),
      id: props.id
    });
    if (data.get('user_name') === ""){
      alert("ユーザーネームを入力して下さい。")
      return
    }
    if (data.get('kanji_name') === ""){
      alert("名前(漢字)を入力して下さい。")
      return
    }
    if (data.get('kata_name') === ""){
      alert("名前(カタカナ)を入力して下さい。")
      return
    }
    if (data.get('password') === ""){
      alert("パスワードを入力して下さい。")
      return
    }
    if (data.get('position') === ""){
      alert("役職を入力して下さい。")
      return
    }
    if (data.get('is_approval') === ""){
      alert("承認ユーザーを入力して下さい。")
      return
    }
    const user = {
      user_name: data.get('user_name'),
      kanji_name: data.get('kanji_name'),
      kata_name: data.get('kata_name'),
      password: data.get('password'),
      position: targetUserPosition,
      is_approval: data.get('is_approval'),
    };

    axios.put(`${API_URL}/user/${props.id}`, user, {
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
    axios.delete(`${API_URL}/user/${props.id}`, params)
        .then(function (res) {
            console.log(res)
            props.setEditModalIsOpen(false);
        })
        .catch(function (error) {
            console.log("error", error);
        });
  };

  const handlePositionChange = (event) => {
    // 役職の入力値を大文字のA, B, Cに正規化
    let positionValue = event.target.value;

    // 役職が全角や小文字の場合に変換
    positionValue = positionValue
      .replace(/[ａ-ｚＡ-Ｚ]/g, (match) => String.fromCharCode(match.charCodeAt(0) - 0xfee0)) // 全角→半角変換
      .toUpperCase(); // 小文字→大文字変換

    props.setPosition && props.setPosition(positionValue);
  };

  const handleApprovalChange = (event) => {
    let approvalValue = event.target.value;

    // 承認ユーザーの入力が全角の場合、半角に変換
    approvalValue = approvalValue.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (match) => 
      String.fromCharCode(match.charCodeAt(0) - 0xfee0) // 全角→半角変換
    );

    props.setIs_approval && props.setIs_approval(approvalValue);
  };

  const handleShowPasswordChange = (event) => {
    setShowPassword(event.target.checked);
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
                  autoComplete="username"
                  name="user_name"
                  required
                  fullWidth
                  id="user_name"
                  label="ユーザーネーム"
                  autoFocus
                  value={props.user_name || ""}
                  onChange={(event) => props.setUser_name(event.target.value)}
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
                  value={props.kanji_name || ""}
                  onChange={(event) => props.setKanji_name(event.target.value)}
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
                  value={props.kata_name || ""}
                  onChange={(event) => props.setKata_name(event.target.value)}
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
                  autoComplete="new-password"
                  value={props.password || ""}
                  onChange={(event) => props.setPassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showPassword}
                      onChange={handleShowPasswordChange}
                      size="large"
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
                  autoComplete="position"
                  value={props.position || ""}
                  onChange={handlePositionChange} // 変更された役職を処理
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  title="承認ユーザーが2になることですべての機能が使用できます。デフォルトは1です。"
                  id="is_approval"
                  label="承認ユーザー"
                  name="is_approval"
                  autoComplete="is_approval"
                  value={props.is_approval || ""}
                  onChange={handleApprovalChange} // 承認ユーザーが全角入力される場合に変換
                />
              </Grid>
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
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}

