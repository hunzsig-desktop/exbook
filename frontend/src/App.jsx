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

    const mds = {};
    const md = (i) => {
        if (!mds[i]) {
            mds[i] = mi.render(content[i])
        }
        return mds[i]
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

    // useEffect(() => {
    //     document.querySelectorAll('pre code').forEach((block) => {
    //         hljs.highlightBlock(block);
    //     });
    // }, [doc])

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
        <div className="md hljs" dangerouslySetInnerHTML={{__html: doc}}/>
    </div>
}

export default App
