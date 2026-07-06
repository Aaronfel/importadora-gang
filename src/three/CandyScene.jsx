import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll, Float, Sparkles, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import {
  WatermelonMesh,
  CherryMesh,
  HeartMesh,
  StrawberryMesh,
  BeltMesh,
  BearMesh,
  BearParts,
  TeethMesh,
} from './candyShapes.jsx'
import { CHAPTERS, chapterProgress, chapterIndex } from '../ui/FlavorChapters.jsx'

const CANDY_COLORS = ['#e23a3a', '#ff4f9a', '#7b2d8e', '#57b8e4', '#7cc024', '#ffc93c', '#ff8a3c']

// deterministic pseudo-random so the scene is stable across renders
const rand = (seed) => {
  const x = Math.sin(seed * 999.7) * 43758.5453
  return x - Math.floor(x)
}

/* ------------------------------------------------------------------ */
/* Procedural candy geometry — real Gummy Gang shapes                  */
/* ------------------------------------------------------------------ */

// Gummy worm: ribbed wavy tube with a two-flavor color gradient.
// Built once per variant and shared by every worm on screen.
let wormCache = null
function getWorms() {
  if (wormCache) return wormCache

  const build = (hexA, hexB) => {
    const N = 40
    const pts = []
    for (let i = 0; i <= N; i += 1) {
      const t = i / N
      pts.push(
        new THREE.Vector3(
          (t - 0.5) * 2.4,
          Math.sin(t * Math.PI * 2.1) * 0.3,
          Math.cos(t * Math.PI * 1.5) * 0.16
        )
      )
    }
    const curve = new THREE.CatmullRomCurve3(pts)
    const geo = new THREE.TubeGeometry(curve, 90, 0.17, 12)

    const uv = geo.attributes.uv
    const pos = geo.attributes.position
    const nor = geo.attributes.normal

    // ribbed body, like the segments of a real gummy worm
    for (let i = 0; i < pos.count; i += 1) {
      const amp = 0.018 * Math.sin(uv.getX(i) * Math.PI * 2 * 16)
      pos.setXYZ(
        i,
        pos.getX(i) + nor.getX(i) * amp,
        pos.getY(i) + nor.getY(i) * amp,
        pos.getZ(i) + nor.getZ(i) * amp
      )
    }

    // two-flavor gradient along the body
    const a = new THREE.Color(hexA)
    const b = new THREE.Color(hexB)
    const c = new THREE.Color()
    const colors = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i += 1) {
      c.copy(a).lerp(b, THREE.MathUtils.smoothstep(uv.getX(i), 0.42, 0.58))
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.computeVertexNormals()

    return { geo, ends: [curve.getPoint(0), curve.getPoint(1)], endColors: [hexA, hexB] }
  }

  wormCache = [build('#ff2323', '#ffd21f'), build('#ff7a1f', '#5fd41f')]
  return wormCache
}

function WormMesh({ variant = 0, dim }) {
  const { geo, ends, endColors } = getWorms()[variant % 2]
  const matProps = {
    roughness: 0.12,
    clearcoat: 0.55,
    clearcoatRoughness: 0.25,
    envMapIntensity: 0.7,
    transparent: dim,
    opacity: dim ? 0.85 : 1,
  }
  return (
    <group>
      <mesh geometry={geo}>
        <meshPhysicalMaterial vertexColors {...matProps} />
      </mesh>
      <mesh position={ends[0].toArray()}>
        <sphereGeometry args={[0.165, 12, 12]} />
        <meshPhysicalMaterial color={endColors[0]} {...matProps} />
      </mesh>
      <mesh position={ends[1].toArray()}>
        <sphereGeometry args={[0.165, 12, 12]} />
        <meshPhysicalMaterial color={endColors[1]} {...matProps} />
      </mesh>
    </group>
  )
}

