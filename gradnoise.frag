#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
out vec4 fragColor;

uvec3 k = uvec3(0x22345678u, 0xa7897b4au, 0x89ab4a0u);
uvec3 u = uvec3(1,2,3);
const uint UINT_MAX = 0xffffffffu;
const float PI = 3.14159;

uvec2 uhash22(uvec2 n){
    n ^= (n.yx << u.xy);
    n ^= (n.yx >> u.xy);
    n *= k.xy;
    n ^= (n.yx << u.xy);
    return n * k.xy;
}

float hash21(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return float(uhash22(n).x)/ float(UINT_MAX);
}

vec2 hash22(vec2 p){
    uvec2 n = floatBitsToUint(p);
    return vec2(uhash22(n)) / vec2(UINT_MAX);
}

float fColor(vec2 p){
    vec2[4] lat=vec2[](floor(p),
                        floor(p)+vec2(1,0),
                        floor(p)+vec2(0,1),
                        floor(p)+vec2(1,1)
                        );
    vec2 f = fract(p);
    vec2[4] grads =  vec2[](hash22(lat[0])-vec2(0.5,0.5),
                            hash22(lat[1])-vec2(0.5,0.5),
                            hash22(lat[2])-vec2(0.5,0.5),
                            hash22(lat[3])-vec2(0.5,0.5));
    float[4] v = float[](dot(grads[0],f),
                        dot(grads[1],f-vec2(1,0)),
                        dot(grads[2],f-vec2(0,1)),
                        dot(grads[3],f-vec2(1,1))
                        );
    f = f*f*f*(6.0*f*f-15.0*f+10.0);
    return (mix(mix(v[0],v[1],f.x), mix(v[2],v[3],f.x),f.y)+0.5);
}

vec4 dwarp(vec2 p){
    vec2 q = vec2(fColor(p), fColor(p));

    vec2 r = vec2(fColor(p+4.0*q-vec2(1.0,2.1)),
                fColor(p+4.0*q+vec2(-5.0, 1.2)));

    //return vec4(fColor(p+fColor(p+fColor(p+fColor(p+fColor(p))))));
    //return vec4(fColor(p+fColor(p+vec2(fColor(p+vec2(0.5,0.1)),fColor(p+vec2(2.15,-10))))));
    //return vec4((fColor(p-5.0*q + 13.0*r -u_time)),0,0,1);
    return vec4(fColor(p-5.0*q+13.0*r -u_time));
    //return vec4(fColor(p-5.0*q));
}

void main(){
    vec2 p = gl_FragCoord.xy / u_resolution.x;
    p *= 5.0;
    fragColor = dwarp(p);
}