import * as AFRAME from "AFRAME";
import { attachEffects, attach } from "three-effects";

AFRAME.registerSystem("fx", {
    schema: {
        type: 'array',
        default: []
    },

    init: function () {
        this.timeUniform = { value: 0 };
        this.fx = attachEffects(this.sceneEl.object3D);
    },

    update: function () {
        this.fx(this.data.length ? this.data : null);
    },

    tick: function (t) {
        this.timeUniform.value = t;
    }
});

AFRAME.registerComponent("fx", {
    schema: {

    },

    multiple: true,

    init: function () {
        var att = attach[this.id];
        this.control = att(this.el.object3D);
        var ud = this.el.object3D.userData[this.id];
        var schema = {}, t;
        for( var k in ud) {
            var p = ud[k];
            
            if(p.value.isVector2) {
                t = "vec2";
            } else if(p.value.isVector3) {
                t = "vec3";
            } else if(p.value.isVector4) {
                t = "vec4";
            } else if(p.value.isColor) {
                t = "color";
            }else if(p.value.isTexture) {
                t = "asset";
                p.value.image.addEventListener("load", function () {
                    p.value.needsUpdate = true;
                })
            } else {
                t = "number";
            }

            schema[k] = { type: t, default: p.value.getHexString ? "#" + p.value.getHexString() : p.value };
        }
        this.updateSchema(schema);
    },

    update: function () {
        var ud = this.el.object3D.userData[this.id];
        for(var k in this.schema) {
            var s = this.schema[k];
            if(s.type === "asset") {
                if(!ud[k].value.isCanvasTexture && ud[k].value.isDataTexture) {
                    if(ud[k].value.image.src !== this.data[k]) ud[k].value.image.src = this.data[k];        
                }
            } else if(s.type === "color") {
                ud[k].value.set(this.data[k]);
            } else if(s.type === "number") {
                ud[k].value = this.data[k];
            } else {
                ud[k].value.copy(this.data[k]);
            }
        }
        ud.needsUpdate = true;
    },

    remove: function () {
        this.control(null);
    }
});
