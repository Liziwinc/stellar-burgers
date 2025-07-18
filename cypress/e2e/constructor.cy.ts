import * as orderFixture from '../fixtures/order.json';

const TEST_URL = 'http://localhost:4000';
const dataCyBun = '[data-cy="bun"]';
const dataCyBunFirst = '[data-cy="bun"]:first-of-type';
const dataCyOrder = '[data-cy-order]';
const modals = '#modals';

describe('Тест e2e :: stellar-burger', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
    cy.visit(TEST_URL);
  });
  it('Переход на главную страницу', () => {
    cy.visit(TEST_URL);
  });

  it('Ингредиенты отображаются на странице', () => {
    cy.get(dataCyBun).should('have.length.at.least', 1);
    cy.get('[data-cy="main"], [data-cy="sauce"]').should(
      'have.length.at.least',
      1
    );
  });

  describe('Тест :: добавление ингредиентов в конструктор', () => {
    it('Добавление ингредиентов в конструктор и проверка названий', () => {
      cy.get('[data-cy="bun"]:first-of-type')
        .find('p.text_type_main-default')
        .invoke('text')
        .then((bunName) => {
          cy.get('[data-cy="bun"]:first-of-type button').click();

          cy.get('div.constructor-element_pos_top')
            .find('.constructor-element__text')
            .should('contain.text', bunName.trim());
        });

      cy.get('[data-cy="main"]:first-of-type')
        .find('p.text_type_main-default')
        .invoke('text')
        .then((mainName) => {
          cy.get('[data-cy="main"]:first-of-type button').click();

          cy.get('span.constructor-element__row')
            .eq(1)
            .find('.constructor-element__text')
            .should('contain.text', mainName.trim());
        });

      cy.get('[data-cy="sauce"]:first-of-type')
        .find('p.text_type_main-default')
        .invoke('text')
        .then((sauceName) => {
          cy.get('[data-cy="sauce"]:first-of-type button').click();

          cy.get('span.constructor-element__row')
            .eq(2)
            .find('.constructor-element__text')
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
            cy.get(`${modals} h3`)
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
        cy.get(`${modals} button:first-of-type`).click();
        cy.wait(1000);
        cy.get(modals).children().should('have.length', 0);
      });

      it('Закрытие модального окна по клику на оверлей', () => {
        cy.get(dataCyBunFirst).click();
        cy.get(`${modals}>div:nth-of-type(2)`).click({ force: true });
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
      cy.visit(TEST_URL);
    });

    it('Оформление заказа с выбранными ингредиентами', () => {
      cy.get(dataCyOrder).should('be.disabled');
      cy.get(`${dataCyBunFirst} button`).click();
      cy.get(dataCyOrder).should('be.disabled');
      cy.get('[data-cy="main"]:first-of-type button').click();
      cy.get(dataCyOrder).should('be.enabled');
      cy.get(dataCyOrder).click();
      cy.get(modals).children().should('have.length', 2);
      cy.get(`${modals} h2:first-of-type`).should(
        'have.text',
        orderFixture.order.number
      );
      cy.get(`${modals} button:first-of-type`).click();
      cy.get(dataCyOrder).children().should('have.length', 0);
      cy.get(dataCyOrder).should('be.disabled');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
    });
  });
});
