import {useEffect, useState} from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import './App.less';
import './hlst.css';
import './md.less';
import {Document} from "../wailsjs/go/main/App";

function App() {
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
    const [cate, setCate] = useState(0);
    const [doc, setDoc] = useState('');
    let [list, setList] = useState([]);
    let [content, setContent] = useState([]);
    // 配置
    const [fontSize, setFontSize] = useState("fs-2")
    const options = {
        fontSize: {
            "fs-1": "小",
            "fs-2": "中",
            "fs-3": "大",
        }
    }

    const mds = {};
    const md = (i) => {
        if (!mds[i]) {
            mds[i] = mi.render(content[i])
        }
        return mds[i]
    }
    const mdClass = () => {
        const c = ["md", fontSize];
        return c.join(" ");
    }
    const open = (cIdx) => {
        setCate(cIdx)
        setDoc(md(cIdx))
    }

    useEffect(() => {
        Document().then((v) => {
            list = v.list
            content = v.content
            setList(list)
            setContent(content)
            open(0)
        })
    }, []);

    const renderTools = function (key) {
        const o = Object.entries(options[key])
        return <span>{
            o.map((v) => {
                return <button key={v[0]}
                               className={v[0] === fontSize ? `focus` : ``}
                               onClick={() => setFontSize(v[0])}>{v[1]}</button>
            })
        }</span>
    }

    return <div id="app">
        <div className="cate">
            <div className="search">
                <input placeholder="在此搜索文档内容"/>
            </div>
            <div className="summary">
                {
                    list.map((v, idx) => {
                        return <div
                            className={idx === cate ? `focus` : ``}
                            key={idx}
                            onClick={() => {
                                open(idx)
                            }}
                        >{v}</div>
                    })
                }
            </div>
        </div>
        <div className={mdClass()}>
            <div className="tools">
                <div>
                    {/*<span>字号</span>*/}
                    {renderTools("fontSize")}
                </div>
            </div>
            <div className="hljs" dangerouslySetInnerHTML={{__html: doc}}/>
        </div>
    </div>
}

export default App
