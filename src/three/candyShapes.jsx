import * as THREE from 'three'

/*
 * Procedural Gummy Gang candy shapes.
 * Heavy geometries are built once at module level and shared by every instance.
 */

export const gummyMat = (color, dim, extra = {}) => ({
  color,
  roughness: 0.12,
  clearcoat: 0.55,
  clearcoatRoughness: 0.25,
  envMapIntensity: 0.7,
  transparent: dim,
  opacity: dim ? 0.85 : 1,
  ...extra,
})

export const sugarMat = (color, dim, extra = {}) => ({
  color,
  roughness: 0.68,
  sheen: 1,
  sheenColor: '#fff6d8',
  sheenRoughness: 0.45,
  envMapIntensity: 0.45,
  transparent: dim,
  opacity: dim ? 0.85 : 1,
  ...extra,
})

/* ---------- watermelon slice (sugar-frosted, 3 color layers) ---------- */

const semiRing = (rOut, rIn) => {
  const shape = new THREE.Shape()
  shape.absarc(0, 0, rOut, 0, Math.PI, false)
  if (rIn > 0) {
    shape.lineTo(-rIn, 0)
    const hole = new THREE.Path()
    hole.absarc(0, 0, rIn, 0, Math.PI, false)
    shape.holes.push(hole)
  }
  shape.closePath()
  return shape
}

const extrudeOpts = { depth: 0.3, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 3, curveSegments: 24 }

// the three layers share ONE coordinate space (concentric semicircles with
// overlapping radii) and get the same translation — no per-mesh offsets, so
// the rind can never detach from the flesh
let melonCache = null
function getMelon() {
  if (!melonCache) {
    melonCache = {
      red: new THREE.ExtrudeGeometry(semiRing(0.8, 0), extrudeOpts),
      white: new THREE.ExtrudeGeometry(semiRing(0.89, 0.76), extrudeOpts),
      green: new THREE.ExtrudeGeometry(semiRing(1, 0.85), extrudeOpts),
    }
    Object.values(melonCache).forEach((g) => g.translate(0, -0.42, -extrudeOpts.depth / 2))
  }
  return melonCache
}

export function WatermelonMesh({ dim }) {
  const { red, white, green } = getMelon()
  return (
    <group scale={0.85}>
      <mesh geometry={red}>
        <meshPhysicalMaterial {...sugarMat('#ff4257', dim)} />
      </mesh>
      <mesh geometry={white}>
        <meshPhysicalMaterial {...sugarMat('#fdf6e3', dim)} />
      </mesh>
      <mesh geometry={green}>
        <meshPhysicalMaterial {...sugarMat('#63c421', dim)} />
      </mesh>
    </group>
  )
}

/* ---------- cherry pair with stems ---------- */

let stemCache = null
function getStems() {
  if (!stemCache) {
    const stem = (from, to, bend) => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(...from),
        new THREE.Vector3(...bend),
        new THREE.Vector3(...to)
      )
      return new THREE.TubeGeometry(curve, 12, 0.06, 6)
    }
    stemCache = [
      stem([-0.33, -0.1, 0], [0, 0.85, 0], [-0.38, 0.5, 0]),
      stem([0.33, -0.18, 0.06], [0, 0.85, 0], [0.42, 0.45, 0.04]),
    ]
  }
  return stemCache
}

