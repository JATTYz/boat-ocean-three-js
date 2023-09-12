import * as THREE from 'three';
import data from './position.json'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


let camera, scene, renderer;
let controls, water, sun;
let position;
const loader = new GLTFLoader();

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Boat {
  constructor(){
    let boat_position = new THREE.Vector3(0,0,0)
    loader.load("assets/boat/scene.gltf", (gltf) => {
      scene.add( gltf.scene )
      gltf.scene.scale.set(1, 1, 1)
      gltf.scene.position.set(5,3,50)
      gltf.scene.rotation.y = -1

      this.boat = gltf.scene
      this.speed = {
        vel: 0,
        rot: 0
      }
    })
  }

  stop(){
    this.speed.vel = 0
    this.speed.rot = 0
  }

  update(){
    if(this.boat){
      this.boat.rotation.y += this.speed.rot
      this.boat.translateX(this.speed.vel)
      
      //print position x,y,z
      // console.log(this.boat.position);
    }
  }

  position(){
    return this.boat.position
  }
}

const boat = new Boat()

// class Opera_House{
//   constructor(){
//     loader.load("assets/test/scene.gltf", (gltf) => {
//       scene.add( gltf.scene )
//       gltf.scene.scale.set(5, 5, 5)
//       gltf.scene.position.set(-120,3,-100)
      

//       this.opera = gltf.scene
//     })
//   }
// }
// const opera = new Opera_House()

// class Harbour{
//   constructor(){
//     loader.load("assets/test3/scene.gltf", (gltf) => {
//       scene.add( gltf.scene )
//       gltf.scene.scale.set(1, 1, 1)
//       gltf.scene.position.set(150,10,-250)
//       gltf.scene.rotateY(-1.5)
//       this.harbour = gltf.scene
//     })
//   }
// }
// const habour = new Harbour()

init();
animate();
replay();
async function init() {
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild( renderer.domElement );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
  camera.position.x = 15;
  camera.position.y = 6;
  camera.position.z = 15;
  // camera.lookAt(scene.position);
  

  sun = new THREE.Vector3();

  // Water

  const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

  water = new Water(
    waterGeometry,
    {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load( 'assets/waternormals.jpg', function ( texture ) {

        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

      } ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xffffff,
      waterColor: 0x001e0f,
      distortionScale: 3.7,
      fog: scene.fog !== undefined
    }
  );

  water.rotation.x = - Math.PI / 2;

  scene.add( water );

  // Skybox

  const sky = new Sky();
  sky.scale.setScalar( 10000 );
  scene.add( sky );

  const skyUniforms = sky.material.uniforms;

  skyUniforms[ 'turbidity' ].value = 10;
  skyUniforms[ 'rayleigh' ].value = 2;
  skyUniforms[ 'mieCoefficient' ].value = 0.005;
  skyUniforms[ 'mieDirectionalG' ].value = 0.8;

  const parameters = {
    elevation: 2,
    azimuth: 180
  };

  const pmremGenerator = new THREE.PMREMGenerator( renderer );

  function updateSun() {

    const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
    const theta = THREE.MathUtils.degToRad( parameters.azimuth );

    sun.setFromSphericalCoords( 1, phi, theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    scene.environment = pmremGenerator.fromScene( sky ).texture;

  }

  updateSun();

  controls = new OrbitControls( camera, renderer.domElement );
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set( 0, 10, 0 );
  controls.minDistance = 40.0;
  controls.maxDistance = 200.0;
  controls.update();

  window.addEventListener( 'resize', onWindowResize );

  window.addEventListener( 'keydown', function(e){
    if(e.key == "ArrowUp"){
      boat.speed.vel = 1
    }
    if(e.key == "ArrowDown"){
      boat.speed.vel = -1
    }
    if(e.key == "ArrowRight"){
      boat.speed.rot = -0.1
    }
    if(e.key == "ArrowLeft"){
      boat.speed.rot = 0.1
    }
  })

  window.addEventListener( 'keyup', function(e){
    boat.stop()
  })

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
  requestAnimationFrame( animate );
  render();
  boat.update()
  // camera.position.copy(boat.position().clone().add(new THREE.Vector3(40, 20, 50)));
  // camera.lookAt(boat.position());
  // console.log(boat.position());

}

function render() {
  water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

  renderer.render( scene, camera );
}

function replay(){
  const head_angle = [-116.1574527,
    -116.2330831,
    -116.2875141,
    -116.3751766,
    -116.4571096,
    -116.5441992,
    -116.6318617,
    -116.7063462,
    -116.7928629,
    -116.8851091,
    -116.9664691,
    -117.0478291,
    -117.1320539,
    -117.2288838
    ]
  
    

  const data_x = [
    -17.3285,
    -17.2433,
    -17.1816,
    -17.0819,
    -16.9883,
    -16.8879,
    -16.7872,
    -16.7005,
    -16.6002,
    -16.492,
    -16.3967,
    -16.3011,
    -16.2019,
    -16.0867,
    -15.979,
    -15.8732,
    -15.7738,
    -15.6821
  ] 
 
  let x_position = []
  let y_position = []
  for (const item of data) {

      const xPosition = item["X_Position"];
      const yPosition = item["Y_Position"];
      x_position.push(xPosition)
      y_position.push(yPosition)
  }

  
  let index = 0;

  function loop(){
    let x = x_position[index]
    let y = y_position[index]
    // let x = data_x[index]
    // let y = data_y[index]
    boat.boat.position.set(x,3,y)
    index++
    // console.log(data);
  }
  setInterval(loop, 10)
}
