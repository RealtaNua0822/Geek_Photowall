import React, { useState, useEffect } from 'react';
import './App.css';
import UploadZone from './components/UploadZone';
import BatchImport from './components/BatchImport';
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
      console.log('WebP paths:', data.map(p => ({ id: p.id, webpPath: p.webpPath, mediumPath: p.mediumPath })));
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
            </div>
            <div className="gallery-content">
              {photos.length === 0 ? (
                <div className="empty-gallery">
                  <div className="empty-icon">📷</div>
                  <h2>还没有照片</h2>
                  <p>开始上传一些精彩的作品吧！</p>
                </div>
              ) : (
                <div className="photo-wall">
                  {photos.map((photo, index) => {
                    // 生成不规则尺寸类
                    const sizeClass = `photo-size-${(index % 6) + 1}`;
                    return (
                      <div key={photo.id} className={`photo-item ${sizeClass}`}>
                        <div className="photo-container">
                          {photo.webpPath ? (
                            <img 
                              src={photo.webpPath} 
                              alt={photo.originalName}
                              loading="lazy"
                            />
                          ) : (
                            <img 
                              src={photo.mediumPath || photo.path} 
                              alt={photo.originalName}
                              loading="lazy"
                            />
                          )}
                          <div className="photo-overlay">
                            <div className="photo-actions">
                              <button 
                                className="delete-btn"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm('确定要删除这张照片吗？')) {
                                    try {
                                      await fetch(`/api/photos/${photo.id}`, {
                                        method: 'DELETE'
                                      });
                                      fetchPhotos();
                                    } catch (error) {
                                      console.error('删除失败:', error);
                                      alert('删除失败');
                                    }
                                  }
                                }}
                                title="删除照片"
                              >
                                🗑️
                              </button>
                            </div>
                            {photo.webpPath && (
                              <div className="webp-badge">WebP</div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !error && activeTab === 'upload' && (
          <UploadZone onUploadSuccess={handleUploadSuccess} />
        )}

        {!loading && !error && activeTab === 'import' && (
          <BatchImport onImportSuccess={handleUploadSuccess} />
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