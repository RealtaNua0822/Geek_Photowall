import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './UploadZone.css';

const UploadZone = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadStatus('正在上传照片...');
    setUploadProgress(0);

    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('photos', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus(`✅ 成功上传 ${result.photos.length} 张照片！`);
        setUploadProgress(100);
        
        setTimeout(() => {
          onUploadSuccess();
          setUploading(false);
          setUploadStatus('');
          setUploadProgress(0);
        }, 2000);
      } else {
        throw new Error('上传失败');
      }
    } catch (error) {
      console.error('上传错误:', error);
      setUploadStatus('❌ 上传失败，请重试');
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  return (
    <div className="upload-zone">
      <div className="upload-header">
        <h2>上传照片</h2>
        <p>支持 JPG、PNG、GIF、WebP 格式，单个文件最大 10MB</p>
      </div>

      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          {uploading ? (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="upload-status">{uploadStatus}</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📸</div>
              <p>{isDragActive ? '释放以上传照片...' : '拖拽照片到这里，或点击选择文件'}</p>
              <p className="upload-hint">可以同时选择多个文件进行批量上传</p>
            </>
          )}
        </div>
      </div>

      <div className="upload-tips">
        <h3>上传提示</h3>
        <ul>
          <li>📷 支持的格式：JPG、PNG、GIF、WebP</li>
          <li>📏 建议图片尺寸：至少 800px 宽度</li>
          <li>💾 单个文件大小限制：10MB</li>
          <li>🔄 可以同时上传多个文件</li>
          <li>✨ 系统会自动生成缩略图和WebP优化版本</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadZone;