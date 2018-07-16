require('social-share-kit');

require('./filter');
const createWaveform = require('./waveform');
require('./scss/style.scss');

SocialShareKit.init();

const widgets = document.querySelectorAll('.player');
[].forEach.call(widgets, el => {
  const widget = SC.Widget(el.querySelector('.soundcloud-widget'));

  const trackArtwork = el.querySelector('.track-artwork');
  const trackTitle = el.querySelector('.track-title');
  const trackWaveform = el.querySelector('.waveform');
  const trackPermalink = el.querySelector('.track-permalink');
  const btnPlay = el.querySelector('.btn-play');
  const iconPlay = el.querySelector('.icon-play');
  const iconPause = el.querySelector('.icon-pause');
  const btnSharer = el.querySelector('.track-share');
  const sharer = el.querySelector('.sharer');

  const displayTrack = track => {
    const artwork = track.artwork_url.replace('large', 't500x500');
    trackArtwork.setAttribute('src', artwork);

    const title = track.title;
    const permalink = track.permalink_url;
    trackTitle.textContent = title;
    trackPermalink.setAttribute('href', permalink);

    // Load the waveform JSON file
    window.fetch(track.waveform_url)
      .then(res => res.json())
      .then(wave => {
        createWaveform(trackWaveform, wave);
        window.addEventListener('resize', () => createWaveform(trackWaveform, wave));
      });
    
    // Update the links in the social sharer
    const shareLinks = sharer.querySelectorAll('a');
    let text = '';
    if(title.indexOf('Can\'t Wait Mix') == 0) {
      text += 'Listen to this hour long mix of house, chill and world music!';
    } else {
      text += 'This track is worth a listen!';
    }
    [].forEach.call(shareLinks, link => {
      link.dataset.title = title;
      link.dataset.text = text;
      link.dataset.url = permalink;
      link.dataset.image = artwork;
    });
  };

  widget.bind(SC.Widget.Events.READY, () => {
    widget.getCurrentSound(displayTrack);
  });
  widget.bind(SC.Widget.Events.PLAY, () => {
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
  });
  widget.bind(SC.Widget.Events.PAUSE, () => {
    iconPause.style.display = 'none';
    iconPlay.style.display = 'block';
  });
  widget.bind(SC.Widget.Events.PLAY_PROGRESS, player => {
    const bars = trackWaveform.querySelectorAll('.bar');
    const filled = Math.ceil(bars.length * player.relativePosition);
    for(let i = 0; i < filled; i++) {
      bars[i].style.background = el.dataset.color || '#FA03D8';
    }
  });

  btnPlay.addEventListener('click', () => widget.toggle());

  btnSharer.addEventListener('click', () => {
    if(sharer.style.display !== 'flex') {
      sharer.style.display = 'flex';
    } else {
      sharer.style.display = 'none';
    }
  });
});