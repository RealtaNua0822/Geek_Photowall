import React, { useState } from 'react';
import './BatchImport.css';

const BatchImport = ({ onImportSuccess }) => {
  const [importPath, setImportPath] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImport = async () => {
    if (!importPath.trim()) {
      setError('请输入导入路径');
      return;
    }

    try {
      setImporting(true);
      setError(null);
      setImportResult(null);

      const response = await fetch('/api/upload-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: importPath.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setImportResult(data);
        if (onImportSuccess) {
          onImportSuccess();
        }
      } else {
        setError(data.error || '导入失败');
      }
    } catch (error) {
      setError('导入失败: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleImport();
    }
  };

  return (
    <div className="batch-import">
      <div className="import-header">
        <h2>$ 批量导入</h2>
        <div className="import-status">
          <span className="status-indicator"></span>
          <span>BATCH_MODE</span>
        </div>
      </div>

      <div className="import-content">
        <div className="import-form">
          <h3>📁 从服务器目录导入照片</h3>
          <div className="input-group">
            <label htmlFor="importPath">服务器路径:</label>
            <input
              id="importPath"
              type="text"
              value={importPath}
              onChange={(e) => setImportPath(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="例如: /path/to/photos 或 C:\path\to\photos"
              className="path-input"
            />
          </div>
          
          <button 
            onClick={handleImport}
            disabled={importing || !importPath.trim()}
            className="import-btn"
          >
            {importing ? (
              <>
                <span className="loading-spinner"></span>
                导入中...
              </>
            ) : (
              '🚀 开始导入'
            )}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {importResult && (
          <div className="import-result">
            <h3>📊 导入结果</h3>
            <div className="result-stats">
              <div className="stat-item success">
                <span className="stat-number">{importResult.imported || 0}</span>
                <span className="stat-label">成功导入</span>
              </div>
              <div className="stat-item skipped">
                <span className="stat-number">{importResult.skipped || 0}</span>
                <span className="stat-label">已存在(跳过)</span>
              </div>
              <div className="stat-item error">
                <span className="stat-number">{importResult.errors?.length || 0}</span>
                <span className="stat-label">导入失败</span>
              </div>
            </div>

            {importResult.importedFiles && importResult.importedFiles.length > 0 && (
              <div className="imported-files">
                <h4>✅ 成功导入的文件:</h4>
                <ul>
                  {importResult.importedFiles.map((file, index) => (
                    <li key={index} className="file-item">
                      <span className="file-name">{file.originalName}</span>
                      <span className="file-size">{(file.size / 1024).toFixed(1)}KB</span>
                      <span className="file-dimensions">{file.width}×{file.height}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {importResult.errors && importResult.errors.length > 0 && (
              <div className="import-errors">
                <h4>❌ 导入失败的文件:</h4>
                <ul>
                  {importResult.errors.map((error, index) => (
                    <li key={index} className="error-item">
                      <span className="error-file">{error.file}</span>
                      <span className="error-reason">{error.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="import-tips">
          <h3>💡 导入提示</h3>
          <ul>
            <li>📂 支持导入服务器本地目录中的照片</li>
            <li>🖼️ 支持格式: JPG, PNG, GIF, WebP</li>
            <li>🔄 重复文件会自动跳过</li>
            <li>📏 系统会自动生成缩略图</li>
            <li>⚡ 大量文件导入可能需要一些时间</li>
            <li>🛡️ 确保路径有读取权限</li>
          </ul>
        </div>

        <div className="example-paths">
          <h3>📝 路径示例</h3>
          <div className="path-examples">
            <div className="example-item">
              <span className="example-label">Linux/Mac:</span>
              <code>/home/user/photos</code>
            </div>
            <div className="example-item">
              <span className="example-label">Windows:</span>
              <code>C:\Users\Username\Pictures</code>
            </div>
            <div className="example-item">
              <span className="example-label">相对路径:</span>
              <code>./import_photos</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchImport;