//create priority queue
class Queue{

    
    constructor(){
        this.states = [] ;
    }
    enqueue(state, priority, paths){
        // paths.push(state);
        let pos = this.states.length - 1;
        while(pos > 0 && priority < this.states[pos].priority) {
            pos--; 
        }

        if(this.states.length > 0) {
            if(pos > 0) {
                this.states.splice(pos+1, 0, {state, priority, paths});
            }
            else {
                if(priority < this.states[pos].priority)
                    this.states.splice(pos, 0, {state, priority, paths});
                else
                    this.states.splice(pos+1, 0, {state, priority, paths}); 
            }
        }
        else {
            this.states.push({state, priority, paths});
        }
    }
    dequeue(){
        if(this.isEmpty())
            return null;
        return this.states.shift();
    }
    front(){
        if(this.isEmpty())
            return null;
        return this.states[0];
    }
    isEmpty(){
        return this.states.length === 0;
    }


}

module.exports = Queue;