'use strict';

const API_URL = 'https://substantial-local-chasmosaurus.glitch.me/';

// GET api - получить список услуг
// GET api?service={n} - получить список барберов
// GET api?spec={n} - получить список месяца работы барбера
// GET api?spec={n}&month={n} - получить список дней работы барбера
// GET api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
// POST api/order - оформить заказ

const addPreload = (elem) => {
  elem.classList.add('preload');
};

const removePreload = (elem) => {
  elem.classList.remove('preload');
};

const disableModal = () => {
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
};

const startSlider = () => {
  const sliderItems = document.querySelectorAll('.slider__item');
  const sliderList = document.querySelector('.slider__list');
  const btnPrevSlide = document.querySelector('.slider__arrow_left');
  const btnNextSlide = document.querySelector('.slider__arrow_right');

  let activeSlide = 1;
  let position = 0;

  const checkSlider = () => {
    if (
      (activeSlide + 2 === sliderItems.length &&
        document.documentElement.offsetWidth > 560) ||
      activeSlide === sliderItems.length
    ) {
      btnNextSlide.style.display = 'none';
    } else {
      btnNextSlide.style.display = '';
    }

    if (activeSlide === 1) {
      btnPrevSlide.style.display = 'none';
    } else {
      btnPrevSlide.style.display = '';
    }
  };

  checkSlider();

  const nextSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item_active');
    position = -sliderItems[0].clientWidth * activeSlide;

    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide++;
    sliderItems[activeSlide]?.classList.add('slider__item_active');
    checkSlider();
  };

  const prevSlide = () => {
    sliderItems[activeSlide]?.classList.remove('slider__item_active');
    position = -sliderItems[0].clientWidth * (activeSlide - 2);

    sliderList.style.transform = `translateX(${position}px)`;
    activeSlide--;
    sliderItems[activeSlide]?.classList.add('slider__item_active');
    checkSlider();
  };

  btnPrevSlide.addEventListener('click', prevSlide);
  btnNextSlide.addEventListener('click', nextSlide);

  window.addEventListener('resize', () => {
    if (
      activeSlide + 2 > sliderItems.length &&
      document.documentElement.offsetWidth > 560
    ) {
      activeSlide = sliderItems.length - 2;
      sliderItems[activeSlide]?.classList.add('slider__item_active');
    }

    position = -sliderItems[0].clientWidth * (activeSlide - 1);
    sliderList.style.transform = `translateX(${position}px)`;
    checkSlider();
  });
};

const initSlider = () => {
  const slider = document.querySelector('.slider');
  const sliderContainer = document.querySelector('.slider__container');

  sliderContainer.style.display = 'none';
  addPreload(slider);

  window.addEventListener('load', () => {
    sliderContainer.style.display = '';
    removePreload(slider);
    startSlider();
  });
};

const renderPrice = (wrapper, data) => {
  data.forEach((item) => {
    const priceItem = document.createElement('li');
    priceItem.classList.add('price__item');

    priceItem.innerHTML = `
      <span class="price__item-title">${item.name}</span>
      <span class="price__item-count">${item.price}</span>
    `;

    wrapper.append(priceItem);
  });
};

const renderService = (wrapper, data) => {
  const labels = data.map((item) => {
    const label = document.createElement('label');
    label.classList.add('radio');
    label.innerHTML = `
      <input class="radio__input" type="radio" name="service" value="${item.id}"/>
      <span class="radio__label">${item.name}</span>
    `;
    return label;
  });

  wrapper.append(...labels);
};

const initService = () => {
  const priceList = document.querySelector('.price__list');
  const reserveFieldsetService = document.querySelector(
    '.reserve__fieldset_service'
  );
  priceList.textContent = '';
  addPreload(priceList);

  reserveFieldsetService.innerHTML =
    '<legend class="reserve__legend">Услуга</legend>';
  addPreload(reserveFieldsetService);

  fetch(`${API_URL}api`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      renderPrice(priceList, data);
      removePreload(priceList);
      return data;
    })
    .then((data) => {
      renderService(reserveFieldsetService, data);
      removePreload(reserveFieldsetService);
    });
};

const addDisabled = (array) => {
  array.forEach((el) => {
    el.disabled = true;
  });
};

const removeDisabled = (array) => {
  array.forEach((el) => {
    el.disabled = false;
  });
};

const renderSpec = (wrapper, data) => {
  const labels = data.map((item) => {
    const label = document.createElement('label');
    label.classList.add('radio');
    label.innerHTML = `
      <input class="radio__input" type="radio" name="spec" value="${item.id}" />
      <span
        class="radio__label radio__label_spec"
        style="--bg-image: url(../${item.img})"
        >${item.name}</span
      >
    `;
    return label;
  });

  wrapper.append(...labels);
};

const renderMonth = (wrapper, data) => {
  const labels = data.map((month) => {
    const label = document.createElement('label');
    label.classList.add('radio');
    label.innerHTML = `
      <input class="radio__input" type="radio" name="month" value="${month}" />
      <span
        class="radio__label"
        >${new Intl.DateTimeFormat('ru-RU', {
          month: 'long',
        }).format(new Date(month))}</span
      >
    `;
    return label;
  });

  wrapper.append(...labels);
};

const renderDay = (wrapper, data, month) => {
  const labels = data.map((day) => {
    const label = document.createElement('label');
    label.classList.add('radio');
    label.innerHTML = `
      <input class="radio__input" type="radio" name="day" value="${day}" />
      <span
        class="radio__label"
        >${new Intl.DateTimeFormat('ru-RU', {
          month: 'long',
          day: 'numeric',
        }).format(new Date(`${month}/${day}`))}</span
      >
    `;
    return label;
  });

  wrapper.append(...labels);
};

const renderTime = (wrapper, data) => {
  const labels = data.map((time) => {
    const label = document.createElement('label');
    label.classList.add('radio');
    label.innerHTML = `
      <input class="radio__input" type="radio" name="time" value="${time}" />
      <span class="radio__label">${time}</span>
    `;
    return label;
  });

  wrapper.append(...labels);
};

const initModal = (data) => {
  const modal = document.querySelector('.modal');
  const body = document.querySelector('body');

  modal.style.display = '';

  const modalContainer = document.createElement('div');
  modalContainer.classList.add('modal__container');
  modalContainer.innerHTML = `
    <h2 class="modal__title">Спасибо за Ваш выбор!</h2>
    <div>номер заказа
      <span class="modal__booking"> #${data.id}</span>
    </div>
    <div>Ждём Вас
      <span class="modal__booking">${new Intl.DateTimeFormat('ru-RU', {
        month: 'long',
        day: 'numeric',
      }).format(new Date(`${data.month}/${data.day}`))}
      </span>
    </div>
    <div>в
      <span class="modal__booking">${data.time}</span>
    </div>
  `;

  modal.append(modalContainer);

  body.style.overflow = 'hidden';
  body.style.paddingRight = '17px';

  modal.addEventListener('click', () => {
    body.style.overflow = '';
    body.style.paddingRight = '';
    disableModal();
  });
};

const initReserve = () => {
  const reserveForm = document.querySelector('.reserve__form');
  const {
    fieldservice,
    fieldspec,
    fielddate,
    fieldmonth,
    fieldday,
    fieldtime,
    btn,
  } = reserveForm;

  addDisabled([fieldspec, fielddate, fieldmonth, fieldday, fieldtime, btn]);

  reserveForm.addEventListener('change', async (event) => {
    const target = event.target;

    if (target.name === 'service') {
      addDisabled([fieldspec, fielddate, fieldmonth, fieldday, fieldtime, btn]);
      fieldspec.innerHTML =
        '<legend class="reserve__legend">Специалист</legend>';
      addPreload(fieldspec);
      const response = await fetch(`${API_URL}api?service=${target.value}`);
      const data = await response.json();
      renderSpec(fieldspec, data);
      removePreload(fieldspec);
      removeDisabled([fieldspec]);
    }

    if (target.name === 'spec') {
      addDisabled([fielddate, fieldmonth, fieldday, fieldtime, btn]);
      addPreload(fieldmonth);
      const response = await fetch(`${API_URL}api?spec=${target.value}`);
      const data = await response.json();
      fieldmonth.textContent = '';
      renderMonth(fieldmonth, data);
      removePreload(fieldmonth);
      removeDisabled([fielddate, fieldmonth]);
    }

    if (target.name === 'month') {
      addDisabled([fieldday, fieldtime, btn]);
      addPreload(fieldday);
      const response = await fetch(
        `${API_URL}api?spec=${reserveForm.spec.value}&month=${target.value}`
      );
      const data = await response.json();
      fieldday.textContent = '';
      renderDay(fieldday, data, target.value);
      removePreload(fieldday);
      removeDisabled([fieldday]);
    }

    if (target.name === 'day') {
      addDisabled([fieldtime, btn]);
      addPreload(fieldtime);
      const response = await fetch(
        `${API_URL}api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`
      );
      const data = await response.json();
      fieldtime.textContent = '';
      renderTime(fieldtime, data);
      removePreload(fieldtime);
      removeDisabled([fieldtime]);
    }

    if (target.name === 'time') {
      removeDisabled([btn]);
    }
  });

  reserveForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(reserveForm);
    const json = JSON.stringify(Object.fromEntries(formData));

    const response = await fetch(`${API_URL}api/order`, {
      method: 'post',
      body: json,
    });

    const data = await response.json();

    addDisabled([
      fieldservice,
      fieldspec,
      fielddate,
      fieldmonth,
      fieldday,
      fieldtime,
      btn,
    ]);

    initModal(data);
  });
};

const init = () => {
  disableModal();
  initSlider();
  initService();
  initReserve();
};

window.addEventListener('DOMContentLoaded', init);
