import { useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import * as WeatherLayers from "weatherlayers-gl";

export interface ParticleParams {
  numParticles: number;
  maxAge: number;
  speedFactor: number;
  width: number;
  imageUnscale: [number, number];
  bounds: [number, number, number, number]; // [west, south, east, north]
}

export const useMap = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const deckOverlayRef = useRef<MapboxOverlay | null>(null);
  const currentImageRef = useRef<any>(null);
  const currentParamsRef = useRef<ParticleParams>({
    numParticles: 5000,
    maxAge: 10,
    speedFactor: 30,
    width: 2.5,
    imageUnscale: [-128, 127],
    bounds: [-180, -90, 180, 90]
  });

  // ファイルをTextureDataに変換する関数
  const fileToTextureData = async (file: File) => {
    // 1. ファイルを ImageBitmap に変換
    const blobUrl = URL.createObjectURL(file);
    const imgBitmap = await createImageBitmap(file);
    URL.revokeObjectURL(blobUrl);

    const width  = imgBitmap.width;
    const height = imgBitmap.height;

    // 2. Canvas を使ってピクセルデータを取得
    const canvas = document.createElement('canvas');
    canvas.width  = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context could not be created');
    }
    ctx.drawImage(imgBitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // 3. TextureData 形式に整形（バンド数＝4、RGBA と仮定）
    const textureData = {
      data: data,
      width: width,
      height: height,
      bandsCount: 4
    };

    return textureData;
  };

  // ParticleLayerを作成する共通関数
  const createParticleLayer = useCallback((image: any, params: ParticleParams) => {
    return new WeatherLayers.ParticleLayer({
      id: 'particle',
      numParticles: params.numParticles,
      maxAge: params.maxAge,
      speedFactor: params.speedFactor,
      width: params.width,
      opacity: 0.1,
      image: image,
      bounds: params.bounds,
      imageUnscale: params.imageUnscale,
    });
  }, []);

  // パーティクルパラメータを更新する関数
  const updateParticleParams = useCallback((params: ParticleParams) => {
    const map = mapRef.current;
    if (!map || !deckOverlayRef.current || !currentImageRef.current) return;

    try {
      currentParamsRef.current = params;
      const particleLayer = createParticleLayer(currentImageRef.current, params);

      deckOverlayRef.current.setProps({
        layers: [particleLayer]
      });
    } catch (error) {
      console.error('Failed to update particle parameters:', error);
    }
  }, [createParticleLayer]);
  
  // 風レイヤーを更新する関数
  const updateWindLayer = useCallback(async (imageFile: File) => {
    const map = mapRef.current;
    if (!map || !deckOverlayRef.current) return;

    try {
      // カスタム関数を使用してFileをTextureDataに変換
      const image = await fileToTextureData(imageFile);
      
      // 現在の画像を保存
      currentImageRef.current = image;
      
      // 現在のパラメータでParticleLayerを作成
      const particleLayer = createParticleLayer(image, currentParamsRef.current);

      deckOverlayRef.current.setProps({
        layers: [particleLayer]
      });
    } catch (error) {
      console.error('Failed to load wind data:', error);
      throw error;
    }
  }, [createParticleLayer]);

  // 地図の初期化（一度だけ実行）
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: "styles/style.json",
      center: [139.8, 35.9],
      zoom: 2,
      minZoom: 0,
      pitch: 0,
      hash: true,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // 地図がロードされた後にDeckGLオーバーレイを初期化
    map.on('load', () => {
      // Globeプロジェクションに設定
      map.setProjection({ type: 'globe' });
      
      // DeckGL オーバーレイを初期化
      const deckOverlay = new MapboxOverlay({
        interleaved: true,
        layers: []
      });
      deckOverlayRef.current = deckOverlay;
      map.addControl(deckOverlay as any);
    });

    return () => {
      map.remove();
    };
  }, []); // 依存関係を空にして一度だけ実行

  return { 
    mapContainerRef, 
    mapRef,
    updateWindLayer,
    updateParticleParams
  };
};
