// Карта для контактов
function pizzaConstructor(argsObj) {

    let constructorObj = this;
    constructorObj.data = null;

    let selectorTabsDefault = '.js--constructor__tab-link',
        selectorStepsDefault = '.js--constructor__step',
        selectorBtnNextDefault = '.js--constructor__btn-next',
        selectorBodyWrapperDefault = '.js--constructor__body-wrapper',
        selectorBodyContentDefault = '.js--constructor__body-content',
        selectorStepContent = '.js--constructor__body-content',
        timeNextStepExpandDefault = 300;

    let classes = {
        header: {
            link: {
                active: 'constructor__tab-link--active'
            }
        },
        body: {
            wrapper: {
                active: 'constructor__body-wrapper--active'
            },
            content: {
                active: 'constructor__body-content--active'
            },
            next: {
                hidden: 'constructor__next--hidden'
            },
            step: {
                content: {
                    hidden: 'constructor__step-content--hidden'
                }
            }
        },
    };

    function initBtnsNext() {
        // Инициализация кнопок перехода к следующему шага конструктора
        let btnsNext = constructorObj.el.querySelectorAll(selectorBtnNextDefault),
            steps = constructorObj.el.querySelectorAll(selectorStepsDefault),
            classNextHidden = classes.body.next.hidden,
            classStepHidden = classes.body.step.content.hidden;
        btnsNext.forEach(function (btn) {
            btn.addEventListener('click', function () {
                let dataStep = this.getAttribute('data-next-step');
                btnsNext.forEach(function (next) {
                    if (next.parentNode.classList.contains('js--constructor__next') && dataStep === next.getAttribute('data-next-step')) {
                        next.parentNode.classList.add(classNextHidden);
                    }
                });
                Array.from(steps).filter(function (step) {
                    if (step.getAttribute('data-step') == dataStep) {
                        $(step).slideDown(timeNextStepExpandDefault);
                        step.querySelector('.js--constructor__step-content').classList.remove(classStepHidden);
                    }
                })
            });
        })
    }

    function initTabs() {
        // Инициализация табов-переключателей типа конструктора;
        // Навешивание обработчиков кликов по ним
        let tabs = constructorObj.el.querySelectorAll(selectorTabsDefault),
            wrappers = constructorObj.el.querySelectorAll(selectorBodyWrapperDefault),
            classTabLinkActive = classes.header.link.active,
            classWrapperActive = classes.body.wrapper.active,
            classContentActive = classes.body.content.active;
        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                tabs.forEach(function (tab) {
                    tab.classList.remove(classTabLinkActive);
                });
                this.classList.add(classTabLinkActive);
                let dataBind = this.getAttribute('data-bind');
                Array.from(wrappers).filter(function (wrapper, index) {
                    if (wrapper.getAttribute('data-bind') == dataBind) {
                        wrapper.classList.add(classWrapperActive);
                        wrapper.querySelector(selectorBodyContentDefault).classList.add(classContentActive);
                    } else {
                        wrapper.classList.remove(classWrapperActive);
                        wrapper.querySelector(selectorBodyContentDefault).classList.remove(classContentActive);
                    }
                });
            })
        });
    }

    function initConstructor() {
        // Инициализация объекта конструктора
        try {
            constructorObj.el = document.querySelector(argsObj.el);
        } catch (e) {
            if (e.name == 'TypeError') {
                console.log("На странице отсутствует элемент с переданным конструктору селектором.", e);
            } else {
                throw e;
            }
        }
    }

    function init() {
        // Инициализация конструктора
        initConstructor();
        if (constructorObj.el) {
            initTabs();
            initBtnsNext();
        }
    }

    init();

}