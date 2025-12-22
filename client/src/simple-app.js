import React, { useState, useEffect } from 'react';
import './App.css';
import UploadZone from './components/UploadZone';
import Dashboard from './components/Dashboard';
import TechParams from './components/TechParams';

function App() {
  const [photos, setPhotos] = useState([]);
  const [activeTab, setActiveTab] = useState('gallery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataFlowActive, setDataFlowActive] = useState(false);

  // 获取所有照片
  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      setDataFlowActive(true);
      const response = await fetch('/api/photos');
      const data = await response.json();
      setPhotos(data || []);
      console.log('Photos loaded:', data);
    } catch (error) {
      console.error('获取照片失败:', error);
      setError('获取照片失败: ' + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setDataFlowActive(false), 2000);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // 刷新照片列表
  const refreshPhotos = () => {
    fetchPhotos();
  };

  // 上传成功回调
  const handleUploadSuccess = () => {
    fetchPhotos();
    setActiveTab('gallery');
  };

  console.log('App render - activeTab:', activeTab, 'photos:', photos.length, 'loading:', loading);

  return (
    <div className="App">
      {/* 数据流可视化背景 */}
      <div className="data-flow-background">
        <div className="data-flow-placeholder">
          <div className="data-flow-info">
            <div className={`status-dot ${dataFlowActive ? 'active' : ''}`}></div>
            <span>DATA FLOW {dataFlowActive ? 'ACTIVE' : 'IDLE'}</span>
          </div>
        </div>
      </div>

      <header className="app-header">
        <h1>&gt; 摄影师作品集_</h1>
        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            [{photos.length}] 作品展示
          </button>
          <button 
            className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            &gt; 上传照片
          </button>
          <button 
            className={`tab-btn ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            $ 批量导入
          </button>
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 数据仪表板
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tech' ? 'active' : ''}`}
            onClick={() => setActiveTab('tech')}
          >
            🔬 技术分析
          </button>
        </nav>
      </header>

      <main className="app-main">
        {error && (
          <div className="error-message" style={{
            color: '#ff5f56',
            background: 'rgba(255, 95, 86, 0.1)',
            border: '1px solid #ff5f56',
            padding: '10px 15px',
            borderRadius: '5px',
            margin: '10px 0',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>&gt; LOADING...</p>
          </div>
        )}

        {!loading && !error && activeTab === 'gallery' && (
          <div className="photo-gallery">
            <div className="gallery-header">
              <h2>作品展示 ({photos.length} 张照片)</h2>
              <button className="refresh-btn" onClick={refreshPhotos}>🔄 刷新</button>
            </div>
            <div className="gallery-content">
              {photos.length === 0 ? (
                <div className="empty-gallery">
                  <div className="empty-icon">📷</div>
                  <h2>还没有照片</h2>
                  <p>开始上传一些精彩的作品吧！</p>
                </div>
              ) : (
                <div className="photo-grid">
                  {photos.map(photo => (
                    <div key={photo.id} className="photo-item">
                      <img 
                        src={photo.path} 
                        alt={photo.originalName}
                        style={{ 
                          width: '100%', 
                          height: 'auto',
                          borderRadius: '8px',
                          border: '1px solid #00ff41',
                          boxShadow: '0 0 10px rgba(0, 255, 65, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                      />
                      <div className="photo-info">
                        <p>{photo.originalName}</p>
                        <p>{photo.width} × {photo.height} • {(photo.size / 1024).toFixed(1)}KB</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !error && activeTab === 'upload' && (
          <UploadZone onUploadSuccess={handleUploadSuccess} />
        )}

        {!loading && !error && activeTab === 'import' && (
          <div className="batch-import">
            <h2>批量导入</h2>
            <p>从服务器目录批量导入照片</p>
            <div className="import-form" style={{
              background: 'rgba(0, 255, 65, 0.05)',
              border: '1px solid #00ff41',
              borderRadius: '8px',
              padding: '20px',
              margin: '20px 0'
            }}>
              <p style={{ color: '#00ff41', textAlign: 'center' }}>
                批量导入功能正在开发中...
              </p>
            </div>
          </div>
        )}

        {!loading && !error && activeTab === 'dashboard' && (
          <Dashboard photos={photos} />
        )}

        {!loading && !error && activeTab === 'tech' && (
          <TechParams photos={photos} />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 | [PHOTOGRAPHER_WEBSITE_v2.0] | SYSTEM_ONLINE</p>
      </footer>
    </div>
  );
}

export default App;