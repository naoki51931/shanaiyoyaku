import React, { useState, useEffect } from "react"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios';
import NewForm from "./new/new";

const API_URL = "/api";

export default function Form(props) {
    const [pasokonName, setPasokonName] = useState('');
    const [tagName, setTagName] = useState('');
    const [officeName, setOfficeName] = useState('');
    const [performance, setPerformance] = useState('');

    const searchPasokons = () => {
        const payload = {};

        if (pasokonName.trim()) {
            payload.pasokon_name = pasokonName.trim();
        }
        if (tagName.trim()) {
            payload.tag_name = tagName.trim();
        }
        if (officeName.trim()) {
            payload.office_name = officeName.trim();
        }
        if (performance.trim()) {
            payload.performance = performance.trim();
        }

        // 何も入ってなければ API に投げない
        if (Object.keys(payload).length === 0) {
            alert("検索条件を1つ以上入力してください");
            return;
        }

        axios.post(`${API_URL}/pasokon/search/`, payload)
            .then((res) => {
                console.log("検索結果:", res.data);

                if (res.data.length > 0) {
                    props.setDisplay(res.data);
                    props.setFlag(true);
                } else {
                    props.setFlag(false);
                }
            })
            .catch((error) => {
                console.error("検索エラー", error);
                props.setFlag(false);
            });
    };

    const funget = () => {
        axios.get(`${API_URL}/pasokon/all/`)
            .then(function (res) {
                if (res.data.length > 0) {
                    let tmpUsers = []
                    for (let i = 0; i < res.data.length; i++) {
                        tmpUsers = tmpUsers.concat([{
                            id: res.data[i].id,
                            pasokon_id: res.data[i].pasokon_id,
                            pasokon_name: res.data[i].pasokon_name,
                            in_active: res.data[i].in_active,
                            soft_ids: res.data[i].soft_ids,
                            soft_names: res.data[i].soft_names,
                            office_id: res.data[i].office_id,
                            office_name: res.data[i].office_name,
                            seat_id: res.data[i].seat_id,
                            seat_name: res.data[i].seat_name,
                            performance: res.data[i].performance,
                            created_at: res.data[i].created_at,
                            updated_at: res.data[i].updated_at,
                        }])
                    }
                    props.setDisplay(tmpUsers);
                    props.setFlag(true);
                } else {
                    props.setFlag(false);
                }
            })
            .catch(function (error) {
                console.log("error", error);
            });
    }

    useEffect(() => {
        funget()
    }, [])

    return (
        <Grid container rowSpacing={1} position={'static'} marginTop={"15px"} marginLeft={"5px"}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    searchPasokons();
                }}
            >
                <Grid item sx={{ mb: 1 }}>
                    <TextField
                        label="パソコン名で検索"
                        value={pasokonName}
                        onChange={(e) => setPasokonName(e.target.value)}
                        size="small"
                        sx={{ mr: 1, minWidth: 220 }}
                    />
                    <TextField
                        label="タグ名で検索（エクセル等）"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        size="small"
                        sx={{ mr: 1, minWidth: 220 }}
                    />
                    <TextField
                        label="事業所名で検索"
                        value={officeName}
                        onChange={(e) => setOfficeName(e.target.value)}
                        size="small"
                        sx={{ mr: 1, minWidth: 220 }}
                    />
                    <TextField
                        label="性能で検索（CPU/メモリ等）"
                        value={performance}
                        onChange={(e) => setPerformance(e.target.value)}
                        size="small"
                        sx={{ mr: 1, minWidth: 220 }}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ mr: 1 }}
                    >
                        検索
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={funget}
                    >
                        全件表示
                    </Button>
                </Grid>
            </form>
        </Grid>
    )
}
