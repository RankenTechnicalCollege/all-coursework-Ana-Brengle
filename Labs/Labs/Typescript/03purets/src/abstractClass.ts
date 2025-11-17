// abstract class cannot create objects on their own

abstract class TakePhoto {
    constructor(
        public cameraMode: string,
        public filter: string
    )
    {}

    abstract getSepia(): void 
    getReelTime(): number{
        return 8;
    }
}

// they help to define the class that inherit from them
class Instagram extends TakePhoto {
    constructor(
        public cameraMode: string, 
        public filter: string, 
        public burst: number
    ){
        super(cameraMode, filter);
    }
    getSepia(): void {
        console.log("Sepia");
    }
}

//const ab = new Instagram("test", "testfilter");