"use strict";
// abstract class cannot create objects on their own
Object.defineProperty(exports, "__esModule", { value: true });
class TakePhoto {
    cameraMode;
    filter;
    constructor(cameraMode, filter) {
        this.cameraMode = cameraMode;
        this.filter = filter;
    }
    getReelTime() {
        return 8;
    }
}
// they help to define the class that inherit from them
class Instagram extends TakePhoto {
    cameraMode;
    filter;
    burst;
    constructor(cameraMode, filter, burst) {
        super(cameraMode, filter);
        this.cameraMode = cameraMode;
        this.filter = filter;
        this.burst = burst;
    }
    getSepia() {
        console.log("Sepia");
    }
}
//const ab = new Instagram("test", "testfilter");
//# sourceMappingURL=abstractClass.js.map