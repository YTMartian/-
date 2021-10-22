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
    Tag,
    Tooltip
} from 'antd';

import {
    QuestionCircleTwoTone,
} from '@ant-design/icons';

message.config({
    top: 150
});


const CTW1500 = () => {

    const [trainImageSrc, setTrainImageSrc] = useState('');
    const [trainLabelSrc, setTrainLabelSrc] = useState('');
    const [trainImageSize, setTrainImageSize] = useState({'width': -1, 'height': -1});
    const [trainChecked, setTrainChecked] = useState({'box': true, 'segs': true, 'pts': true});
    const [testImageSrc, setTestImageSrc] = useState('');
    const [testLabelSrc, setTestLabelSrc] = useState('');
    const [testImageSize, setTestImageSize] = useState({'width': -1, 'height': -1});
    const [testChecked, setTestChecked] = useState({'segs': true});

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
        }
    }

    function choseTrainLabel({fileList: newFileList}) {
        if (newFileList.length === 0) {
            setTrainLabelSrc('');
            const svg = document.getElementById('trainSvg');
            while (svg.lastChild) svg.removeChild(svg.lastChild);
        }
    }

    function choseTestImage({fileList: newFileList}) {
        if (newFileList.length === 0) {
            setTestImageSrc('');
            const svg = document.getElementById('testSvg');
            while (svg.lastChild) svg.removeChild(svg.lastChild);
        }
    }

    function choseTestLabel({fileList: newFileList}) {
        if (newFileList.length === 0) {
            setTestLabelSrc('');
            const svg = document.getElementById('testSvg');
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

    function testSegsChange(checked) {
        testChecked.segs = checked;
        setTestChecked(testChecked);
    }

    return (
        <>
            <Card title={<>训练集<Tooltip title="先选择图片再选择label"><QuestionCircleTwoTone /></Tooltip></>}>
                <Row gutter={16} align={"middle"}>
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
                                        setTrainImageSize({'width': width, 'height': height});
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
                    <Col>
                        <Upload
                            beforeUpload={file => {
                                const reader = new FileReader();
                                reader.readAsText(file);
                                reader.addEventListener('load', event => {
                                    const xml = event.target.result;
                                    setTrainLabelSrc('--');
                                    xml2js.parseString(xml, function (err, result) {
                                        const boxes = result.Annotataions.image[0].box;
                                        const imgWidth = document.getElementById("trainImg").offsetWidth;
                                        const ratio = imgWidth / trainImageSize.width;//图片缩放比率
                                        const svg = document.getElementById('trainSvg');
                                        while (svg.lastChild) svg.removeChild(svg.lastChild);
                                        const roughSvg = rough.svg(svg);
                                        for (let i = 0; i < boxes.length; i++) {
                                            let color = colors[Math.floor(Math.random() * colors.length)];
                                            //绘制box
                                            if (boxes[i].$ !== undefined && trainChecked.box) {
                                                svg.appendChild(roughSvg.rectangle(boxes[i].$.left * ratio, boxes[i].$.top * ratio, boxes[i].$.width * ratio, boxes[i].$.height * ratio, {
                                                    fill: color,
                                                    fillStyle: 'solid',
                                                    stroke: color,
                                                    roughness: 0
                                                }));
                                            }
                                            //绘制中心线
                                            color = color.replace('0.5', '0.8');//透明度调低一点
                                            const pts = boxes[i].pts;
                                            if (pts !== undefined && trainChecked.pts) {
                                                for (let j = 0; j < pts.length - 1; j++) {
                                                    svg.appendChild(roughSvg.line(pts[j].$.x * ratio, pts[j].$.y * ratio, pts[j + 1].$.x * ratio, pts[j + 1].$.y * ratio, {
                                                        stroke: color,
                                                        roughness: 0,
                                                        strokeWidth: 5
                                                    }));
                                                }
                                            }
                                            //绘制分割
                                            const segs = boxes[i].segs[0].split(',');
                                            const polygon = [];
                                            if (segs !== undefined && trainChecked.segs) {
                                                for (let j = 0; j < segs.length; j += 2) {
                                                    let x1 = parseInt(segs[j]);
                                                    let y1 = parseInt(segs[j + 1]);
                                                    polygon.push([x1 * ratio, y1 * ratio]);
                                                }
                                                svg.appendChild(roughSvg.polygon(polygon, {
                                                    fill: color,
                                                    roughness: 0,
                                                    stroke: color,
                                                    strokeWidth: 2
                                                }));
                                            }
                                        }
                                    });
                                });
                                return false;
                            }}
                            onChange={choseTrainLabel}
                            listType="picture-card"
                            accept="application/xml"
                        >
                            {trainLabelSrc === '' && '选择label(xml)'}
                        </Upload>
                    </Col>
                    <Col>
                        <Switch checkedChildren="box" unCheckedChildren="box" defaultChecked
                                onChange={(checked) => trainBoxChange(checked)}/>
                    </Col>
                    <Col>
                        <Switch checkedChildren="segs" unCheckedChildren="segs" defaultChecked
                                onChange={(checked) => trainSegsChange(checked)}/>
                    </Col>
                    <Col>
                        <Switch checkedChildren="pts" unCheckedChildren="pts" defaultChecked
                                onChange={(checked) => trainPtsChange(checked)}/>
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
            <Card title={<>训练集<Tooltip title="先选择图片再选择label"><QuestionCircleTwoTone /></Tooltip></>}>
                <Row gutter={16} align={"middle"}>
                    <Col>
                        <Upload
                            beforeUpload={file => {
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.addEventListener('load', event => {
                                    const _loadedImageUrl = event.target.result;
                                    const image = document.createElement('img');
                                    image.src = _loadedImageUrl;
                                    setTestImageSrc(_loadedImageUrl);
                                    image.addEventListener('load', () => {
                                        const {width, height} = image;
                                        setTestImageSize({'width': width, 'height': height});
                                    });
                                });
                                return false;
                            }}
                            onChange={choseTestImage}
                            listType="picture-card"
                            accept="image/*"
                        >
                            {testImageSrc === '' && '选择图片'}
                        </Upload>
                    </Col>
                    <Col>
                        <Upload
                            beforeUpload={file => {
                                const reader = new FileReader();
                                reader.readAsText(file);
                                reader.addEventListener('load', event => {
                                    const txt = event.target.result.split('\n');
                                    setTestLabelSrc('--');
                                    const imgWidth = document.getElementById("testImg").offsetWidth;
                                    const ratio = imgWidth / testImageSize.width;//图片缩放比率
                                    const svg = document.getElementById('testSvg');
                                    while (svg.lastChild) svg.removeChild(svg.lastChild);
                                    const roughSvg = rough.svg(svg);
                                    for (let i = 0; i < txt.length; i++) {
                                        let color = colors[Math.floor(Math.random() * colors.length)];
                                        color = color.replace('0.5', '0.8');//透明度调低一点
                                        const segs = txt[i].split('####')[0].split(',');
                                        const polygon = [];
                                        if (segs !== undefined && segs.length > 1 && testChecked.segs) {
                                            for (let j = 0; j < segs.length - 1; j += 2) {//最后一个为空
                                                let x = parseInt(segs[j]);
                                                let y = parseInt(segs[j + 1]);
                                                polygon.push([x * ratio, y * ratio]);
                                            }
                                            svg.appendChild(roughSvg.polygon(polygon, {
                                                fill: color,
                                                stroke: color,
                                                roughness: 0,
                                                strokeWidth: 2
                                            }));
                                        }
                                    }
                                });
                                return false;
                            }}
                            onChange={choseTestLabel}
                            listType="picture-card"
                            accept="text/plain"
                        >
                            {testLabelSrc === '' && '选择label(txt)'}
                        </Upload>
                    </Col>
                    <Col>
                        <Switch checkedChildren="segs" unCheckedChildren="segs" defaultChecked
                                onChange={(checked) => testSegsChange(checked)}/>
                    </Col>
                </Row>
                <Card style={{position: "relative"}}>
                    <svg
                        id='testSvg'
                        style={{zIndex: 10, position: "absolute", height: "100%", width: "100%"}}
                    />
                    <Image
                        className="can-not-select"
                        id="testImg"
                        width="100%"
                        preview={false}
                        src={testImageSrc}
                        style={{pointerEvents: "none"}}
                    >
                    </Image>
                </Card>
            </Card>
        </>
    );
};

export default CTW1500
