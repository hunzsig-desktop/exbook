import {useEffect, useState} from 'react';
import {Button, Input, Notification, Space, Tooltip} from '@arco-design/web-react';
import {
    IconCloudDownload,
    IconMoon,
    IconSearch,
    IconSun,
    IconThumbUp,
    IconZoomIn,
    IconZoomOut
} from '@arco-design/web-react/icon';
import "@arco-design/web-react/dist/css/arco.css";
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import './App.less';
import './hlst.css';
import {Document} from "../wailsjs/go/main/App";

function App() {
    const [style, setStyle] = useState('');
    const [cate, setCate] = useState(0);
    const [doc, setDoc] = useState('');
    let [list, setList] = useState([]);
    let [content, setContent] = useState([]);
    let [word, setWord] = useState('');
    const [mdSize, setMDSize] = useState(3);
    // 高亮
    const mi = new MarkdownIt({
        html: true, linkify: true, typographer: true, highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, {language: lang}).value;
                } catch (__) {
                }
            }
            return ''; // use external default escaping
        }
    })
    //
    let mds = {};
    const md = (i) => {
        if (!mds[i]) {
            mds[i] = mi.render(content[i] || ``)
        }
        return mds[i]
    }
    const open = (cIdx) => {
        setCate(cIdx)
        let html = md(cIdx) || ``
        if (word.length > 0) {
            let result = html.match(/>(.*?)</gmis);
            result.forEach((w) => {
                if (w.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
                    const regex = new RegExp(word, "gi");
                    const w2 = w.replaceAll(regex, match => `<span class="wf">${match}</span>`);
                    html = html.replace(w, w2);
                }
            })
        }
        setDoc(html);
    }

    const getDoc = () => {
        Document().then((v) => {
            mds = {};
            list = v.list || [];
            content = v.content || [];
            setList(list);
            setContent(content);
            open(cate);
            Notification.success({
                title: '读取成功', content: '文档数据已载入。',
            })
        })
    }

    useEffect(() => {
        getDoc();
    }, []);

    const cutOffset = (str) => {
        const tit = (str || ``).split(`.`)
        tit.shift()
        return tit.join(`.`)
    }

    const toggleLight = () => {
        const s = style === '' ? 'light' : ''
        setStyle(s)
        if (s === '') {
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            document.body.removeAttribute('arco-theme');
        }
    }

    const renderSummary = () => {
        let inContent = [];
        content.forEach((v, i) => {
            if (v.indexOf(word) !== -1) {
                inContent.push(i);
            }
        })
        return list.map((v, idx) => {
            v = cutOffset(v)
            let cn = []
            if (idx === cate) {
                cn.push(`focus`);
            }
            let inName = false
            if (word.length > 0) {
                inName = v.toLowerCase().indexOf(word.toLowerCase()) !== -1;
                if (inName) {
                    const regex = new RegExp(word, "gi");
                    v = v.replaceAll(regex, match => `<span class="wf">${match}</span>`);
                }
            }
            if (!inName && !inContent.includes(idx)) {
                cn.push(`wf2`);
            }
            return <div
                dangerouslySetInnerHTML={{__html: v}}
                className={cn.join(` `)}
                key={idx}
                onClick={() => {
                    open(idx)
                }}
            />
        })
    }
    return <div id="app" className={style}>
        <div className="sponsor" onClick={() => window.open("https://afdian.net/a/hunzsig")}>
            <div>支持开发者</div>
            <IconThumbUp/>
            <IconThumbUp/>
            <IconThumbUp/>
            <IconThumbUp/>
            <IconThumbUp/>
        </div>
        <div className="cate">
            <div className="search">
                <Input
                    size="small"
                    // style={{width: 350, margin: 12}}
                    prefix={<IconSearch/>}
                    placeholder="在此搜索"
                    onChange={(val) => {
                        word = val;
                        setWord(word);
                        open(cate);
                    }}
                />
            </div>
            <div className="summary">
                {renderSummary()}
            </div>
        </div>
        <div className="md">
            <Space size='large' className="tools">
                <Button.Group>
                    <Tooltip position='bottom' trigger='hover' content='更新md文档到阅读器'>
                        <Button type='primary' icon={<IconCloudDownload/>} onClick={getDoc}>读取文档</Button>
                    </Tooltip>
                    <Tooltip position='bottom' trigger='hover' content='主题色调'>
                        <Button
                            type='primary'
                            icon={style === '' ? <IconMoon/> : <IconSun/>}
                            onClick={toggleLight}
                        >{style === '' ? '暗黑' : '明亮'}</Button>
                    </Tooltip>
                    <Button
                        type='secondary'
                        icon={<IconZoomOut/>}
                        disabled={mdSize <= 1}
                        onClick={() => setMDSize(mdSize - 1)}></Button>
                    <Button
                        type='secondary'
                        icon={<IconZoomIn/>}
                        disabled={mdSize >= 5}
                        onClick={() => setMDSize(mdSize + 1)}></Button>
                </Button.Group>
            </Space>
            <h2 className="title">{cutOffset(list[cate])}</h2>
            <div className={["hljs", "s" + mdSize].join(" ")} dangerouslySetInnerHTML={{__html: doc}}/>
        </div>
    </div>
}

export default App
