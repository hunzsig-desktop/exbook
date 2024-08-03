import {useEffect, useState} from 'react';
import {Button, Divider, Image, Input, Menu, Notification, Space, Tooltip} from '@arco-design/web-react';
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
import {Document, GetConf, OpenBrowser, SetConf} from "../wailsjs/go/main/App";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function App() {
    document.openbrowser = (url) => {
        OpenBrowser(url)
    }
    const [style, setStyle] = useState('light');
    const [cate, setCate] = useState('');
    const [doc, setDoc] = useState({content: '', detail: ''});
    let [summary, setSummary] = useState([]);
    let [word, setWord] = useState('');
    let [outWord, setOutWord] = useState([]);
    let [tckv, setTCKV] = useState({title: {}, content: {}});
    const [mdSize, setMDSize] = useState(3);
    const [img, setImg] = useState({src: '', alt: ''});
    // 高亮
    const mi = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(str, {language: lang}).value;
                } catch (__) {
                }
            }
            return ''; // use external default escaping
        },
    })
    mi.renderer.rules.link_open = function (tokens, idx, options, env, self) {
        const href = tokens[idx].attrGet('href')
        const content = tokens[1].content
        tokens[1].content = ''
        return `<a onclick="document.openbrowser('${href}')">${content}</a>`
    }

    const title = (k) => {
        const str = tckv.title[k] || ``
        const tit = str.split(`.`)
        tit.shift()
        return tit.join(`.`)
    }
    let mds = {};
    const md = (name, key) => {
        if (!mds[name]) {
            mds[name] = {}
        }
        if (!mds[name][key]) {
            mds[name][key] = mi.render(tckv[name][key] || ``)
        }
        return mds[name][key]
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
        let c = md("content", key) || ``
        let d = md("detail", key) || ``
        setDoc({content: match(c), detail: match(d)});
        setConf(style, mdSize, key);
        sleep(0).then(() => {
            const images = document.getElementsByTagName('img');
            for (const img of images) {
                if (img.id !== 'bigImg') {
                    img.onclick = function (evt) {
                        setImg({src: evt.target.src, alt: evt.target.alt});
                        sleep(0).then(() => {
                            document.getElementById('bigImg').click();
                        });
                    };
                }
            }
        });
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
                if (v.cate !== '' && tckv.title[v.cate] !== undefined) {
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
        <Image id="bigImg" src={img.src} alt={img.alt}/>
        <div className="sponsor" onClick={() => OpenBrowser("https://www.hunzsig.com")}>
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
