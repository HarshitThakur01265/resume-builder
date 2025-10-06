/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { forwardRef, useRef, useMemo, useLayoutEffect, useEffect } from 'react'
import { Color } from 'three'

const hexToNormalizedRGB = (hex) => {
  const clean = hex.replace('#', '')
  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ]
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  uniform float uTime;
  uniform vec3 uColor;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uRotation;
  uniform float uNoiseIntensity;

  const float e = 2.71828182845904523536;

  float noise(vec2 texCoord) {
    float G = e;
    vec2 r = (G * sin(G * texCoord));
    return fract(r.x * r.y * (1.0 + texCoord.x));
  }

  vec2 rotateUvs(vec2 uv, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    mat2 rot = mat2(c, -s, s, c);
    return rot * uv;
  }

  void main() {
    float rnd = noise(gl_FragCoord.xy);
    vec2 uv = rotateUvs(vUv * uScale, uRotation);
    vec2 tex = uv * uScale;
    float tOffset = uSpeed * uTime;

    tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

    float pattern = 0.6 +
      0.4 * sin(5.0 * (tex.x + tex.y +
      cos(3.0 * tex.x + 5.0 * tex.y) +
      0.02 * tOffset) +
      sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

    vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
    col.a = 1.0;
    gl_FragColor = col;
  }
`

const SilkPlane = forwardRef(function SilkPlane({ uniforms, targetColor, tweenSeconds }, ref) {
  const { viewport } = useThree()

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1)
    }
  }, [ref, viewport])

  useFrame((_, delta) => {
    if (ref.current?.material?.uniforms?.uTime) {
      ref.current.material.uniforms.uTime.value += 0.1 * delta
    }
    if (uniforms?.uColor?.value && targetColor) {
      const current = uniforms.uColor.value
      const t = tweenSeconds > 0 ? Math.min(1, delta / tweenSeconds) : 1
      current.lerp(targetColor, t)
    }
  })

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        attach="material"
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={false}
      />
    </mesh>
  )
})
SilkPlane.displayName = 'SilkPlane'

export default function Silk({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
  style = {},
  className = '',
  tweenSeconds = 0.6,
}) {
  const meshRef = useRef()

  // Gracefully skip rendering if WebGL is unavailable
  const isWebGLSupported = useMemo(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      return !!gl
    } catch {
      return false
    }
  }, [])

  // Keep uniforms stable to allow tweening
  const uniforms = useRef({
    uSpeed: { value: speed },
    uScale: { value: scale },
    uNoiseIntensity: { value: noiseIntensity },
    uColor: { value: new Color(...hexToNormalizedRGB(color)) },
    uRotation: { value: rotation },
    uTime: { value: 0 },
  })

  // Target color to tween towards
  const targetColor = useRef(new Color(...hexToNormalizedRGB(color)))

  // Update non-color uniforms immediately on prop change
  useEffect(() => {
    uniforms.current.uSpeed.value = speed
  }, [speed])
  useEffect(() => {
    uniforms.current.uScale.value = scale
  }, [scale])
  useEffect(() => {
    uniforms.current.uNoiseIntensity.value = noiseIntensity
  }, [noiseIntensity])
  useEffect(() => {
    uniforms.current.uRotation.value = rotation
  }, [rotation])
  // Set new target color when prop changes
  useEffect(() => {
    const [r, g, b] = hexToNormalizedRGB(color)
    targetColor.current.setRGB(r, g, b)
  }, [color])

  if (!isWebGLSupported) return null

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    >
      <Canvas
        gl={{ antialias: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <SilkPlane ref={meshRef} uniforms={uniforms.current} targetColor={targetColor.current} tweenSeconds={tweenSeconds} />
      </Canvas>
    </div>
  )
}


