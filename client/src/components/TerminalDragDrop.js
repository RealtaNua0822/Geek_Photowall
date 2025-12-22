import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import './TerminalDragDrop.css';

const TerminalDragDrop = ({ onUploadSuccess }) => {
  const [uploadLog, setUploadLog] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const logContainerRef = useRef(null);

  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setUploadLog(prev => [...prev, { message, type, timestamp }]);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [uploadLog, scrollToBottom]);

  const simulateUploadProcess = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const steps = [
      { message: 'DETECTING_FILE_FORMAT...', delay: 500 },
      { message: 'VALIDATING_IMAGE_DATA...', delay: 800 },
      { message: 'CALCULATING_CHECKSUM...', delay: 600 },
      { message: 'ANALYZING_METADATA...', delay: 700 },
      { message: 'OPTIMIZING_COMPRESSION...', delay: 900 },
      { message: 'TRANSFERRING_DATA...', delay: 1200 },
      { message: 'VERIFYING_INTEGRITY...', delay: 500 },
      { message: 'UPDATING_DATABASE...', delay: 400 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      addLog(step.message, 'process');
      setUploadProgress(Math.round(((i + 1) / steps.length) * 100));
      await new Promise(resolve => setTimeout(resolve, step.delay));
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        addLog('SUCCESS: FILES_INJECTED', 'success');
        addLog(`SYSTEM: ${files.length} files processed`, 'info');
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        addLog('ERROR: UPLOAD_FAILED', 'error');
        addLog('SYSTEM: Retrying connection...', 'warning');
      }
    } catch (error) {
      addLog('CRITICAL_ERROR: Network failure', 'error');
      addLog('SYSTEM: Check firewall settings', 'warning');
    }

    setIsUploading(false);
    setUploadProgress(0);
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    addLog(`SYSTEM: Detected ${acceptedFiles.length} file(s)`, 'info');
    acceptedFiles.forEach(file => {
      addLog(`> ${file.name} (${(file.size / 1024).toFixed(2)} KB)`, 'file');
    });
    
    simulateUploadProcess(acceptedFiles);
  }, [addLog, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    disabled: isUploading
  });

  const clearLog = () => {
    setUploadLog([]);
    addLog('SYSTEM: Terminal cleared', 'info');
  };

  return (
    <div className="terminal-drag-drop">
      <div className="terminal-header">
        <div className="terminal-controls">
          <span className="control close"></span>
          <span className="control minimize"></span>
          <span className="control maximize"></span>
        </div>
        <div className="terminal-title">FILE_UPLOAD_TERMINAL_v2.0</div>
        <div className="terminal-actions">
          <button onClick={clearLog} className="clear-btn">CLEAR</button>
        </div>
      </div>

      <div className="terminal-body">
        <div className="terminal-output" ref={logContainerRef}>
          {uploadLog.length === 0 && (
            <div className="welcome-message">
              <div className="system-info">
                > HACKER UPLOAD PROTOCOL v2.0.1
                > READY FOR FILE INJECTION
                > DRAG & DROP IMAGES TO BEGIN
                > SUPPORTED: JPEG, PNG, GIF, WEBP
              </div>
            </div>
          )}
          
          {uploadLog.map((log, index) => (
            <div key={index} className={`log-entry ${log.type}`}>
              <span className="timestamp">[{log.timestamp}]</span>
              <span className="message">{log.message}</span>
              {log.type === 'process' && (
                <span className="cursor">_</span>
              )}
            </div>
          ))}

          {isUploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                [{uploadProgress}%] UPLOADING...
              </div>
            </div>
          )}
        </div>

        <div 
          {...getRootProps()} 
          className={`drop-zone ${isDragActive ? 'active' : ''} ${isUploading ? 'uploading' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="drop-zone-content">
            {isUploading ? (
              <div className="uploading-state">
                <div className="processing-indicator">
                  <span className="processing-text">PROCESSING...</span>
                  <div className="dots">
                    <span>.</span><span>.</span><span>.</span>
                  </div>
                </div>
                <div className="upload-status">
                  SYSTEM BUSY - DO NOT DISCONNECT
                </div>
              </div>
            ) : (
              <div className="drop-prompt">
                <div className="prompt-symbol">&gt;</div>
                <div className="prompt-text">
                  {isDragActive ? 'RELEASE FILES TO INJECT' : 'DRAG FILES HERE'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalDragDrop;