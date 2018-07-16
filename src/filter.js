// const filters = [
//   {
//     btn: document.getElementById('filter-music'),
//     elements: document.querySelectorAll('.player--music')
//   },
//   {
//     btn: document.getElementById('filter-mixes'),
//     elements: document.querySelectorAll('.player--mix')
//   }
// ];

// const handleClick = (index, e) => {
//   e.preventDefault();
//   const f = filters.slice();
//   const filter = f.splice(index, 1)[0];
//   const other = f[0];
  
//   const isFiltered = other.btn.classList.contains('filtered');
//   filter.btn.classList.remove('filtered');
//   other.btn.classList.remove('filtered');

//   if(isFiltered) {
//     // Remove this filter
//     [].forEach.call(filter.elements, m => m.style.display = 'block');
//     [].forEach.call(other.elements, m => m.style.display = 'block');
//   } else {
//     // Filter the other tracks
//     other.btn.classList.add('filtered');
//     [].forEach.call(filter.elements, m => m.style.display = 'block');
//     [].forEach.call(other.elements, m => m.style.display = 'none');
//   }
// };

// filters.forEach((filter, i) => {
//   filter.btn.addEventListener('click', handleClick.bind(this, i));
// });