import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DataFlowVisualizer.css';

const DataFlowVisualizer = ({ isActive = true }) => {
  const canvasRef = useRef(null);
  const [packets, setPackets] = useState([]);
  const [networkActivity, setNetworkActivity] = useState(false);
  const [systemStatus, setSystemStatus] = useState('READY');
  const [dataFlowStats, setDataFlowStats] = useState({
    uploadSpeed: 0,
    downloadSpeed: 0,
    packetsTransferred: 0,
    totalData: 0
  });

  // 数据包类
  class DataPacket {
    constructor(startX, startY, endX, endY, type = 'upload') {
      this.startX = startX;
      this.startY = startY;
      this.endX = endX;
      this.endY = endY;
      this.currentX = startX;
      this.currentY = startY;
      this.type = type;
      this.speed = 2 + Math.random() * 3;
      this.size = 2 + Math.random() * 3;
      this.color = type === 'upload' ? '#00ff41' : '#ff0080';
      this.opacity = 1;
      this.trail = [];
      this.maxTrailLength = 10;
    }

    update() {
      // 计算移动方向
      const dx = this.endX - this.startX;
      const dy = this.endY - this.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const moveX = (dx / distance) * this.speed;
        const moveY = (dy / distance) * this.speed;
        
        // 添加到轨迹
        this.trail.push({ x: this.currentX, y: this.currentY });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }
        
        this.currentX += moveX;
        this.currentY += moveY;
        
        // 检查是否到达目标
        const currentDistance = Math.sqrt(
          Math.pow(this.endX - this.currentX, 2) + 
          Math.pow(this.endY - this.currentY, 2)
        );
        
        return currentDistance < 5;
      }
      return true;
    }

    draw(ctx) {
      // 绘制轨迹
      this.trail.forEach((point, index) => {
        ctx.globalAlpha = (index / this.trail.length) * 0.5;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // 绘制主数据包
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.currentX, this.currentY, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  // 生成数据包
  const generatePacket = useCallback(() => {
    if (!canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const isUpload = Math.random() > 0.5;
    
    let startX, startY, endX, endY;
    
    if (isUpload) {
      // 从鼠标位置到服务器
      startX = Math.random() * canvas.width;
      startY = Math.random() * canvas.height;
      endX = canvas.width - 50;
      endY = Math.random() * canvas.height;
    } else {
      // 从服务器到随机位置
      startX = canvas.width - 50;
      startY = Math.random() * canvas.height;
      endX = Math.random() * canvas.width;
      endY = Math.random() * canvas.height;
    }
    
    return new DataPacket(startX, startY, endX, endY, isUpload ? 'upload' : 'download');
  }, []);

  // 动画循环
  const animate = useCallback(() => {
    if (!canvasRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格背景
    drawGrid(ctx, canvas);
    
    // 更新和绘制数据包
    setPackets(prevPackets => {
      const updatedPackets = prevPackets.filter(packet => {
        const reachedTarget = packet.update();
        if (!reachedTarget) {
          packet.draw(ctx);
        }
        return !reachedTarget;
      });
      
      // 随机添加新数据包
      if (Math.random() < 0.1 && updatedPackets.length < 20) {
        const newPacket = generatePacket();
        if (newPacket) {
          updatedPackets.push(newPacket);
        }
      }
      
      return updatedPackets;
    });
    
    // 更新统计信息
    setDataFlowStats(prev => ({
      uploadSpeed: Math.random() * 1000,
      downloadSpeed: Math.random() * 800,
      packetsTransferred: prev.packetsTransferred + Math.floor(Math.random() * 3),
      totalData: prev.totalData + Math.random() * 100
    }));
    
    requestAnimationFrame(animate);
  }, [isActive, generatePacket]);

  // 绘制网格背景
  const drawGrid = (ctx, canvas) => {
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.lineWidth = 0.5;
    
    const gridSize = 30;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  // 设置画布大小
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 启动动画
  useEffect(() => {
    if (isActive) {
      const animationId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationId);
    }
  }, [animate, isActive]);

  // 模拟网络活动
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkActivity(prev => !prev);
      setSystemStatus(prev => {
        const statuses = ['READY', 'PROCESSING', 'OPTIMIZING', 'SYNCING'];
        return statuses[Math.floor(Math.random() * statuses.length)];
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`data-flow-visualizer ${isActive ? 'active' : ''}`}>
      <div className="visualizer-header">
        <div className="status-indicators">
          <div className={`network-status ${networkActivity ? 'active' : ''}`}>
            <div className="status-dot"></div>
            <span>NETWORK</span>
          </div>
          <div className="system-status">
            <span>SYSTEM: {systemStatus}</span>
          </div>
        </div>
        <div className="flow-stats">
          <div className="stat-item">
            <span className="stat-label">UPLOAD</span>
            <span className="stat-value upload">
              {Math.round(dataFlowStats.uploadSpeed)} KB/s
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">DOWNLOAD</span>
            <span className="stat-value download">
              {Math.round(dataFlowStats.downloadSpeed)} KB/s
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">PACKETS</span>
            <span className="stat-value packets">
              {dataFlowStats.packetsTransferred}
            </span>
          </div>
        </div>
      </div>
      
      <div className="canvas-container">
        <canvas ref={canvasRef} className="data-flow-canvas" />
        
        {/* 服务器图标 */}
        <div className="server-icon">
          <div className="server-body">
            <div className="server-lights">
              <div className="light green"></div>
              <div className="light red"></div>
              <div className="light yellow"></div>
            </div>
          </div>
          <div className="server-label">SERVER</div>
        </div>
        
        {/* 数据流动画指示器 */}
        <div className="flow-indicators">
          <div className="flow-indicator upload">
            <div className="arrow">↑</div>
            <span>UPLOAD</span>
          </div>
          <div className="flow-indicator download">
            <div className="arrow">↓</div>
            <span>DOWNLOAD</span>
          </div>
        </div>
      </div>
      
      <div className="visualizer-footer">
        <div className="data-usage">
          <span>TOTAL DATA: {(dataFlowStats.totalData / 1024).toFixed(2)} MB</span>
        </div>
        <div className="connection-info">
          <span>CONNECTION: ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};

export default DataFlowVisualizer;