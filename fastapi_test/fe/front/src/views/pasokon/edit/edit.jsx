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
import { Select, MenuItem, InputLabel, FormControl, Chip } from '@mui/material';

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
const BASE_URL = "http://localhost:8000";

export default function SignUp(props) {
  const [offices, setOffices] = useState([]);
  const [seats, setSeats] = useState([]);
  const [filteredSeats, setFilteredSeats] = useState([]);
  const [tags, setTags] = useState([]); // ソフト名（タグ）を管理
  const [softName, setSoftName] = useState(''); // ソフト名入力フィールドの管理
  const [availableTags, setAvailableTags] = useState([]); // 既存のタグを管理
  const [softId, setSoftId] = useState(null); // ソフトIDを管理
  const [selectedTag, setSelectedTag] = useState(''); // 追加されたタグを選択する状態

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
    axios.get(`${BASE_URL}/seat/all/`)
      .then((res) => {
        setSeats(res.data);
      })
      .catch((error) => {
        console.error("シート情報の取得に失敗:", error);
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

  useEffect(() => {
    axios.get(`${BASE_URL}/tags/`)  // 既存タグを取得
      .then((res) => {
        setAvailableTags(res.data);
      })
      .catch((error) => {
        console.error('タグ情報の取得に失敗:', error);
      });
  }, []);

  useEffect(() => {
    // 編集時に初期タグをセット
    if (props.soft_id) {
      const initialTags = props.soft_id.split(','); // カンマ区切りでタグをセット
      setTags(initialTags);
    }
  }, [props.soft_id]);

  // ソフト名の変更時にIDを取得する処理
  const handleSoftNameChange = (event) => {
    const value = event.target.value;
    setSoftName(value);

    // ソフト名が変更されるたびにIDを取得する
    if (value) {
      axios.get(`${BASE_URL}/tags/search?name=${value}`)
        .then((res) => {
          if (res.data && res.data.id) {
            setSoftId(res.data.id); // ソフト名に対応するIDを取得して設定
          } else {
            setSoftId(null); // 一致しない場合はIDをnullに設定
          }
        })
        .catch((error) => {
          console.error('ソフト名検索エラー:', error);
        });
    }
  };

  // エンターキーまたはタブキーでタグを追加
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === 'Tab') {
      event.preventDefault(); // フォーカスが移動しないようにする
      if (softName && !tags.includes(softName)) {
        setTags([...tags, softName]);
        setSoftName(''); // ソフト名入力フィールドをリセット
        // 新しいタグがあれば、バックエンドに追加する
        axios.post('http://localhost:8000/tags/', { name: softName })
          .then(() => {
            // タグが追加された後、新しいタグリストを再取得
            axios.get('http://localhost:8000/tags/')
              .then((res) => setAvailableTags(res.data));
          })
          .catch((error) => {
            console.error('タグの追加に失敗:', error);
          });
      }
    }
  };

  // タグの選択
  const handleTagSelect = (event) => {
    const selected = event.target.value;
    if (selected && !tags.includes(selected)) {
      setTags([...tags, selected]); // 新しいタグを追加
    }
  };

  const handleTagDelete = (index) => {
    const newTags = tags.filter((_, tagIndex) => tagIndex !== index);
    setTags(newTags);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const token = localStorage.getItem('token');
    if (typeof token !== 'string') {
      console.error("Invalid token:", token);
    }
    const decodedToken = jwtDecode(token);
    const loginUserIsApproval = decodedToken?.is_approval;

    const Approval_level = 2;
    if (loginUserIsApproval !== Approval_level) {
      alert("ユーザー作成には管理者及び上位ユーザーの承認が必要です。");
      return;
    }

    
    // soft_names を tags から作成（タグIDではなく、タグ名を使用）
    const softNamesList = tags.map(tagId => {
      const tag = availableTags.find(t => t.id === tagId);
      return tag ? tag.name : null;
    }).filter(name => name !== null);  // nullのタグ名を除外

    // softIdList を単なる整数のリストとして格納
    const softIdList = tags;  // 既にタグIDのリストとして格納されているのでそのまま使用


    const pasokon = {
      pasokon_name: data.get('pasokon_name'),
      in_active: data.get('in_active'),
      soft_ids: softIdList, // タグIDのリストを送信
      soft_names: softNamesList, // タグ名のリストを送信
      office_id: data.get('office_id'),
      seat_id: data.get('seat_id'),
    };

    axios.put(`${BASE_URL}/pasokon/${props.id}`, pasokon, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function (res) {
        console.log(res);
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
    axios.delete(`${BASE_URL}/pasokon/${props.id}`, params)
      .then(function (res) {
        console.log(res);
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
                  autoComplete="pasokon_name"
                  name="pasokon_name"
                  required
                  fullWidth
                  id="pasokon_name"
                  label="パソコン名"
                  autoFocus
                  value={props.pasokon_name || ""}
                  onChange={(event) => props.setPasokon_name(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="in-active-select-label">使用可不可</InputLabel>
                  <Select
                    labelId="in-active-select-label"
                    id="in_active"
                    name="in_active"
                    value={props.in_active ?? ""}
                    label="使用可不可"
                    onChange={(event) => props.setIn_active(event.target.value)}
                  >
                    <MenuItem value="">選択してください</MenuItem>
                    <MenuItem value={0}>不可</MenuItem>
                    <MenuItem value={1}>予約中</MenuItem>
                    <MenuItem value={2}>使用可</MenuItem>
                    <MenuItem value={3}>破損</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="soft_name"
                  name="soft_name"
                  required
                  fullWidth
                  id="soft_name"
                  label="導入ソフト"
                  value={softName}
                  onChange={handleSoftNameChange} // ソフト名変更時にIDを取得
                  onKeyDown={handleKeyDown} // エンターまたはタブキーでタグ追加
                />
                <Box sx={{ mt: 2 }}>
                  {/* タグ表示 */}
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleTagDelete(index)}
                      sx={{ margin: 0.5 }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>タグ選択</InputLabel>
                  <Select
                    value={selectedTag}
                    onChange={handleTagSelect}  // 既存タグを選択
                  >
                    <MenuItem value="">タグを選択</MenuItem>
                    {availableTags.map((tag) => (
                      <MenuItem key={tag.id} value={tag.name}>
                        {tag.name}
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
                    value={props.office_id || ""}
                    label="事務所"
                    onChange={(event) => props.setOffice_id(event.target.value)}
                  >
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
              onClick={() => { DeleteUser() }}
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
