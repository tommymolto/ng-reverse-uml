export default class Helpers{
    constructor() {
    }
    loga(fg = true, ...args: any[]){
        if (fg) console.log(...args)
    }

}

