import React from 'react';
import { TextField, Button } from '@mui/material';

function NewReservationForm({ closeModal }) {
    return (
        <div>
            <h2>新規予約作成</h2>
            <form>
                <TextField label="予約ID" fullWidth margin="normal" />
                <TextField label="概要" fullWidth margin="normal" />
                <TextField label="予約者ID" fullWidth margin="normal" />
                <TextField label="座席ID" fullWidth margin="normal" />
                <TextField label="開始時間" type="datetime-local" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                <TextField label="終了時間" type="datetime-local" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                <TextField label="予約日" type="datetime-local" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />

                <Button variant="contained" onClick={() => closeModal()} sx={{ mt: 2 }}>
                    予約作成
                </Button>
            </form>
        </div>
    );
}

export default NewReservationForm;
