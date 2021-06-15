import React from 'react';

const address = window.localStorage.getItem('sv_address');

//get 전송
export async function getdata(path, data, callback) {
    if (data === "") {
        data = "null";
    }
    const response = await fetch(address + path + data
        , { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*' } });
    const result = await response.json();
    callback(result, data);
};

//post전송
export async function postdata(path, data, callback) {
    fetch(address + path
        , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(result => { callback(result, data.type) });
}