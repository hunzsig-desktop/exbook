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
    const [doc, setDoc] = useState({content: '', detail: ''});
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
    const title = (k) => {
        const str = tckv.title[k] || ``
        const tit = str.split(`.`)
        tit.shift()
        return tit.join(`.`)
    }
    let mds = {};
    const md = (k) => {
        if (!mds[k]) {
            mds[k] = mi.render(tckv.content[k] || ``)
        }
        return mds[k]
    }
    let details = {};
    const detail = (k) => {
        if (!details[k]) {
            details[k] = mi.render(tckv.detail[k] || ``)
        }
        return details[k]
    }
    const match = (html) => {
        if (word.length > 0) {
            let result = html.match(/>(.*?)</gmis);
            if (result != null) {
                result.forEach((w) => {
                    if (w.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
                        const regex = new RegExp(word, "gi");
                        const w2 = w.replaceAll(regex, match => `<span class="wf">${match}</span>`);
                        html = html.replace(w, w2);
                    }
                })
            }
        }
        return html
    }
    const open = (key) => {
        setCate(key)
        let c = md(key) || ``
        let d = detail(key) || ``
        setDoc({content: match(c), detail: match(d)});
        setConf(style, mdSize, key);
    }
    const getData = (data, kv) => {
        data.map((v) => {
            kv.title[v.key] = v.title
            if (v.children === null) {
                kv.content[v.key] = v.content
                kv.detail[v.key] = v.detail
            } else {
                getData(v.children, kv)
            }
        })
        return kv
    }
    const refresh = () => {
        Document().then((v) => {
            mds = {};
            summary = v;
            setSummary(summary);
            tckv = getData(summary, {title: {}, content: {}, detail: {}})
            setTCKV(tckv)
            GetConf().then((v) => {
                if (v.theme !== style) {
                    setStyle(v.theme)
                    if (v.theme === 'dark') {
                        document.body.setAttribute('arco-theme', 'dark');
                    } else {
                        document.body.removeAttribute('arco-theme');
                    }
                }
                if (v.mdSize !== mdSize) {
                    setMDSize(mdSize)
                }
                if (v.cate !== cate && tckv.title[v.cate] !== undefined) {
                    open(v.cate)
                } else {
                    if (summary.length > 0) {
                        open(summary[0].key);
                    }
                }
            })
        })
    }
    const setConf = (theme, fontSize, cate) => {
        SetConf(theme, fontSize, cate).then(() => {
        })
    }

    useEffect(() => {
        refresh();
    }, []);

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
                            const wl = word.toLowerCase()
                            for (const k in tckv.content) {
                                let c = tckv.content[k].toLowerCase()
                                const regex = /\(data:image\/png;base64.*?\)/g
                                c = c.replace(regex, '')
                                if (c.indexOf(wl) === -1) {
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
                            refresh();
                            Notification.success({
                                title: '读取成功', content: '文档数据已载入。',
                            })
                        }}>读取文档</Button>
                    </Tooltip>
                    <Tooltip position='bottom' trigger='hover' content='主题色调'>
                        <Button
                            type='primary'
                            icon={style === 'light' ? <IconSun/> : <IconMoon/>}
                            onClick={() => setStyle(() => {
                                const v = style === 'light' ? 'dark' : 'light'
                                if (v === 'dark') {
                                    document.body.setAttribute('arco-theme', 'dark');
                                } else {
                                    document.body.removeAttribute('arco-theme');
                                }
                                setConf(v, mdSize, cate);
                                return v;
                            })}
                        >{style === 'light' ? '明亮' : '暗黑'}</Button>
                    </Tooltip>
                    <Button
                        type='secondary'
                        icon={<IconZoomOut/>}
                        disabled={mdSize <= 1}
                        onClick={() => setMDSize(() => {
                            const v = mdSize - 1
                            setConf(style, v, cate);
                            return v;
                        })}></Button>
                    <Button
                        type='secondary'
                        icon={<IconZoomIn/>}
                        disabled={mdSize >= 5}
                        onClick={() => setMDSize(() => {
                            const v = mdSize + 1
                            setConf(style, v, cate);
                            return v;
                        })}></Button>
                </Button.Group>
            </Space>
            <h2 className="title">{title(cate)}</h2>
            <Divider/>
            <div className="stage">
                <div className={["mdTxt", "s" + mdSize].join(" ")} dangerouslySetInnerHTML={{__html: doc.content}}/>
                {doc.detail !== '' &&
                    <div className={["mdTxt", "s" + mdSize].join(" ")} dangerouslySetInnerHTML={{__html: doc.detail}}/>}
            </div>
        </div>
    </div>
}

export default App
