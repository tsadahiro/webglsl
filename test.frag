#version 300 es

precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 mouse;

out vec4 fragColor;

vec3 center = vec3(0,0,10);

float wallSDF(vec3 p){
  return -p.z;
}

float sphereSDF(vec3 p){
  return length(p-center) - 0.5;
}

float smin( float a, float b, float k )
{
    k *= 6.0;
    float h = max( k-abs(a-b), 0.0 )/k;
    return min(a,b) - h*h*h*k*(1.0/6.0);
}


float SDF(vec3 p){
  return smin(wallSDF(p), sphereSDF(p),0.025);
}

vec3 SDFnormal(vec3 p){
  float eps = 0.0001;
  float dx = SDF(p + vec3(eps,0,0)) - SDF(p);
  float dy = SDF(p + vec3(0,eps,0)) - SDF(p);
  float dz = SDF(p + vec3(0,0,eps)) - SDF(p);
  return normalize(vec3(dx,dy,dz));
}

vec3 rayMarching(vec3 pos, vec3 ray){
  for (int i=0; i<50; i++){
    if (abs(SDF(pos))<0.001){
      return pos;
    }
    pos += SDF(pos)*ray;
  }
  return vec3(10000,10000,10000);
}

float diffraction(vec3 pos, vec3 light){
  vec3 ldir = normalize(light - pos);
  return dot(ldir, SDFnormal(pos));
}

void main(){
  vec2 p = gl_FragCoord.xy / u_resolution.xy;
  p *= 0.5;
  p -= 0.5;
  vec2 m = mouse / u_resolution.xy;
  m.y *= -0.5;
  m -= vec2(0.25,-0.25);

  
  vec3 camera = vec3(0,0,-20);
  vec3 cdir = vec3(0,0,1);
  cdir = normalize(cdir);
  vec3 udir = vec3(0,1,0);
  udir = normalize(udir);
  vec3 hdir = cross(cdir, udir);
  hdir = normalize(hdir);
  float depth = 5.0;

  vec3 ray = p.x*hdir + p.y*udir + depth*cdir;
  ray = normalize(ray);

  vec3 mray = m.x*hdir + m.y*udir + depth*cdir;
  mray = normalize(mray);

  float k = - camera.z / mray.z;
  m = vec2(camera.x + k*mray.x, camera.y + k*mray.y);
  center = vec3(m, 0.5*u_time);
  
  vec3 pos = camera;
  pos = rayMarching(pos, ray);

  vec3 light = vec3(10,10,-10);
  if (length(pos) < 1000.0){
    float d = diffraction(pos,light);
    fragColor=vec4(d);
  }
  else{
    fragColor=vec4(0,0,0,1);
  }
}
