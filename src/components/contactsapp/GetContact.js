import React from 'react';
import './main.css';
import OneContact from './OneContact';

const GetContact = ({ match : {params: {id} } }) => {
    const numbID = Number(id);
    return(
        <div className='main'>
            <OneContact id={numbID} />
        </div>
    )
}

export default GetContact;