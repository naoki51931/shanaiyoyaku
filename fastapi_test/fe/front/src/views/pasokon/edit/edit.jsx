import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();
const BASE_URL = "http://localhost:8000";

export default function Edit(props) {
  // offices & seats
  const [offices, setOffices] = useState([]);
  const [seats, setSeats] = useState([]);
  const [filteredSeats, setFilteredSeats] = useState([]);

  // tags
  const [availableTags, setAvailableTags] = useState([]); // [{id,name}]
  const [tags, setTags] = useState([]);                   // [{id,name}] added to this pasokon
  const [softName, setSoftName] = useState("");           // typing buffer
  const [selectedTag, setSelectedTag] = useState("");     // dropdown selection (id)

  /* ------------------------------------------------------------------ */
  /*                             Fetch master                           */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    axios.get(`${BASE_URL}/office/all/`).then((res) => setOffices(res.data));
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/seat/all/`).then((res) => setSeats(res.data));
  }, []);

  useEffect(() => {
    axios.get(`${BASE_URL}/tags/`).then((res) => setAvailableTags(res.data));
  }, []);

  /* ------------------------------------------------------------------ */
  /*                         props-driven filters                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (props.office_id) {
      setFilteredSeats(seats.filter((s) => s.office_id === props.office_id));
    } else {
      setFilteredSeats([]);
    }
  }, [props.office_id, seats]);

  /* ------------------------------------------------------------------ */
  /*                    initial tags when editing                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (props.soft_ids && props.soft_names) {
      // combine the two arrays coming from the API
      const initial = props.soft_ids.map((id, idx) => ({
        id,
        name: props.soft_names[idx] ?? "",
      }));
      setTags(initial);
    }
  }, [props.soft_ids, props.soft_names]);

  /* ------------------------------------------------------------------ */
  /*                           Tag Helpers                              */
  /* ------------------------------------------------------------------ */
  const handleSoftNameChange = (e) => setSoftName(e.target.value);

  const handleKeyDown = async (e) => {
    if (e.key !== "Enter" && e.key !== "Tab") return;
    e.preventDefault();

    const name = softName.trim();
    if (!name || tags.some((t) => t.name === name)) return;

    try {
      // create new tag and get ID
      const { data: newTag } = await axios.post(`${BASE_URL}/tags/`, { name });
      setTags((prev) => [...prev, newTag]);   // {id,name}
      setAvailableTags((prev) => [...prev, newTag]);
      setSoftName("");
    } catch (err) {
      console.error("Failed to create tag:", err);
    }
  };

  const handleTagSelect = (e) => {
    const id = e.target.value;
    setSelectedTag(id);

    if (id && !tags.some((t) => t.id === id)) {
      const tagObj = availableTags.find((t) => t.id === id);
      if (tagObj) setTags((prev) => [...prev, tagObj]);
    }
  };

  const handleTagDelete = (tagId) =>
    setTags((prev) => prev.filter((t) => t.id !== tagId));

  /* ------------------------------------------------------------------ */
  /*                             Submit                                 */
  /* ------------------------------------------------------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Auth check
    const token = localStorage.getItem("token");
    if (!token) return alert("ログイン情報がありません。");

    const { is_approval: loginUserIsApproval } = jwtDecode(token);
    if (loginUserIsApproval !== 2) {
      return alert("ユーザー作成には管理者及び上位ユーザーの承認が必要です。");
    }

    const data = new FormData(e.currentTarget);

    const payload = {
      pasokon_name: data.get("pasokon_name"),
      in_active: data.get("in_active"),
      soft_ids: tags.map((t) => t.id),
      soft_names: tags.map((t) => t.name),
      office_id: data.get("office_id"),
      seat_id: data.get("seat_id"),
      performance: data.get("performance"),
    };

    try {
      await axios.put(`${BASE_URL}/pasokon/${props.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      props.setEditModalIsOpen(false);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  /* ------------------------------------------------------------------ */
  /*                            Delete                                  */
  /* ------------------------------------------------------------------ */
  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/pasokon/${props.id}`);
      props.setEditModalIsOpen(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  /* ------------------------------------------------------------------ */
  /*                               UI                                   */
  /* ------------------------------------------------------------------ */
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Edit Pasokon
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {/* パソコン名 */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="pasokon_name"
                  name="pasokon_name"
                  label="パソコン名"
                  autoFocus
                  value={props.pasokon_name ?? ""}
                  onChange={(e) => props.setPasokon_name(e.target.value)}
                />
              </Grid>

              {/* 使用可不可 */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="in-active-select-label">使用可不可</InputLabel>
                  <Select
                    labelId="in-active-select-label"
                    id="in_active"
                    name="in_active"
                    label="使用可不可"
                    value={props.in_active ?? ""}
                    onChange={(e) => props.setIn_active(e.target.value)}
                  >
                    <MenuItem value="">選択してください</MenuItem>
                    <MenuItem value={0}>不可</MenuItem>
                    <MenuItem value={1}>予約中</MenuItem>
                    <MenuItem value={2}>使用可</MenuItem>
                    <MenuItem value={3}>破損</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 導入ソフト入力 */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="soft_name"
                  name="soft_name"
                  label="導入ソフト (Enter/Tab で追加)"
                  value={softName}
                  onChange={handleSoftNameChange}
                  onKeyDown={handleKeyDown}
                />
                {/* 選択済みタグ */}
                <Box sx={{ mt: 2 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      onDelete={() => handleTagDelete(tag.id)}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Grid>

              {/* 既存タグ選択 */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="tag-select-label">タグ選択</InputLabel>
                  <Select
                    labelId="tag-select-label"
                    value={selectedTag}
                    label="タグ選択"
                    onChange={handleTagSelect}
                  >
                    <MenuItem value="">タグを選択</MenuItem>
                    {availableTags.map((tag) => (
                      <MenuItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* 事務所 */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="office-select-label">事務所</InputLabel>
                  <Select
                    labelId="office-select-label"
                    id="office_id"
                    name="office_id"
                    label="事務所"
                    value={props.office_id ?? ""}
                    onChange={(e) => props.setOffice_id(Number(e.target.value))}
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

              {/* 座席 */}
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="seat-select-label">座席</InputLabel>
                  <Select
                    labelId="seat-select-label"
                    id="seat_id"
                    name="seat_id"
                    label="座席"
                    value={props.seat_id ?? ""}
                    onChange={(e) => props.setSeat_id(Number(e.target.value))}
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="performance"
                  name="performance"
                  label="性能"
                  autoFocus
                  value={props.performance ?? ""}
                  onChange={(e) => props.setPerformance(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* 更新 / 削除ボタン */}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Update
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{ mb: 2 }}
              onClick={handleDelete}
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
