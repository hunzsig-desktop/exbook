import {useEffect, useState} from 'react';
import hljs from 'highlight.js';
import './App.css';
import './hlst.css';

function App() {
    const [path, setPath] = useState('');

    useEffect(() => {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
        });
    }, [path])

    return <div id="app">
        <div className="alert">
            <div>本软件资源均来自互联网，仅供个人欣赏、学习之用，任何组织和个人不得公开传播或用于任何商业盈利用途，请自觉于下载后
                24 小时内删除。
            </div>
            <div>This software resource is sourced from the internet and is only for personal appreciation and
                learning purposes.
            </div>
            <div>No organization or individual is allowed to publicly disseminate or use it for any commercial
                profit. Please delete it within 24 hours after downloading.
            </div>
        </div>
        <div id="page" dangerouslySetInnerHTML={{__html: path}}/>
    </div>
}

export default App
