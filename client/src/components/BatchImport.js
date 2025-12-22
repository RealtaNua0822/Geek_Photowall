import React, { useState } from 'react';
import './BatchImport.css';

const BatchImport = ({ onImportSuccess }) => {
  const [importing, setImporting] = useState(false);
  const [sourceDir, setSourceDir] = useState('');
  const [importResults, setImportResults] = useState(null);

  const handleImport = async () => {
    if (!sourceDir.trim()) {
      alert('请输入源目录路径');
      return;
    }

    setImporting(true);
    setImportResults(null);

    try {
      const response = await fetch('/api/import-photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sourceDir: sourceDir.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setImportResults(result);
        onImportSuccess();
      } else {
        alert('导入失败: ' + result.error);
      }
    } catch (error) {
      console.error('导入错误:', error);
      alert('导入过程中发生错误');
    } finally {
      setImporting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="batch-import">
      <div className="import-header">
        <h2>批量导入照片</h2>
        <p>从服务器目录批量导入照片到作品集</p>
      </div>

      <div className="import-form">
        <div className="form-group">
          <label htmlFor="sourceDir">源目录路径:</label>
          <input
            type="text"
            id="sourceDir"
            value={sourceDir}
            onChange={(e) => setSourceDir(e.target.value)}
            placeholder="例如: /path/to/your/photos 或 C:\Photos"
            disabled={importing}
          />
          <small>
            输入包含照片的服务器目录路径，系统将自动导入所有支持的图片格式
          </small>
        </div>

        <button
          className="import-btn"
          onClick={handleImport}
          disabled={importing || !sourceDir.trim()}
        >
          {importing ? (
            <>
              <span className="btn-spinner"></span>
              导入中...
            </>
          ) : (
            '开始导入'
          )}
        </button>
      </div>

      {importResults && (
        <div className="import-results">
          <h3>导入完成</h3>
          <div className="results-summary">
            <div className="summary-item">
              <span className="label">导入状态:</span>
              <span className="value success">成功</span>
            </div>
            <div className="summary-item">
              <span className="label">导入数量:</span>
              <span className="value">{importResults.photos.length} 张照片</span>
            </div>
          </div>

          <div className="imported-photos">
            <h4>导入的照片</h4>
            <div className="photo-grid">
              {importResults.photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo.thumbnailPath} alt={photo.originalName} />
                  <div className="photo-info">
                    <p className="photo-name">{photo.originalName}</p>
                    <p className="photo-details">
                      {photo.width} × {photo.height} • {formatFileSize(photo.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="new-import-btn"
            onClick={() => {
              setImportResults(null);
              setSourceDir('');
            }}
          >
            继续导入
          </button>
        </div>
      )}

      <div className="import-guide">
        <h3>使用指南</h3>
        <div className="guide-section">
          <h4>支持的目录格式</h4>
          <ul>
            <li><strong>Linux/Mac:</strong> /home/user/photos</li>
            <li><strong>Windows:</strong> C:\Users\Username\Pictures</li>
            <li><strong>相对路径:</strong> ./photos</li>
          </ul>
        </div>

        <div className="guide-section">
          <h4>支持的图片格式</h4>
          <ul>
            <li>JPEG (.jpg, .jpeg)</li>
            <li>PNG (.png)</li>
            <li>GIF (.gif)</li>
            <li>WebP (.webp)</li>
          </ul>
        </div>

        <div className="guide-section">
          <h4>导入功能特点</h4>
          <ul>
            <li>🔍 自动扫描目录中的所有图片文件</li>
            <li>🖼️ 自动生成缩略图</li>
            <li>📊 提取图片元数据（尺寸、大小等）</li>
            <li>🔄 避免重复导入</li>
            <li>⚡ 批量处理，提高效率</li>
          </ul>
        </div>

        <div className="guide-section">
          <h4>注意事项</h4>
          <ul>
            <li>确保目录路径正确且可访问</li>
            <li>导入过程会复制文件，不会移动原文件</li>
            <li>大量文件导入可能需要较长时间</li>
            <li>建议先备份重要照片</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BatchImport;