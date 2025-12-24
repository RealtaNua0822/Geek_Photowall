import React, { useState, useEffect } from 'react';
import PhotoGallery from './components/PhotoGallery';
import UploadZone from './components/UploadZone';
import BatchImport from './components/BatchImport';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 获取照片列表
  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/photos');
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error('获取照片失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载照片
  useEffect(() => {
    fetchPhotos();
  }, []);

  // 上传成功后刷新照片列表
  const handleUploadSuccess = () => {
    fetchPhotos();
    setActiveTab('gallery');
  };

  // 批量导入成功后刷新照片列表
  const handleBatchImportSuccess = () => {
    fetchPhotos();
    setActiveTab('gallery');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>&gt; 摄影师作品集_</h1>
        <nav className="nav-tabs">
          <button 
            className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            [0] 作品展示
          </button>
          <button 
            className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            &gt; 上传照片
          </button>
          <button 
            className={`tab-btn ${activeTab === 'batch' ? 'active' : ''}`}
            onClick={() => setActiveTab('batch')}
          >
            $ 批量导入
          </button>
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 数据仪表板
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'gallery' && (
          <PhotoGallery 
            photos={photos} 
            onRefresh={fetchPhotos}
            loading={loading}
          />
        )}
        
        {activeTab === 'upload' && (
          <UploadZone onUploadSuccess={handleUploadSuccess} />
        )}
        
        {activeTab === 'batch' && (
          <BatchImport onImportSuccess={handleBatchImportSuccess} />
        )}
        
        {activeTab === 'dashboard' && (
          <Dashboard photos={photos} />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 | [PHOTOGRAPHER_WEBSITE_v1.0] | SYSTEM_ONLINE</p>
      </footer>
    </div>
  );
}

export default App;