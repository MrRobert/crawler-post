//======================== HashMap Util =========================================
HashMap = function() {
    this.keys = [];
    this.values = [];

    this.put = function(key, value){
        this.keys.push(key);
        this.values.push(value);
    }

    this.size = function(){
        return this.keys.length;
    }

    this.get = function(key){
        var index = this.keys.indexOf(key);
        if(index < 0) return "";
        return this.values[index];
    }

    this.remove = function(key){
        var index = this.keys.indexOf(key);
        if(index < 0) return;
        this.keys.slice(index);
        this.values.slice(index);
    }
}
