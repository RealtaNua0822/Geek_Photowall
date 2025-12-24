const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 确保上传目录存在
const uploadsDir = path.join(__dirname, 'uploads');
const photosDir = path.join(uploadsDir, 'photos');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
const webpDir = path.join(uploadsDir, 'webp');

// 创建目录
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(photosDir);
fs.ensureDirSync(thumbnailsDir);
fs.ensureDirSync(webpDir);

// 配置multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photosDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只支持 JPEG, PNG, GIF, WebP 格式的图片'));
    }
  }
});

// 服务前端静态文件
app.use(express.static(path.join(__dirname, 'client', 'build')));

// 服务上传文件
app.use('/uploads', express.static(uploadsDir));

// API 路由
// 获取所有照片
app.get('/api/photos', async (req, res) => {
  try {
    const files = await fs.readdir(photosDir);
    const photos = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(photosDir, filename);
        const thumbnailPath = path.join(thumbnailsDir, filename);
        const stats = await fs.stat(filePath);
        
        // 获取图片尺寸
        let width = 0, height = 0;
        try {
          const sharp = require('sharp');
          const metadata = await sharp(filePath).metadata();
          width = metadata.width;
          height = metadata.height;
        } catch (error) {
          console.warn('无法获取图片尺寸:', error);
        }

        return {
          id: filename.replace(/\.[^/.]+$/, ''),
          filename: filename,
          originalName: filename,
          path: `/uploads/photos/${filename}`,
          thumbnailPath: `/uploads/thumbnails/${filename}`,
          uploadedAt: stats.birthtime.toISOString(),
          width: width,
          height: height,
          format: path.extname(filename).slice(1),
          size: stats.size
        };
      })
    );
    
    res.json(photos);
  } catch (error) {
    console.error('获取照片失败:', error);
    res.status(500).json({ error: '获取照片失败' });
  }
});

// 上传单个或多个照片
app.post('/api/upload', upload.array('photos'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '没有上传文件' });
    }

    const uploadedPhotos = [];
    
    for (const file of req.files) {
      // 生成多种尺寸和格式的图片
              try {
                const sharp = require('sharp');
                const thumbnailPath = path.join(thumbnailsDir, file.filename);
                const webpPath = path.join(webpDir, file.filename.replace(/\.[^/.]+$/, '.webp'));
                const mediumPath = path.join(photosDir, 'medium_' + file.filename);
                
                // 生成缩略图
                await sharp(file.path)
                  .resize(300, 300, { fit: 'cover' })
                  .jpeg({ quality: 80 })
                  .toFile(thumbnailPath);
                
                // 生成中等尺寸图片
                await sharp(file.path)
                  .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
                  .jpeg({ quality: 85 })
                  .toFile(mediumPath);
                
                // 生成WebP格式图片
                await sharp(file.path)
                  .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
                  .webp({ quality: 80 })
                  .toFile(webpPath);
                
                uploadedPhotos.push({
                  id: file.filename.replace(/\.[^/.]+$/, ''),
                  filename: file.filename,
                  originalName: file.originalname,
                  path: `/uploads/photos/${file.filename}`,
                  mediumPath: `/uploads/photos/medium_${file.filename}`,
                  webpPath: `/uploads/webp/${file.filename.replace(/\.[^/.]+$/, '.webp')}`,
                  thumbnailPath: `/uploads/thumbnails/${file.filename}`,
                  size: file.size
                });
              } catch (error) {
                console.error('生成图片格式失败:', error);
              }    }
    
    res.json({ success: true, photos: uploadedPhotos });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({ error: '上传失败' });
  }
});

app.post('/api/upload-batch', async (req, res) => {
  try {
    const { path: importPath } = req.body;
    
    if (!importPath) {
      return res.status(400).json({ error: 'Import path is required' });
    }

    const fs = require('fs').promises;
    const path = require('path');
    
    let imported = 0;
    let skipped = 0;
    const errors = [];
    const importedFiles = [];

    try {
      // 检查路径是否存在
      const stats = await fs.stat(importPath);
      if (!stats.isDirectory()) {
        return res.status(400).json({ error: 'Path is not a directory' });
      }

      // 读取目录内容
      const files = await fs.readdir(importPath);
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      
      for (const file of files) {
        try {
          const ext = path.extname(file).toLowerCase();
          if (!imageExtensions.includes(ext)) {
            continue; // 跳过非图片文件
          }

          const filePath = path.join(importPath, file);
          const fileStats = await fs.stat(filePath);
          
          if (!fileStats.isFile()) {
            continue; // 跳过子目录
          }

          // 生成唯一文件名
          const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
          const destPath = path.join(photosDir, filename);
          
          // 复制文件到上传目录
          await fs.copyFile(filePath, destPath);
          
          // 生成缩略图
          const thumbnailPath = path.join(thumbnailsDir, filename);
          await sharp(destPath)
            .resize(200, 200, { fit: 'cover' })
            .toFile(thumbnailPath);

          // 获取图片信息
          const metadata = await sharp(destPath).metadata();

          const photoInfo = {
            id: filename,
            originalName: file,
            path: `/uploads/photos/${filename}`,
            thumbnailPath: `/uploads/thumbnails/${filename}`,
            size: fileStats.size,
            width: metadata.width,
            height: metadata.height,
            uploadTime: new Date().toISOString()
          };

          photos.push(photoInfo);
          importedFiles.push(photoInfo);
          imported++;
        } catch (error) {
          console.error('Error processing file:', file, error);
          errors.push({
            file: file,
            reason: error.message
          });
        }
      }

      res.json({
        success: true,
        imported,
        skipped,
        errors,
        importedFiles,
        total: imported + skipped + errors.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to read directory: ' + error.message });
    }
  } catch (error) {
    console.error('Batch import error:', error);
    res.status(500).json({ error: 'Batch import failed' });
  }
});

// 删除照片
app.delete('/api/photos/:id', async (req, res) => {
  try {
    const photoId = req.params.id;
    
    // 查找文件
    const files = await fs.readdir(photosDir);
    const file = files.find(f => f.includes(photoId));
    
    if (!file) {
      return res.status(404).json({ error: '照片不存在' });
    }
    
    // 删除原图和缩略图
    await fs.remove(path.join(photosDir, file));
    await fs.remove(path.join(thumbnailsDir, file));
    
    res.json({ success: true });
  } catch (error) {
    console.error('删除照片失败:', error);
    res.status(500).json({ error: '删除照片失败' });
  }
});

// 所有其他请求都返回前端应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`前端应用可通过 http://localhost:${PORT} 访问`);
});