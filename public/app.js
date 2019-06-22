/*

	https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/
	https://discourse.threejs.org/t/how-to-place-randomly-a-box-on-a-sphere/4280
	https://stackoverflow.com/questions/56570775/threejs-coordinates-of-a-destination-from-an-origin-a-direction-and-distance
	https://threejsfundamentals.org/threejs/lessons/threejs-materials.html

	https://threejs.org/examples/#webgl_buffergeometry
	https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry.html
*/

var scene;

$(document).ready(function()
{

	//-- scene

	scene = new THREE.Scene();
	//scene.background = new THREE.Color( 0xf0f0f0 );
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.001, 1000 );
	camera.position.set(0,0,-50);	
	camera.lookAt(0,-50,0);	

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', function()
	{
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );

	var controls = new THREE.OrbitControls( camera, renderer.domElement );



	//-- light

	scene.add(new THREE.AmbientLight(0x444444));
	var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
	light1.position.set(50, 50, 50);
	scene.add(light1);
	var light2 = new THREE.DirectionalLight(0xffffff, 1.5);
	light2.position.set(0, -50, 0);
	scene.add(light2);


	//-- axes

	var axesHelper = new THREE.AxesHelper( 5 );
	scene.add( axesHelper );


	//-- figure

	var figure = new Figure();
	scene.add( figure.object );


	//-- animate

	function animate()
	{
        //figure.geometry.normalize();
		//geom.verticesNeedUpdate = true;
		//geom.elementsNeedUpdate = true;
		//geom.computeBoundingSphere();

//		figure.object.geometry.attributes.position.needsUpdate = true;

		requestAnimationFrame( animate );
		controls.update();
		renderer.render( scene, camera );

	}
	animate();



	//-- interface update by Socket.io
	
	var socket = io();

	socket.on('data', function(d)
	{
		var [distance, x, y] = d.split("\t");
	//	console.log(distance + ' - ' + x + ' - ' + y);
		figure.add(distance, x, y);
	});


	function add_point_spherical(distance, x, y)
	{
		var geometry = new THREE.SphereGeometry(.005);
		var material = new THREE.MeshBasicMaterial({color:0xffff00});
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.set(0,0,50);
		sphere.position.setFromSphericalCoords(distance/100, THREE.Math.degToRad(y), THREE.Math.degToRad(x) );
		scene.add(sphere);
	}



	function add_point_cartesian(x, y, z)
	{
		var geometry = new THREE.SphereGeometry(.005);
		var material = new THREE.MeshBasicMaterial({color:0xffff00});
		var sphere = new THREE.Mesh(geometry, material);
		sphere.position.set(z,x,y);
		scene.add(sphere);
	}

});

