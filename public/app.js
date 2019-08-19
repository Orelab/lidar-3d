/*

	https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/
	https://discourse.threejs.org/t/how-to-place-randomly-a-box-on-a-sphere/4280
	https://stackoverflow.com/questions/56570775/threejs-coordinates-of-a-destination-from-an-origin-a-direction-and-distance
	https://threejsfundamentals.org/threejs/lessons/threejs-materials.html

	https://threejs.org/examples/#webgl_buffergeometry
	https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry.html


	https://stackoverflow.com/questions/42141438/access-to-faces-in-buffergeometry
	http://www.oranlooney.com/post/deep-copy-javascript/
	https://stackoverflow.com/questions/20303239/three-js-how-to-update-buffergeometry-vertices
*/


function generate_interface(){
	$('body').append('<ul id="files"/>');

	$.ajax('/files').done((data)=>{
		data.forEach((e)=>{
			$(`<li>${e.file} - ${e.size}</li>`)
			.attr('file', e.file)
			.attr('size', e.size)
			.appendTo('#files');
		});
	});
}


var scene, figure;

$(document).ready(function()
{
	generate_interface();

	//-- scene

	scene = new THREE.Scene();
	scene.background = new THREE.Color('black');
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
	camera.position.set(0,0,-5);	
	camera.lookAt(0,0,0);	

	var renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setSize( window.innerWidth, window.innerHeight );
	//renderer.physicallyCorrectLights = true;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', function()
	{
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );

	var controls = new THREE.OrbitControls( camera, renderer.domElement );



	//-- light

	var ambiantLight = new THREE.AmbientLight(0xffffff, .5);
	scene.add(ambiantLight);
	
	var pointLight = new THREE.PointLight(0xffffff, .5);
	scene.add(pointLight);
	
	var pointLight2 = new THREE.PointLight(0xffffff, .5);
	pointLight2.position.set(0,-2,0);
	scene.add(pointLight2);

	
	//-- axes

	var axesHelper = new THREE.AxesHelper( 5 );
	scene.add( axesHelper );


	//-- figure

	figure = new Figure();
	scene.add( figure.object );


	//-- animate

	function animate()
	{
		requestAnimationFrame( animate );
		controls.update();
		renderer.render( scene, camera );
	}
	animate();



	//-- interface update by Socket.io
	
	var socket = io();
	socket.on('data', data_load);



	function data_load(d){
		var [distance, x, y] = d.split("\t");
		//console.log(distance + ' - ' + x + ' - ' + y);
		figure.add(distance, x, y);
		//add_point_spherical(distance, x, y);
	}


	//-- object loading by clicking

	$('body').delegate('li', 'click', function(){
		var filename = $(this).attr('file');

		console.log('Generating ' + filename);

		figure.clear();
	
		$.ajax('/file/'+filename).done(function(data){
			var d = data.split("\n");

			for(var i=0 ; i<d.length ; i++){
				//console.log(d[i]);
				data_load(d[i]);
			}
		});
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


	

});