// Sweet Banana: sugar-frosted curved gummy (partial torus + rounded tips)
const BANANA = { R: 0.72, r: 0.23, arc: Math.PI * 0.95 }
function BananaMesh({ dim }) {
  const sugar = {
    color: '#ffd23a',
    roughness: 0.68,
    sheen: 1,
    sheenColor: '#fff6d8',
    sheenRoughness: 0.45,
    envMapIntensity: 0.45,
    transparent: dim,
    opacity: dim ? 0.85 : 1,
  }
  const { R, r, arc } = BANANA
  return (
    <group>
      <mesh>
        <torusGeometry args={[R, r, 10, 22, arc]} />
        <meshPhysicalMaterial {...sugar} />
      </mesh>
      <mesh position={[R, 0, 0]} scale={[1, 0.85, 1]}>
        <sphereGeometry args={[r, 10, 10]} />
        <meshPhysicalMaterial {...sugar} />
      </mesh>
      <mesh position={[R * Math.cos(arc), R * Math.sin(arc), 0]} scale={[1, 0.85, 1]}>
        <sphereGeometry args={[r, 10, 10]} />
        <meshPhysicalMaterial {...sugar} />
      </mesh>
    </group>
  )
}

// Fried Egg gummy: two flattened white blobs + glossy yolk
function EggMesh({ dim }) {
  const white = {
    color: '#fff8ef',
    roughness: 0.38,
    clearcoat: 0.35,
    clearcoatRoughness: 0.35,
    envMapIntensity: 0.6,
    transparent: dim,
    opacity: dim ? 0.9 : 1,
  }
  return (
    <group>
      <mesh scale={[1, 0.28, 1.22]}>
        <sphereGeometry args={[0.55, 24, 16]} />
        <meshPhysicalMaterial {...white} />
      </mesh>
      <mesh position={[0.3, 0, -0.28]} scale={[0.72, 0.24, 0.78]}>
        <sphereGeometry args={[0.55, 20, 14]} />
        <meshPhysicalMaterial {...white} />
      </mesh>
      <mesh position={[0.04, 0.1, 0.04]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.3, 20, 14]} />
        <meshPhysicalMaterial
          color="#ff9500"
          emissive="#c96a00"
          emissiveIntensity={0.12}
          roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1}
          transparent={dim}
          opacity={dim ? 0.9 : 1}
        />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */

function BasicGeometry({ kind }) {
  switch (kind) {
    case 'torus':
      return <torusGeometry args={[1, 0.45, 24, 48]} />
    case 'knot':
      return <torusKnotGeometry args={[0.9, 0.32, 100, 16]} />
    case 'capsule':
      return <capsuleGeometry args={[0.6, 1.1, 8, 16]} />
    default:
      return <sphereGeometry args={[1, 32, 32]} />
  }
}

const BEAR_COLORS = ['#e23a3a', '#ff8a3c', '#ffc93c', '#7cc024']

function CandyShape({ kind, color, dim, seed }) {
  if (kind === 'worm') return <WormMesh variant={Math.round(seed) % 2} dim={dim} />
  if (kind === 'banana') return <BananaMesh dim={dim} />
  if (kind === 'egg') return <EggMesh dim={dim} />
  if (kind === 'watermelon') return <WatermelonMesh dim={dim} />
  if (kind === 'cherry') return <CherryMesh dim={dim} />
  if (kind === 'heart') return <HeartMesh dim={dim} />
  if (kind === 'strawberry') return <StrawberryMesh dim={dim} />
  if (kind === 'belt') return <BeltMesh dim={dim} />
  if (kind === 'bear') return <BearMesh color={BEAR_COLORS[Math.round(seed) % BEAR_COLORS.length]} dim={dim} />
  if (kind === 'teeth') return <TeethMesh dim={dim} />
  return (
    <mesh>
      <BasicGeometry kind={kind} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.22}
        metalness={0.02}
        clearcoat={0.7}
        clearcoatRoughness={0.25}
        envMapIntensity={0.9}
        transparent={dim}
        opacity={dim ? 0.85 : 1}
      />
    </mesh>
  )
}

// shapes that read best mostly face-on: tumble gently instead of spinning freely
const GENTLE_KINDS = new Set(['egg', 'watermelon', 'heart', 'teeth', 'bear', 'belt', 'cherry', 'strawberry'])

// relative size boost so detailed shapes stay recognizable at field scale
const KIND_SCALE = { watermelon: 1.3, heart: 1.25, teeth: 1.2, cherry: 1.15, strawberry: 1.15, bear: 1.1, belt: 1.15 }

