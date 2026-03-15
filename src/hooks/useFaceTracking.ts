'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}

export interface FaceTrackingResults {
  landmarks: any;
  image: HTMLVideoElement;
}

interface FaceMeshResults {
  multiFaceLandmarks: any[][];
  image: any;
}

export function useFaceTracking(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<FaceTrackingResults | null>(null);
  const faceMeshRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  const onResults = useCallback((results: FaceMeshResults) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    resultsRef.current = {
    landmarks: results.multiFaceLandmarks[0],
    image: results.image as unknown as HTMLVideoElement,
  };
} else {
  resultsRef.current = null;
}
}, []);

  useEffect(() => {
    if (!videoRef.current) return;

    let isCancelled = false;

    const init = async () => {
      try {
        if (!window.FaceMesh || !window.Camera) {
          // Wait a bit if scripts are still loading
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (!window.FaceMesh || !window.Camera) {
            throw new Error('MediaPipe scripts not loaded');
          }
        }

        const faceMesh = new window.FaceMesh({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(onResults);
        faceMeshRef.current = faceMesh;

        if (videoRef.current) {
          const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (faceMeshRef.current && videoRef.current) {
                await faceMeshRef.current.send({ image: videoRef.current });
              }
            },
            width: 1280,
            height: 720,
          });
          
          cameraRef.current = camera;
          await camera.start();
          
          if (!isCancelled) setIsReady(true);
        }
      } catch (err) {
        console.error('FaceMesh Init Error:', err);
        if (!isCancelled) setError('Failed to initialize face tracking');
      }
    };

    init();

    return () => {
      isCancelled = true;
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }
    };
  }, [videoRef, onResults]);

  return { isReady, error, results: resultsRef };
}
