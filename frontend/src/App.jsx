import {useEffect, useState} from 'react';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import './App.less';
import './hlst.css';
import './md.less';
import {Document} from "../wailsjs/go/main/App";

function App() {
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

    useEffect(() => {
        Document().then((v) => {
            list = v.list || []
            content = v.content || []
            setList(list)
            setContent(content)
            open(0)
        })
    }, []);

    const renderSummary = function () {
        return list.map((v, idx) => {
            let cn = []
            if (idx === cate) {
                cn.push(`focus`);
            }
            if (word.length > 0 && v.indexOf(word) === -1) {
                cn.push(`wf2`);
            }
            return <div
                className={cn.join(` `)}
                key={idx}
                onClick={() => {
                    open(idx)
                }}
            >{v}</div>
        })
    }
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
