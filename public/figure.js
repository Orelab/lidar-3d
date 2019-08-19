
class Figure {

    points = new List();
    object;
    

    positions = [];
    normals = [];
    colors = [];

    geom = null;
    mat = null;
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
    
        //this.mat = new THREE.MeshNormalMaterial();
        //this.mat = new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:false});
        this.mat = new THREE.MeshPhongMaterial({color:0xd2baa8,side:THREE.DoubleSide});
    
        this.object = new THREE.Mesh( this.geom, this.mat );
        //this.object.geometry.attributes.position.needsUpdate = true;

        window.addEventListener('click', function(){ this.click(); }.bind(this), false);
    }


    add(distance, x, y)
    {
        if( distance == 0 || distance > 8000 ) // 8190 == out of range for V53L0X
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
    */
    find_points(x, y)
    {
        var face1 = [
            this.points[y][x],
            this.points[y].prev_val(x),
            ( this.points.prev_val(y) || {} )[x]
        ];
        var face2 = [
            this.points[y][x],
            ( this.points.prev_val(y) || {} )[x],
            ( this.points.prev_val(y) || new List() ).prev_val(x)
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

        if( points === 'undefined' || points == null ){
            return;
        }

        if( typeof points !== 'object'){
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
        //console.log( "adding point");
        //console.log(points);

        // triangle geometry
        var geom = new THREE.Geometry();
        geom.vertices.push(new THREE.Vector3(points[0].coords.x, points[0].coords.y, points[0].coords.z));
        geom.vertices.push(new THREE.Vector3(points[1].coords.x, points[1].coords.y, points[1].coords.z));
        geom.vertices.push(new THREE.Vector3(points[2].coords.x, points[2].coords.y, points[2].coords.z));
        geom.faces.push(new THREE.Face3(0, 1, 2));
        geom.computeFaceNormals();

        // material
        //var mat = new THREE.MeshLambertMaterial({color: 0xFF0000, side:THREE.DoubleSide});
        //var mat = new THREE.MeshBasicMaterial({color:0xFF0000, side:THREE.DoubleSide, wireframe:true});
        //var mat = new THREE.MeshPhongMaterial({color:0xFF0000, specular:0x555555, shininess:30});
        var mat = new THREE.MeshPhongMaterial({color:0xFF0000, side:THREE.DoubleSide, transparent:true, opacity:0.9, wireframe:false});

        //  form mesh of geometry + material and add it to the scene
        var mesh = new THREE.Mesh(geom, mat);
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