import React, { useState, useEffect } from 'react';
import TechParams from './TechParams';
import './PhotoGallery.css';

const PhotoGallery = ({ photos, onRefresh, loading }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('wall'); // wall, grid, list
  const [shuffledPhotos, setShuffledPhotos] = useState([]);

  // 随机打乱照片数组
  useEffect(() => {
    if (photos && photos.length > 0) {
      const shuffled = [...photos].sort(() => Math.random() - 0.5);
      setShuffledPhotos(shuffled);
    }
  }, [photos]);
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

  // 随机图片墙布局
  const renderPhotoWall = () => {
    if (shuffledPhotos.length === 0) return null;
    
    return (
      <div className="photo-wall">
        {shuffledPhotos.map((photo, index) => {
          // 随机生成不同大小的照片块，考虑长宽比
          const sizeClass = getRandomSizeClass(photo, index);
          return (
            <div 
              key={photo.id} 
              className={`wall-photo-item ${sizeClass}`}
              onClick={() => setSelectedPhoto(photo)}
              style={{
                '--aspect-ratio': photo.width / photo.height
              }}
            >
              <div className="wall-photo-container">
                {photo.webpPath ? (
                  <picture>
                    <source srcSet={photo.webpPath} type="image/webp" />
                    <source srcSet={photo.mediumPath || photo.path} type="image/jpeg" />
                    <img 
                      src={photo.mediumPath || photo.path} 
                      alt=""
                      loading="lazy"
                    />
                  </picture>
                ) : (
                  <img 
                    src={photo.mediumPath || photo.path} 
                    alt=""
                    loading="lazy"
                  />
                )}
                <div className="wall-photo-overlay">
                  <div className="wall-photo-details">
                    {photo.width} × {photo.height}
                    {photo.webpPath && <span className="webp-badge">WebP</span>}
                  </div>
                  <div className="wall-photo-actions">
                    <button 
                      className="wall-tech-btn"
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
                      className="wall-delete-btn"
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
        })}
      </div>
    );
  };

  // 随机生成大小类名，考虑图片长宽比
  const getRandomSizeClass = (photo, index) => {
    const aspectRatio = photo.width / photo.height;
    
    // 根据长宽比选择合适的尺寸类别
    let suitableSizes = [];
    
    if (aspectRatio > 1.5) {
      // 宽图
      suitableSizes = ['size-wide', 'size-wide-large', 'size-medium-wide', 'size-small'];
    } else if (aspectRatio < 0.7) {
      // 高图
      suitableSizes = ['size-tall', 'size-tall-large', 'size-medium-tall', 'size-small'];
    } else {
      // 方图或接近方图
      suitableSizes = ['size-large', 'size-medium', 'size-small', 'size-square', 'size-medium-square'];
    }
    
    // 添加一些随机性，偶尔不按长宽比
    if (Math.random() < 0.2) {
      const allSizes = [
        'size-large', 'size-medium', 'size-small', 
        'size-wide', 'size-wide-large', 'size-medium-wide',
        'size-tall', 'size-tall-large', 'size-medium-tall',
        'size-square', 'size-medium-square', 'size-panorama',
        'size-portrait', 'size-thumbnail'
      ];
      suitableSizes = allSizes;
    }
    
    // 随机选择一个合适的尺寸
    return suitableSizes[Math.floor(Math.random() * suitableSizes.length)];
  };

  // 渲染单个照片项
  const renderPhotoItem = (photo, index) => {
    // 优先使用WebP格式，回退到中等尺寸，最后原图
    const renderImage = () => {
      if (photo.webpPath) {
        return (
          <picture>
            <source srcSet={photo.webpPath} type="image/webp" />
            <source srcSet={photo.mediumPath || photo.path} type="image/jpeg" />
            <img 
              src={photo.mediumPath || photo.path} 
              alt=""
              loading="lazy"
            />
          </picture>
        );
      } else {
        return (
          <img 
            src={photo.mediumPath || photo.path} 
            alt=""
            loading="lazy"
          />
        );
      }
    };

    return (
      <div key={photo.id} className="photo-item">
        <div className="photo-container">
          {renderImage()}
          <div className="photo-overlay">
            <div className="photo-info">
              <p className="photo-details">
                {photo.width} × {photo.height} • {(photo.size / 1024).toFixed(1)}KB
                {photo.webpPath && <span className="webp-badge">WebP</span>}
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
  };

  // 网格视图
  const renderGridView = () => (
    <div className="grid-view">
      {photos.map((photo, index) => renderPhotoItem(photo, index))}
    </div>
  );

  // 列表视图
  const renderListView = () => (
    <div className="list-view">
      {photos.map(photo => (
        <div key={photo.id} className="list-item">
          <img 
            src={photo.thumbnailPath} 
            alt=""
            onClick={() => setSelectedPhoto(photo)}
          />
          <div className="list-item-info">
            <p>{photo.width} × {photo.height} • {(photo.size / 1024).toFixed(1)}KB</p>
            <p>上传时间: {new Date(photo.uploadedAt).toLocaleString()}</p>
            {photo.webpPath && <p className="webp-info">✅ WebP优化版本可用</p>}
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
            className={`view-btn ${viewMode === 'wall' ? 'active' : ''}`}
            onClick={() => setViewMode('wall')}
            title="随机图片墙"
          >
            🎲
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
          <button className="refresh-btn" onClick={() => {
            onRefresh();
            // 重新随机排列
            if (photos && photos.length > 0) {
              const shuffled = [...photos].sort(() => Math.random() - 0.5);
              setShuffledPhotos(shuffled);
            }
          }} title="刷新并重新排列">
            🔄
          </button>
        </div>
      </div>

      <div className="gallery-content">
        {viewMode === 'wall' && renderPhotoWall()}
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
            {selectedPhoto.webpPath ? (
              <picture>
                <source srcSet={selectedPhoto.webpPath} type="image/webp" />
                <source srcSet={selectedPhoto.mediumPath || selectedPhoto.path} type="image/jpeg" />
                <img src={selectedPhoto.mediumPath || selectedPhoto.path} alt="" />
              </picture>
            ) : (
              <img src={selectedPhoto.mediumPath || selectedPhoto.path} alt="" />
            )}
            <div className="modal-info">
              <p>尺寸: {selectedPhoto.width} × {selectedPhoto.height}</p>
              <p>文件大小: {(selectedPhoto.size / 1024).toFixed(1)}KB</p>
              {selectedPhoto.webpPath && <p className="webp-info">✅ WebP优化版本可用</p>}
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