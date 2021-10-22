import React, {useState, useRef} from "react"
import 'antd/dist/antd.css'
import '../style.css'
import rough from 'roughjs/bundled/rough.esm.js';//https://roughjs.com/
import xml2js from 'react-native-xml2js/lib/parser';
import {
    Button,
    message,
    Card,
    Image,
    Upload,
    Switch,
    Grid,
    Col,
    Row,
} from 'antd';

message.config({
    top: 150
});


const ICDAR2019 = () => {

    const colors = [
        "rgba(58, 161, 255, 0.5)",
        "rgba(136, 209, 234, 0.5)",
        "rgba(54, 203, 203, 0.5)",
        "rgba(130, 223, 190, 0.5)",
        "rgba(78, 203, 115, 0.5)",
        "rgba(172, 223, 130, 0.5)",
        "rgba(251, 212, 55, 0.5)",
        "rgba(234, 166, 116, 0.5)",
        "rgba(242, 99, 123, 0.5)",
        "rgba(220, 129, 210, 0.5)",
        "rgba(151, 95, 229, 0.5)",
        "rgba(159, 139, 240, 0.5)",
        "rgba(82, 84, 207, 0.5)",
        "rgba(136, 145, 236, 0.5)",
        "rgba(67, 81, 136, 0.5)",
        "rgba(145, 176, 234, 0.5)",
    ];

    return (
        <>

        </>
    );
};

export default ICDAR2019
