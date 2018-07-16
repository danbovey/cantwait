const downsampler = require('downsample-lttb');

/**
 * @param {Node} el The waveform element
 * @param {array} waveform The waveform JSON
 */
const createWaveform = (el, waveform) => {
  // Empty waveform element
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }

  // The amount of bars the waveform can hold in the current viewport
  const maxBars = Math.round(el.offsetWidth / 5);

  // Convert samples into graph plots [1, 140], [2, 90]
  let samples = waveform.samples.map((s, i) => [i, s]);
  // Resample array to the amount of bars we want
  samples = downsampler.processData(samples, maxBars);
  // Convert graph plots back into int array
  samples = samples.map(s => s[1]);

  samples.forEach(sample => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = (40 * (sample / waveform.height)) + 'px';
    el.appendChild(bar);
  });
};

module.exports = createWaveform;