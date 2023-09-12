import * as THREE from 'three';
import data from './position.json'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import waternormals from './assets/waternormals.jpg'


let camera, scene, renderer;
let controls, water, sun;
const loader = new GLTFLoader();

  class Boat {
    constructor(){
      let boat_position = new THREE.Vector3(0,0,0)
      loader.load("assets/boat/scene.gltf", (gltf) => {
        scene.add( gltf.scene )
        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.position.set(-17.3285, 1, -29.7828);
        gltf.scene.rotation.y = -1.5;
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

  function init() {
      // Create the WebGL renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ReinhardToneMapping;
      renderer.setClearColor(0x000000);
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.style.zIndex = '-1';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.top = '0';
      document.body.appendChild(renderer.domElement);

      // Create the scene
      scene = new THREE.Scene();

      // Create the camera
      camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
      camera.position.set(1, 3, -100);
      
      // Create the sun vector
      sun = new THREE.Vector3();

      // Create the water geometry
      const waterGeometry = new THREE.PlaneGeometry(3000, 3000);

      // Create the water object
      water = new Water(
          waterGeometry,
          {
              textureWidth: 512,
              textureHeight: 512,
              waterNormals: new THREE.TextureLoader().load(
                  waternormals, function (texture) {
                  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
              }),
              sunDirection: new THREE.Vector3(),
              sunColor: 0xffffff,
              waterColor: 0x001e0f,
              distortionScale: 3.7,
              fog: scene.fog !== undefined
          }
      );

      // Set the rotation of the water
      water.rotation.x = -Math.PI / 2;

      // Add the water to the scene
      scene.add(water);

      // Create the sky object
      const sky = new Sky();
      sky.scale.setScalar(10000);
      scene.add(sky);

      // Set the parameters for the sky
      const skyUniforms = sky.material.uniforms;
      skyUniforms['turbidity'].value = 10;
      skyUniforms['rayleigh'].value = 2;
      skyUniforms['mieCoefficient'].value = 0.005;
      skyUniforms['mieDirectionalG'].value = 0.8;

      // Set the parameters for the sun
      const parameters = {
          elevation: 2,
          azimuth: 180
      };

      // Create the PMREM generator
      const pmremGenerator = new THREE.PMREMGenerator(renderer);

      // Update the position of the sun and sky
      function updateSun() {
          const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
          const theta = THREE.MathUtils.degToRad(parameters.azimuth);
          sun.setFromSphericalCoords(1, phi, theta);
          sky.material.uniforms['sunPosition'].value.copy(sun);
          water.material.uniforms['sunDirection'].value.copy(sun).normalize();
          scene.environment = pmremGenerator.fromScene(sky).texture;
      }

      // Call the updateSun function
      updateSun();

      // Create orbit controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.495;
      controls.target.set(0, 10, 0);
      controls.minDistance = 40.0;
      controls.maxDistance = 200.0;
      controls.update();


      // Add event listener for window resize
      window.addEventListener('resize', onWindowResize);

      const cubeSize = 20;
      const indicatorDistance = 200; // Adjust the distance from the center

      const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const northIndicator = new THREE.Mesh(cubeGeometry, cubeMaterial);

      // Position the cube at the north direction
      northIndicator.position.set(0, 50, indicatorDistance);

      scene.add(northIndicator);
      // Start the animation loop
    //   const points = [];
    //     points.push(
    //         new THREE.Vector3(20, 10, 1),
    //         new THREE.Vector3(10, 2, 1),
    //         new THREE.Vector3(30, 2, 1),
    //         new THREE.Vector3(30, 2, 2)
    //         );
    //     const geometry = new THREE.BufferGeometry().setFromPoints( points );
    //     const line = new THREE.Line(
    //         geometry,
    //         new THREE.LineBasicMaterial({
    //             color: 0x0000ff
    //         })
    //     );
    //     scene.add(line);

    const points = [];


    for (const item of data) {
  
        const xPosition = item["X_Position"];
        const yPosition = item["Y_Position"];
        points.push(new THREE.Vector3(xPosition, 1, yPosition))
    }

    // points.push(

        
  
        // new THREE.Vector3(-17.3285, 1, -29.7828),
        // new THREE.Vector3(20, 1, 0),
        // new THREE.Vector3(30, 1, 0),
        // new THREE.Vector3(40, 1, 0),
        // new THREE.Vector3(50, 1, 0),
        // new THREE.Vector3(60, 1, 0),
    
        
        
        // );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
            color: 0x0000ff
        })
    );
    scene.add(line);
      animate();

  }

  // Function to handle window resize
  function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // Animation loop
  function animate() {
      requestAnimationFrame(animate);
      render();
      // stats.update();
      controls.update();
  }

  // Render function
  function render() {
      const time = performance.now() * 0.001;
    
      water.material.uniforms['time'].value += 1.0 / 60.0;
      renderer.render(scene, camera);
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
      boat.boat.position.set(x,1,y)
      index++
      // console.log(data);
    }
    setInterval(loop, 100)
  }


  init();
  replay()