// Browser-only port of Bottle3d: live normal/specular/shadow textures, original GLSL lighting.
import { Container, Mesh, Program, QuadUv, Rectangle, Shader, Sprite, Texture } from "pixi.js";
import { ASSETS_TO_VIRTUAL as K, bundleUrl, type CilizAssets } from "@/lib/ciliz-assets";
import { realBottleFallback } from "@/lib/real-bottle-fallback";
const vertex = `attribute vec2 aVertexPosition; attribute vec2 aTextureCoord;
uniform mat3 translationMatrix; uniform mat3 projectionMatrix; varying vec2 vPos; varying vec2 vUvs;
void main(){vPos=aVertexPosition;vUvs=aTextureCoord;gl_Position=vec4((projectionMatrix*translationMatrix*vec3(aVertexPosition,1.0)).xy,0.0,1.0);}`;
const fragment = `varying vec2 vPos; varying vec2 vUvs;
uniform float uAlpha; uniform vec3 uLight; uniform vec3 uLightPos; uniform vec3 uViewerPos;
uniform sampler2D uLuminosity; uniform sampler2D uNormal; uniform sampler2D uBase;
void main(){ vec3 vertPos=vec3(vPos,0.0); vec4 luminosity=texture2D(uLuminosity,vUvs);
vec4 normal=texture2D(uNormal,vUvs); vec4 baseColor=texture2D(uBase,vUvs);
vec3 N=2.0*(normal.xyz-0.5); vec3 L=normalize(uLightPos-vertPos);
float Kd=uLight.r*luminosity.r;float Ks=uLight.g*luminosity.g;float shininess=uLight.b*luminosity.b;
float lambertian=Kd*max(dot(N,L),0.0);vec3 R=normalize(reflect(-L,N));vec3 V=normalize(uViewerPos-vertPos);
float specular=Ks*pow(max(dot(R,V),0.0001),shininess);
float light=baseColor.a*(lambertian+specular);gl_FragColor=uAlpha*(baseColor+vec4(light,light,light,0.0));}`;
let program: Program | undefined;
export async function bottleArtwork(assets: CilizAssets, type: string, size: number, load: (url: string) => Promise<HTMLImageElement>) {
  const bottle = assets.bottles?.[type] ?? assets.bottles?.['standart'];
  const image = bottle ? await load(bundleUrl(assets, bottle.image, "png", size)).catch(() => load(realBottleFallback)) : await load(realBottleFallback);
  const sprite = Sprite.from(image);
  const original = bottle && image.src !== realBottleFallback ? assets.images[bottle.image] : undefined;
  const frame = original?.size_v2 ?? original?.size ?? [-31.5, -99, 63, 173];
  sprite.width = (frame[2] ?? 63) * K; sprite.height = (frame[3] ?? 173) * K;
  sprite.anchor.set(-(frame[0] ?? 0)/(frame[2] || 1), -(frame[1] ?? 0)/(frame[3] || 1));
  return sprite;
}
export async function originalBottle(assets: CilizAssets, type: string, size: number, load: (url: string) => Promise<HTMLImageElement>, rotation: Container) {
  const bottle = assets.bottles?.[type] ?? assets.bottles?.['standart'];
  if (!bottle) return bottleArtwork(assets, type, size, load);
  const name = bottle.bottle3d;
  const p = name ? assets.bottle3d?.[name] : undefined;
  if (!p || !name) return bottleArtwork(assets, type, size, load);
  try {
  const [base, luminosity, normal, shadow] = await Promise.all(["base","luminosity","normal","shadow"].map(async suffix => Texture.from(await load(bundleUrl(assets, `${name}.${suffix}`, "png", size)))));
  const view = new Container();
  const shade = new Sprite(shadow);
  const ss = p.shadowSize.map(n => n*K), sz = p.size.map(n => n*K);
  shade.anchor.set(-(ss[0] ?? 0)/(ss[2] ?? 1), -(ss[1] ?? 0)/(ss[3] ?? 1));
  shade.width = ss[2] ?? 0; shade.height = ss[3] ?? 0;
  program ??= Program.from(vertex, fragment);
  const shader = new Shader(program, { uBase: base, uLuminosity: luminosity, uNormal: normal, uAlpha: 1,
    uLight: new Float32Array([p.kd,p.ks,p.shininess]), uLightPos: new Float32Array(3),
    uViewerPos: new Float32Array([p.viewerX*K,p.viewerY*K,p.viewerZ*K]) });
  const geometry = new QuadUv();
  const rc = new Rectangle(sz[0] ?? 0, sz[1] ?? 0, sz[2] ?? 0, sz[3] ?? 0);
  geometry.map(rc, rc);
  const quad = new Mesh(geometry, shader);
  view.addChild(shade, quad);
  const render = view.render.bind(view);
  view.render = renderer => {
    const a = -rotation.rotation;
    const x = (Math.cos(a)*p.lightX-Math.sin(a)*p.lightY)*K;
    const y = (Math.sin(a)*p.lightX+Math.cos(a)*p.lightY)*K;
    shade.x = -p.shadowH*x/(p.lightZ-p.shadowH); shade.y = -p.shadowH*y/(p.lightZ-p.shadowH);
    shader.uniforms['uLightPos'].set([x,y,p.lightZ*K]); shader.uniforms['uAlpha'] = view.worldAlpha;
    render(renderer);
  };
  return view;
  } catch {
    return bottleArtwork(assets, type, size, load);
  }
}
