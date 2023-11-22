import {useEffect, useState} from 'react';
import hljs from 'highlight.js';
import './App.less';
import './hlst.css';
import {Document} from "../wailsjs/go/main/App";

function App() {
    const [cate, setCate] = useState(0);
    const [doc, setDoc] = useState('');
    const [list, setList] = useState([]);
    const [content, setContent] = useState([]);

    useEffect(() => {
        Document().then((v) => {
            setList(v.list)
            setContent(v.content)
            setCate(1)
            setDoc(v.content[1])
        })
    }, []);

    useEffect(() => {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }, [doc])

    const open = (cIdx) => {
        console.log(cIdx)
        setCate(cIdx)
        setDoc(content[cIdx])
    }

    return <div id="app">
        <div className="cate">
            <div className="search">
                <input placeholder="在此搜索文档内容"/>
            </div>
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
        <div className="md" dangerouslySetInnerHTML={{__html: doc}}/>
    </div>
}

export default App
