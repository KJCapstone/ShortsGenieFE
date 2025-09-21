import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [capabilities, setCapabilities] = useState<any>(null);
  const [inputFile, setInputFile] = useState('');
  const [outputFile, setOutputFile] = useState('');

  useEffect(() => {
    loadFFmpegCapabilities();
  }, []);

  const loadFFmpegCapabilities = async () => {
    try {
      const caps = await window.electronAPI.ffmpegCapabilities();
      setCapabilities(caps);
      console.log('FFmpeg 지원 형식:', caps);
    } catch (error) {
      console.error('FFmpeg 기능 조회 오류:', error);
    }
  };

  const handleFFmpegProcess = async () => {
    if (!inputFile || !outputFile) {
      alert('입력 파일과 출력 파일을 모두 지정해주세요.');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await window.electronAPI.ffmpegProcess({
        inputFile: inputFile,
        outputFile: outputFile,
        videoCodec: 'libx264',
        audioCodec: 'aac',
        size: '1080x1920', // 세로형 숏폼 비디오
        duration: 30 // 30초 제한
      });
      console.log('FFmpeg 처리 결과:', result);
      alert('비디오 처리가 완료되었습니다!');
    } catch (error) {
      console.error('FFmpeg 처리 오류:', error);
      alert('비디오 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>🎬 ShortsGenie</h1>
        <p>AI 기반 숏폼 비디오 생성 도구</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            입력 파일 경로:
          </label>
          <input
            type="text"
            value={inputFile}
            onChange={(e) => setInputFile(e.target.value)}
            placeholder="/path/to/input.mp4"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            출력 파일 경로:
          </label>
          <input
            type="text"
            value={outputFile}
            onChange={(e) => setOutputFile(e.target.value)}
            placeholder="/path/to/output.mp4"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        <button
          onClick={handleFFmpegProcess}
          disabled={isProcessing || !inputFile || !outputFile}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: (isProcessing || !inputFile || !outputFile) ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: (isProcessing || !inputFile || !outputFile) ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {isProcessing ? '처리 중...' : '숏폼 비디오 생성'}
        </button>
      </div>

      <div style={{ textAlign: 'left' }}>
        <h3>주요 기능:</h3>
        <ul>
          <li>🎥 비디오 파일 업로드 및 처리</li>
          <li>✂️ 자동 비디오 편집 및 자르기 (30초 제한)</li>
          <li>📱 세로형 포맷 변환 (1080x1920)</li>
          <li>🎨 H.264 비디오 + AAC 오디오 최적화</li>
          <li>⚡ 실시간 진행률 표시</li>
        </ul>

        {capabilities && (
          <div style={{ marginTop: '20px' }}>
            <h3>FFmpeg 상태:</h3>
            <p style={{ color: 'green', fontWeight: 'bold' }}>✅ FFmpeg 연결됨</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              지원 형식: {Object.keys(capabilities).length}개
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;