/*

	https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/



*/



$(document).ready(function()
{

	//-- scene

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	function onWindowResize(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}


	//-- cube

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	camera.position.z = 5;


	//-- animate

	function animate() {
		requestAnimationFrame( animate );
		renderer.render( scene, camera );
	}
	animate();



	/*
		Interface update by Socket.io
	*/
	var socket = io();

	socket.on('data', function(d)
	{
		var distance, x, y;
		[distance, x, y] = d.split("\t");

		console.log(distance + ' - ' + x + ' - ' + y);
		add_point(distance, x, y);
	});


});




function add_point(distance, x, y)
{

}