const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const photosDir = path.join(__dirname, 'uploads', 'photos');
const webpDir = path.join(__dirname, 'uploads', 'webp');
const mediumDir = photosDir; // 中等尺寸图片存在photos目录下

async function convertExistingPhotos() {
  try {
    // 确保webp目录存在
    await fs.promises.mkdir(webpDir, { recursive: true });
    
    // 读取所有照片文件
    const files = await fs.promises.readdir(photosDir);
    const imageFiles = files.filter(file => 
      !file.startsWith('.') && 
      !file.startsWith('medium_') &&
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    
    console.log(`找到 ${imageFiles.length} 张照片需要转换`);
    
    let converted = 0;
    let errors = 0;
    
    for (const file of imageFiles) {
      try {
        const inputPath = path.join(photosDir, file);
        const webpPath = path.join(webpDir, file.replace(/\.[^/.]+$/, '.webp'));
        const mediumPath = path.join(photosDir, 'medium_' + file);
        
        // 跳过已经转换过的文件
        if (fs.existsSync(webpPath)) {
          console.log(`⏭️  跳过已存在的WebP: ${file}`);
          continue;
        }
        
        console.log(`🔄 转换中: ${file}`);
        
        // 生成WebP版本
        await sharp(inputPath)
          .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(webpPath);
        
        // 生成中等尺寸版本（如果不存在）
        if (!fs.existsSync(mediumPath)) {
          await sharp(inputPath)
            .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toFile(mediumPath);
        }
        
        // 检查文件大小
        const originalStats = await fs.promises.stat(inputPath);
        const webpStats = await fs.promises.stat(webpPath);
        const savings = ((originalStats.size - webpStats.size) / originalStats.size * 100).toFixed(1);
        
        console.log(`✅ 完成: ${file} - 节省 ${savings}% 空间`);
        converted++;
        
      } catch (error) {
        console.error(`❌ 转换失败 ${file}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n🎉 转换完成!`);
    console.log(`✅ 成功: ${converted} 张`);
    console.log(`❌ 失败: ${errors} 张`);
    
  } catch (error) {
    console.error('批量转换失败:', error);
  }
}

convertExistingPhotos();