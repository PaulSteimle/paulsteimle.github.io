// Photo galleries: each cover (<a data-folder>) links to the first image of a
// numbered series, e.g. images/usa/USA-0001.webp … USA-0047.webp. The rest of
// the series is added as hidden links so the lightbox can page through it.
(function () {
	document.querySelectorAll('.gallery a[data-folder]').forEach(function (cover) {
		var folder = cover.dataset.folder;
		var prefix = cover.dataset.prefix;
		var count = parseInt(cover.dataset.count, 10);
		cover.classList.add('glightbox');
		cover.dataset.gallery = folder;
		for (var i = 2; i <= count; i++) {
			var link = document.createElement('a');
			link.href = 'images/' + folder + '/' + prefix + '-' + String(i).padStart(4, '0') + '.webp';
			link.className = 'glightbox';
			link.dataset.gallery = folder;
			link.hidden = true;
			cover.parentNode.appendChild(link);
		}
	});

	if (typeof GLightbox === 'function') {
		GLightbox({
			selector: '.glightbox',
			touchNavigation: true,
			keyboardNavigation: true,
			closeOnOutsideClick: true,
			loop: true
		});
	}

	// Highlight the nav link of the section in view.
	var links = document.querySelectorAll('.nav a[href^="#"]');
	if ('IntersectionObserver' in window) {
		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				links.forEach(function (link) {
					if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'true');
					else link.removeAttribute('aria-current');
				});
			});
		}, { rootMargin: '-45% 0px -50% 0px' });
		document.querySelectorAll('main > section[id]').forEach(function (s) { observer.observe(s); });
	}

	// Print the full "Read more" text, then restore what was collapsed.
	var reopened = [];
	window.addEventListener('beforeprint', function () {
		document.querySelectorAll('details:not([open])').forEach(function (d) { d.open = true; reopened.push(d); });
	});
	window.addEventListener('afterprint', function () {
		reopened.forEach(function (d) { d.open = false; });
		reopened = [];
	});

	// Theme toggle: flips between light and dark and remembers the choice.
	// Without a saved choice the page follows the device setting.
	var root = document.documentElement;
	var toggle = document.querySelector('.theme-toggle');
	var media = window.matchMedia('(prefers-color-scheme: dark)');
	function isDark() { return root.dataset.theme ? root.dataset.theme === 'dark' : media.matches; }
	function syncIcon() {
		if (!toggle) return;
		toggle.querySelector('i').className = isDark() ? 'fas fa-sun' : 'fas fa-moon';
		toggle.setAttribute('aria-label', isDark() ? 'Switch to light theme' : 'Switch to dark theme');
	}
	if (toggle) {
		toggle.addEventListener('click', function () {
			var next = isDark() ? 'light' : 'dark';
			// Picking the theme the device already uses clears the override.
			if ((next === 'dark') === media.matches) delete root.dataset.theme;
			else root.dataset.theme = next;
			try {
				if (root.dataset.theme) localStorage.setItem('theme', root.dataset.theme);
				else localStorage.removeItem('theme');
			} catch (e) {}
			syncIcon();
		});
	}
	media.addEventListener('change', syncIcon);
	syncIcon();
})();
