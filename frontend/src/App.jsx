import {useEffect, useState} from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import './App.less';
import './hlst.css';
import './StyleLight.less';
import {Document} from "../wailsjs/go/main/App";
import {
    IconBookDownload,
    IconBulb,
    IconBulbOff,
    IconTextDecrease,
    IconTextIncrease,
    IconTextOrientation,
    IconThumbUp
} from "@tabler/icons-react";

function App() {
    const [style, setStyle] = useState('');
    const [cate, setCate] = useState(0);
    const [doc, setDoc] = useState('');
    let [list, setList] = useState([]);
    let [content, setContent] = useState([]);
    let [word, setWord] = useState('');
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
        }
    })
    // 配置
    const [fontSize, setFontSize] = useState("fs-2")
    const options = {
        fontSize: {
            "fs-1": <IconTextDecrease/>,
            "fs-2": <IconTextIncrease/>,
            "fs-3": <IconTextOrientation/>,
        }
    }

    let mds = {};
    const md = (i) => {
        if (!mds[i]) {
            mds[i] = mi.render(content[i] || ``)
        }
        return mds[i]
    }
    const hljsClass = () => {
        const c = ["hljs", fontSize];
        return c.join(" ");
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
    const renderTools = (key) => {
        const o = Object.entries(options[key])
        return <span>
            <button key="refresh" onClick={getDoc}><IconBookDownload/></button>
            <button key="style" onClick={() => {
                setStyle(style === '' ? 'light' : '')
            }}>{style === '' ? <IconBulbOff/> : <IconBulb/>}</button>
            {o.map((v) => {
                return <button key={v[0]}
                               disabled={v[0] === fontSize}
                               className={v[0] === fontSize ? `focus` : ``}
                               onClick={() => setFontSize(v[0])}>{v[1]}</button>
            })}
                </span>
    }

    return <div id="app" className={style}>
        <div className="sponsor" onClick={() => window.open("https://afdian.net/a/hunzsig")}>
            <div>支 持 一 下</div>
            <IconThumbUp/>
            <IconThumbUp/>
            <IconThumbUp/>
        </div>
        <div className="cate">
            <div className="search">
                <input
                    placeholder="在此搜索"
                    onChange={(e) => {
                        word = e.target.value
                        setWord(word)
                        open(cate)
                    }}
                />
            </div>
            <div className="summary">
                {renderSummary()}
            </div>
        </div>
        <div className="md">
            <div className="tools">
                <div>
                    {/*<span>字号</span>*/}
                    {renderTools("fontSize")}
                </div>
            </div>
            <h2 className="title">{cutOffset(list[cate])}</h2>
            <div className={hljsClass()} dangerouslySetInnerHTML={{__html: doc}}/>
        </div>
    </div>
}

export default App
