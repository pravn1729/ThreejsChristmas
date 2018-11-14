var camera, scene, renderer;
var geometry, material, mesh;
var keyboard = {};
var player = { height:1,speed:0.1,turnSpeed:Math.PI*0.01};
var meshFloor,ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;


window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

init();
animate();

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
		new THREE.PlaneGeometry(20,20,10,10),
		new THREE.MeshPhongMaterial({color:0xcdabff, wireframe:false})
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

	loader.load("naturePack_107.gltf", function(gltf){
	
	gltf.scene.position.x += 5;
	scene.add(gltf.scene);
	});
	
	
	// particles
	var particles = new THREE.Geometry;
	
	for (var p = 0; p< 10000; p++) {
		var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
		particles.vertices.push(particle);
	}
	
	var particleMaterial = new THREE.ParticleBasicMaterial({ 
	color: 0xffffff, 
	size: 0.2,
	map: THREE.ImageUtils.loadTexture(
		"particle.png"
	  ),
	  blending: THREE.AdditiveBlending,
	  transparent: true	});
	
	var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
	particleSystem.sortParticles = true;
	scene.add(particleSystem);
	
	
	
	camera.position.set(0,player.height,-5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	
	// Shadow
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild( renderer.domElement );

	}

function animate() {

	requestAnimationFrame( animate );

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;
	
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

	renderer.render( scene, camera );

}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}
