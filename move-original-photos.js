const fs = require('fs');
const path = require('path');

// 创建原图存储目录
const originalDir = path.join(__dirname, 'uploads', 'original');
const photosDir = path.join(__dirname, 'uploads', 'photos');

if (!fs.existsSync(originalDir)) {
  fs.mkdirSync(originalDir, { recursive: true });
  console.log('✅ 创建原图目录: uploads/original');
}

// 移动原图到original目录
fs.readdir(photosDir, (err, files) => {
  if (err) {
    console.error('❌ 读取photos目录失败:', err);
    return;
  }

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  let movedCount = 0;

  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    
    // 只移动原图（不包含medium_前缀的文件）
    if (imageExtensions.includes(ext) && !file.startsWith('medium_')) {
      const sourcePath = path.join(photosDir, file);
      const targetPath = path.join(originalDir, file);
      
      fs.rename(sourcePath, targetPath, (err) => {
        if (err) {
          console.error(`❌ 移动文件失败 ${file}:`, err);
        } else {
          console.log(`📁 移动原图: ${file} -> original/`);
          movedCount++;
        }
      });
    }
  });

  console.log(`🎯 开始移动 ${files.filter(f => 
    imageExtensions.includes(path.extname(f).toLowerCase()) && 
    !f.startsWith('medium_')
  ).length} 个原图文件到 original/ 目录`);
});