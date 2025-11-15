import React, { useState, useCallback } from "react";
import { useMap } from "../hooks/useMap";
import ParticleControls from "./ParticleControls";
import type { ParticleParams } from "./ParticleControls";
import "../styles/map.css";

const MapView: React.FC = () => {
  const { mapContainerRef, updateWindLayer, updateParticleParams } = useMap();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasParticleLayer, setHasParticleLayer] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setErrorMessage(null);

    const files = Array.from(e.dataTransfer.files);
    const pngFiles = files.filter(file => file.type === 'image/png');

    if (pngFiles.length === 0) {
      setErrorMessage('PNG画像ファイルをドロップしてください。');
      return;
    }

    if (pngFiles.length > 1) {
      setErrorMessage('一度に複数のファイルはサポートされていません。');
      return;
    }

    const file = pngFiles[0];
    setIsLoading(true);

    try {
      await updateWindLayer(file);
      setHasParticleLayer(true);
      setErrorMessage(null);
    } catch (error) {
      console.error('Wind layer update failed:', error);
      setErrorMessage('画像の読み込みに失敗しました。');
    } finally {
      setIsLoading(false);
    }
  }, [updateWindLayer]);

  const handleParticleParamsChange = useCallback((params: ParticleParams) => {
    updateParticleParams(params);
  }, [updateParticleParams]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div 
        ref={mapContainerRef} 
        style={{ width: "100%", height: "100%" }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />
      
      {/* ドラッグオーバー時のオーバーレイ */}
      {isDragOver && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          border: '3px dashed #007bff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          pointerEvents: 'none'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#007bff'
          }}>
            PNG画像をここにドロップしてください
          </div>
        </div>
      )}

      {/* ローディング表示 */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          zIndex: 1000
        }}>
          画像を読み込み中...
        </div>
      )}

      {/* エラーメッセージ */}
      {errorMessage && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(220, 53, 69, 0.9)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          zIndex: 1000,
          cursor: 'pointer'
        }} onClick={() => setErrorMessage(null)}>
          {errorMessage}
        </div>
      )}

      {/* パーティクルコントロール */}
      <ParticleControls 
        onParamsChange={handleParticleParamsChange}
        isVisible={hasParticleLayer}
      />

      {/* 使い方の説明 - Particleレイヤが表示されていない時のみ表示 */}
      {!hasParticleLayer && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '5px',
          fontSize: '14px',
          maxWidth: '300px'
        }}>
          WeatherLayers GLのdata formatのPNG画像を地図上にドラッグ&ドロップしてParticleレイヤーを表示できます。
        </div>
      )}
    </div>
  );
};

export default MapView;