export function CherryMesh({ dim }) {
  const stems = getStems()
  const cherry = gummyMat('#d61637', dim, { clearcoat: 1, clearcoatRoughness: 0.12 })
  return (
    <group scale={0.9}>
      <mesh position={[-0.33, -0.32, 0]}>
        <sphereGeometry args={[0.42, 24, 18]} />
        <meshPhysicalMaterial {...cherry} />
      </mesh>
      <mesh position={[0.33, -0.4, 0.06]}>
        <sphereGeometry args={[0.4, 24, 18]} />
        <meshPhysicalMaterial {...cherry} />
      </mesh>
      {stems.map((geo, i) => (
        <mesh key={i} geometry={geo} position={[0, -0.2, 0]}>
          <meshPhysicalMaterial color="#3f8f22" roughness={0.4} transparent={dim} opacity={dim ? 0.85 : 1} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- sweet-heat heart (red top fading to cream base) ---------- */

let heartCache = null
function getHeart() {
  if (!heartCache) {
    const x = 0
    const y = 0
    const shape = new THREE.Shape()
    shape.moveTo(x, y + 0.5)
    shape.bezierCurveTo(x, y + 0.8, x - 0.6, y + 0.9, x - 0.75, y + 0.45)
    shape.bezierCurveTo(x - 0.9, y, x - 0.35, y - 0.5, x, y - 0.85)
    shape.bezierCurveTo(x + 0.35, y - 0.5, x + 0.9, y, x + 0.75, y + 0.45)
    shape.bezierCurveTo(x + 0.6, y + 0.9, x, y + 0.8, x, y + 0.5)
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.07,
      bevelSegments: 3,
      curveSegments: 20,
    })
    geo.center()
    // red top → cream base, like the Sweet Heat gummies
    const top = new THREE.Color('#ff2d55')
    const base = new THREE.Color('#fff1dc')
    const c = new THREE.Color()
    const pos = geo.attributes.position
    const colors = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i += 1) {
      const t = THREE.MathUtils.smoothstep(pos.getY(i), -0.55, 0.25)
      c.copy(base).lerp(top, t)
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    heartCache = geo
  }
  return heartCache
}

export function HeartMesh({ dim }) {
  return (
    <mesh geometry={getHeart()} scale={0.75}>
      <meshPhysicalMaterial vertexColors {...sugarMat('#ffffff', dim)} />
    </mesh>
  )
}

/* ---------- strawberry (frosted red drop + leaf crown) ---------- */

let berryCache = null
function getBerry() {
  if (!berryCache) {
    const profile = []
    const N = 14
    for (let i = 0; i <= N; i += 1) {
      const t = i / N
      // wide shoulders, rounded tip
      const r = 0.62 * Math.sin(Math.PI * (0.12 + 0.88 * t)) * (1 - t * 0.35)
      profile.push(new THREE.Vector2(Math.max(r, 0.001), 0.85 - t * 1.45))
    }
    berryCache = new THREE.LatheGeometry(profile, 20)
  }
  return berryCache
}

export function StrawberryMesh({ dim }) {
  const leaves = [0, 1, 2, 3, 4]
  return (
    <group scale={0.95}>
      <mesh geometry={getBerry()}>
        <meshPhysicalMaterial {...sugarMat('#ff2e44', dim)} />
      </mesh>
      {leaves.map((i) => {
        const a = (i / leaves.length) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.3, 0.82, Math.sin(a) * 0.3]}
            rotation={[Math.PI / 2.6, -a, 0]}
          >
            <coneGeometry args={[0.13, 0.42, 12]} />
            <meshPhysicalMaterial color="#4da32b" roughness={0.45} transparent={dim} opacity={dim ? 0.85 : 1} />
          </mesh>
        )
      })}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.25, 6]} />
        <meshPhysicalMaterial color="#3f8f22" roughness={0.45} transparent={dim} opacity={dim ? 0.85 : 1} />
      </mesh>
    </group>
  )
}

/* ---------- sour belt (wavy rainbow ribbon, 4 sugar stripes) ---------- */

const BELT_COLORS = ['#ff3b3b', '#ffc93c', '#6fce25', '#a44bc0']

let beltCache = null
function getBelt() {
  if (!beltCache) {
    const pts = []
    const N = 24
    for (let i = 0; i <= N; i += 1) {
      const t = i / N
      pts.push(new THREE.Vector3((t - 0.5) * 2.6, Math.sin(t * Math.PI * 1.8) * 0.34, 0))
    }
    const path = new THREE.CatmullRomCurve3(pts)
    const stripeW = 0.16
    beltCache = BELT_COLORS.map((_, i) => {
      const y0 = (i - BELT_COLORS.length / 2) * stripeW
      const shape = new THREE.Shape()
      shape.moveTo(0.03, y0)
      shape.lineTo(0.03, y0 + stripeW)
      shape.lineTo(-0.03, y0 + stripeW)
      shape.lineTo(-0.03, y0)
      shape.closePath()
      return new THREE.ExtrudeGeometry(shape, { steps: 60, depth: 1, extrudePath: path, bevelEnabled: false })
    })
  }
  return beltCache
}

