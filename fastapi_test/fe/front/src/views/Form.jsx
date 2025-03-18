import React, { useState, useEffect } from "react"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios';
import NewForm from "./new/new";

export default function Form(props) {
    const [kanji_name, setKanji_name] = useState('');

    const funSetKanji_name = (e) => {
        setKanji_name(() => e.target.value);
    }

    const funPost = () => {
        // const params = new URLSearchParams();
        const params = {'kanji_name': kanji_name};
        console.log(params);
        axios.post('http://localhost:8000/user/', params)
            .then(function (res) {
                console.log(res)
                console.log("aaa")
                console.log(res.data.message)
                if(res.data.length > 1){
                    console.log("bbb");
                    console.log(res.data.length)
                    let tmpUsers = []
                    for (let i = 0; i < res.data.length; i++) {
                        tmpUsers = tmpUsers.concat([
                            {
                                id: res.data[i].id,
                                kanji_name: res.data[i].kanji_name,
                                kata_name: res.data[i].kata_name,
                                position: res.data[i].position,
                                is_superuser: res.data[i].is_superuser,
                                is_approval: res.data[i].is_approval,
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
                } else if(res.data.length == 1 || res.data.length != 0){
                    console.log("2bbb");
                    console.log(res.data.length)
                    let tmpUsers = []
                    tmpUsers = tmpUsers.concat([
                        {
                            id: res.data.id,
                            kanji_name: res.data.kanji_name,
                            kata_name: res.data.kata_name,
                            position: res.data.position,
                            is_superuser: res.data.is_superuser,
                            is_approval: res.data.is_approval,
                            created_at: res.data.created_at,
                            updated_at: res.data.updated_at,
                        }
                    ])
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

    const funget = () => {
        axios.get('http://localhost:8000/user/all/')
            .then(function (res) {
                console.log(res.data.length)
                console.log(res)
                if(res.data.length > 1){
                    let tmpUsers = []
                    for (let i = 0; i < res.data.length; i++) {
                        tmpUsers = tmpUsers.concat([
                            {
                                id: res.data[i].id,
                                kanji_name: res.data[i].kanji_name,
                                kata_name: res.data[i].kata_name,
                                position: res.data[i].position,
                                is_superuser: res.data[i].is_superuser,
                                is_approval: res.data[i].is_approval,
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
                } else if(res.data.length == 1 || res.data.length != 0){
                    let tmpUsers = []
                    tmpUsers = tmpUsers.concat([
                        {
                            id: res.data.id,
                            kanji_name: res.data.kanji_name,
                            kata_name: res.data.kata_name,
                            position: res.data.position,
                            is_superuser: res.data.is_superuser,
                            is_approval: res.data.is_approval,
                            created_at: res.data.created_at,
                            updated_at: res.data.updated_at,
                        }
                    ])
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
            <form>
                <Grid item>
                    <TextField
                        label="名前(kanji)"
                        value={kanji_name}
                        onChange={funSetKanji_name}
                    />
                </Grid>                
                <Grid item>
                    <Button variant="contained" onClick={funPost}>検索</Button>
                </Grid>
            </form>
        </Grid>
    )
}