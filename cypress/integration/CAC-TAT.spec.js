describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000
    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrgatórios e envia o formulário', function()  {

        cy.clock()

        cy.get('#firstName').type('William')
        cy.get('#lastName').type('Dutra')
        cy.get('#email').type('williamdutraa@exemple.com')
        cy.get('#open-text-area').type('Test')
        cy.contains('button','Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o fomulário com um e-mail com formatação invalida', function() {
        cy.clock()
        cy.get('#firstName').type('William')
        cy.get('#lastName').type('Dutra')
        cy.get('#email').type('williamdutraa@exemple,com')
        cy.get('#open-text-area').type('Test')
        cy.contains('button','Enviar').click()

        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    
    })

    it('campo telefone continua vazio quando preenchido com valo não numérico', function(){
        cy.get('#phone')
            .type('dhgshtsh')
            .should('have.value','')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.clock()
        cy.get('#firstName').type('William')
        cy.get('#lastName').type('Dutra')
        cy.get('#email').type('williamdutraa@exemple.com')
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type('Test')
        cy.contains('button','Enviar').click()

        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName')
            .type('William')
            .should('have.value','William')
            .clear()
            .should('have.value','')
        cy.get('#lastName')
            .type('Dutra')
            .should('have.value','Dutra')
            .clear()
            .should('have.value','')
        cy.get('#email')
            .type('williamdutraa@exemple.com')
            .should('have.value','williamdutraa@exemple.com')
            .clear()
            .should('have.value','')
        cy.get('#phone')
            .type('123456')
            .should('have.value','123456')
            .clear()
            .should('have.value','')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.clock()
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
        cy.tick(THREE_SECONDS_IN_MS)
        cy.get('.error').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function() {
        cy.fillMandatoryFieldsAndSubmit()        
        cy.get('.success').should('be.visible')
        
    })

    it('seleciona um produto (YouTube) por seu texto', function(){
        cy.get('#product')
        .select('YouTube')
        .should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product') 
        .select('mentoria','youtube')
        .should('have.value','mentoria','youtube') 

    })

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product') 
        .select(1)
        .should('have.value','blog') 
    })

    it('marcar o tipo de atendimento feedback', function(){
        cy.get('[type="radio"]')
        .check('feedback')
        .should('have.value', 'feedback')
    })
    
    it('marcar cada tipo de atendimento', function(){
        cy.get('input[type="radio"]')
        .should('have.length',3)
        .each(function($radio) {
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })

    it('marcar ambos checkboxes e depois desmarcar o ultimo', function(){
        cy.get('input[type="checkbox"]')
            .check()
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    it('selecione um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json')
            .should(function(input) {
                expect(input[0].files[0].name).to.equal('example.json')
            }           )

    })
    
    it('selecione um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]#file-upload')
            .should('not.have.value')
            .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function(input) {
                expect(input[0].files[0].name).to.equal('example.json')
            }           )

    })
    it('seleciona um arquivo utilizando uma fixture para qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]') 
            .selectFile('@sampleFile')
            .should(function(input) {
                expect(input[0].files[0].name).to.equal('example.json')
            }           )
    })
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique',function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        
        cy.contains('Talking About Testing').should('be.visible')
    })
    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => { //função reduzida 
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })
        

      it('preenche a area de texto usando o comando invoke', function(){
        const longText = Cypress._.repeat('1234567890',4000)

        cy.get('#open-text-area')
            .invoke('val', longText)
            .should('have.value', longText)
      })

      it('Faz uma requisição HTTP', function(){
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function(Response){
                const {status, statusText,body} = Response
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')
            })
      })

      it('encontra o gato escondido', function(){
        cy.get('#dog')
        .invoke('show')
        .should('be.visible')
        
      })
    })