import {useEffect, useState} from 'react';
import {Button, Divider, Empty, Image, Input, Menu, Notification, Space, Tooltip} from '@arco-design/web-react';
import {
    IconBook,
    IconCloudDownload,
    IconMoon,
    IconSearch,
    IconSun,
    IconZoomIn,
    IconZoomOut
} from '@arco-design/web-react/icon';
import "@arco-design/web-react/dist/css/arco.css";
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import clipboard from 'copy-to-clipboard';
import {AssetsBase64, Document, GetConf, SetConf} from "../wailsjs/go/main/App";
import {BrowserOpenURL} from "../wailsjs/runtime";
import LoadingBase64 from './LoadingBase64.jsx'
import './App.less';
import './hlst.less';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function App() {
    document.openbrowser = (url) => {
        BrowserOpenURL(url)
    }
    const [folder, setFolder] = useState('/docs');
    const [style, setStyle] = useState('light');
    const [cate, setCate] = useState('');
    const [doc, setDoc] = useState({content: '', detail: ''});
    let [summary, setSummary] = useState([]);
    let [summaryMap, setSummaryMap] = useState({title: {}, content: {}, detail: {}, isShow: {}});
    let [findWord, setFindWord] = useState('');
    const [mdSize, setMDSize] = useState(3);
    const [img, setImg] = useState({src: '', alt: ''});
    const [refreshing, setRefreshing] = useState(false);
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
        const href = tokens[idx].attrGet('href') || ''
        const t1 = tokens[idx + 1]
        let content = '点击'
        if (undefined !== t1 && t1.type === "text") {
            content = t1.content
            t1.content = ''
        }
        if (href[0].startsWith('/')) {
            return `<a href="${href}">${content}</a>`
        } else {
            return `<a onclick="document.openbrowser('${href}')">${content}</a>`
        }
    }

    const open = (key) => {
        if (typeof key === 'string' && key !== '') {
            setCate(key)
            setConf(folder, style, mdSize, key);
            const _html = (str) => {
                let html = mi.render(str)
                if (findWord.length > 0) {
                    let mat = html.match(/>(.*?)</gmis);
                    if (mat != null) {
                        mat.forEach((w) => {
                            const regex = new RegExp(findWord, "gi");
                            const w2 = w.replaceAll(regex, match => `<span class="wf">${match}</span>`);
                            html = html.replace(w, w2);
                        })
                    }
                }
                return html
            }
            let c = _html(summaryMap.content[key] || ``)
            let d = _html(summaryMap.detail[key] || ``)
            const writeDoc = () => {
                setDoc({content: c, detail: d});
                sleep(0).then(() => {
                    // big img
                    (async () => {
                        const images = document.getElementsByTagName('img');
                        for (const img of images) {
                            if (img.onclick === null && img.id !== 'bigImg') {
                                const src = img.getAttribute('src')
                                if (src.length > 0) {
                                    if (src.startsWith('/')) {
                                        img.onerror = (evt) => {
                                            evt.target.src = LoadingBase64;
                                            evt.target.onerror = null;
                                        }
                                        try {
                                            img.src = await AssetsBase64(src);
                                        } catch (error) {
                                            console.error('Failed to convert image to base64:', error);
                                        }
                                    }
                                    img.onclick = function (evt) {
                                        setImg({src: evt.target.src, alt: evt.target.alt});
                                        sleep(0).then(() => {
                                            document.getElementById('bigImg').click();
                                        });
                                    };
                                }
                            }
                        }
                    })();

                    // pre code
                    document.querySelectorAll('pre code').forEach((codeBlock) => {
                        const preElement = codeBlock.parentElement;
                        const copy = preElement.getElementsByClassName('pre-code-copy')
                        if (copy.length === 0) {
                            const btn = document.createElement('div');
                            btn.className = 'pre-code-copy';
                            btn.textContent = '复 制';
                            btn.onclick = function () {
                                const isCopied = clipboard(codeBlock.textContent);
                                if (isCopied) {
                                    Notification.success({
                                        title: '复制成功',
                                        content: '内容已复制到剪贴板',
                                    })
                                } else {
                                    Notification.error({
                                        title: '复制失败',
                                        content: '无法复制内容到剪贴板，请再次尝试或手动复制',
                                    })
                                }
                            }
                            preElement.insertBefore(btn, codeBlock);
                        }
                    });
                });
            }
            writeDoc()
        }
    }

    const parseSummary = () => {
        const dv = {title: {}, content: {}, detail: {}, isShow: {}}
        const _parser = (data) => {
            let isShowAll = findWord.length <= 0
            data.map((v) => {
                let isShow = findWord.length <= 0
                let t = v.title || ``
                t = t.split(`.`)
                t.shift()
                t = t.join(`.`)
                if (!isShow && t.toLowerCase().indexOf(findWord) !== -1) {
                    isShow = true
                    const regex = new RegExp(findWord, "gi");
                    const wt = t.replaceAll(regex, match => `<span class="wf">${match}</span>`);
                    t = <span dangerouslySetInnerHTML={{__html: wt}}/>
                }
                dv.title[v.key] = t
                if (v.children === null) {
                    let c = v.content || ``
                    let d = v.detail || ``
                    if (!isShow) {
                        let c2 = c.toLowerCase().replace(/!\[.+\]\(.+\)/g, '')
                        c2 = c2.replace(/]\(.+\)/g, ']')
                        if (findWord.length > 0 && c2.indexOf(findWord) !== -1) {
                            isShow = true
                        }
                    }
                    if (!isShow) {
                        let d2 = d.toLowerCase().replace(/!\[.+\]\(.+\)/g, '')
                        d2 = d2.replace(/]\(.+\)/g, ']')
                        if (findWord.length > 0 && d2.indexOf(findWord) !== -1) {
                            isShow = true
                        }
                    }
                    dv.content[v.key] = c
                    dv.detail[v.key] = d
                    dv.isShow[v.key] = isShow
                } else {
                    isShow = _parser(v.children)
                    dv.isShow[v.key] = isShow
                }
                if (isShowAll === false && isShow === true) {
                    isShowAll = true
                }
            })
            return isShowAll
        }
        _parser(summary)
        summaryMap = dv
        setSummaryMap(summaryMap)
    }
    const firstCate = (data) => {
        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                const d = data[i]
                if (d.children !== null) {
                    const cat = firstCate(d.children)
                    if (cat !== '') {
                        return cat
                    }
                } else {
                    return d.key
                }
            }
        }
        if (typeof data.key === "string") {
            return data.key
        }
        return ``
    }
    const refresh = (isNotify) => {
        Document().then((v) => {
            sleep(1000).then(() => {
                setRefreshing(false);
            })
            if (v === null) {
                Notification.error({
                    title: '读取错误',
                    content: ['请检查文档数据格式。（文档需放置在/根/mds中）',],
                })
                return
            }
            summary = v;
            setSummary(summary);
            parseSummary();
            GetConf().then((v) => {
                if (v.folder !== folder) {
                    setFolder(v.folder)
                    isNotify && Notification.success({
                        title: '读取成功',
                        content: '文档根错误，已载入默认或上一次的根目录数据。',
                    })
                } else {
                    isNotify && Notification.success({
                        title: '读取成功',
                        content: '已载入文档数据。',
                    })
                }
                if (v.theme !== style) {
                    setStyle(v.theme)
                    if (v.theme === 'dark') {
                        document.body.setAttribute('arco-theme', 'dark');
                    } else {
                        document.body.removeAttribute('arco-theme');
                    }
                }
                if (v.mdSize !== mdSize) {
                    setMDSize(v.mdSize)
                }
                if (v.cate !== '' && summaryMap.title[v.cate] !== undefined) {
                    open(v.cate)
                } else {
                    if (summary.length > 0) {
                        open(firstCate(summary));
                    }
                }
            })
        })
    }
    const setConf = (folder, theme, mdSize, cate, call) => {
        SetConf(folder, theme, mdSize, cate).then(() => {
            if (typeof call === "function") {
                call()
            }
        })
    }

    useEffect(() => {
        refresh(false);
    }, []);

    const renderMenu = (data) => {
        return data.map((v) => {
            const k = v.key
            if (v.children === null) {
                return <Menu.Item
                    key={k}
                    className={summaryMap.isShow[k] !== true ? 'wf2' : ''}
                    onClick={() => {
                        open(k)
                    }}
                >{summaryMap.title[k]}</Menu.Item>
            } else {
                return <Menu.SubMenu
                    key={k}
                    title={summaryMap.title[k]}
                    className={summaryMap.isShow[k] !== true ? 'wf2' : ''}>{renderMenu(v.children)}</Menu.SubMenu>
            }
        })
    }
    return <div id="app">
        {/*图片放大容器*/}
        <Image id="bigImg" src={img.src} alt={img.alt}/>
        {/*左侧导航栏*/}
        <div className="nav">
            <div className="search">
                <Input
                    size="small"
                    prefix={<IconSearch/>}
                    placeholder="在此搜索"
                    onChange={(val) => {
                        findWord = val.toLowerCase();
                        setFindWord(findWord);
                        parseSummary();
                        open(cate);
                    }}
                />
            </div>
            <Menu className="summary" mode='vertical' selectedKeys={[cate]}>
                {renderMenu(summary)}
            </Menu>
            <div className="sponsor">
                <div onClick={() => BrowserOpenURL("https://www.hunzsig.com/exbook-log")}>软件版本 ver.2025.7</div>
                <div onClick={() => BrowserOpenURL("https://www.hunzsig.com/donate")}>支持作者 www.hunzsig.com</div>
            </div>
        </div>
        <div className="md">
            <Space size='large' className="tools">
                <Input
                    className="folder"
                    size="small"
                    addBefore='文档根'
                    searchButton={<IconCloudDownload/> + '读取文档'}
                    value={folder}
                    placeholder='默认/docs'
                    onChange={(val) => {
                        setFolder(val)
                    }}
                />
                <Button.Group>
                    <Tooltip position='bottom' trigger='hover' content='更新md文档到阅读器'>
                        <Button type='primary'
                                icon={<IconCloudDownload/>}
                                disabled={refreshing}
                                loading={refreshing}
                                onClick={() => {
                                    setRefreshing(true);
                                    // 正常刷新完再过1000毫秒恢复，最长7500毫秒恢复刷新状态
                                    sleep(7500).then(() => {
                                        setRefreshing(false);
                                    })
                                    setConf(folder, style, mdSize, cate, () => {
                                        refresh(true);
                                    });
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
                                setConf(folder, v, mdSize, cate);
                                return v;
                            })}
                        >{style === 'light' ? '明亮' : '暗黑'}</Button>
                    </Tooltip>
                    <Tooltip position='bottom' trigger='hover' content='字号缩小'>
                        <Button
                            type='secondary'
                            icon={<IconZoomOut/>}
                            disabled={mdSize <= 1}
                            onClick={() => setMDSize(() => {
                                const v = mdSize - 1
                                setConf(folder, style, v, cate);
                                return v;
                            })}></Button>
                    </Tooltip>
                    <Tooltip position='bottom' trigger='hover' content='字号放大'>
                        <Button
                            type='secondary'
                            icon={<IconZoomIn/>}
                            disabled={mdSize >= 5}
                            onClick={() => setMDSize(() => {
                                const v = mdSize + 1
                                setConf(folder, style, v, cate);
                                return v;
                            })}></Button>
                    </Tooltip>
                </Button.Group>
            </Space>
            <h2 className="title">{summaryMap.title[cate] || ``}</h2>
            <Divider/>
            {
                doc.content !== '' ?
                    <div className="stage">
                        <div className={["mdTxt", "s" + mdSize].join(" ")}
                             dangerouslySetInnerHTML={{__html: doc.content}}/>
                        {doc.detail !== '' &&
                            <div className={["mdTxt", "s" + mdSize].join(" ")}
                                 dangerouslySetInnerHTML={{__html: doc.detail}}/>}
                    </div> :
                    <div className="stage">
                        <Empty icon={<IconBook/>} description={
                            <div>
                                <p>没有找到文档</p>
                                <p>请将阅读器放在文档根目录位置，如下结构</p>
                                <p> /exbook.exe - 阅读器 </p>
                                <p> /docs/assets - 资源文件 </p>
                                <p> /docs/mds - 文档md文件 </p>
                            </div>
                        }/>
                    </div>
            }
        </div>
    </div>
}

export default App
