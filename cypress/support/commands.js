Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('William')
    cy.get('#lastName').type('Dutra')
    cy.get('#email').type('williamdutraa@exemple.com')
    cy.get('#open-text-area').type('Test')
    cy.contains('button','Enviar').click()
})