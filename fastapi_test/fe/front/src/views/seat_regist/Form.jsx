import React, { useState, useEffect } from "react"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios';
import NewForm from "./new/new";

const API_URL = "/api";

export default function Form(props) {
    const [seatName, setSeatName] = useState('');
    const [officeName, setOfficeName] = useState('');

    const handleSeatNameChange = (e) => {
        setSeatName(e.target.value);
    };

    const handleOfficeNameChange = (e) => {
        setOfficeName(e.target.value);
    };

    const searchSeats = () => {
        const payload = {};
        if (seatName.trim()) {
            payload.seat_name = seatName.trim();
        }
        if (officeName.trim()) {
            payload.office_name = officeName.trim();
        }

        if (Object.keys(payload).length === 0) {
            alert("座席名か事務所名のいずれかを入力してください");
            return;
        }

        axios.post(`${API_URL}/seat/search/`, payload)
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
        axios.get(`${API_URL}/seat/all/`)
            .then(function (res) {
                console.log(res.data.length)
                console.log(res)
                if(res.data.length > 0){
                    let tmpUsers = []
                    for (let i = 0; i < res.data.length; i++) {
                        tmpUsers = tmpUsers.concat([
                            {
                                id: res.data[i].id,
                                seat_name: res.data[i].seat_name,
                                office_name: res.data[i].office_name,
                                office_id: res.data[i].office_id,
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
        <Grid container rowSpacing={1} position={'static'} marginTop={"15px"} marginLeft={"5px"}> 
            <form onSubmit={(e) => { e.preventDefault(); searchSeats(); }}>
                <Grid item sx={{ mb: 1 }}>
                    <TextField
                        label="座席名で検索"
                        value={seatName}
                        onChange={handleSeatNameChange}
                        size="small"
                        sx={{ mr: 1, minWidth: 220 }}
                    />
                    <TextField
                        label="事務所名で検索"
                        value={officeName}
                        onChange={handleOfficeNameChange}
                        size="small"
                        sx={{ mr: 1, minWidth: 220 }}
                    />
                </Grid>                
                <Grid item>
                    <Button variant="contained" onClick={searchSeats}>検索</Button>
                </Grid>
            </form>
        </Grid>
    )
}
