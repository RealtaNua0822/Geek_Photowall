import React, { useState } from 'react';
import TerminalDragDrop from './TerminalDragDrop';
import './UploadZone.css';

const UploadZone = ({ onUploadSuccess }) => {
  const [useTerminalMode, setUseTerminalMode] = useState(true);

  return (
    <div className="upload-zone">
      <div className="upload-header">
        <div className="header-content">
          <h2>上传照片</h2>
          <div className="mode-toggle">
            <button 
              className={`mode-btn ${useTerminalMode ? 'active' : ''}`}
              onClick={() => setUseTerminalMode(true)}
            >
              🖥️ 终端模式
            </button>
            <button 
              className={`mode-btn ${!useTerminalMode ? 'active' : ''}`}
              onClick={() => setUseTerminalMode(false)}
            >
              📸 普通模式
            </button>
          </div>
        </div>
        <p>支持 JPG、PNG、GIF、WebP 格式，单个文件最大 10MB</p>
      </div>

      {useTerminalMode ? (
        <TerminalDragDrop onUploadSuccess={onUploadSuccess} />
      ) : (
        <>
          <div className="dropzone">
            <div className="dropzone-content">
              <div className="upload-icon">📸</div>
              <p>拖拽照片到这里，或点击选择文件</p>
              <p className="upload-hint">可以同时选择多个文件进行批量上传</p>
            </div>
          </div>
        </>
      )}

      <div className="upload-tips">
        <h3>上传提示</h3>
        <ul>
          <li>📷 支持的格式：JPG、PNG、GIF、WebP</li>
          <li>📏 建议图片尺寸：至少 800px 宽度</li>
          <li>💾 单个文件大小限制：10MB</li>
          <li>🔄 可以同时上传多个文件</li>
          <li>✨ 系统会自动生成缩略图</li>
          {useTerminalMode && (
            <li>🖥️ 终端模式：体验黑客风格的上传过程</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UploadZone;