import React from 'react';

function Test() {
  return (
    <div style={{ 
      background: '#0a0a0a', 
      color: '#00ff41', 
      padding: '20px',
      minHeight: '100vh',
      fontFamily: 'monospace'
    }}>
      <h1>测试页面</h1>
      <p>如果你能看到这个页面，说明基础渲染正常</p>
      <p>时间: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default Test;