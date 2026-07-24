// Load GENERAL_WORDS from gzip+base64 chunks
(async function(){
  try {
    if (!window.__WORDS_B64) throw new Error('missing words payload');
    const bin = Uint8Array.from(atob(window.__WORDS_B64), c => c.charCodeAt(0));
    const ds = new DecompressionStream('gzip');
    const stream = new Blob([bin]).stream().pipeThrough(ds);
    const code = await new Response(stream).text();
    (0, eval)(code);
  } catch (e) {
    console.error('Failed to load word bank', e);
    window.GENERAL_WORDS = window.GENERAL_WORDS || [];
  }
})();
