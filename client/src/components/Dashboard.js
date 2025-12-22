import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = ({ photos }) => {
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalSize: 0,
    avgSize: 0,
    formats: {},
    sizes: {},
    uploadTimes: []
  });

  useEffect(() => {
    if (photos && photos.length > 0) {
      calculateStats(photos);
    }
  }, [photos]);

  const calculateStats = (photosData) => {
    const totalPhotos = photosData.length;
    const totalSize = photosData.reduce((sum, photo) => sum + photo.size, 0);
    const avgSize = totalSize / totalPhotos;
    
    // 格式统计
    const formats = {};
    photosData.forEach(photo => {
      const ext = photo.originalName.split('.').pop().toLowerCase();
      formats[ext] = (formats[ext] || 0) + 1;
    });

    // 尺寸统计
    const sizes = {};
    photosData.forEach(photo => {
      const sizeRange = photo.width < 1000 ? '<1000px' : 
                       photo.width < 2000 ? '1000-2000px' : '>2000px';
      sizes[sizeRange] = (sizes[sizeRange] || 0) + 1;
    });

    setStats({
      totalPhotos,
      totalSize,
      avgSize,
      formats,
      sizes,
      uploadTimes: photosData.slice(0, 10).map(p => new Date(p.uploadTime).toLocaleDateString())
    });
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 数据统计仪表板</h2>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>SYSTEM MONITORING</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📸</div>
          <div className="stat-content">
            <h3>{stats.totalPhotos}</h3>
            <p>总照片数</p>
            <div className="stat-change">+{Math.floor(stats.totalPhotos * 0.1)}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💾</div>
          <div className="stat-content">
            <h3>{formatSize(stats.totalSize)}</h3>
            <p>总存储空间</p>
            <div className="stat-change">+{Math.floor(stats.totalSize * 0.001 / 1024)}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📏</div>
          <div className="stat-content">
            <h3>{formatSize(stats.avgSize)}</h3>
            <p>平均文件大小</p>
            <div className="stat-change">+{Math.floor(stats.avgSize * 0.01)}%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎨</div>
          <div className="stat-content">
            <h3>{Object.keys(stats.formats).length}</h3>
            <p>文件格式</p>
            <div className="stat-change">稳定</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>文件格式分布</h3>
          <div className="format-chart">
            {Object.entries(stats.formats).map(([format, count]) => (
              <div key={format} className="format-bar">
                <span className="format-label">.{format}</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${(count / stats.totalPhotos) * 100}%`,
                      background: `hsl(${Math.random() * 60 + 120}, 100%, 50%)`
                    }}
                  ></div>
                </div>
                <span className="format-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>尺寸分布</h3>
          <div className="size-chart">
            {Object.entries(stats.sizes).map(([size, count]) => (
              <div key={size} className="size-bar">
                <span className="size-label">{size}</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${(count / stats.totalPhotos) * 100}%`,
                      background: 'linear-gradient(90deg, #00ff41, #ff0080)'
                    }}
                  ></div>
                </div>
                <span className="size-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-uploads">
        <h3>最近上传</h3>
        <div className="upload-list">
          {stats.uploadTimes.length > 0 ? (
            stats.uploadTimes.map((time, index) => (
              <div key={index} className="upload-item">
                <span className="upload-index">#{index + 1}</span>
                <span className="upload-time">{time}</span>
                <span className="upload-status">✓ 完成</span>
              </div>
            ))
          ) : (
            <div className="no-uploads">暂无上传记录</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;