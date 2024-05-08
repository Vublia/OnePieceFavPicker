export class Character{

    constructor(name, id, fileSrc){
        this.name = name;
        this.id = id;
        this.fileSrc = fileSrc;
        this.parents = []
        this.isRanked = false
    }
    /**
     * 
     * @param data json data from a file
     * @returns a character loaded from json data
     */
    static loadFromJson(data){
        return new Character(data["name"], data["char-id"], data["imagesrc"])
    }
}

export class ActionType{
    constructor(type, valueArray, valueArray2){
        //either 'pick, swap'
        this.type = type
        //for 'pick' , this array holds what characters got ['faved']
        //for swap, holds the oldindex of the thing that got moved
        this.valueArray = valueArray
        //for  pick, this array holds what characters got influenced bt the 'faved')
        //for swap, holds the newindex of the thing that got moved
        this.valueArray2 = valueArray2
    }
}