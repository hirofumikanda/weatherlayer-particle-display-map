import React, { useState, useCallback } from 'react';
import '../styles/particleControls.css';

export interface ParticleParams {
  numParticles: number;
  maxAge: number;
  speedFactor: number;
  width: number;
  imageUnscale: [number, number];
  bounds: [number, number, number, number]; // [west, south, east, north]
}

interface ParticleControlsProps {
  onParamsChange: (params: ParticleParams) => void;
  isVisible: boolean;
}

const ParticleControls: React.FC<ParticleControlsProps> = ({ onParamsChange, isVisible }) => {
  const [params, setParams] = useState<ParticleParams>({
    numParticles: 5000,
    maxAge: 10,
    speedFactor: 30,
    width: 2.5,
    imageUnscale: [-128, 127],
    bounds: [-180, -90, 180, 90]
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleParamChange = useCallback((key: keyof ParticleParams, value: number | [number, number] | [number, number, number, number]) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onParamsChange(newParams);
  }, [params, onParamsChange]);

  const handleImageUnscaleMinChange = useCallback((value: number) => {
    handleParamChange('imageUnscale', [value, params.imageUnscale[1]]);
  }, [params.imageUnscale, handleParamChange]);

  const handleImageUnscaleMaxChange = useCallback((value: number) => {
    handleParamChange('imageUnscale', [params.imageUnscale[0], value]);
  }, [params.imageUnscale, handleParamChange]);

  const handleBoundsChange = useCallback((index: number, value: number) => {
    const newBounds = [...params.bounds] as [number, number, number, number];
    newBounds[index] = value;
    handleParamChange('bounds', newBounds);
  }, [params.bounds, handleParamChange]);

  if (!isVisible) return null;

  return (
    <div className="particle-controls">
      <div className="particle-controls-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <h3>パーティクル設定</h3>
        <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
      </div>
      
      {!isCollapsed && (
        <div className="particle-controls-content">
          {/* numParticles */}
          <div className="control-group">
            <label>
              パーティクル数: {params.numParticles}
            </label>
            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={params.numParticles}
              onChange={(e) => handleParamChange('numParticles', parseInt(e.target.value))}
              className="slider"
            />
          </div>

          {/* maxAge */}
          <div className="control-group">
            <label>
              最大寿命: {params.maxAge}
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={params.maxAge}
              onChange={(e) => handleParamChange('maxAge', parseInt(e.target.value))}
              className="slider"
            />
          </div>

          {/* speedFactor */}
          <div className="control-group">
            <label>
              速度係数: {params.speedFactor}
            </label>
            <input
              type="range"
              min="1"
              max="1000"
              step="5"
              value={params.speedFactor}
              onChange={(e) => handleParamChange('speedFactor', parseInt(e.target.value))}
              className="slider"
            />
          </div>

          {/* width */}
          <div className="control-group">
            <label>
              線の太さ: {params.width}
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.1"
              value={params.width}
              onChange={(e) => handleParamChange('width', parseFloat(e.target.value))}
              className="slider"
            />
          </div>

          {/* imageUnscale min */}
          <div className="control-group">
            <label>
              最小値: {params.imageUnscale[0]}
            </label>
            <input
              type="range"
              min="-128"
              max="0"
              step="1"
              value={params.imageUnscale[0]}
              onChange={(e) => handleImageUnscaleMinChange(parseInt(e.target.value))}
              className="slider"
            />
          </div>

          {/* imageUnscale max */}
          <div className="control-group">
            <label>
              最大値: {params.imageUnscale[1]}
            </label>
            <input
              type="range"
              min="0"
              max="128"
              step="1"
              value={params.imageUnscale[1]}
              onChange={(e) => handleImageUnscaleMaxChange(parseInt(e.target.value))}
              className="slider"
            />
          </div>

          {/* Bounds controls */}
          <div className="control-group">
            <label style={{ marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
              緯度経度範囲
            </label>
            
            {/* West (西) */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '11px' }}>
                西経度: {params.bounds[0]}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={params.bounds[0]}
                onChange={(e) => handleBoundsChange(0, parseInt(e.target.value))}
                className="slider"
              />
            </div>

            {/* South (南) */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '11px' }}>
                南緯度: {params.bounds[1]}°
              </label>
              <input
                type="range"
                min="-90"
                max="90"
                step="1"
                value={params.bounds[1]}
                onChange={(e) => handleBoundsChange(1, parseInt(e.target.value))}
                className="slider"
              />
            </div>

            {/* East (東) */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '11px' }}>
                東経度: {params.bounds[2]}°
              </label>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={params.bounds[2]}
                onChange={(e) => handleBoundsChange(2, parseInt(e.target.value))}
                className="slider"
              />
            </div>

            {/* North (北) */}
            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '11px' }}>
                北緯度: {params.bounds[3]}°
              </label>
              <input
                type="range"
                min="-90"
                max="90"
                step="1"
                value={params.bounds[3]}
                onChange={(e) => handleBoundsChange(3, parseInt(e.target.value))}
                className="slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticleControls;