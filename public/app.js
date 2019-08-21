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


// https://blog.niap3d.com/fr/4,10,news-16-Convertir-des-octets-en-Javascript.html

function FileConvertSize(aSize) {
	aSize = Math.abs(parseInt(aSize, 10));
	var def = [[1, 'octets'], [1024, 'ko'], [1024 * 1024, 'Mo'], [1024 * 1024 * 1024, 'Go'], [1024 * 1024 * 1024 * 1024, 'To']];
	for (var i = 0; i < def.length; i++) {
		if (aSize < def[i][0]) return (aSize / def[i - 1][0]).toFixed(2) + ' ' + def[i - 1][1];
	}
}


function generate_interface() {
	$('#files').empty();
	$.ajax('/files').done((data) => {
		data.forEach((e) => {
			$(`<li>
			<button class="point"></button><!--
			--><button class="plain"></button><!--
			--><button class="wireframe"></button><!--
			--><button class="delete"></button>
			${e.file} <span>${FileConvertSize(e.size)}</span>
			</li>`)
				.attr('file', e.file)
				.attr('size', e.size)
				.appendTo('#files');
		});
	});
}


var scene, figure, mode;	// mode = plain/wireframe/point

$(document).ready(function () {
	generate_interface();

	//-- scene

	scene = new THREE.Scene();
	scene.background = new THREE.Color('black');
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
	camera.position.set(0, 2, 0);
	camera.lookAt(0, 0, 0);

	var renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setSize(window.innerWidth - 410, window.innerHeight);
	//renderer.physicallyCorrectLights = true;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild(renderer.domElement);

	window.addEventListener('resize', function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth - 410, window.innerHeight);
	}, false);

	var controls = new THREE.OrbitControls(camera, renderer.domElement);



	//-- light

	var ambiantLight = new THREE.AmbientLight(0xffffff, .5);
	scene.add(ambiantLight);

	var pointLight = new THREE.PointLight(0xffffff, .5);
	scene.add(pointLight);
	pointLight.position.direction = true;

	function movePointLight() {
		if (pointLight.position.direction)
			pointLight.position.y += .05;
		else
			pointLight.position.y -= .05;

		if (pointLight.position.y < -1) {
			pointLight.position.direction = true;
		}
		if (pointLight.position.y > 1) {
			pointLight.position.direction = false;
		}
	}

	var pointLight2 = new THREE.PointLight(0xffffff, .5);
	pointLight2.position.set(0, -2, 0);
	scene.add(pointLight2);


	//-- axes

	var axesHelper = new THREE.AxesHelper(5);
	scene.add(axesHelper);


	//-- figure

	figure = new Figure();
	scene.add(figure.object);


	//-- animate

	function animate() {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);

		//movePointLight();
	}
	animate();



	//-- interface update by Socket.io

	var socket = io();
	socket.on('data', data_load);



	function data_load(d) {
		var [distance, x, y] = d.split("\t");
		y = Math.ceil(y * 1.05 * 100) / 100 + "";	// => improper scanner calibration correction
		//console.log(distance + ' - ' + x + ' - ' + y);

		switch (mode) {
			case "point":
				figure.add_point(distance, x, y);
				break;
			case "plain":
				figure.wireframe = false;
				figure.add(distance, x, y);
				break;
			default:
				figure.wireframe = true;
				figure.add(distance, x, y);
		}
	}


	//-- object loading by clicking

	$('#panel').delegate('.plain,.wireframe,.point', 'click', function () {
		mode = this.className;
		const filename = $(this).parent().attr('file');

		console.log('Generating ' + filename);

		figure.clear();

		$.ajax('/file/' + filename).done(function (data) {
			var d = data.split("\n");

			for (var i = 0; i < d.length; i++) {
				//console.log(d[i]);
				data_load(d[i]);
			}
		});

		$('#files li').css('background-color', '');
		$(this).parent().css('background-color', 'grey');
	});

	$('#panel').delegate('.delete', 'click', function () {

		if( ! confirm('Are you sure you want to delete this file ? ' + "\n"
			+ '(it will just  be moved in the trash/ folder)') ){
			alert('Deletion canceled !');
			return;
		}

		const filename = $(this).parent().attr('file');

		console.log('Deleting ' + filename);

		$.ajax('/delete/' + filename).done(function (data) {
			if (data == 'ok') {
				generate_interface();
				alert('File deleted !');
			} else {
				alert('The file couldn\'t be deleted');
			}
		});
	});


});


