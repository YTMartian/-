import React, {useRef, useState} from "react"
import 'antd/dist/antd.css'
import '../style.css'
import rough from 'roughjs/bundled/rough.esm.js'; //https://roughjs.com/
import {Card, Col, Image, message, Row, Tooltip, Upload,} from 'antd';
import {QuestionCircleTwoTone} from "@ant-design/icons";

message.config({
    top: 150
});


const ICDAR2015 = () => {

    const [trainImageSrc, setTrainImageSrc] = useState('');
    const [trainLabelSrc, setTrainLabelSrc] = useState('');
    const [trainChecked, setTrainChecked] = useState({'box': true, 'segs': true, 'pts': true});

    const cardRef = useRef();

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

    function choseTrainImage({fileList: newFileList}) {
        if (newFileList.length === 0) {
            setTrainImageSrc('');
            const svg = document.getElementById('trainSvg');
            while (svg.lastChild) svg.removeChild(svg.lastChild);
        } else {
            if (trainLabelSrc === '') {
                message.warn('请先选择label再选择图片');
            }
        }
    }

    function choseTrainLabel({fileList: newFileList}) {
        if (newFileList.length === 0) {
            setTrainLabelSrc('');
            const svg = document.getElementById('trainSvg');
            while (svg.lastChild) svg.removeChild(svg.lastChild);
        }
    }

    function trainBoxChange(checked) {
        trainChecked.box = checked;
        setTrainChecked(trainChecked);
    }

    function trainSegsChange(checked) {
        trainChecked.segs = checked;
        setTrainChecked(trainChecked);
    }

    function trainPtsChange(checked) {
        trainChecked.pts = checked;
        setTrainChecked(trainChecked);
    }

    return (
        <>
            <Card title={<>训练/测试集<Tooltip title="先选择label再选择图片"><QuestionCircleTwoTone/></Tooltip></>}>
                <Row gutter={16} align={"middle"}>
                    <Col>
                        <Upload
                            beforeUpload={file => {
                                const reader = new FileReader();
                                reader.readAsText(file);
                                reader.addEventListener('load', event => {
                                    const txt = event.target.result.split('\n');
                                    const json = {};
                                    for (let i = 0; i < txt.length; i++) {
                                        if (txt[i].length === 0) continue;
                                        const s = txt[i].split('.jpg');
                                        const img_name = s[0].split('/')[1];
                                        json[img_name] = JSON.parse(s[1]);
                                    }
                                    setTrainLabelSrc(json);
                                });
                                return false;
                            }}
                            onChange={choseTrainLabel}
                            listType="picture-card"
                            accept="text/plain"
                        >
                            {trainLabelSrc === '' && '选择label(txt)'}
                        </Upload>
                    </Col>
                    <Col>
                        <Upload
                            beforeUpload={file => {
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.addEventListener('load', event => {
                                    const _loadedImageUrl = event.target.result;
                                    const image = document.createElement('img');
                                    image.src = _loadedImageUrl;
                                    setTrainImageSrc(_loadedImageUrl);
                                    image.addEventListener('load', () => {
                                        const {width, height} = image;
                                        const imgWidth = document.getElementById("trainImg").offsetWidth;
                                        const ratio = imgWidth / width;//图片缩放比率
                                        const segs = trainLabelSrc[file.name.split('.')[0]];
                                        if (segs === undefined) return false;
                                        const svg = document.getElementById('trainSvg');
                                        while (svg.lastChild) svg.removeChild(svg.lastChild);
                                        const roughSvg = rough.svg(svg);
                                        for (let i = 0; i < segs.length; i++) {
                                            let color = colors[Math.floor(Math.random() * colors.length)];
                                            color = color.replace('0.5', '0.8');//透明度调低一点
                                            const polygon = [];
                                            for (let j = 0; j < segs[i].points.length; j++) {
                                                polygon.push([segs[i].points[j][0] * ratio, segs[i].points[j][1] * ratio]);
                                            }
                                            svg.appendChild(roughSvg.polygon(polygon, {
                                                fill: color,
                                                roughness: 0,
                                                stroke: color,
                                                strokeWidth: 2
                                            }));
                                        }
                                    });
                                });
                                return false;
                            }}
                            onChange={choseTrainImage}
                            listType="picture-card"
                            accept="image/*"
                        >
                            {trainImageSrc === '' && '选择图片'}
                        </Upload>
                    </Col>
                </Row>
                <Card style={{position: "relative"}}>
                    <svg
                        id='trainSvg'
                        style={{zIndex: 10, position: "absolute", height: "100%", width: "100%"}}
                    />
                    <Image
                        className="can-not-select"
                        id="trainImg"
                        width="100%"
                        preview={false}
                        src={trainImageSrc}
                        style={{pointerEvents: "none"}}
                    >
                    </Image>
                </Card>
            </Card>
        </>
    );
};

export default ICDAR2015
