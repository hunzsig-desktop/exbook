import {useEffect, useState} from 'react';
import {Button, Divider, Input, Menu, Notification, Space, Tooltip} from '@arco-design/web-react';
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
import './hlst.less';
import {Document, GetConf, SetConf} from "../wailsjs/go/main/App";

function App() {
    const [style, setStyle] = useState('light');
    const [cate, setCate] = useState('');
    const [doc, setDoc] = useState('');
    let [summary, setSummary] = useState([]);
    let [word, setWord] = useState('');
    let [outWord, setOutWord] = useState([]);
    let [tckv, setTCKV] = useState({title: {}, content: {}});
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
    const title = (k) => {
        const str = tckv.title[k] || ``
        const tit = str.split(`.`)
        tit.shift()
        return tit.join(`.`)
    }
    const md = (k) => {
        if (!mds[k]) {
            mds[k] = mi.render(tckv.content[k] || ``)
        }
        return mds[k]
    }
    const open = (key) => {
        setCate(key)
        let html = md(key) || ``
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

    const getData = (data, kv) => {
        data.map((v) => {
            kv.title[v.key] = v.title
            if (v.children === null) {
                kv.content[v.key] = v.content
            } else {
                getData(v.children, kv)
            }
        })
        return kv
    }
    const getDoc = () => {
        Document().then((v) => {
            mds = {};
            summary = v;
            setSummary(summary);
            tckv = getData(summary, {title: {}, content: {}})
            setTCKV(tckv)
            if (summary.length > 0) {
                open(summary[0].key);
            }
        })
    }
    const getConf = () => {
        GetConf().then((v) => {
            if (v.theme !== style || v.mdSize !== mdSize) {
                conf(v.theme, v.mdSize)
            }
        })
    }
    const setConf = (theme, fontSize) => {
        SetConf(theme, fontSize).then(() => {
        })
    }

    useEffect(() => {
        getConf();
        getDoc();
    }, []);

    const conf = (theme, mdSize) => {
        setStyle(theme)
        setMDSize(mdSize)
        if (theme === 'dark') {
            document.body.setAttribute('arco-theme', 'dark');
        } else {
            document.body.removeAttribute('arco-theme');
        }
        setConf(theme, mdSize);
    }

    const renderMenu = (data) => {
        return data.map((v) => {
            let tit = title(v.key)
            if (v.children === null) {
                let cn = []
                let outName = true
                if (word.length > 0) {
                    outName = tit.toLowerCase().indexOf(word.toLowerCase()) === -1;
                    if (!outName) {
                        const regex = new RegExp(word, "gi");
                        tit = tit.replaceAll(regex, match => `<span class="wf">${match}</span>`);
                    }
                }
                if (outName && outWord.includes(v.key)) {
                    cn.push(`wf2`);
                }
                return <Menu.Item
                    key={v.key}
                    className={cn.join(` `)}
                    onClick={() => {
                        open(v.key)
                    }}
                ><span dangerouslySetInnerHTML={{__html: tit}}></span></Menu.Item>
            } else {
                return <Menu.SubMenu key={v.key} title={tit}>{renderMenu(v.children)}</Menu.SubMenu>
            }
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
                    prefix={<IconSearch/>}
                    placeholder="在此搜索"
                    onChange={(val) => {
                        word = val;
                        setWord(word);
                        outWord = [];
                        if (word.length > 0) {
                            for (const k in tckv.content) {
                                if (tckv.content[k].toLowerCase().indexOf(word.toLowerCase()) === -1) {
                                    outWord.push(k);
                                }
                            }
                        }
                        setOutWord(outWord);
                        open(cate);
                    }}
                />
            </div>
            <Menu className="summary" mode='vertical' selectedKeys={[cate]}>
                {renderMenu(summary)}
            </Menu>
        </div>
        <div className="md">
            <Space size='large' className="tools">
                <Button.Group>
                    <Tooltip position='bottom' trigger='hover' content='更新md文档到阅读器'>
                        <Button type='primary' icon={<IconCloudDownload/>} onClick={() => {
                            getDoc();
                            Notification.success({
                                title: '读取成功', content: '文档数据已载入。',
                            })
                        }}>读取文档</Button>
                    </Tooltip>
                    <Tooltip position='bottom' trigger='hover' content='主题色调'>
                        <Button
                            type='primary'
                            icon={style === 'light' ? <IconSun/> : <IconMoon/>}
                            onClick={() => conf(style === 'light' ? 'dark' : 'light', mdSize)}
                        >{style === 'light' ? '明亮' : '暗黑'}</Button>
                    </Tooltip>
                    <Button
                        type='secondary'
                        icon={<IconZoomOut/>}
                        disabled={mdSize <= 1}
                        onClick={() => conf(style, mdSize - 1)}></Button>
                    <Button
                        type='secondary'
                        icon={<IconZoomIn/>}
                        disabled={mdSize >= 5}
                        onClick={() => conf(style, mdSize + 1)}></Button>
                </Button.Group>
            </Space>
            <h2 className="title">{title(cate)}</h2>
            <Divider/>
            <div className={["content", "s" + mdSize].join(" ")} dangerouslySetInnerHTML={{__html: doc}}/>
        </div>
    </div>
}

export default App
