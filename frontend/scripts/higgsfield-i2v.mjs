/**
 * Higgsfield image-to-video: 5s clips from landing stills.
 *
 * Usage:
 *   HF_API_KEY_ID=... HF_API_KEY_SECRET=... node scripts/higgsfield-i2v.mjs
 *
 * Docs: https://docs.higgsfield.ai/docs/guides/video
 * Duration is 5s (Higgsfield allows 5 or 10; 3–5s request → 5).
 *
 * If DoP returns not_enough_credits (or HF_I2V_LOCAL=1), encodes a 5s
 * cinematic still-motion loop locally with ffmpeg so the landing still plays.
 */
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, stat, unlink } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'landing');
const API = 'https://platform.higgsfield.ai';
const PRIMARY_MODEL = process.env.HF_I2V_MODEL || 'higgsfield-ai/dop/standard';
const FALLBACK_MODELS = ['higgsfield-ai/dop/lite'];
const DURATION = 5;

const KEY_ID = process.env.HF_API_KEY_ID || '';
const KEY_SECRET = process.env.HF_API_KEY_SECRET || '';
const CREDENTIALS = process.env.HF_CREDENTIALS || (KEY_ID && KEY_SECRET ? `${KEY_ID}:${KEY_SECRET}` : '');

const JOBS = [
  {
    file: 'whatwedo-1.jpg',
    out: 'whatwedo-1.mp4',
    motion: 'push',
    prompt:
      'Slow cinematic push-in on layered silver necklaces, hair and denim fabric breathing, light glinting on the Libra pendant, black and white editorial, subtle handheld, 5 seconds, no morphing faces',
  },
  {
    file: 'whatwedo-2.jpg',
    out: 'whatwedo-2.mp4',
    motion: 'push',
    prompt:
      'Warm luxury close-up, slow camera push toward the gold herringbone chain and round pendant, metal catching soft light, skin micro-movement, shallow depth of field, 5 seconds',
  },
  {
    file: 'whatwedo-3.jpg',
    out: 'whatwedo-3.mp4',
    motion: 'orbit',
    prompt:
      'Soft breeze on a white shirt, silver heart pendant catching light, slow gentle orbit around the collarbone, natural daylight, 5 seconds',
  },
  {
    file: 'work-jewelry.jpg',
    out: 'work-jewelry.mp4',
    motion: 'push',
    prompt:
      'Editorial portrait, slow cinematic push-in, gold rings catching golden-hour light, hair softly moving, serene expression held, 5 seconds',
  },
  {
    file: 'work-campaign.jpg',
    out: 'work-campaign.mp4',
    motion: 'pan',
    prompt:
      'Slow pan along a gold paperclip chain on the collarbone, linen shirt shifting slightly, warm directional light, 5 seconds',
  },
  {
    file: 'work-product.jpg',
    out: 'work-product.mp4',
    motion: 'macro',
    prompt:
      'Macro jewelry beauty shot, slow zoom on the gold paperclip links, highlights sliding across metal, 5 seconds',
  },
  {
    file: 'work-macro.jpg',
    out: 'work-macro.mp4',
    motion: 'drift',
    prompt:
      'Top-down close-up, fingers barely moving on champagne satin, gold rings catching light, fabric folds breathing, 5 seconds',
  },
];

function authHeaders() {
  return {
    Authorization: `Key ${CREDENTIALS}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init.headers || {}) },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const err = new Error(`Higgsfield ${res.status} ${path}: ${text.slice(0, 500)}`);
    err.status = res.status;
    err.bodyText = text;
    throw err;
  }
  return body;
}

function isCreditsError(error) {
  const text = `${error?.bodyText || ''} ${error?.message || ''}`.toLowerCase();
  return text.includes('not_enough_credits') || text.includes('enough credits');
}

async function uploadJpeg(filePath) {
  const upload = await api('/files/generate-upload-url', {
    method: 'POST',
    body: JSON.stringify({ content_type: 'image/jpeg' }),
  });
  const buf = await readFile(filePath);
  const headers = { ...(upload.upload_headers || {}), 'Content-Type': 'image/jpeg' };
  const put = await fetch(upload.upload_url, { method: 'PUT', headers, body: buf });
  if (!put.ok) {
    throw new Error(`Upload failed ${put.status} ${await put.text()}`);
  }
  return upload.public_url;
}

function videoUrlFrom(result) {
  return (
    result.video?.url ||
    result.videos?.[0]?.url ||
    result.output?.video?.url ||
    result.jobs?.[0]?.results?.raw?.url ||
    result.jobs?.[0]?.results?.min?.url ||
    null
  );
}

async function poll(statusUrl, started = Date.now()) {
  if (Date.now() - started > 8 * 60 * 1000) {
    throw new Error(`Timed out polling ${statusUrl}`);
  }
  const res = await fetch(statusUrl, { headers: authHeaders() });
  const body = await res.json();
  const status = body.status || body.state;
  if (status === 'completed' || status === 'ok') return body;
  if (status === 'failed' || status === 'nsfw' || status === 'canceled') {
    throw new Error(`Generation ${status}: ${JSON.stringify(body).slice(0, 400)}`);
  }
  await new Promise((r) => setTimeout(r, 4000));
  return poll(statusUrl, started);
}

async function generateWithModel(model, imageUrl, prompt) {
  const submitted = await api(`/${model}`, {
    method: 'POST',
    body: JSON.stringify({
      image_url: imageUrl,
      prompt,
      duration: DURATION,
    }),
  });
  const statusUrl = submitted.status_url || `${API}/requests/${submitted.request_id}/status`;
  const done = await poll(statusUrl);
  const url = videoUrlFrom(done);
  if (!url) throw new Error(`No video URL in result: ${JSON.stringify(done).slice(0, 600)}`);
  return url;
}

async function generate(imageUrl, prompt, models) {
  while (models.length) {
    const model = models[0];
    try {
      console.log('generate', model, `${DURATION}s`);
      return await generateWithModel(model, imageUrl, prompt);
    } catch (error) {
      if (isCreditsError(error)) {
        console.warn('not enough credits for', model);
        models.shift();
        continue;
      }
      throw error;
    }
  }
  throw new Error('No Higgsfield DoP model had enough credits');
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('ffmpeg', args, { stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}`))));
  });
}

