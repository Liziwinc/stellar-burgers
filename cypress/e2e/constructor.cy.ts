import * as orderFixture from '../fixtures/order.json';

const dataCyBun = '[data-cy="bun"]';
const dataCyBunFirst = '[data-cy="bun"]:first-of-type';
const dataCyMain = '[data-cy="main"]';
const dataCyMainFirst = '[data-cy="main"]:first-of-type';
const dataCySauce = '[data-cy="sauce"]';
const dataCySauceFirst = '[data-cy="sauce"]:first-of-type';
const dataCyOrder = '[data-cy-order]';
const selectorConstructorElementTop = 'div.constructor-element_pos_top';
const selectorConstructorElementText = '.constructor-element__text';
const selectorConstructorElementRow = 'span.constructor-element__row';
const modals = '#modals';
const selectorModalsH3 = `${modals} h3`;
const selectorModalsButtonFirst = `${modals} button:first-of-type`;
const selectorModalsOverlay = `${modals}>div:nth-of-type(2)`;
const selectorModalsH2First = `${modals} h2:first-of-type`;

describe('Тест e2e :: stellar-burger', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit('/');
  });
  it('Переход на главную страницу', () => {
    cy.visit('/');
  });

  it('Ингредиенты отображаются на странице', () => {
    cy.get(dataCyBun).should('have.length.at.least', 1);
    cy.get(`${dataCyMain}, ${dataCySauce}`).should('have.length.at.least', 1);
  });

  describe('Тест :: добавление ингредиентов в конструктор', () => {
    it('Добавление ингредиентов в конструктор и проверка названий', () => {
      cy.get(dataCyBunFirst)
        .find('p.text_type_main-default')
        .invoke('text')
        .then((bunName) => {
          cy.get(`${dataCyBunFirst} button`).click();
          cy.get(selectorConstructorElementTop)
            .find(selectorConstructorElementText)
            .should('contain.text', bunName.trim());
        });

      cy.get(dataCyMainFirst)
        .find('p.text_type_main-default')
        .invoke('text')
        .then((mainName) => {
          cy.get(`${dataCyMainFirst} button`).click();
          cy.get(selectorConstructorElementRow)
            .eq(1)
            .find(selectorConstructorElementText)
            .should('contain.text', mainName.trim());
        });

      cy.get(dataCySauceFirst)
        .find('p.text_type_main-default')
        .invoke('text')
        .then((sauceName) => {
          cy.get(`${dataCySauceFirst} button`).click();
          cy.get(selectorConstructorElementRow)
            .eq(2)
            .find(selectorConstructorElementText)
            .should('contain.text', sauceName.trim());
        });
    });
  });

  describe('Тест :: работоспособность модальных окон', () => {
    describe('Тест :: открытие модального окна', () => {
      it('Открытие модального окна и проверка названия ингредиента', () => {
        cy.get(dataCyBunFirst)
          .find('p.text_type_main-default')
          .first()
          .invoke('text')
          .then((ingredientName) => {
            cy.get(dataCyBunFirst).click();
            cy.get(modals).children().should('have.length', 2);
            cy.get(selectorModalsH3)
              .eq(1)
              .invoke('text')
              .then((modalIngredientName) => {
                expect(modalIngredientName.trim()).to.contain(
                  ingredientName.trim()
                );
              });
          });
      });

      it('Открытие карточки ингредиента по клику', () => {
        cy.get(dataCyBunFirst).click();
        cy.get(modals).children().should('have.length', 2);
      });

      it('Сохранение состояния модального окна после перезагрузки', () => {
        cy.get(dataCyBunFirst).click();
        cy.reload(true);
        cy.get(modals).children().should('have.length', 2);
      });
    });

    describe('Тест :: различные способы закрытия модального окна', () => {
      it('Закрытие модального окна по крестику', () => {
        cy.get(dataCyBunFirst).click();
        cy.get(selectorModalsButtonFirst).click();
        cy.wait(1000);
        cy.get(modals).children().should('have.length', 0);
      });

      it('Закрытие модального окна по клику на оверлей', () => {
        cy.get(dataCyBunFirst).click();
        cy.get(selectorModalsOverlay).click({ force: true });
        cy.wait(1000);
        cy.get(modals).children().should('have.length', 0);
      });
    });
  });

  describe('Тест :: работоспособность оформления заказа', () => {
    beforeEach(() => {
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
      cy.visit('/');
    });

    it('Оформление заказа с выбранными ингредиентами', () => {
      cy.get(dataCyOrder).should('be.disabled');
      cy.get(`${dataCyBunFirst} button`).click();
      cy.get(dataCyOrder).should('be.disabled');
      cy.get(`${dataCyMainFirst} button`).click();
      cy.get(dataCyOrder).should('be.enabled');
      cy.get(dataCyOrder).click();
      cy.get(modals).children().should('have.length', 2);
      cy.get(selectorModalsH2First).should(
        'have.text',
        orderFixture.order.number
      );
      cy.get(selectorModalsButtonFirst).click();
      cy.get(dataCyOrder).children().should('have.length', 0);
      cy.get(dataCyOrder).should('be.disabled');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