function Candy({ kind, color, position, scale, seed, reduced, dim = false }) {
  const ref = useRef()
  const gentle = GENTLE_KINDS.has(kind)

  useFrame((_, delta) => {
    if (reduced || !ref.current) return
    ref.current.rotation.x += delta * (gentle ? 0.05 : 0.1 + rand(seed) * 0.3)
    ref.current.rotation.y += delta * (0.15 + rand(seed + 1) * 0.35)
  })

  return (
    <Float
      speed={reduced ? 0 : 1 + rand(seed + 2) * 1.2}
      rotationIntensity={reduced ? 0 : 0.35}
      floatIntensity={reduced ? 0 : 0.9}
    >
      <group
        ref={ref}
        position={position}
        scale={scale}
        rotation={
          gentle
            ? [rand(seed + 3) * 0.7 - 0.35, rand(seed + 4) * Math.PI, rand(seed + 8) * 0.7 - 0.35]
            : [rand(seed + 3) * Math.PI, rand(seed + 4) * Math.PI, 0]
        }
      >
        <CandyShape kind={kind} color={color} dim={dim} seed={seed} />
      </group>
    </Float>
  )
}

// Giant flavor-chapter gummy: pinned on screen while the runway section
// scrolls by; rotates with progress, color-morphs per chapter, and one
// flavor accent orbits it.
function GiantGummy({ isMobile, reduced }) {
  const group = useRef()
  const accentRefs = [useRef(), useRef(), useRef()]

  const bearMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(CHAPTERS[0].bear),
        roughness: 0.12,
        clearcoat: 0.8,
        clearcoatRoughness: 0.18,
        envMapIntensity: 0.7,
      }),
    []
  )
  const targetColor = useMemo(() => new THREE.Color(CHAPTERS[0].bear), [])

  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const p = chapterProgress()
    if (p === null) {
      g.visible = false
      return
    }
    g.visible = true
    const ci = chapterIndex(p)

    // enter/exit envelope + spin
    const enter = THREE.MathUtils.smoothstep(p, 0, 0.1)
    const exit = 1 - THREE.MathUtils.smoothstep(p, 0.9, 1)
    const base = isMobile ? 0.85 : 1.2
    g.scale.setScalar(Math.max(base * Math.min(enter, exit), 0.0001))
    if (reduced) {
      g.rotation.set(0, 0.35, 0)
    } else {
      g.rotation.y = p * Math.PI * 2.5
      g.rotation.x = Math.sin(p * Math.PI * 2) * 0.1
    }

    targetColor.set(CHAPTERS[ci].bear)
    bearMaterial.color.lerp(targetColor, reduced ? 1 : Math.min(1, delta * 4))

    accentRefs.forEach((ref, i) => {
      if (!ref.current) return
      const target = i === ci ? (isMobile ? 0.5 : 0.55) : 0.0001
      const s = THREE.MathUtils.damp(ref.current.scale.x || 0.0001, target, 5, delta)
      ref.current.scale.setScalar(s)
    })
  })

  const accentPos = isMobile ? [1.25, 0.8, 0.4] : [1.8, 0.8, 0.4]

  return (
    <group ref={group} position={[0, -0.55, 1.1]} visible={false}>
      <BearParts material={bearMaterial} />
      <group ref={accentRefs[0]} position={accentPos} scale={0.0001}>
        <WatermelonMesh />
      </group>
      <group ref={accentRefs[1]} position={[-accentPos[0], accentPos[1], accentPos[2]]} scale={0.0001}>
        <TeethMesh />
      </group>
      <group ref={accentRefs[2]} position={accentPos} scale={0.0001}>
        <BananaMesh />
      </group>
    </group>
  )
}

// speed = how many world-units the layer climbs across the full scroll
// xMin keeps candies out of the central text column
const LAYERS = [
  { speed: 16, xMin: 2.6, xSpread: 3.2, zRange: [0.2, 1.4], sRange: [0.5, 0.85] }, // near
  { speed: 10, xMin: 2.1, xSpread: 2.6, zRange: [-4, -2], sRange: [0.4, 0.7] }, // mid
  { speed: 6, xMin: 1.4, xSpread: 2.4, zRange: [-9, -6], sRange: [0.28, 0.5] }, // far
]

