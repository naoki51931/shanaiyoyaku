import React, { useState, useEffect } from "react"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios';
import NewForm from "./new/new";

const API_URL = process.env.REACT_APP_API_BASE_URL;

export default function Form(props) {
    const [searchResult, setSearchResult] = useState([]);
    const [displayFlag, setDisplayFlag] = useState(false);
    const [reserveId, setReserveId] = useState('');
    const [personName, setPersonName] = useState('');
    const [todoContent, setTodoContent] = useState('');

    const handleSearch = () => {
        const queryParams = {
            reserve_id: reserveId,
            person_name: personName,
            todo_content: todoContent
        };

        axios.post(`${API_URL}/seat_reservation/search/`, queryParams)
            .then((res) => {
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
        axios.get(`${API_URL}/seat_reservation/all/`)
            .then(function (res) {
                console.log(res.data.length)
                console.log(res)
                if(res.data.length > 0){
                    let tmpUsers = []
                    for (let i = 0; i < res.data.length; i++) {
                        tmpUsers = tmpUsers.concat([
                            {
                                id: res.data[i].id,
                                reserve_id: res.data[i].reserve_id,
                                todo_content: res.data[i].todo_content,
                                person_id: res.data[i].person_id,
                                person_name: res.data[i].person_name,
                                office_id: res.data[i].office_id,
                                office_name: res.data[i].office_name,
                                seat_id: res.data[i].seat_id,
                                seat_name: res.data[i].seat_name,
                                pasokon_id: res.data[i].pasokon_id,
                                pasokon_name: res.data[i].pasokon_name,
                                start_time: res.data[i].start_time,
                                finish_time: res.data[i].finish_time,
                                reserve_day: res.data[i].reserve_day,
                                created_at: res.data[i].created_at,
                                updated_at: res.data[i].updated_at,
                            }
                        ])
                    }
                        // props.setDisplay({
                        //     ...props.display,
                        //     id: v.id,
                        //     name: v.name,
                        //     password: v.password,
                        //     mailAdress: v.mailAdress,
                        // });
                    console.log(tmpUsers);
                    props.setDisplay(tmpUsers);
                    props.setFlag(true);
                }
                else{
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
        <Grid container spacing={2} marginTop={2} marginLeft={1}>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="予約ID"
                    fullWidth
                    value={reserveId}
                    onChange={(e) => setReserveId(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="予約ユーザー名"
                    fullWidth
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    label="概要"
                    fullWidth
                    value={todoContent}
                    onChange={(e) => setTodoContent(e.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
                    検索
                </Button>
            </Grid>
        </Grid>
    );
}