

class List extends Object {

    constructor(obj)
    {
        super();

        for (var key in obj)
        {
            this[key] = obj[key];
        }
    }

    p2n(prop)    // in object, property name to index number
    {
        return Object.keys(this).indexOf(prop);
    }
    
    n2p(num)
    {
        return Object.keys(this)[num];
    }
    
    n2p_val(num)
    {
        return this[ Object.keys(this)[num] ];
    }

    prev_prop(prop)
    {
        return this.n2p( this.p2n(prop)-1 );
    }

    next_prop(prop)
    {
        return this.n2p( this.p2n(prop)+1 );
    }

    prev_val(prop)
    {
        return this.n2p_val( this.p2n(prop)-1 );
    }

    next_val(prop)
    {
        return this.n2p_val( this.p2n(prop)+1 );
    }

}






//-- Examples

var demo = new List({
    1.1: "aaaa",
    "prop2": "bbbb",
    3.3: "cccc",
    4.4: "dddd"
});


console.log( demo.p2n("4.4") );         // 3
console.log( demo.n2p(2) );             // 3.3
console.log( demo.n2p(1) );             // "prop2"
console.log( demo.n2p_val(1) );         // "bbbb"
console.log( demo.prev_prop("prop2") )  // 1.1
console.log( demo.next_prop("prop2") )  // 3.3

