/*

	https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/
	https://discourse.threejs.org/t/how-to-place-randomly-a-box-on-a-sphere/4280
	https://stackoverflow.com/questions/56570775/threejs-coordinates-of-a-destination-from-an-origin-a-direction-and-distance
	https://threejsfundamentals.org/threejs/lessons/threejs-materials.html

	https://threejs.org/examples/#webgl_buffergeometry
	https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry.html
*/



$(document).ready(function()
{

	//-- scene

	var scene = new THREE.Scene();
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



	//-- axes

	var axesHelper = new THREE.AxesHelper( 5 );
	scene.add( axesHelper );


	//-- figure

	var geom = new THREE.Geometry();
	geom.dynamic = true;
	//var mat = new THREE.MeshNormalMaterial();
	var mat = new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:false});
	var figure = new THREE.Mesh( geom, mat );
	scene.add(figure);

	for(var i=0 ; i<10000 ; i++)
	{
		geom.faces.push(new THREE.Face3(0,0,0));
	}


	//-- animate

	function animate()
	{
        //figure.geometry.normalize();
		geom.verticesNeedUpdate = true;
		geom.elementsNeedUpdate = true;
		geom.computeBoundingSphere();

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
		console.log(distance + ' - ' + x + ' - ' + y);
		add_point_spherical_2(distance, x, y);
	});

var n=0;

	function add_point_spherical_2(distance, x, y)
	{
n+=2;
		var ppr=134;
		var v = new THREE.Vector3();
		v.setFromSphericalCoords(distance/100, THREE.Math.degToRad(y), THREE.Math.degToRad(x) );
		geom.vertices.push(v);

		var n = geom.vertices.length-1;
		if(n>ppr)
		{
			//geom.faces.push(new THREE.Face3(n,n-ppr,n-ppr-1));
			//geom.faces.push(new THREE.Face3(n,n-1,n-ppr-1));
			geom.faces[n] = new THREE.Face3(n,n-ppr,n-ppr-1);
			geom.faces[n-1] = new THREE.Face3(n,n-1,n-ppr-1);
			geom.computeFaceNormals();
/*
			add_point_cartesian(geom.vertices[n].x, geom.vertices[n].y, geom.vertices[n].z);
			add_point_cartesian(geom.vertices[n-ppr].x, geom.vertices[n-ppr].y, geom.vertices[n-ppr].z);
			add_point_cartesian(geom.vertices[n-ppr-1].x, geom.vertices[n-ppr-1].y, geom.vertices[n-ppr-1].z);
*/
		}
	}


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