export function BeltMesh({ dim }) {
  const stripes = getBelt()
  return (
    <group scale={0.8}>
      {stripes.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshPhysicalMaterial {...sugarMat(BELT_COLORS[i], dim, { roughness: 0.75 })} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- gummy bear (stylized primitive assembly) ---------- */

// part list shared by the field bears (own material) and the giant
// chapter bear (single shared material whose color morphs per flavor)
export const BEAR_PARTS = [
  { position: [0, -0.25, 0], scale: [0.62, 0.72, 0.48], sphere: [1, 24, 18] }, // body
  { position: [0, -0.32, 0.3], scale: [0.42, 0.5, 0.28], sphere: [1, 18, 14] }, // belly
  { position: [0, 0.72, 0.05], scale: [0.48, 0.44, 0.42], sphere: [1, 24, 18] }, // head
  { position: [0, 0.62, 0.42], scale: [0.22, 0.16, 0.14], sphere: [1, 14, 10] }, // muzzle
  { position: [-0.36, 1.08, 0], scale: [0.17, 0.17, 0.12], sphere: [1, 14, 10] }, // ear
  { position: [0.36, 1.08, 0], scale: [0.17, 0.17, 0.12], sphere: [1, 14, 10] }, // ear
  { position: [-0.6, 0.05, 0.12], rotation: [0, 0, 0.9], capsule: [0.16, 0.34, 6, 10] }, // arm
  { position: [0.6, 0.05, 0.12], rotation: [0, 0, -0.9], capsule: [0.16, 0.34, 6, 10] }, // arm
  { position: [-0.32, -0.95, 0.18], rotation: [0.5, 0, 0.25], capsule: [0.18, 0.3, 6, 10] }, // leg
  { position: [0.32, -0.95, 0.18], rotation: [0.5, 0, -0.25], capsule: [0.18, 0.3, 6, 10] }, // leg
]

export function BearParts({ material, children }) {
  return (
    <group scale={0.85} position={[0, -0.1, 0]}>
      {BEAR_PARTS.map((part, i) => (
        <mesh key={i} position={part.position} scale={part.scale} rotation={part.rotation}>
          {part.sphere ? <sphereGeometry args={part.sphere} /> : <capsuleGeometry args={part.capsule} />}
          {material ? <primitive object={material} attach="material" /> : children}
        </mesh>
      ))}
    </group>
  )
}

export function BearMesh({ color = '#ff8a3c', dim }) {
  const mat = gummyMat(color, dim, { clearcoat: 0.8, clearcoatRoughness: 0.18 })
  return (
    <BearParts>
      <meshPhysicalMaterial {...mat} />
    </BearParts>
  )
}

/* ---------- gummy teeth (denture: coral lips + two rows of white teeth) ---------- */

export function TeethMesh({ dim }) {
  const gum = gummyMat('#ff7d78', dim, { clearcoat: 0.9, clearcoatRoughness: 0.15 })
  const tooth = gummyMat('#fffdf6', dim, { roughness: 0.25 })
  const xs = [-0.44, -0.22, 0, 0.22, 0.44]
  return (
    <group scale={0.9}>
      {/* upper + lower lips */}
      <mesh position={[0, 0.34, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.19, 1.05, 6, 14]} />
        <meshPhysicalMaterial {...gum} />
      </mesh>
      <mesh position={[0, -0.34, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.19, 1.05, 6, 14]} />
        <meshPhysicalMaterial {...gum} />
      </mesh>
      {/* two rows of teeth */}
      {xs.map((x) => (
        <group key={x} position={[x, 0, 0.02]}>
          <mesh position={[0, 0.1, 0]} scale={[0.155, 0.2, 0.13]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshPhysicalMaterial {...tooth} />
          </mesh>
          <mesh position={[0, -0.1, 0]} scale={[0.145, 0.18, 0.12]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshPhysicalMaterial {...tooth} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