function ffprobeSize(file) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'ffprobe',
      ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0:s=x', file],
      { stdio: ['ignore', 'pipe', 'inherit'] },
    );
    let out = '';
    child.stdout.on('data', (chunk) => {
      out += chunk;
    });
    child.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`ffprobe ${code}`));
        return;
      }
      const [w, h] = out.trim().split('x').map(Number);
      resolve({ w, h });
    });
  });
}

function outputSize(w, h) {
  return h >= w ? { w: 720, h: 1080 } : { w: 1080, h: 720 };
}

function zoompanFilter(w, h, motion) {
  const s = `${w}x${h}`;
  const frames = 150;
  const last = frames - 1;
  switch (motion) {
    case 'pan':
      return `scale=iw*2:ih*2,zoompan=z=1.2:x='(iw-iw/zoom)*on/${last}':y='(ih-ih/zoom)*0.42':d=${frames}:s=${s}:fps=30`;
    case 'orbit':
      return `scale=iw*2:ih*2,zoompan=z=1.16:x='(iw-iw/zoom)*(0.5+0.5*sin(6.2832*on/${frames}))':y='(ih-ih/zoom)*(0.5+0.32*cos(6.2832*on/${frames}))':d=${frames}:s=${s}:fps=30`;
    case 'macro':
      return `scale=iw*2:ih*2,zoompan=z='min(zoom+0.002,1.26)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${s}:fps=30`;
    case 'drift':
      return `scale=iw*2:ih*2,zoompan=z=1.14:x='iw/2-(iw/zoom/2)':y='(ih-ih/zoom)*on/${last}':d=${frames}:s=${s}:fps=30`;
    default:
      return `scale=iw*2:ih*2,zoompan=z='min(zoom+0.0015,1.18)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=${s}:fps=30`;
  }
}

async function localCinematic(src, dest, motion) {
  const { w: srcW, h: srcH } = await ffprobeSize(src);
  const { w, h } = outputSize(srcW, srcH);
  await ffmpeg([
    '-y',
    '-loop',
    '1',
    '-i',
    src,
    '-t',
    '5',
    '-vf',
    zoompanFilter(w, h, motion),
    '-an',
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-crf',
    '23',
    '-preset',
    'fast',
    '-movflags',
    '+faststart',
    dest,
  ]);
}

async function downloadAndCompress(url, dest) {
  const tmp = `${dest}.src.mp4`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${res.status} ${url}`);
  await pipeline(res.body, createWriteStream(tmp));
  try {
    await ffmpeg([
      '-y',
      '-i',
      tmp,
      '-an',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '23',
      '-preset',
      'fast',
      '-movflags',
      '+faststart',
      dest,
    ]);
  } finally {
    await unlink(tmp).catch(() => {});
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const models = [PRIMARY_MODEL, ...FALLBACK_MODELS.filter((m) => m !== PRIMARY_MODEL)];
  let useHiggsfield = Boolean(CREDENTIALS) && process.env.HF_I2V_LOCAL !== '1';
  let failed = 0;

  if (!CREDENTIALS) {
    console.warn('No Higgsfield keys; encoding local 5s cinematic clips.');
  }

  for (const job of JOBS) {
    const dest = join(OUT_DIR, job.out);
    try {
      const existing = await stat(dest);
      if (existing.size > 20_000) {
        console.log('skip', job.out);
        continue;
      }
    } catch {
      /* generate */
    }

    if (useHiggsfield) {
      try {
        console.log('upload', job.file);
        const imageUrl = await uploadJpeg(join(OUT_DIR, job.file));
        const videoUrl = await generate(imageUrl, job.prompt, models);
        console.log('download', videoUrl);
        await downloadAndCompress(videoUrl, dest);
        console.log('wrote', dest);
        continue;
      } catch (error) {
        if (!isCreditsError(error)) {
          failed += 1;
          console.error('failed', job.out, error);
          continue;
        }
        useHiggsfield = false;
        console.warn('Higgsfield credits unavailable; encoding local 5s cinematic clips.');
      }
    }

    try {
      console.log('local', job.out, job.motion);
      await localCinematic(join(OUT_DIR, job.file), dest, job.motion);
      console.log('wrote', dest);
    } catch (error) {
      failed += 1;
      console.error('failed', job.out, error);
    }
  }

  if (failed) {
    throw new Error(`${failed} clip(s) failed`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
