import { Input } from '@material-ui/core';
import React, { useState } from 'react';


const Filter = ({ setFilter, placeholder }) => {
    const [value, setValue] = useState('');
    const onChange = e => {
        setValue(e.target.value);
        setFilter(e.target.value)
    }
    return (
        <Input onChange={onChange} placeholder={placeholder} value={value} style={{ width: '100%' }} />
    );
}

export default Filter;