import React, { useState, useEffect } from 'react';
import './TechParams.css';

const TechParams = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [techData, setTechData] = useState({
    exif: {},
    histogram: [],
    colorAnalysis: {},
    metadata: {}
  });

  useEffect(() => {
    if (selectedPhoto) {
      analyzePhoto(selectedPhoto);
    }
  }, [selectedPhoto]);

  const analyzePhoto = (photo) => {
    // 模拟技术参数分析
    const mockExif = {
      '相机型号': 'Canon EOS R5',
      '镜头': 'RF 24-70mm f/2.8L IS USM',
      '光圈': 'f/2.8',
      '快门速度': '1/125s',
      'ISO': '400',
      '焦距': '50mm',
      '白平衡': '自动',
      '拍摄时间': photo.uploadTime ? new Date(photo.uploadTime).toLocaleString() : '未知时间',
      '文件格式': photo.originalName.split('.').pop().toUpperCase(),
      '色彩空间': 'sRGB',
      '压缩质量': '95%'
    };

    const mockHistogram = Array.from({ length: 256 }, (_, i) => ({
      value: i,
      red: Math.floor(Math.random() * 255),
      green: Math.floor(Math.random() * 255),
      blue: Math.floor(Math.random() * 255)
    }));

    const mockColorAnalysis = {
      dominantColors: [
        { color: '#FF6B6B', percentage: 35 },
        { color: '#4ECDC4', percentage: 25 },
        { color: '#45B7D1', percentage: 20 },
        { color: '#96CEB4', percentage: 12 },
        { color: '#FFEAA7', percentage: 8 }
      ],
      brightness: Math.floor(Math.random() * 100),
      contrast: Math.floor(Math.random() * 100),
      saturation: Math.floor(Math.random() * 100),
      sharpness: Math.floor(Math.random() * 100)
    };

    const mockMetadata = {
      fileName: photo.originalName,
      fileSize: `${(photo.size / 1024).toFixed(1)} KB`,
      dimensions: `${photo.width} × ${photo.height}`,
      aspectRatio: (photo.width / photo.height).toFixed(2),
      pixelCount: (photo.width * photo.height).toLocaleString(),
      colorDepth: '24-bit',
      compression: 'JPEG',
      uploadTime: photo.uploadTime ? new Date(photo.uploadTime).toLocaleString() : '未知时间'
    };

    setTechData({
      exif: mockExif,
      histogram: mockHistogram,
      colorAnalysis: mockColorAnalysis,
      metadata: mockMetadata
    });
  };

  return (
    <div className="tech-params">
      <div className="tech-header">
        <h2>🔬 技术参数分析</h2>
        <div className="analysis-status">
          <span className="status-dot"></span>
          <span>ANALYSIS_MODE</span>
        </div>
      </div>

      <div className="photo-selector">
        <h3>选择照片进行分析</h3>
        <div className="photo-grid">
          {photos && photos.map(photo => (
            <div 
              key={photo.id} 
              className={`photo-thumb ${selectedPhoto?.id === photo.id ? 'selected' : ''}`}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo.path} alt={photo.originalName} />
              <div className="thumb-info">
                <p>{photo.originalName}</p>
                <p>{photo.width} × {photo.height}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <div className="analysis-results">
          <div className="analysis-grid">
            <div className="analysis-section">
              <h3>📸 EXIF 数据</h3>
              <div className="exif-data">
                {Object.entries(techData.exif).map(([key, value]) => (
                  <div key={key} className="exif-item">
                    <span className="exif-label">{key}:</span>
                    <span className="exif-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="analysis-section">
              <h3>📊 直方图分析</h3>
              <div className="histogram">
                <div className="histogram-chart">
                  {techData.histogram.map((point, index) => (
                    <div 
                      key={index} 
                      className="histogram-bar"
                      style={{
                        height: `${Math.max(point.red, point.green, point.blue) / 255 * 100}%`,
                        background: `linear-gradient(to top, 
                          rgba(${point.red}, 0, 0, 0.8), 
                          rgba(0, ${point.green}, 0, 0.8), 
                          rgba(0, 0, ${point.blue}, 0.8))`
                      }}
                    />
                  ))}
                </div>
                <div className="histogram-legend">
                  <span className="legend-red">红</span>
                  <span className="legend-green">绿</span>
                  <span className="legend-blue">蓝</span>
                </div>
              </div>
            </div>

            <div className="analysis-section">
              <h3>🎨 色彩分析</h3>
              <div className="color-analysis">
                <div className="dominant-colors">
                  <h4>主要颜色</h4>
                  {techData.colorAnalysis.dominantColors?.map((color, index) => (
                    <div key={index} className="color-item">
                      <div 
                        className="color-swatch" 
                        style={{ backgroundColor: color.color }}
                      />
                      <span className="color-hex">{color.color}</span>
                      <span className="color-percent">{color.percentage}%</span>
                    </div>
                  ))}
                </div>
                <div className="color-metrics">
                  <div className="metric">
                    <span className="metric-label">亮度</span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ width: `${techData.colorAnalysis.brightness}%` }}
                      />
                    </div>
                    <span className="metric-value">{techData.colorAnalysis.brightness}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">对比度</span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ width: `${techData.colorAnalysis.contrast}%` }}
                      />
                    </div>
                    <span className="metric-value">{techData.colorAnalysis.contrast}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">饱和度</span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ width: `${techData.colorAnalysis.saturation}%` }}
                      />
                    </div>
                    <span className="metric-value">{techData.colorAnalysis.saturation}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">锐度</span>
                    <div className="metric-bar">
                      <div 
                        className="metric-fill" 
                        style={{ width: `${techData.colorAnalysis.sharpness}%` }}
                      />
                    </div>
                    <span className="metric-value">{techData.colorAnalysis.sharpness}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="analysis-section">
              <h3>📁 文件信息</h3>
              <div className="file-metadata">
                {Object.entries(techData.metadata).map(([key, value]) => (
                  <div key={key} className="metadata-item">
                    <span className="metadata-label">{key}:</span>
                    <span className="metadata-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechParams;