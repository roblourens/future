const slides = [...document.querySelectorAll('.slide')];
const progress = document.querySelector('.progress');
const currentSlide = document.querySelector('#current-slide');
const previousButton = document.querySelector('[data-direction="previous"]');
const nextButton = document.querySelector('[data-direction="next"]');
let activeSlide = 0;

const dots = slides.map((slide, index) => {
	const dot = document.createElement('button');
	dot.className = 'dot';
	dot.type = 'button';
	dot.role = 'tab';
	dot.setAttribute('aria-label', `Show slide ${index + 1}`);
	dot.addEventListener('click', event => {
		event.stopPropagation();
		showSlide(index);
	});
	progress.append(dot);
	return dot;
});

function showSlide(index) {
	activeSlide = (index + slides.length) % slides.length;
	slides.forEach((slide, slideIndex) => {
		const selected = slideIndex === activeSlide;
		slide.classList.toggle('is-active', selected);
		slide.setAttribute('aria-hidden', String(!selected));
		dots[slideIndex].setAttribute('aria-selected', String(selected));
		dots[slideIndex].tabIndex = selected ? 0 : -1;
	});
	currentSlide.textContent = String(activeSlide + 1);
}

previousButton.addEventListener('click', event => {
	event.stopPropagation();
	showSlide(activeSlide - 1);
});

nextButton.addEventListener('click', event => {
	event.stopPropagation();
	showSlide(activeSlide + 1);
});

document.addEventListener('click', event => {
	if (!(event.target instanceof Element) || !event.target.closest('.controls')) {
		showSlide(activeSlide + 1);
	}
});

document.addEventListener('keydown', event => {
	if (event.key === 'ArrowLeft') {
		showSlide(activeSlide - 1);
	}

	if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter') {
		event.preventDefault();
		showSlide(activeSlide + 1);
	}
});

showSlide(activeSlide);