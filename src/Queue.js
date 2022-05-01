//create priority queue
class Queue{
    constructor(){
        this.states = [] ;
    }
    
    enqueue(state, priority, paths){
        let contain = false;
        let newState = {state, priority, paths};

        for (var i = 0; i < this.states.length; i++) {
            if (this.states[i].priority > priority) {
                this.states.splice(i, 0, newState);
                contain = true;
                break;
            }
        }
        if (!contain) {
            this.states.push(newState);
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