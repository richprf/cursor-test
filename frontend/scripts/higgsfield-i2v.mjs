/**
 * Higgsfield image-to-video: 5s clips from landing stills.
 *
 * Usage:
 *   HF_API_KEY_ID=... HF_API_KEY_SECRET=... node scripts/higgsfield-i2v.mjs
 *
 * Docs: https://docs.higgsfield.ai/docs/guides/video
 * Duration is 5s (Higgsfield allows 5 or 10; 3–5s request → 5).
 */
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'landing');
const API = 'https://platform.higgsfield.ai';
const MODEL = process.env.HF_I2V_MODEL || 'higgsfield-ai/dop/standard';
const DURATION = 5;

const KEY_ID = process.env.HF_API_KEY_ID || '';
const KEY_SECRET = process.env.HF_API_KEY_SECRET || '';
const CREDENTIALS = process.env.HF_CREDENTIALS || (KEY_ID && KEY_SECRET ? `${KEY_ID}:${KEY_SECRET}` : '');

const JOBS = [
  {
    file: 'whatwedo-1.jpg',
    out: 'whatwedo-1.mp4',
    prompt:
      'Slow cinematic push-in on layered silver necklaces, hair and denim fabric breathing, light glinting on the Libra pendant, black and white editorial, subtle handheld, 5 seconds, no morphing faces',
  },
  {
    file: 'whatwedo-2.jpg',
    out: 'whatwedo-2.mp4',
    prompt:
      'Warm luxury close-up, slow camera push toward the gold herringbone chain and round pendant, metal catching soft light, skin micro-movement, shallow depth of field, 5 seconds',
  },
  {
    file: 'whatwedo-3.jpg',
    out: 'whatwedo-3.mp4',
    prompt:
      'Soft breeze on a white shirt, silver heart pendant catching light, slow gentle orbit around the collarbone, natural daylight, 5 seconds',
  },
  {
    file: 'work-jewelry.jpg',
    out: 'work-jewelry.mp4',
    prompt:
      'Editorial portrait, slow cinematic push-in, gold rings catching golden-hour light, hair softly moving, serene expression held, 5 seconds',
  },
  {
    file: 'work-campaign.jpg',
    out: 'work-campaign.mp4',
    prompt:
      'Slow pan along a gold paperclip chain on the collarbone, linen shirt shifting slightly, warm directional light, 5 seconds',
  },
  {
    file: 'work-product.jpg',
    out: 'work-product.mp4',
    prompt:
      'Macro jewelry beauty shot, slow zoom on the gold paperclip links, highlights sliding across metal, 5 seconds',
  },
  {
    file: 'work-macro.jpg',
    out: 'work-macro.mp4',
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
    throw new Error(`Higgsfield ${res.status} ${path}: ${text.slice(0, 500)}`);
  }
  return body;
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

async function generate(imageUrl, prompt) {
  const submitted = await api(`/${MODEL}`, {
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

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('ffmpeg', args, { stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}`))));
  });
}

async function downloadAndCompress(url, dest) {
  const tmp = `${dest}.src.mp4`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${res.status} ${url}`);
  await pipeline(res.body, createWriteStream(tmp));
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
}

async function main() {
  if (!CREDENTIALS) {
    console.error('Set HF_API_KEY_ID and HF_API_KEY_SECRET (or HF_CREDENTIALS=id:secret).');
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });

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

    console.log('upload', job.file);
    const imageUrl = await uploadJpeg(join(OUT_DIR, job.file));
    console.log('generate', job.out, MODEL, `${DURATION}s`);
    const videoUrl = await generate(imageUrl, job.prompt);
    console.log('download', videoUrl);
    await downloadAndCompress(videoUrl, dest);
    console.log('wrote', dest);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
