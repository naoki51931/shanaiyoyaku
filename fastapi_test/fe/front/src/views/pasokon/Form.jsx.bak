import React, { useState, useEffect } from "react"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios';
import NewForm from "./new/new";

const API_URL = process.env.REACT_APP_API_BASE_URL;

export default function Form(props) {
    const [query, setQuery] = useState('');

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const searchPasokons = () => {
        axios.post(`${API_URL}/pasokon/search/`, { query })
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
                console.log(res.data.length)
                console.log(res)
                if(res.data.length > 0){
                    let tmpUsers = []
                    for (let i = 0; i < res.data.length; i++) {
                        tmpUsers = tmpUsers.concat([
                            {
                                id: res.data[i].id,
                                pasokon_name: res.data[i].pasokon_name,
                                in_active: res.data[i].in_active,
                                soft_ids:   res.data[i].soft_ids,
                                soft_names: res.data[i].soft_names,
                                office_id: res.data[i].office_id,
                                office_name: res.data[i].office_name,
                                seat_id: res.data[i].seat_id,
                                seat_name: res.data[i].seat_name,
                                performance: res.data[i].performance,
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
            <form onSubmit={(e) => { e.preventDefault(); searchPasokons(); }}>
                <Grid item>
                    <TextField
                        label="パソコン名を入力"
                        value={query}
                        onChange={handleQueryChange}
                    />
                </Grid>                
                <Grid item>
                    <Button variant="contained" onClick={searchPasokons}>検索</Button>
                </Grid>
            </form>
        </Grid>
    )
}