const KINDS = [
  'worm', 'bear', 'watermelon', 'sphere', 'heart', 'banana', 'cherry', 'torus',
  'strawberry', 'egg', 'belt', 'teeth', 'knot', 'worm', 'bear', 'watermelon',
]

export default function CandyScene({ isMobile, reduced }) {
  const scroll = useScroll()
  const layerRefs = [useRef(), useRef(), useRef()]

  const layers = useMemo(() => {
    const count = isMobile ? 15 : 27
    const result = [[], [], []]
    for (let i = 0; i < count; i += 1) {
      const li = i % 3
      const layer = LAYERS[li]
      const seed = i * 7.31 + li * 13.7
      const side = i % 2 === 0 ? 1 : -1
      // spread candies from just below the hero all the way down the scroll run
      const y = 2.5 - (i / count) * (layer.speed + 9) - rand(seed) * 2
      result[li].push({
        kind: KINDS[i % KINDS.length],
        color: CANDY_COLORS[i % CANDY_COLORS.length],
        position: [
          side * (layer.xMin + rand(seed + 5) * layer.xSpread),
          y,
          THREE.MathUtils.lerp(layer.zRange[0], layer.zRange[1], rand(seed + 6)),
        ],
        scale:
          THREE.MathUtils.lerp(layer.sRange[0], layer.sRange[1], rand(seed + 7)) *
          (KIND_SCALE[KINDS[i % KINDS.length]] ?? 1),
        seed,
        dim: li === 2,
      })
    }
    return result
  }, [isMobile])

  useFrame((state, delta) => {
    const offset = scroll?.offset ?? 0

    layerRefs.forEach((ref, i) => {
      if (!ref.current) return
      ref.current.position.y = offset * LAYERS[i].speed
      ref.current.rotation.z = offset * 0.12 * (i % 2 === 0 ? 1 : -1)
    })

    if (reduced) return
    const cam = state.camera
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.7, 3, delta)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, state.pointer.y * 0.4, 3, delta)
    cam.position.z = THREE.MathUtils.damp(cam.position.z, 9 - offset * 3.2, 3, delta)
    cam.lookAt(0, 0, 0)
  })

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 6]} intensity={1.1} />

      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} position={[0, 5, 5]} scale={[10, 10, 1]} color="#ffffff" />
        <Lightformer intensity={1.3} position={[-5, 2, 3]} scale={[6, 6, 1]} color="#ffd1e8" />
        <Lightformer intensity={1.1} position={[5, -2, 2]} scale={[6, 6, 1]} color="#d1ecff" />
      </Environment>

      <GiantGummy isMobile={isMobile} reduced={reduced} />

      {/* hero flank pieces — live in the near layer so they sweep away quickly */}
      <group ref={layerRefs[0]}>
        <Candy kind="worm" color="#e23a3a" position={[-3.9, -0.4, 1.2]} scale={1.35} seed={100} reduced={reduced} />
        <Candy kind="bear" color="#e23a3a" position={[3.9, 1.1, 0.5]} scale={1.05} seed={104} reduced={reduced} />
        <Candy kind="egg" color="#ffc93c" position={[3.6, -1.8, 1]} scale={1.4} seed={105} reduced={reduced} />
        {layers[0].map((c) => (
          <Candy key={c.seed} {...c} reduced={reduced} />
        ))}
      </group>

      <group ref={layerRefs[1]}>
        {layers[1].map((c) => (
          <Candy key={c.seed} {...c} reduced={reduced} />
        ))}
      </group>

      <group ref={layerRefs[2]}>
        {layers[2].map((c) => (
          <Candy key={c.seed} {...c} reduced={reduced} />
        ))}
        <Sparkles
          count={isMobile ? 30 : 90}
          scale={[16, 22, 8]}
          position={[0, -6, -4]}
          size={3}
          speed={reduced ? 0 : 0.4}
          opacity={0.5}
          color="#ffd9ec"
        />
      </group>
    </>
  )
}
