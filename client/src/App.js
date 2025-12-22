import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>&gt; 摄影师作品集_</h1>
        <nav className="nav-tabs">
          <button className="tab-btn active">
            [0] 作品展示
          </button>
          <button className="tab-btn">
            &gt; 上传照片
          </button>
          <button className="tab-btn">
            $ 批量导入
          </button>
          <button className="tab-btn">
            📊 数据仪表板
          </button>
        </nav>
      </header>

      <main className="app-main">
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: '#00ff41'
        }}>
          <div className="empty-icon">📷</div>
          <h2>还没有照片</h2>
          <p>开始上传一些精彩的作品吧！</p>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 | [PHOTOGRAPHER_WEBSITE_v1.0] | SYSTEM_ONLINE</p>
      </footer>
    </div>
  );
}

export default App;