
class Figure {

    points = new List();
    
    positions = [];
    normals = [];
    colors = [];

    geom = null;
    mat = null;
    wireframe = true;
    raise = 1;
    object = null;

    constructor()
    {
        this.clear();

        this.geom = new THREE.BufferGeometry();
        this.geom.dynamic = true;

        function disposeArray()
        {
            this.array = null;
        }
        this.geom.addAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3).onUpload(disposeArray));
        this.geom.addAttribute( 'normal', new THREE.Float32BufferAttribute(this.normals, 3).onUpload(disposeArray));
        this.geom.addAttribute( 'color', new THREE.Float32BufferAttribute( this.colors, 3 ).onUpload( disposeArray ) );
        this.geom.computeBoundingSphere();
        this.geom.computeFaceNormals();
    
        //this.mat = new THREE.MeshNormalMaterial();
        //this.mat = new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:false});
        this.mat = new THREE.MeshPhongMaterial({color:0xd2baa8,side:THREE.DoubleSide});
    
        this.object = new THREE.Mesh( this.geom, this.mat );
        //this.object.geometry.attributes.position.needsUpdate = true;

        window.addEventListener('click', function(){ this.click(); }.bind(this), false);
    }


    add(distance, x, y)
    {
        if( distance <= 10 || distance > 8000 ) // 8190 == out of range for V53L0X
        {
            return;
        }

		if( ! this.points.hasOwnProperty(y) )
		{
			this.points[y] = new List();
		}
        this.points[y][x] = {
            distance: distance,
            coords: this.toCartesian(distance, x, y)
        };

        var p = this.find_points(x, y);
        this.build_face2( p[0] );
        this.build_face2( p[1] );
    }



    /*
        This can be used in replacement of add()
        to draw only a point instead of a complex mesh of vertex
    */
    add_point(distance, x, y)
	{
		var geometry = new THREE.SphereGeometry(.002);
		var material = new THREE.MeshBasicMaterial({color:0xffff00});
		var sphere = new THREE.Mesh(geometry, material);
        sphere.position.setFromSphericalCoords(distance/100, THREE.Math.degToRad(y), THREE.Math.degToRad(x) );
        sphere.position.y += this.raise;
        this.object.add(sphere);
	}


    /*
        Call this method to clear the figure.
        This will simply erase the figure from the scene and 
        you'll be able to add new points to draw another figure.
    */
    clear()
    {
        //this.object.geometry.dispose();
        //this.object.material.dispose();
        scene.remove(this.object);
        this.object = new THREE.Mesh();
        scene.add(this.object);

        this.points = new List();
    }


    /*
        Each time a point is added, 
        potentially two triangles could be built

           7--6--5
          /| /| /|
         / |/ |/ |
        4--3--2--1

        When 7 is added. Two triangles can be build :
         -> 7-3-6
         -> 7-3-4

         In the following code, this.points[y][x] corresponds to 7
    */
    find_points(x, y)
    {
        var face1 = [
            this.points[y][x],
            this.points[y].prev_val(x),
            ( this.points.prev_val(y))[x]
        ];
        var face2 = [
            this.points[y][x],
            this.points[y].prev_val(x),
            ( this.points.prev_val(y)).next_val(x)
        ];
        
        return [face1, face2];
    }


    build_face(points)
    {
        // If one point is missing, no face !

        if(    typeof points[0] === 'undefined'
            || typeof points[1] === 'undefined'
            || typeof points[2] === 'undefined' )
        {
            return;
        }
        //console.log( "adding point");
        //console.log(points);

        // update positions

        this.positions.push(points[0].coords.x);
        this.positions.push(points[0].coords.y);
        this.positions.push(points[0].coords.z);

        this.positions.push(points[1].coords.x);
        this.positions.push(points[1].coords.y);
        this.positions.push(points[1].coords.z);

        this.positions.push(points[2].coords.x);
        this.positions.push(points[2].coords.y);
        this.positions.push(points[2].coords.z);


        // update normals

        var pA = new THREE.Vector3();
        var pB = new THREE.Vector3();
        var pC = new THREE.Vector3();

        var cb = new THREE.Vector3();
        var ab = new THREE.Vector3();

        pA.set( points[0].coords.x, points[0].coords.y, points[0].coords.z );
        pB.set( points[1].coords.x, points[1].coords.y, points[1].coords.z );
        pC.set( points[2].coords.x, points[2].coords.y, points[2].coords.z );

        cb.subVectors( pC, pB );
        ab.subVectors( pA, pB );
        cb.cross( ab );

        cb.normalize();

        var nx = cb.x;
        var ny = cb.y;
        var nz = cb.z;

        this.normals.push( nx, ny, nz );
        this.normals.push( nx, ny, nz );
        this.normals.push( nx, ny, nz );

        //-- update colors

        var color = new THREE.Color();
        color.setRGB( Math.random(), Math.random(), Math.random() );

        this.colors.push( 0.8841463850770785, 0.5844001034523705, 0.9906873155009701 );
        this.colors.push( 0.8841463850770785, 0.5844001034523705, 0.9906873155009701 );
        this.colors.push( 0.8841463850770785, 0.5844001034523705, 0.9906873155009701);

    }


    build_face2(points)
    {
        // If one point is missing, no face !

        if( typeof points !== 'object' || points == null ){
            return;
        }
        
        if( points['length'] < 2 ){
            return;
        }

        if(    typeof points[0] === 'undefined'
            || typeof points[1] === 'undefined'
            || typeof points[2] === 'undefined' )
        {
            return;
        }

        // triangle geometry
        var geom = new THREE.Geometry();
        geom.vertices.push(new THREE.Vector3(points[0].coords.x, points[0].coords.y+this.raise, points[0].coords.z));
        geom.vertices.push(new THREE.Vector3(points[1].coords.x, points[1].coords.y+this.raise, points[1].coords.z));
        geom.vertices.push(new THREE.Vector3(points[2].coords.x, points[2].coords.y+this.raise, points[2].coords.z));
        geom.faces.push(new THREE.Face3(0, 1, 2));
        geom.mergeVertices();
        geom.computeVertexNormals();

        geom.computeFaceNormals();

        // material
        var mat = new THREE.MeshPhongMaterial({
            color: 'grey', 
            side: THREE.DoubleSide, 
            specular: 0x555555, 
            shininess: 30, 
            transparent: true, 
            opacity: 0.9, 
            wireframe: this.wireframe
        });

        var mesh = new THREE.Mesh(geom, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        this.object.add(mesh);
    }

    toCartesian(distance, x, y)
    {
		var v = new THREE.Vector3();
        v.setFromSphericalCoords(distance/100, THREE.Math.degToRad(y), THREE.Math.degToRad(x) );

        return {
            x: v.x,
            y: v.y,
            z: v.z
        };
    }


    click()
    {
        console.log(this.points);
    }
}