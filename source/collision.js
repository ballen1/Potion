'use strict'

module.exports = {

    bboxCollision : function(a, b) {
        let a_x1 = a.x;
        let a_y1 = a.y;
        let a_x2 = a.x + a.w;
        let a_y2 = a.y + a.h;

        let b_x1 = b.x;
        let b_y1 = b.y;
        let b_x2 = b.x + b.w;
        let b_y2 = b.y + b.h;

        return !(
            b_x1 > a_x2 ||
            b_x2 < a_x1 ||
            b_y2 < a_y1 ||
            b_y1 > a_y2
        )
    }

}