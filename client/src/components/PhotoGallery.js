import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import TechParams from './TechParams';
import './PhotoGallery.css';

const PhotoGallery = ({ photos, onRefresh, loading }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('masonry'); // masonry, grid, list
  const [showTechParams, setShowTechParams] = useState(false);

  // 删除照片
  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('确定要删除这张照片吗？')) {
      try {
        const response = await fetch(`/api/photos/${photoId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          onRefresh();
        } else {
          alert('删除失败');
        }
      } catch (error) {
        console.error('删除照片失败:', error);
        alert('删除失败');
      }
    }
  };

  // 瀑布流断点
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  // 渲染单个照片项
  const renderPhotoItem = (photo) => (
    <div key={photo.id} className="photo-item">
      <div className="photo-container">
        <img 
          src={photo.path} 
          alt={photo.originalName}
          onClick={() => setSelectedPhoto(photo)}
          loading="lazy"
        />
        <div className="photo-overlay">
          <div className="photo-info">
            <p className="photo-name">{photo.originalName}</p>
            <p className="photo-details">
              {photo.width} × {photo.height} • {(photo.size / 1024).toFixed(1)}KB
            </p>
          </div>
          <div className="photo-actions">
            <button 
              className="tech-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(photo);
                setShowTechParams(true);
              }}
              title="技术参数分析"
            >
              🔬
            </button>
            <button 
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletePhoto(photo.id);
              }}
              title="删除照片"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // 网格视图
  const renderGridView = () => (
    <div className="grid-view">
      {photos.map(photo => renderPhotoItem(photo))}
    </div>
  );

  // 列表视图
  const renderListView = () => (
    <div className="list-view">
      {photos.map(photo => (
        <div key={photo.id} className="list-item">
          <img 
            src={photo.thumbnailPath} 
            alt={photo.originalName}
            onClick={() => setSelectedPhoto(photo)}
          />
          <div className="list-item-info">
            <h3>{photo.originalName}</h3>
            <p>{photo.width} × {photo.height} • {(photo.size / 1024).toFixed(1)}KB</p>
            <p>上传时间: {new Date(photo.uploadedAt).toLocaleString()}</p>
          </div>
          <div className="list-item-actions">
            <button 
              className="tech-btn"
              onClick={() => {
                setSelectedPhoto(photo);
                setShowTechParams(true);
              }}
              title="技术参数分析"
            >
              🔬 分析
            </button>
            <button 
              className="delete-btn"
              onClick={() => handleDeletePhoto(photo.id)}
            >
              删除
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="spinner"></div>
        <p>加载照片中...</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="empty-gallery">
        <div className="empty-icon">📷</div>
        <h2>还没有照片</h2>
        <p>开始上传一些精彩的作品吧！</p>
      </div>
    );
  }

  return (
    <div className="photo-gallery">
      <div className="gallery-header">
        <h2>作品展示 ({photos.length} 张照片)</h2>
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'masonry' ? 'active' : ''}`}
            onClick={() => setViewMode('masonry')}
            title="瀑布流视图"
          >
            ⊞
          </button>
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="网格视图"
          >
            ⚏
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="列表视图"
          >
            ☰
          </button>
          <button className="refresh-btn" onClick={onRefresh} title="刷新">
            🔄
          </button>
        </div>
      </div>

      <div className="gallery-content">
        {viewMode === 'masonry' && (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {photos.map(photo => renderPhotoItem(photo))}
          </Masonry>
        )}
        
        {viewMode === 'grid' && renderGridView()}
        
        {viewMode === 'list' && renderListView()}
      </div>

      {/* 照片查看器模态框 */}
      {selectedPhoto && !showTechParams && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPhoto(null)}>
              ×
            </button>
            <img src={selectedPhoto.path} alt={selectedPhoto.originalName} />
            <div className="modal-info">
              <h3>{selectedPhoto.originalName}</h3>
              <p>尺寸: {selectedPhoto.width} × {selectedPhoto.height}</p>
              <p>文件大小: {(selectedPhoto.size / 1024).toFixed(1)}KB</p>
              <p>上传时间: {new Date(selectedPhoto.uploadedAt).toLocaleString()}</p>
              <button 
                className="tech-analysis-btn"
                onClick={() => setShowTechParams(true)}
              >
                🔬 技术参数分析
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 技术参数模态框 */}
      {showTechParams && selectedPhoto && (
        <TechParams 
          photo={selectedPhoto} 
          onClose={() => {
            setShowTechParams(false);
            setSelectedPhoto(null);
          }}
        />
      )}
    </div>
  );
};

export default PhotoGallery;