var camera, scene, renderer;
var geometry, material, mesh;
var keyboard = {};
var player = { height:1,speed:0.1,turnSpeed:Math.PI*0.01};
var meshFloor,ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;
//var particleSystem;
//var particleCount = 50000;
//var particles;
var particleCount = 2000;
var particles;

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

init();
animate();

function simulateRain(){
	  var pCount = particleCount;
	  while (pCount--) {
		var particle = particles.vertices[pCount];
		if (particle.y < -200) {
		  particle.y = 200;
		  particle.velocity.y = -1.2;
		}

		particle.velocity.y -= Math.random() * .02;

		particle.y += particle.velocity.y;
	  }

	  particles.verticesNeedUpdate = true;
};

function init()
	{

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	//camera.position.z = 1;

	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry( 0.5,0.5,0.5 );
	material = new THREE.MeshPhongMaterial({color:0x00ffff, wireframe:false});

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.y += 1;
	mesh.receiveShadow = true;
	mesh.castShadow = true;
	scene.add( mesh );
	
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(100,100,100,100),
		new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
	);
	meshFloor.rotation.x -= Math.PI /2;
	meshFloor.receiveShadow = true;
	scene.add( meshFloor );
	
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	
	scene.add(light);
	
	
	var textureLoader = new THREE.TextureLoader();
	textureLoader.crossOrigin = '';
	
	crateTexture = new textureLoader.load("crate0_diffuse.png");
	
	crate= new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshPhongMaterial({
			color:0xffffff,
			map:crateTexture
			})
	);
	
	scene.add(crate);
	crate.position.y += 0.5;
	crate.position.x += 2;
	crate.castShadow = true;
	crate.receiveShadow = true;
	
	
	var loader = new THREE.GLTFLoader();
	for(var i=100;i<207;i++){
		loader.load("naturePack_'+i+'.gltf", function(gltf){
	
			gltf.scene.position.x += 5;
			scene.add(gltf.scene);
			});	
	}
	
	
	// particles
	/*particles = new THREE.Geometry;
	
	for (var p = 0; p< particleCount; p++) {
		var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
		// create a velocity vector
		particle.velocity = new THREE.Vector3(
		  0,              // x
		  -Math.random(), // y: random vel
		  0);             // z
		particles.vertices.push(particle);
	}
	
	var particleMaterial = new THREE.ParticleBasicMaterial({ 
	color: 0xffffff, 
	size: 0.09,
	map: THREE.ImageUtils.loadTexture(
		"particle.png"
	  ),
	  blending: THREE.AdditiveBlending,
	  transparent: true	});
	
	particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
	particleSystem.sortParticles = true;
	scene.add(particleSystem);
	*/
	console.log("Particle cloud");
	
	var pMaterial = new THREE.PointsMaterial({
	   color: 0xFFFFFF,
	   size: 3,
	   map: THREE.ImageUtils.loadTexture(
		"cTALZ.png"
	  ),
	   blending: THREE.AdditiveBlending,
	   depthTest: false,
	   transparent: true
	});
	particles = new THREE.Geometry;

	for (var i = 0; i < particleCount; i++) {
		var pX = Math.random()*1000 - 500,
		pY = Math.random()*500 - 250,
		pZ = Math.random()*1000 - 500,
		particle = new THREE.Vector3(pX, pY, pZ);
		particle.velocity = {};
		particle.velocity.y = -1;
		particles.vertices.push(particle);
	}

	var particleSystem = new THREE.PointCloud(particles, pMaterial);
	particleSystem.position.y = 200;
	scene.add(particleSystem);
	
	/*var cloud = new THREE.Cloud( 0xeeeeee );

	cloud.scale.set( 3, 3, 3 );
	cloud.position.set( 0, 1, 0 );
	cloud.rotation.set( Math.PI * 0.25, Math.PI * 0.5, 0 );

	scene.add( cloud );
*/
	
	
	camera.position.set(0,player.height,-5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	
	// Shadow
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild( renderer.domElement );

	}


	var step = 0;


	


function animate() {

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;
	
	
	
	  // add some rotation to the system
  //particleSystem.rotation.y += 0.01;
  //particleSystem.rotation.x -= 0.01;

  /*var pCount = particleCount;
  while (pCount--) {

    // get the particle
    var particle =
      particles.vertices[pCount];

    // check if we need to reset
    if (particle.y < -200) {
      particle.y = 200;
      particle.velocity.y = 0;
    }

    // update the velocity with
    // a splat of randomniz
    //particle.velocity.y -= Math.random() * 0.007;

    // and the position
    particle.add(
      particle.velocity);
  }

  // flag to the particle system
  // that we've changed its vertices.
  particleSystem.
    geometry.
    __dirtyVertices = true;
	*/
	
	if(keyboard[87]){ // w key
		camera.position.x -= Math.sin(camera.rotation.y)*player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y)*player.speed;
	}
	
	if(keyboard[83]){ // s key
		camera.position.x += Math.sin(camera.rotation.y)*player.speed;
		camera.position.z += -Math.cos(camera.rotation.y)*player.speed;
	}
	
	if(keyboard[65]){ // A key
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2)*player.speed;
		camera.position.z += -Math.cos(camera.rotation.y+ Math.PI/2)*player.speed;
	}
	
	if(keyboard[68]){ // D key
		camera.position.x -= Math.sin(camera.rotation.y+ Math.PI/2)*player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y+ Math.PI/2)*player.speed;
	}
	
	
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
	}

	//renderer.render( scene, camera );
	
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
  
  //camera.position.y =  Math.sin((step / 400) * Math.PI * 4) * 5;
  //camera.position.x =  Math.sin((step / 400) * Math.PI * 2) * 10;
  //camera.lookAt(new THREE.Vector3( 0, 45, 200 ));
  //camera.rotation.z = Math.sin((step / 400) * Math.PI * 2) * Math.PI / 200;
	
	simulateRain();
  
  step++;
  step = step % 400;

}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}
