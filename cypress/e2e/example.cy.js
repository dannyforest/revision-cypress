// https://on.cypress.io/api

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

describe('My First Test', () => {

  beforeEach(() => {
    cy.visit('https://idealcoworking.com')
  })

  it('visits the app root url', () => {
    cy.get('.col-sm-7 > p').should('have.text', "Brisez l'isolement du télétravail...");
  })

  describe('sign up', () => {
    it('should not create an account if email field is empty', () => {
      // cy.wait(1000);
      const reservationButton = '#menu-item-78896 > [href="#"]';
      // cy.get(reservationButton).trigger('mouseover');
      cy.get(reservationButton)
          .trigger('mouseover')
          .find('#menu-item-78890')
          .contains('Mon compte')
          .click();
      // cy.wait(1000);
      // cy.get('#menu-item-78890').click({force: true}); // TODO: do not trigger every time
      cy.visit('https://idealcoworking.com/mon-compte/')
      cy.url().should('contain', 'mon-compte');

      cy.get('.woocommerce-Button').click();

      cy.url().should('contain', 'mon-compte');
      cy.get('.woocommerce-error > li').should('contain.text', 'Veuillez saisir une e-mail valide')

      // cy.location("pathname").should('eq', '/mon-compte');
      // cy.get('selector').trigger('mouseover')

    })

    it('should not create an account if email is not the right format', () => {
      cy.wait(1000);
      const reservationButton = '#menu-item-78896 > [href="#"]';
      cy.get(reservationButton).trigger('mouseover');
      cy.wait(1000);
      cy.get('#menu-item-78890').click({force: true}); // TODO: do not trigger every time
      cy.visit('https://idealcoworking.com/mon-compte/')
      cy.url().should('contain', 'mon-compte');

      const email = Date.now();
      cy.get('#reg_email').type(`${email}`);
      cy.get('.woocommerce-Button').click();

      // TODO: Check for small popup
      cy.get('#reg_email:invalid').should('exist');
      cy.get('#reg_email:invalid').invoke('prop', 'validationMessage').should('include', email);

    })

    it('should create an account', () => {
      cy.wait(1000);
      const reservationButton = '#menu-item-78896 > [href="#"]';
      cy.get(reservationButton).trigger('mouseover');
      cy.wait(1000);
      cy.get('#menu-item-78890').click({force: true}); // TODO: do not trigger every time
      cy.visit('https://idealcoworking.com/mon-compte/')
      cy.url().should('contain', 'mon-compte');

      cy.get('#reg_email').type(`${Date.now()}@gmail.com`);
      cy.get('.woocommerce-Button').click();

      cy.url().should('contain', 'mon-compte');
      cy.get('.title').should('have.text', 'Mon compte');
      cy.get('.woocommerce-MyAccount-navigation-link--dashboard > a').should('have.text', 'Tableau de bord');
    })
  })

  describe('sign in', () => {
    it('should sign in if the email/password combo match', () => {
      const reservationButton = '#menu-item-78896 > [href="#"]';
      cy.get(reservationButton).trigger('mouseover');
      cy.wait(1000);
      cy.get('#menu-item-78890').click({force: true}); // TODO: do not trigger every time
      cy.visit('https://idealcoworking.com/mon-compte/')
      cy.url().should('contain', 'mon-compte');

      cy.get('#username').type('ford86@gmail.com');
      cy.get('#password').type('vuqwuk-rakcuj-xoxgI9');

      cy.get(':nth-child(3) > .woocommerce-button').click();

      cy.url().should('contain', 'mon-compte');
      cy.get('.title').should('have.text', 'Mon compte');
      cy.get('.woocommerce-MyAccount-navigation-link--dashboard > a').should('have.text', 'Tableau de bord');

    })

    it('should not log in when email/password do not match', () => {
      const reservationButton = '#menu-item-78896 > [href="#"]';
      cy.get(reservationButton).trigger('mouseover');
      cy.wait(1000);
      cy.get('#menu-item-78890').click({force: true}); // TODO: do not trigger every time
      cy.visit('https://idealcoworking.com/mon-compte/')
      cy.url().should('contain', 'mon-compte');

      cy.get('#username').type('ford86@gmail.com');
      cy.get('#password').type('test');

      cy.get(':nth-child(3) > .woocommerce-button').click();

      cy.url().should('contain', 'mon-compte');
      cy.get('.woocommerce-error > li').should('contain.text', 'le mot de passe que vous avez saisi pour l’adresse e-mail ')
    })

  })

  describe('contact form', () => {
    // there's a bug on the site
    it('should send the form successfully if the required fields are filled', () => {
      const contactButton = cy.get('#menu-item-80079 > a');
      contactButton.click();

      cy.wait(1000); // not ideal

      // cy.location('pathname').should('contain', '/contact')
      cy.url().should('contain', 'contact');

      cy.get('#ft_602299c76baa8').type('Danny'); // name
      cy.get('#ft_602299d0c4005').type('email@gmail.com');
      cy.get('#ft_602299e2c1995').type('1234567890');
      cy.get('#ft_60229a40c3caa').type('Ignore ca');
      cy.get('#ft_602299f777efb').type('11/03/2024');
      cy.get('#ft_60229e28288b1').type('test');

      cy.get('.ft-button').click();

      cy.get('.ft-confirmation').should('have.text', 'Une erreur est survenue, vérifiez le(s) champ(s) de nouveau.');
    })

    it('should not send the form if a required field is not filled', () => {
      const contactButton = cy.get('#menu-item-80079 > a');
      contactButton.click();

      cy.wait(1000); // not ideal

      // cy.location('pathname').should('contain', '/contact')
      cy.url().should('contain', 'contact');

      cy.get('.ft-button').click();

      cy.get('#ft_602299c76baa8-error').should('be.visible');
      cy.get('#ft_602299d0c4005-error').should('be.visible');
      cy.get('#ft_602299e2c1995-error').should('be.visible');
    })
  })

  describe('ajouter au panier', () => {
    it('should add an item to the cart', () => {
      const reservationButton = '#menu-item-78896 > [href="#"]';
      cy.get(reservationButton).trigger('mouseover');
      cy.get('#menu-item-78895').click({force: true}); // TODO: do not trigger every time
      cy.visit('https://idealcoworking.com/boutique/')
      cy.url().should('contain', 'boutique');

      cy.get('.post-2980 > .button').click(); // 20 credits
      cy.url().should('contain', 'panier');

      cy.get('.woocommerce-message').should('contain.text', ' «20 crédits IDEAL @ Montréal (Saint-Henri)» a été ajouté à votre panier.\t')

    })
  })

  describe('modifier le panier', () => {
    it('should edit the total price', () => {
      const reservationButton = '#menu-item-78896 > [href="#"]';
      cy.get(reservationButton).trigger('mouseover');
      cy.get('#menu-item-78895').click({force: true}); // TODO: do not trigger every time
      cy.visit('https://idealcoworking.com/boutique/')
      cy.url().should('contain', 'boutique');

      cy.get('.post-2980 > .button').click(); // 20 credits
      cy.url().should('contain', 'panier');

      cy.get('.woocommerce-message').should('contain.text', ' «20 crédits IDEAL @ Montréal (Saint-Henri)» a été ajouté à votre panier.\t')

      cy.get('input.qty').type('2');

      cy.get('[name="update_cart"]').click();

      cy.get('.woocommerce-cart-form__cart-item > .product-subtotal').should('contain.text', '3,600.00');
    })
  })

  describe('Enlever un item du panier', () => {
    it.only('should remove the item from the cart', () => {
      const reservationButton = '#menu-item-78896 > [href="#"]';
      cy.get(reservationButton).trigger('mouseover');
      cy.get('#menu-item-78895').click({force: true}); // TODO: do not trigger every time
      cy.visit('https://idealcoworking.com/boutique/')
      cy.url().should('contain', 'boutique');

      cy.get('.post-2980 > .button').click(); // 20 credits
      cy.url().should('contain', 'panier');

      cy.get('.woocommerce-message').should('contain.text', ' «20 crédits IDEAL @ Montréal (Saint-Henri)» a été ajouté à votre panier.\t')

      cy.get('.remove').click();

      cy.get('.woocommerce-message').should('contain.text', '«20 crédits IDEAL @ Montréal (Saint-Henri)» supprimé.')
    })
  })
})
