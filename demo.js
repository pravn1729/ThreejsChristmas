var camera, scene, renderer;
var geometry, material, mesh;
var keyboard = {};
var player = { height:1,speed:0.1,turnSpeed:Math.PI*0.01};
var meshFloor,ambientLight, light;

var crate, crateTexture, crateNormalMap, crateBumpMap;
//var particleSystem;
//var particleCount = 50000;
//var particles;

var particle;
var particles = []; 
var particleImage = new Image(); //THREE.ImageUtils.loadTexture( "http://i.imgur.com/cTALZ.png" );
particleImage.src = 'cTALZ.png'; 

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
	
	var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage) } );
        
    for (var i = 0; i < 500; i++) {

        particle = new Particle3D( material);
        particle.position.x = Math.random() * 2000 - 1000;
        particle.position.y = Math.random() * 2000 - 1000;
        particle.position.z = Math.random() * 2000 - 1000;
        particle.scale.x = particle.scale.y =  1;
        scene.add( particle );
        
        particles.push(particle); 
    }

	
	
	camera.position.set(0,player.height,-5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	
	// Shadow
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	
	document.body.appendChild( renderer.domElement );
	setInterval(loop, 1000 / 60);

	}
	
function loop() {

	for(var i = 0; i<particles.length; i++) {

        var particle = particles[i]; 
        particle.updatePhysics(); 

        with(particle.position) {
            if(y<-1000) y+=2000; 
            if(x>1000) x-=2000; 
            else if(x<-1000) x+=2000; 
            if(z>1000) z-=2000; 
            else if(z<-1000) z+=2000; 
        }                
    }

    //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    //camera.position.y += ( - mouseY - camera.position.y ) * 0.05; 
    camera.lookAt(scene.position); 

    renderer.render( scene, camera );

}

	


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

	renderer.render( scene, camera );
	
	requestAnimationFrame( animate );

}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}
