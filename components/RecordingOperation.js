import React, { useState } from 'react'

import { Typography, Box } from '@mui/material';
//-----------radio button-------------
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function RecordingOperation({ name, output }) {

    const [value, setValue] = React.useState('');
    console.log(value)
    return (
        <FormControl sx={{ borderBottom: '1px solid #606c38', background: 'white', paddingX: 1, width: '100%' }}>
            <FormLabel id="demo-controlled-radio-buttons-group" sx={{ fontSize: '0.8rem', margin: 1, color: "#003049" }}>{name}</FormLabel>
            <RadioGroup row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}

                onChange={(e) => {
                    setValue(event.target.value)
                    output(name, event.target.value)
                }}
            >


                <FormControlLabel value="New" control={<Radio />} label={<Typography sx={{ fontSize: '0.7rem', }}>New</Typography>} />

                <FormControlLabel value="Working" control={<Radio />} label={<Typography sx={{ fontSize: '0.7rem', }}>Working</Typography>} />

                <FormControlLabel value="Done" control={<Radio />} label={<Typography sx={{ fontSize: '0.7rem', }}>Done</Typography>} />

                <FormControlLabel value="N/a" control={<Radio />} label={<Typography sx={{ fontSize: '0.7rem', }}>N/a</Typography>} />

            </RadioGroup>
        </FormControl>
    )
}

export default RecordingOperation